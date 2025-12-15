#!/usr/bin/env bun
/**
 * Render PROJECT.md with Mustache substitution
 * Used by bin/momentum to inject personalized system prompt
 *
 * Required env vars: PROJECT_NAME, PROJECT_ROOT, WORKFLOW_PROJECTS
 * Reads: NAME from config.toml, MODE derived from PROJECT_NAME
 * Checks: CLI tool capabilities at launch
 */

import { readFileSync } from "fs";
import { join } from "path";
import Mustache from "mustache";
import { loadConfig } from "./shared/config-loader.ts";
import { getCapabilitiesString } from "./shared/capabilities.ts";

// Disable HTML escaping for triple braces (we want raw output)
Mustache.escape = (text: string) => text;

function main(): void {
  try {
    const config = loadConfig();
    const momentumInstall = config.momentum.install;

    // Read template
    const templatePath = join(momentumInstall, "system.md");
    const template = readFileSync(templatePath, "utf-8");

    // Build view from env vars and config
    const projectName = process.env.PROJECT_NAME || "unknown";
    const mode = projectName === "workspace" ? "workspace" : "project";

    // Check available CLI tools
    const capabilities = getCapabilitiesString();

    const view = {
      NAME: config.personalization.name,
      PROJECT_NAME: projectName,
      MODE: mode,
      PROJECT_ROOT: process.env.PROJECT_ROOT || process.cwd(),
      WORKFLOW_PROJECTS: process.env.WORKFLOW_PROJECTS || "",
      CAPABILITIES: capabilities,
    };

    // Render and output
    const rendered = Mustache.render(template, view);
    console.log(rendered);
  } catch (error) {
    // On error, output raw template so claude still works
    console.error("render-project-prompt error:", error);
    process.exit(1);
  }
}

main();
