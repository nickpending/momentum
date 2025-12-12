#!/usr/bin/env bun
/**
 * Momentum Dynamic Context Hook
 * Outputs routing instructions for Claude to interpret
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { debugLog, debugLogSeparator } from "./shared/debug-log.ts";
import { loadConfig } from "./shared/config-loader.ts";
import {
  PROJECT_ROOT,
  PROJECT_NAME,
  WORKFLOW_PROJECTS,
  WORKFLOW_DIR,
  ARTIFACTS_DIR,
  STATE_DIR,
  CONTEXTS_DIR,
  PROJECT_OBSIDIAN_DIR,
  EXPLORATIONS_DIR,
} from "./shared/momentum-paths.ts";
import {
  loadVoiceStyle,
  loadVerbosityLevel,
  buildVoiceInstructions,
} from "./shared/voice-loader.ts";
import {
  appendEvent,
  createEvent,
  type HookInput as JsonlHookInput,
} from "./shared/jsonl-logger.ts";
import { postToArgus } from "./shared/argus-client.ts";
import { buildPromptContext } from "./shared/summary-context.ts";
import { getLastAssistantMessage } from "./shared/transcript-parser.ts";
import { summarize, loadConfig as loadLLMConfig } from "llm-summarize";
import { readStdinWithTimeout } from "./shared/stdin-reader.ts";

interface HookInput {
  session_id: string;
  prompt: string;
  transcript_path?: string;
  hook_event_name: string;
}

async function main() {
  try {
    debugLogSeparator();
    debugLog("UserPromptSubmit", "Hook triggered");

    const input = await readStdinWithTimeout(5000);
    const data: HookInput = JSON.parse(input);

    debugLog("UserPromptSubmit", "Input received", {
      session_id: data.session_id,
      prompt: data.prompt.substring(0, 100),
      cwd: PROJECT_ROOT,
    });

    // Use centralized path resolution from momentum-paths.ts
    const projectName = PROJECT_NAME;
    const cwd = PROJECT_ROOT;

    // Load configuration
    const config = loadConfig();
    const momentumConfig = config.momentum.install;

    // Always use PROJECT_ROUTING.md (project mode only now)
    let contextsPath = CONTEXTS_DIR;
    let routingPath = join(contextsPath, "PROJECT_ROUTING.md");

    // If no project contexts, use global momentum contexts
    if (!existsSync(routingPath)) {
      debugLog("UserPromptSubmit", "Project routing not found, using global");
      contextsPath = join(momentumConfig, "contexts");
      routingPath = join(contextsPath, "PROJECT_ROUTING.md");
    }

    debugLog("UserPromptSubmit", "Using project routing", {
      contextsPath,
      routingPath,
    });

    if (!existsSync(routingPath)) {
      debugLog("UserPromptSubmit", "No routing file found, exiting", {
        routingPath,
      });
      // No routing file found anywhere - silent fail
      process.exit(0);
    }

    debugLog("UserPromptSubmit", "Reading routing file", { routingPath });
    let routingContent = readFileSync(routingPath, "utf-8");

    // Get workflow paths (from env vars via momentum-paths.ts, non-path settings from config)
    const workflowProjects = WORKFLOW_PROJECTS;
    const workflowDev = config.paths.dev; // Injected for context, placeholder unused
    const momentumHomeDir = config.momentum.workspace;

    // Check for Lore availability first (needed for placeholder replacement)
    const loreConfigPath = join(config.lore.config, "config");
    const loreAvailable = existsSync(loreConfigPath);

    debugLog("UserPromptSubmit", "Replacing placeholders", {
      projectName,
      workflowProjects,
      workflowDev,
      momentumConfig,
      momentumHomeDir,
      contextsPath,
      loreAvailable,
    });

    // Replace placeholders with actual values
    routingContent = routingContent.replace(
      /PROJECT_NAME_PLACEHOLDER/g,
      projectName,
    );
    routingContent = routingContent.replace(
      /WORKFLOW_PROJECTS_PLACEHOLDER/g,
      workflowProjects,
    );
    routingContent = routingContent.replace(
      /WORKFLOW_DEV_PLACEHOLDER/g,
      workflowDev,
    );
    routingContent = routingContent.replace(
      /MOMENTUM_CONFIG_PLACEHOLDER/g,
      momentumConfig,
    );
    routingContent = routingContent.replace(
      /MOMENTUM_HOME_DIR_PLACEHOLDER/g,
      momentumHomeDir,
    );
    routingContent = routingContent.replace(
      /MOMENTUM_CONTEXTS_PATH/g,
      contextsPath,
    );
    routingContent = routingContent.replace(
      /LORE_AVAILABLE_PLACEHOLDER/g,
      String(loreAvailable),
    );

    // Get current date/time in local timezone for user-facing context
    // Internal timestamps (ts field) stay UTC for sorting; filenames/context use local
    const TZ = config.personalization.timezone || "America/Los_Angeles";
    const now = new Date();
    const currentDate = now.toLocaleDateString("en-CA", { timeZone: TZ }); // YYYY-MM-DD
    const currentDateTime = now
      .toLocaleString("sv-SE", { timeZone: TZ })
      .replace(" ", "T"); // YYYY-MM-DDTHH:MM:SS

    // Gitignore compliance checked by session-start hook via llcli-tools/gitignore-check

    // Always inject full routing for consistent semantic intent matching
    debugLog("UserPromptSubmit", "Full routing injection");
    console.log(routingContent);

    // Use centralized paths from momentum-paths.ts
    const projectRoot = PROJECT_ROOT;
    const workflowDir = WORKFLOW_DIR;
    const artifactsDir = ARTIFACTS_DIR;
    const stateDir = STATE_DIR;
    const projectObsidianDir = PROJECT_OBSIDIAN_DIR;
    const explorationsDir = EXPLORATIONS_DIR;

    // Lore paths from config if available
    const loreConfig = loreAvailable ? config.lore.config : null;
    const loreData = loreAvailable ? config.lore.data : null;
    const loreCache = loreAvailable ? config.lore.cache : null;

    // XDG state directory for runtime state (saves log, etc)
    const momentumStateDir = join(
      process.env.HOME || "",
      ".local",
      "state",
      "momentum",
    );

    // Get user name from config
    const userName = config.personalization.name;

    // Always output metadata and paths for context awareness
    console.log("\n<!-- HOOK: Momentum routing loaded -->");
    console.log(`<!-- CURRENT_DATE: ${currentDate} -->`);
    console.log(`<!-- CURRENT_DATETIME: ${currentDateTime} -->`);
    console.log(`<!-- SESSION_ID: ${data.session_id} -->`);
    console.log(`<!-- MODE: project -->`);
    console.log(`<!-- PROJECT: ${projectName} -->`);
    console.log(`<!-- NAME: ${userName} -->`);
    console.log("");
    console.log("<!-- PATH VARIABLES -->");
    console.log(`<!-- PROJECT_ROOT: ${projectRoot} -->`);
    console.log(`<!-- WORKFLOW_DIR: ${workflowDir} -->`);
    console.log(`<!-- ARTIFACTS_DIR: ${artifactsDir} -->`);
    console.log(`<!-- STATE_DIR: ${stateDir} -->`);
    console.log(`<!-- CONTEXTS_PATH: ${contextsPath} -->`);
    console.log(`<!-- MOMENTUM_CONFIG: ${momentumConfig} -->`);
    console.log(`<!-- MOMENTUM_HOME_DIR: ${momentumHomeDir} -->`);
    console.log(`<!-- MOMENTUM_STATE_DIR: ${momentumStateDir} -->`);
    console.log(`<!-- WORKFLOW_PROJECTS: ${workflowProjects} -->`);
    console.log(`<!-- WORKFLOW_DEV: ${workflowDev} -->`);
    console.log(`<!-- PROJECT_OBSIDIAN_DIR: ${projectObsidianDir} -->`);
    console.log(`<!-- EXPLORATIONS_DIR: ${explorationsDir} -->`);
    if (loreAvailable) {
      console.log(`<!-- LORE_CONFIG: ${loreConfig} -->`);
      console.log(`<!-- LORE_DATA: ${loreData} -->`);
      console.log(`<!-- LORE_CACHE: ${loreCache} -->`);
    }
    console.log("");
    console.log("<!-- CAPABILITIES -->");
    console.log(`<!-- LORE_AVAILABLE: ${loreAvailable} -->`);
    console.log(`<!-- SETUPD_AVAILABLE: true -->`);

    // Load and inject combined output format (CAPTURE + VOICE) at the end
    try {
      const outputFormatPath = join(contextsPath, "OUTPUT_FORMAT.md");
      let outputFormatContent = "";

      if (existsSync(outputFormatPath)) {
        outputFormatContent = await Bun.file(outputFormatPath).text();
      }

      // Load voice instructions and append to output format
      const momentumHome = config.momentum.install;
      const voiceStyle = loadVoiceStyle(config.voice.style, momentumHome);
      const verbosityLevel = config.voice.verbosity.project || "normal";
      const verbosity = loadVerbosityLevel(verbosityLevel, momentumHome);
      const voiceInstructions = buildVoiceInstructions(voiceStyle, verbosity);

      // Combine into single output format block
      const combinedOutput = `${outputFormatContent}\n\n${voiceInstructions}`;
      console.log(`\n${combinedOutput}`);

      debugLog("UserPromptSubmit", "Output format injected", {
        style: config.voice.style,
        verbosity: verbosityLevel,
      });
    } catch (error) {
      debugLog("UserPromptSubmit", "Failed to load output format", {
        error: String(error),
      });
      // Continue without output format - it's optional
    }

    // Layer 1: JSONL event logging
    const jsonlHookInput: JsonlHookInput = {
      session_id: data.session_id,
      transcript_path: data.transcript_path || "",
      cwd: cwd,
      hook_event_name: data.hook_event_name || "UserPromptSubmit",
    };
    const logEvent = createEvent(jsonlHookInput, {
      prompt_length: data.prompt?.length || 0,
    });
    appendEvent(logEvent);
    debugLog("UserPromptSubmit", "JSONL event logged", {
      prompt_length: data.prompt?.length || 0,
    });

    // Layer 3: Argus with LLM summary (structured context)
    let promptSummary = data.prompt?.substring(0, 100) || "Empty prompt";

    // Get previous assistant message for context
    const previousTurn = data.transcript_path
      ? getLastAssistantMessage(data.transcript_path)
      : null;

    // Build structured context and summarize
    try {
      const context = buildPromptContext({
        eventType: "UserPromptSubmit",
        project: projectName,
        sessionId: data.session_id,
        content: data.prompt || "",
        previousTurn: previousTurn || undefined,
        userName,
      });
      const llmConfig = loadLLMConfig();
      const result = await summarize(context, llmConfig);
      if (result.summary) {
        promptSummary = result.summary;
      }
    } catch {
      // Fall back to truncated prompt
      promptSummary = data.prompt?.substring(0, 100) || "Empty prompt";
    }

    await postToArgus({
      source: "momentum",
      event_type: "prompt",
      hook: "UserPromptSubmit",
      session_id: data.session_id,
      message: promptSummary,
      data: {
        project: projectName,
        prompt_length: data.prompt?.length || 0,
      },
    }).catch(() => {
      // Silent failure
    });
    debugLog("UserPromptSubmit", "Argus event posted", {
      message: promptSummary,
    });

    debugLog("UserPromptSubmit", "Hook completed successfully");
    process.exit(0);
  } catch (error) {
    debugLog("UserPromptSubmit", "Hook error", { error: String(error) });
    // Silent fail to not interrupt Claude
    process.exit(0);
  }
}

main();
