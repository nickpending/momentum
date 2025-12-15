#!/usr/bin/env bun
/**
 * Momentum UserPromptSubmit Hook
 * Injects per-turn context: metadata + voice instructions
 * Static content (system prompt, output format) injected at session start
 */

import { debugLog, debugLogSeparator } from "./shared/debug-log.ts";
import { loadConfig } from "./shared/config-loader.ts";
import { PROJECT_ROOT, PROJECT_NAME } from "./shared/momentum-paths.ts";
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

    const projectName = PROJECT_NAME;
    const cwd = PROJECT_ROOT;
    const config = loadConfig();

    // Get current date/time in local timezone
    const TZ = config.personalization.timezone || "America/Los_Angeles";
    const now = new Date();
    const currentDate = now.toLocaleDateString("en-CA", { timeZone: TZ });
    const currentDateTime = now
      .toLocaleString("sv-SE", { timeZone: TZ })
      .replace(" ", "T");

    // Inject metadata (per-turn dynamic values)
    console.log("<!-- HOOK: Momentum per-turn context -->");
    console.log(`<!-- CURRENT_DATE: ${currentDate} -->`);
    console.log(`<!-- CURRENT_DATETIME: ${currentDateTime} -->`);
    console.log(`<!-- SESSION_ID: ${data.session_id} -->`);

    // Inject voice instructions (generated from TOML config)
    try {
      const momentumHome = config.momentum.install;
      const voiceStyle = loadVoiceStyle(config.voice.style, momentumHome);
      const verbosityLevel = config.voice.verbosity.project || "normal";
      const verbosity = loadVerbosityLevel(verbosityLevel, momentumHome);
      const voiceInstructions = buildVoiceInstructions(voiceStyle, verbosity);

      console.log(`\n${voiceInstructions}`);

      debugLog("UserPromptSubmit", "Voice instructions injected", {
        style: config.voice.style,
        verbosity: verbosityLevel,
      });
    } catch (error) {
      debugLog("UserPromptSubmit", "Failed to load voice instructions", {
        error: String(error),
      });
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
    debugLog("UserPromptSubmit", "JSONL event logged");

    // Layer 3: Argus with LLM summary
    const userName = config.personalization.name;
    let promptSummary = data.prompt?.substring(0, 100) || "Empty prompt";

    const previousTurn = data.transcript_path
      ? getLastAssistantMessage(data.transcript_path)
      : null;

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
    }).catch(() => {});

    debugLog("UserPromptSubmit", "Hook completed successfully");
    process.exit(0);
  } catch (error) {
    debugLog("UserPromptSubmit", "Hook error", { error: String(error) });
    process.exit(0);
  }
}

main();
