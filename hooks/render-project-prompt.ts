#!/usr/bin/env bun
/**
 * Render system prompt with Mustache substitution
 * Combines: system.md (base) + mode file (project.md or workspace.md)
 *
 * Required env vars: PROJECT_NAME, PROJECT_ROOT, WORKFLOW_PROJECTS
 * Reads: NAME from config.toml, MODE derived from PROJECT_NAME
 * Checks: CLI tool capabilities at launch
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";
import Mustache from "mustache";
import { loadConfig } from "./shared/config-loader.ts";
import { getCapabilitiesString } from "./shared/capabilities.ts";
import {
  loadVoiceStyle,
  loadVerbosityLevel,
  buildVoiceInstructions,
} from "./shared/voice-loader.ts";

// Disable HTML escaping for triple braces (we want raw output)
Mustache.escape = (text: string) => text;

function main(): void {
  try {
    const config = loadConfig();
    const momentumInstall = config.momentum.install;

    // Determine mode
    const projectName = process.env.PROJECT_NAME || "unknown";
    const mode = projectName === "workspace" ? "workspace" : "project";

    // Read base template
    const systemPath = join(momentumInstall, "system.md");
    const template = readFileSync(systemPath, "utf-8");

    // Read mode-specific content
    const modePath = join(momentumInstall, `${mode}.md`);
    let modeContext = "";
    if (existsSync(modePath)) {
      modeContext = readFileSync(modePath, "utf-8");
    }

    // Check available CLI tools
    const capabilities = getCapabilitiesString();

    // Generate voice instructions from TOML config
    // Use mode-specific verbosity
    let voiceInstructions = "";
    try {
      const voiceStyle = loadVoiceStyle(config.voice.style, momentumInstall);
      const verbosityLevel =
        mode === "workspace"
          ? config.voice.verbosity.assistant || "terse"
          : config.voice.verbosity.project || "brief";
      const verbosity = loadVerbosityLevel(verbosityLevel, momentumInstall);
      voiceInstructions = buildVoiceInstructions(voiceStyle, verbosity);
    } catch {
      voiceInstructions = "Voice configuration not available.";
    }

    const view = {
      NAME: config.personalization.name,
      PROJECT_NAME: projectName,
      MODE: mode,
      PROJECT_ROOT: process.env.PROJECT_ROOT || process.cwd(),
      WORKFLOW_PROJECTS: process.env.WORKFLOW_PROJECTS || "",
      CAPABILITIES: capabilities,
      VOICE_INSTRUCTIONS: voiceInstructions,
      MODE_CONTEXT: modeContext,
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
