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

/**
 * Render behavior section from config dials and triggers
 */
function renderBehaviorSection(config: ReturnType<typeof loadConfig>): string {
  const behavior = config.behavior;
  if (!behavior) {
    return ""; // No behavior config, return empty (graceful fallback)
  }

  const lines: string[] = [];

  // Dials section
  const dials = [
    {
      name: "Teaching",
      value: behavior.teaching,
      desc: "Surface first principles when relevant",
    },
    {
      name: "Wit",
      value: behavior.wit,
      desc: "Personality in body text, not just VOICE",
    },
    {
      name: "Pushback",
      value: behavior.pushback,
      desc: "Challenge assumptions when warranted",
    },
    { name: "Depth", value: behavior.depth, desc: "Explanation thoroughness" },
  ].filter((d) => d.value !== undefined);

  if (dials.length > 0) {
    lines.push("**Dials:**");
    for (const dial of dials) {
      lines.push(`- ${dial.name}: ${dial.value}/100 — ${dial.desc}`);
    }
    lines.push("");
  }

  // Teaching config
  const teaching = behavior.teaching_config;
  if (teaching?.enabled !== false) {
    lines.push("**Teaching:**");
    if (teaching?.domains) {
      lines.push(`- Domains: ${teaching.domains.join(", ")}`);
    }
    if (teaching?.min_confidence) {
      lines.push(`- Min confidence: ${teaching.min_confidence}`);
    }
    lines.push("- Use `📚 TEACH [domain] ~confidence:` format");
    lines.push("");
  }

  // Triggers
  const triggers = behavior.triggers;
  if (triggers) {
    const activeTriggersMap: Record<string, string> = {
      on_confusion: "User confusion → Step back to first principles",
      on_agreement: "Agreement on approach → Surface underlying principle",
      on_architecture: "Architecture decision → Note the trade-off pattern",
      on_completion: "Complex task completed → Explain what made it work",
    };

    const activeTriggers = Object.entries(triggers)
      .filter(([_, enabled]) => enabled)
      .map(([key]) => activeTriggersMap[key])
      .filter(Boolean);

    if (activeTriggers.length > 0) {
      lines.push("**Triggers:**");
      for (const trigger of activeTriggers) {
        lines.push(`- ${trigger}`);
      }
    }
  }

  return lines.join("\n");
}

/**
 * Check if ElevenLabs model supports v3 audio tags
 */
function supportsV3AudioTags(model: string | undefined): boolean {
  if (!model) return false;
  // v3 models interpret [tag] as emotions/reactions
  // v2.5 models speak them as literal text
  return model.includes("v3");
}

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

    // Load voice section based on TTS model (v3 gets audio tags, v2.5 gets basic)
    let voiceSection = "";
    const ttsModel = config.voice.tts?.model;
    const voiceFile = supportsV3AudioTags(ttsModel)
      ? "voice-v3.md"
      : "voice-basic.md";
    const voicePath = join(momentumInstall, "contexts", voiceFile);
    if (existsSync(voicePath)) {
      voiceSection = readFileSync(voicePath, "utf-8");
    } else {
      // Fallback if voice files don't exist
      voiceSection =
        "### 🎯 VOICE\n\nEnd responses with TTS summary: `🎯 VOICE: text`";
    }

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

    // Render behavior section from config
    const behaviorSection = renderBehaviorSection(config);

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
      // Voice section (v3 tags or basic) and verbosity
      VOICE_SECTION: voiceSection,
      VOICE_VERBOSITY: voiceVerbosity,
      // Behavioral calibration
      BEHAVIOR_SECTION: behaviorSection,
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
