#!/usr/bin/env bun
/**
 * Momentum SessionEnd Hook
 * Aggregates session stats, logs summary to Layer 1 JSONL and Layer 3 Argus
 * Cleans up session cache
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { debugLog, debugLogSeparator } from "./shared/debug-log.ts";
import {
  appendEvent,
  createEvent,
  type HookInput,
  getEventsDir,
} from "./shared/jsonl-logger.ts";
import { postToArgus } from "./shared/argus-client.ts";
import {
  deleteSessionCache,
  readSessionCache,
} from "./shared/session-cache.ts";
import { parseTranscript } from "./shared/transcript-parser.ts";
import { loadConfig } from "./shared/config-loader.ts";

interface SessionEndInput extends HookInput {
  reason?: string; // user_exit, timeout, error, etc.
}

interface SessionStats {
  event_count: number;
  tool_uses: number;
  prompt_count: number;
  captures_count: number;
  total_input_tokens: number;
  total_output_tokens: number;
  tools_used: string[];
  files_changed: string[];
  commands_executed: string[];
}

async function readStdinWithTimeout(timeout: number = 3000): Promise<string> {
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

/**
 * Aggregate stats from today's JSONL events for this session
 */
function aggregateSessionEvents(sessionId: string): SessionStats {
  const stats: SessionStats = {
    event_count: 0,
    tool_uses: 0,
    prompt_count: 0,
    captures_count: 0,
    total_input_tokens: 0,
    total_output_tokens: 0,
    tools_used: [],
    files_changed: [],
    commands_executed: [],
  };

  try {
    const eventsDir = getEventsDir();
    // Must match filename timezone used in jsonl-logger.ts
    const config = loadConfig();
    const TZ = config.personalization.timezone || "America/Los_Angeles";
    const today = new Date().toLocaleDateString("en-CA", { timeZone: TZ });
    const eventFile = join(eventsDir, `${today}_events.jsonl`);

    if (!existsSync(eventFile)) {
      debugLog("SessionEnd", "No event file for today", { eventFile });
      return stats;
    }

    const content = readFileSync(eventFile, "utf-8");
    const lines = content.trim().split("\n");

    const toolsSet = new Set<string>();
    const filesSet = new Set<string>();
    const commandsSet = new Set<string>();

    for (const line of lines) {
      try {
        const event = JSON.parse(line);

        // Only count events for this session
        if (event.session_id !== sessionId) continue;

        stats.event_count++;

        // Count by hook type
        if (event.hook === "UserPromptSubmit") {
          stats.prompt_count++;
        } else if (
          event.hook === "PreToolUse" ||
          event.hook === "PostToolUse"
        ) {
          stats.tool_uses++;
          if (event.data?.tool_name) {
            toolsSet.add(event.data.tool_name);
          }
        } else if (event.hook === "Stop") {
          // Aggregate token stats from Stop events
          if (event.data?.tokens) {
            stats.total_input_tokens += event.data.tokens.input || 0;
            stats.total_output_tokens += event.data.tokens.output || 0;
          }
          if (event.data?.captures_count) {
            stats.captures_count += event.data.captures_count;
          }
          if (event.data?.tools_used) {
            for (const tool of event.data.tools_used) {
              toolsSet.add(tool);
            }
          }
        }
      } catch {
        // Skip malformed lines
      }
    }

    stats.tools_used = Array.from(toolsSet);
    stats.files_changed = Array.from(filesSet);
    stats.commands_executed = Array.from(commandsSet);

    debugLog("SessionEnd", "Aggregated session events", {
      event_count: stats.event_count,
      prompt_count: stats.prompt_count,
      tool_uses: stats.tool_uses,
      total_tokens: stats.total_input_tokens + stats.total_output_tokens,
    });

    return stats;
  } catch (error) {
    debugLog("SessionEnd", "Error aggregating events", {
      error: String(error),
    });
    return stats;
  }
}

async function main(): Promise<void> {
  try {
    debugLogSeparator();
    debugLog("SessionEnd", "Hook triggered");

    const input = await readStdinWithTimeout();
    const data: SessionEndInput = JSON.parse(input);

    debugLog("SessionEnd", "Input received", {
      session_id: data.session_id,
      reason: data.reason,
    });

    const cwd = data.cwd || process.cwd();
    const projectName = cwd.split("/").pop() || "unknown";

    // Read session cache for context
    const sessionContext = readSessionCache(data.session_id);

    // Calculate session duration
    let durationMinutes = 0;
    if (sessionContext?.created_at) {
      const startTime = new Date(sessionContext.created_at).getTime();
      const endTime = Date.now();
      durationMinutes = Math.round((endTime - startTime) / 60000);
    }

    // Parse transcript for final token counts
    const transcriptStats = parseTranscript(data.transcript_path);

    // Aggregate events from today's JSONL
    const sessionStats = aggregateSessionEvents(data.session_id);

    // Layer 1: JSONL event logging (session summary)
    const hookInput: HookInput = {
      session_id: data.session_id,
      transcript_path: data.transcript_path || "",
      cwd: cwd,
      hook_event_name: data.hook_event_name || "SessionEnd",
    };

    const logEvent = createEvent(hookInput, {
      reason: data.reason || "unknown",
      duration_minutes: durationMinutes,
      total_tokens:
        transcriptStats.total_input_tokens +
        transcriptStats.total_output_tokens,
      event_count: sessionStats.event_count,
      prompt_count: sessionStats.prompt_count,
      tool_uses: sessionStats.tool_uses,
      captures_count: sessionStats.captures_count,
      tools_used: transcriptStats.tools_used,
      files_changed: transcriptStats.files_changed,
      commands_executed: transcriptStats.commands_executed,
      model: transcriptStats.model,
    });
    appendEvent(logEvent);

    debugLog("SessionEnd", "JSONL event logged", {
      duration_minutes: durationMinutes,
      total_tokens:
        transcriptStats.total_input_tokens +
        transcriptStats.total_output_tokens,
    });

    // Layer 3: Argus real-time event (must await before exit)
    await postToArgus({
      source: "momentum",
      event_type: "session",
      hook: "SessionEnd",
      session_id: data.session_id,
      message: `Session ended: ${durationMinutes}min, ${transcriptStats.total_output_tokens} tokens`,
      data: {
        project: projectName,
        mode: sessionContext?.mode || "project",
        reason: data.reason || "unknown",
        duration_minutes: durationMinutes,
        total_tokens:
          transcriptStats.total_input_tokens +
          transcriptStats.total_output_tokens,
        tools_used: transcriptStats.tools_used,
        files_changed: transcriptStats.files_changed.length,
        model: transcriptStats.model,
      },
    }).catch(() => {
      // Silent failure - Argus is best-effort
    });
    debugLog("SessionEnd", "Argus event posted");

    // Cleanup: Delete session cache
    deleteSessionCache(data.session_id);

    debugLog("SessionEnd", "Hook completed successfully");
    process.exit(0);
  } catch (error) {
    debugLog("SessionEnd", "Hook error", { error: String(error) });
    process.exit(0);
  }
}

main();
