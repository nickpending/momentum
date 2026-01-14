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
 * Outputs v4 format with dial values and scale descriptions
 */
function renderBehaviorSection(config: ReturnType<typeof loadConfig>): string {
  const behavior = config.behavior;
  if (!behavior) {
    return ""; // No behavior config, return empty (graceful fallback)
  }

  const lines: string[] = [];

  // Personality dials by category - new structure with {value, scale}
  // Output matches v4 format: no header, just category lists
  const categories = [
    { name: "Communication", key: "communication" as const },
    { name: "Thinking", key: "thinking" as const },
    { name: "Interaction", key: "interaction" as const },
  ];

  for (const category of categories) {
    const categoryData = behavior[category.key];
    if (!categoryData) continue;

    const dialEntries = Object.entries(categoryData).filter(
      ([_, dial]) => dial && typeof dial === "object" && "value" in dial,
    );

    if (dialEntries.length > 0) {
      lines.push(`- ${category.name}:`);
      for (const [dialName, dial] of dialEntries) {
        const d = dial as { value: number; scale: string };
        const capitalizedName =
          dialName.charAt(0).toUpperCase() + dialName.slice(1);
        lines.push(`  - ${capitalizedName} ${d.value} (${d.scale})`);
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

/**
 * Generate merged commands table (shared + mode-specific)
 */
function generateCommandsTable(mode: string): string {
  // Shared commands (always present)
  const sharedCommands = [
    ["**qcom**", "Stage all, commit conventional"],
    ["**qpush**", "Push to origin"],
    ["**qsum**", "Summarize recent commits"],
    ["**qwhy**", "Explain why command failed"],
    ["**qexplain**", "Problem, solution, breakage, assumptions"],
    ["**qlazy**", "Anti-laziness enforcement"],
    ["**qnoquit**", "Force completion of analysis"],
  ];

  // Mode-specific commands
  const modeCommands =
    mode === "project"
      ? [
          ["**qtest**", "Write ONE integration test"],
          ["**qenv**", "Check env vars vs .env.example"],
          ["**qcheck**", "Skeptical senior engineer review"],
          ["**qfix**", "Debug and fix error"],
          ["**qsweep**", "Check what needs attention"],
          ["**qnext**", "What's next based on current work"],
          ["**qux**", "List test scenarios by priority"],
          ["**qpropagate**", "Update tasks based on discovery"],
        ]
      : [
          ["**qback**", "Add to project backlog"],
          ["**qalt**", "Suggest alternative approach"],
          ["**qsensible**", "Align goal, approach, problem, solution"],
          ["**qwtf**", "What's making this harder"],
        ];

  const allCommands = [...sharedCommands, ...modeCommands];
  const lines = [
    "| Command        | Action                                   |",
    "| -------------- | ---------------------------------------- |",
  ];
  for (const [cmd, action] of allCommands) {
    lines.push(`| ${cmd.padEnd(14)} | ${action.padEnd(40)} |`);
  }
  return lines.join("\n");
}

function main(): void {
  try {
    const config = loadConfig();
    const momentumInstall = config.momentum.install;

    // Determine mode
    const projectName = process.env.PROJECT_NAME || "unknown";
    const mode = projectName === "workspace" ? "workspace" : "project";

    // Read mode role (first 2 sentences)
    let modeRole = "";
    const rolePath = join(momentumInstall, "contexts", `${mode}-role.md`);
    if (existsSync(rolePath)) {
      modeRole = readFileSync(rolePath, "utf-8").trim();
    }

    // Read mode rules (principles, constraints)
    let modeRules = "";
    const rulesPath = join(momentumInstall, "contexts", `${mode}-rules.md`);
    if (existsSync(rulesPath)) {
      modeRules = readFileSync(rulesPath, "utf-8").trim();
    }

    // Read base template
    const basePath = join(momentumInstall, "contexts", "base.md");
    let baseTemplate = "";
    if (existsSync(basePath)) {
      baseTemplate = readFileSync(basePath, "utf-8");
    }

    // Generate merged commands table
    const commandsTable = generateCommandsTable(mode);

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
      // Load raw format, will render through Mustache later with CAPTURE/TEACH sections
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

    // Render output format with all embedded sections
    if (outputFormatSection) {
      outputFormatSection = Mustache.render(outputFormatSection, {
        CAPTURE_SECTION: captureSection,
        TEACH_SECTION: teachSection,
        VOICE_SECTION: voiceSection,
        VOICE_VERBOSITY: voiceVerbosity,
        OUTPUT_VERBOSITY: outputVerbosity,
      });
    }

    // Render behavior section from config
    const behaviorSection = renderBehaviorSection(config);

    const view = {
      // Identity
      ASSISTANT_NAME: config.personalization.assistant_name || "Assistant",
      NAME: config.personalization.name,
      PERSONALITY: personality,
      // Mode-specific content
      MODE_ROLE: modeRole,
      MODE_RULES: modeRules,
      COMMANDS_TABLE: commandsTable,
      // Context
      PROJECT_NAME: projectName,
      MODE: mode,
      PROJECT_ROOT: process.env.PROJECT_ROOT || process.cwd(),
      WORKFLOW_PROJECTS: process.env.WORKFLOW_PROJECTS || "",
      // Capabilities
      CAPABILITIES: capabilities,
      // Output (all sections pre-rendered into OUTPUT_FORMAT_SECTION)
      OUTPUT_FORMAT_SECTION: outputFormatSection,
      // Behavioral calibration
      BEHAVIOR_SECTION: behaviorSection,
    };

    // Render and output
    const rendered = Mustache.render(baseTemplate, view);
    console.log(rendered);
  } catch (error) {
    // On error, output raw template so claude still works
    console.error("render-project-prompt error:", error);
    process.exit(1);
  }
}

main();
