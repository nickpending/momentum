#!/usr/bin/env bun
/**
 * Render system prompt with Mustache substitution
 * Combines: contexts/{mode}-identity.md + contexts/base.md
 *
 * Identity flows naturally: role opener, name, personality, then principles
 * Base provides shared mechanics: agents, resources, guards, output
 *
 * Required env vars: PROJECT_NAME, PROJECT_ROOT, WORKFLOW_PROJECTS
 * Reads: NAME, ASSISTANT_NAME from config.toml, MODE derived from PROJECT_NAME
 * Checks: CLI tool capabilities at launch
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";
import Mustache from "mustache";
import { loadConfig } from "./shared/config-loader.ts";
import { getCapabilitiesString } from "./shared/capabilities.ts";
import { loadVoiceStyle, loadVerbosityLevel } from "./shared/voice-loader.ts";

// Disable HTML escaping for triple braces (we want raw output)
Mustache.escape = (text: string) => text;

function main(): void {
  try {
    const config = loadConfig();
    const momentumInstall = config.momentum.install;

    // Determine mode
    const projectName = process.env.PROJECT_NAME || "unknown";
    const mode = projectName === "workspace" ? "workspace" : "project";

    // Read identity template for this mode
    const identityPath = join(
      momentumInstall,
      "contexts",
      `${mode}-identity.md`,
    );
    let identityTemplate = "";
    if (existsSync(identityPath)) {
      identityTemplate = readFileSync(identityPath, "utf-8");
    } else {
      // Fallback to old structure if contexts/ doesn't exist yet
      const oldModePath = join(momentumInstall, `${mode}.md`);
      if (existsSync(oldModePath)) {
        identityTemplate = readFileSync(oldModePath, "utf-8");
      }
    }

    // Read base mechanics template
    const basePath = join(momentumInstall, "contexts", "base.md");
    let baseTemplate = "";
    if (existsSync(basePath)) {
      baseTemplate = readFileSync(basePath, "utf-8");
    } else {
      // Fallback to old system.md if contexts/ doesn't exist yet
      const oldSystemPath = join(momentumInstall, "system.md");
      if (existsSync(oldSystemPath)) {
        baseTemplate = readFileSync(oldSystemPath, "utf-8");
      }
    }

    // Combine templates: identity first, then base mechanics
    const combinedTemplate = `${identityTemplate}\n\n---\n\n${baseTemplate}`;

    // Check available CLI tools
    const capabilities = getCapabilitiesString();

    // Load personality and verbosity separately
    let personality = "";
    let voiceVerbosity = "";
    try {
      const voiceStyle = loadVoiceStyle(config.voice.style, momentumInstall);
      personality = voiceStyle.personality.prompt;

      const verbosityLevel =
        mode === "workspace"
          ? config.voice.verbosity.assistant || "terse"
          : config.voice.verbosity.project || "brief";
      const verbosity = loadVerbosityLevel(verbosityLevel, momentumInstall);
      voiceVerbosity = verbosity.instructions.prompt;
    } catch {
      personality = "Professional and efficient communication style.";
      voiceVerbosity = "Be concise. Focus on essentials.";
    }

    const view = {
      // Identity
      ASSISTANT_NAME: config.personalization.assistant_name || "Assistant",
      NAME: config.personalization.name,
      PERSONALITY: personality,
      // Context
      PROJECT_NAME: projectName,
      MODE: mode,
      PROJECT_ROOT: process.env.PROJECT_ROOT || process.cwd(),
      WORKFLOW_PROJECTS: process.env.WORKFLOW_PROJECTS || "",
      // Capabilities
      CAPABILITIES: capabilities,
      // Voice (just verbosity, personality is separate)
      VOICE_VERBOSITY: voiceVerbosity,
      // Legacy support (in case old templates still use this)
      VOICE_INSTRUCTIONS: `${personality}\n\n${voiceVerbosity}`,
      MODE_CONTEXT: "", // No longer used, but keep for backwards compat
    };

    // Render and output
    const rendered = Mustache.render(combinedTemplate, view);
    console.log(rendered);
  } catch (error) {
    // On error, output raw template so claude still works
    console.error("render-project-prompt error:", error);
    process.exit(1);
  }
}

main();
