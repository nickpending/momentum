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

  // Personality dials by category
  const dialCategories = [
    {
      name: "Communication",
      dials: [
        { key: "formality", desc: "casual ←→ formal" },
        { key: "directness", desc: "diplomatic ←→ blunt" },
        { key: "warmth", desc: "clinical ←→ warm" },
        { key: "confidence", desc: "hedged ←→ assertive" },
      ],
    },
    {
      name: "Thinking",
      dials: [
        { key: "skepticism", desc: "trusting ←→ questioning" },
        { key: "curiosity", desc: "focused ←→ exploratory" },
        { key: "caution", desc: "bold ←→ careful" },
        { key: "precision", desc: "approximate ←→ exact" },
      ],
    },
    {
      name: "Interaction",
      dials: [
        { key: "teaching", desc: "surface first principles" },
        { key: "pushback", desc: "challenge assumptions" },
        { key: "wit", desc: "humor in body text" },
        { key: "initiative", desc: "reactive ←→ proactive" },
      ],
    },
  ];

  lines.push("**Dials:**");
  for (const category of dialCategories) {
    const activeDials = category.dials.filter(
      (d) => behavior[d.key] !== undefined,
    );
    if (activeDials.length > 0) {
      lines.push(
        `- ${category.name}: ${activeDials.map((d) => `${d.key[0].toUpperCase() + d.key.slice(1)} ${behavior[d.key]}`).join(", ")}`,
      );
    }
  }
  lines.push("");

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

    // Load speech marker section based on TTS model (v3 gets audio tags, v2.5 gets basic)
    // Skip if speech.enabled or voice.output_enabled is explicitly false
    let voiceSection = "";
    const speechEnabled =
      config.speech?.enabled ?? config.voice.output_enabled !== false;

    if (speechEnabled) {
      const ttsModel = config.voice.tts?.model;
      const markerFormat =
        config.speech?.marker_format ||
        (supportsV3AudioTags(ttsModel) ? "v3" : "basic");
      const markerPath = join(
        momentumInstall,
        "contexts",
        "speech",
        `marker-${markerFormat}.md`,
      );
      if (existsSync(markerPath)) {
        voiceSection = readFileSync(markerPath, "utf-8");
      } else {
        // Fallback if speech marker files don't exist
        voiceSection = "### 🗣️ VOICE\n\nTTS summary format: `🗣️ VOICE: text`";
      }
    }

    // Load output format context (e.g., standard, discord)
    // Default to "standard" if not specified
    let outputFormatSection = "";
    const outputFormat = config.output?.format || "standard";
    const outputFormatPath = join(
      momentumInstall,
      "contexts",
      "output",
      "format",
      `${outputFormat}.md`,
    );
    if (existsSync(outputFormatPath)) {
      outputFormatSection = readFileSync(outputFormatPath, "utf-8");
    }

    // Load CAPTURE section (unless disabled by profile)
    let captureSection = "";
    if (config.output?.capture_enabled !== false) {
      const capturePath = join(
        momentumInstall,
        "contexts",
        "output",
        "capture.md",
      );
      if (existsSync(capturePath)) {
        captureSection = readFileSync(capturePath, "utf-8");
      }
    }

    // Load TEACH section (unless disabled by profile)
    let teachSection = "";
    if (config.output?.teach_enabled !== false) {
      const teachPath = join(momentumInstall, "contexts", "output", "teach.md");
      if (existsSync(teachPath)) {
        teachSection = readFileSync(teachPath, "utf-8");
      }
    }

    // Load personality style (personality.style with fallback to voice.style)
    let personality = "";
    try {
      const styleName = config.personality?.style || config.voice.style;
      const voiceStyle = loadVoiceStyle(styleName, momentumInstall);
      personality = voiceStyle.personality.prompt;
    } catch {
      personality = "Professional and efficient communication style.";
    }

    // Load speech summary verbosity (for VOICE marker content)
    let voiceVerbosity = "";
    try {
      const summaryLevel =
        config.speech?.summary_verbosity ||
        (mode === "workspace"
          ? config.voice.verbosity.assistant || "terse"
          : config.voice.verbosity.project || "brief");
      const verbosity = loadVerbosityLevel(summaryLevel, momentumInstall);
      voiceVerbosity = verbosity.instructions.prompt;
    } catch {
      voiceVerbosity = "Be concise. Focus on essentials.";
    }

    // Load output verbosity (text response wordiness ceiling)
    let outputVerbosity = "";
    const outputVerbosityLevel =
      config.output?.verbosity || (mode === "workspace" ? "terse" : "brief");
    const outputVerbosityPath = join(
      momentumInstall,
      "contexts",
      "output",
      "verbosity",
      `${outputVerbosityLevel}.md`,
    );
    if (existsSync(outputVerbosityPath)) {
      outputVerbosity = readFileSync(outputVerbosityPath, "utf-8");
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
      // Output sections (modular, config-controlled)
      OUTPUT_FORMAT_SECTION: outputFormatSection,
      OUTPUT_VERBOSITY: outputVerbosity, // text wordiness ceiling
      CAPTURE_SECTION: captureSection,
      TEACH_SECTION: teachSection,
      VOICE_SECTION: voiceSection,
      VOICE_VERBOSITY: voiceVerbosity, // speech summary verbosity
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
