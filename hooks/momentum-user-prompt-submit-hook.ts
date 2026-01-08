#!/usr/bin/env bun
/**
 * Momentum UserPromptSubmit Hook
 * Injects per-turn metadata (date, time, session_id)
 * Static content (system prompt, voice, output format) in system.md at session start
 */

import { debugLog, debugLogSeparator } from "./shared/debug-log.ts";
import { loadConfig } from "./shared/config-loader.ts";
import { PROJECT_ROOT, PROJECT_NAME } from "./shared/momentum-paths.ts";
import {
  appendEvent,
  createEvent,
  type HookInput as JsonlHookInput,
} from "./shared/jsonl-logger.ts";
import { postToArgus } from "./shared/argus-client.ts";
import { buildPromptContext } from "./shared/summary-context.ts";
import { getLastAssistantMessage } from "./shared/transcript-parser.ts";
import {
  summarize,
  loadConfig as loadLLMConfig,
} from "@voidwire/llm-summarize";
import { readStdinWithTimeout } from "./shared/stdin-reader.ts";
import {
  getUnackedNotifications,
  ackNotification,
  formatNotificationsForContext,
} from "./shared/notifications.ts";

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

    // Inject metadata (per-turn dynamic values only) as XML
    console.log("<turn>");
    console.log(`  <date>${currentDate}</date>`);
    console.log(`  <datetime>${currentDateTime}</datetime>`);
    console.log(`  <session_id>${data.session_id}</session_id>`);
    console.log("</turn>");

    // Inject notifications (urgent + indicator tiers)
    try {
      const notifications = getUnackedNotifications();
      if (notifications.length > 0) {
        const formatted = formatNotificationsForContext(notifications);
        console.log(formatted);

        // Auto-ack urgent notifications after injection
        for (const n of notifications) {
          if (n.tier === "urgent") {
            ackNotification(n.id);
          }
        }
        debugLog("UserPromptSubmit", "Notifications injected", {
          count: notifications.length,
          urgent: notifications.filter((n) => n.tier === "urgent").length,
        });
      }
    } catch {
      // Silent fail - never crash hook for notifications
    }

    debugLog("UserPromptSubmit", "Metadata injected");

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
      const result = await summarize(context, llmConfig, {
        mode: "quick",
        userName,
      });
      if (result.insights?.summary) {
        promptSummary = result.insights.summary;
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
