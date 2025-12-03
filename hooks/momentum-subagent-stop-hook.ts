#!/usr/bin/env bun
/**
 * Momentum SubagentStop Hook
 * Logs agent completions to Layer 1 JSONL and Layer 3 Argus
 */

import { debugLog, debugLogSeparator } from "./shared/debug-log.ts";
import {
  appendEvent,
  createEvent,
  type HookInput,
} from "./shared/jsonl-logger.ts";
import { postToArgus } from "./shared/argus-client.ts";

interface SubagentStopInput extends HookInput {
  subagent_type?: string;
  subagent_result?: unknown;
  duration_ms?: number;
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

async function main(): Promise<void> {
  try {
    debugLogSeparator();
    debugLog("SubagentStop", "Hook triggered");

    const input = await readStdinWithTimeout();
    const data: SubagentStopInput = JSON.parse(input);

    debugLog("SubagentStop", "Input received", {
      session_id: data.session_id,
      subagent_type: data.subagent_type,
      duration_ms: data.duration_ms,
    });

    const cwd = data.cwd || process.cwd();
    const projectName = cwd.split("/").pop() || "unknown";

    // Detect Claude Code internal agents: no type provided and instant completion
    const isSystemAgent =
      !data.subagent_type &&
      (data.duration_ms === 0 || data.duration_ms === undefined);
    const agentType = isSystemAgent
      ? "system"
      : data.subagent_type || "unknown";

    // Determine status from result
    let status: "success" | "error" = "success";
    if (
      typeof data.subagent_result === "object" &&
      data.subagent_result !== null
    ) {
      const result = data.subagent_result as Record<string, unknown>;
      if (result.error || result.is_error) {
        status = "error";
      }
    }

    // Layer 1: JSONL event logging
    const hookInput: HookInput = {
      session_id: data.session_id,
      transcript_path: data.transcript_path || "",
      cwd: cwd,
      hook_event_name: data.hook_event_name || "SubagentStop",
    };

    const logEvent = createEvent(hookInput, {
      agent_type: agentType,
      duration_ms: data.duration_ms || 0,
      status: status,
    });
    appendEvent(logEvent);

    debugLog("SubagentStop", "JSONL event logged", {
      agent_type: agentType,
      duration_ms: data.duration_ms,
      status,
    });

    // Layer 3: Argus real-time event (must await before exit)
    await postToArgus({
      source: "momentum",
      event_type: "agent",
      hook: "SubagentStop",
      message: `Agent ${agentType} completed (${status})`,
      level: status === "error" ? "warn" : "info",
      data: {
        session_id: data.session_id,
        project: projectName,
        agent_type: agentType,
        duration_ms: data.duration_ms || 0,
        status: status,
      },
    }).catch(() => {
      // Silent failure - Argus is best-effort
    });
    debugLog("SubagentStop", "Argus event posted");

    debugLog("SubagentStop", "Hook completed successfully");
    process.exit(0);
  } catch (error) {
    debugLog("SubagentStop", "Hook error", { error: String(error) });
    process.exit(0);
  }
}

main();
