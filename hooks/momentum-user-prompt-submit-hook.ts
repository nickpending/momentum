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
import { $ } from "bun";

interface HookInput {
  session_id: string;
  prompt: string;
  transcript_path?: string;
  hook_event_name: string;
}

async function readStdinWithTimeout(timeout: number = 5000): Promise<string> {
  return new Promise((resolve) => {
    let data = "";
    const timer = setTimeout(() => {
      resolve("{}");
    }, timeout);

    process.stdin.on("data", (chunk) => {
      data += chunk.toString();
    });

    process.stdin.on("end", () => {
      clearTimeout(timer);
      resolve(data);
    });

    process.stdin.on("error", () => {
      clearTimeout(timer);
      resolve("{}");
    });
  });
}

async function main() {
  try {
    debugLogSeparator();
    debugLog("UserPromptSubmit", "Hook triggered");

    const input = await readStdinWithTimeout();
    const data: HookInput = JSON.parse(input);

    debugLog("UserPromptSubmit", "Input received", {
      session_id: data.session_id,
      prompt: data.prompt.substring(0, 100),
      cwd: process.cwd(),
    });

    // Get project name from current directory
    const cwd = process.cwd();
    const projectName = cwd.split("/").pop() || "unknown";

    // Load configuration
    const config = loadConfig();
    const momentumConfig = config.momentum.install;

    // Always use PROJECT_ROUTING.md (project mode only now)
    let contextsPath = join(cwd, ".workflow", "contexts");
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

    // Get workflow paths from config
    const workflowProjects = config.paths.projects;
    const workflowDev = config.paths.dev;
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

    // Get current date in ISO format
    const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const currentDateTime = new Date().toISOString(); // Full ISO timestamp

    // Gitignore compliance checked by session-start hook via llcli-tools/gitignore-check

    // Always inject full routing for consistent semantic intent matching
    debugLog("UserPromptSubmit", "Full routing injection");
    console.log(routingContent);

    // Calculate project-specific paths
    const projectRoot = cwd;
    const workflowDir = join(projectRoot, ".workflow");
    const artifactsDir = join(workflowDir, "artifacts");
    const stateDir = join(workflowDir, "state");
    const projectObsidianDir = join(workflowProjects, projectName);
    const explorationsDir = join(projectObsidianDir, "explorations");

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
      const result = await $`llm-summarize ${context}`.quiet();
      const parsed = JSON.parse(result.stdout.toString());
      if (parsed.summary) {
        promptSummary = parsed.summary;
      }
    } catch {
      // Fall back to truncated prompt
      promptSummary = data.prompt?.substring(0, 100) || "Empty prompt";
    }

    await postToArgus({
      source: "momentum",
      event_type: "prompt",
      hook: "UserPromptSubmit",
      message: promptSummary,
      data: {
        session_id: data.session_id,
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
