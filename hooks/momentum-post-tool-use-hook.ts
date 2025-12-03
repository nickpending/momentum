#!/usr/bin/env bun
/**
 * Momentum PostToolUse Hook
 * Logs tool results to Layer 1 JSONL for forensics
 */

import { debugLog, debugLogSeparator } from "./shared/debug-log.ts";
import {
  appendEvent,
  createEvent,
  type HookInput,
} from "./shared/jsonl-logger.ts";
import { postToArgus } from "./shared/argus-client.ts";
import { $ } from "bun";

interface PostToolUseInput extends HookInput {
  tool_name: string;
  tool_input: Record<string, unknown>;
  tool_response: unknown;
  tool_use_id?: string;
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
    debugLog("PostToolUse", "Hook triggered");

    const input = await readStdinWithTimeout();
    const data: PostToolUseInput = JSON.parse(input);

    debugLog("PostToolUse", "Input received", {
      session_id: data.session_id,
      tool_name: data.tool_name,
      tool_use_id: data.tool_use_id,
    });

    // Calculate result size
    let resultSize = 0;
    let success = true;
    try {
      const responseStr = JSON.stringify(data.tool_response);
      resultSize = responseStr.length;
      // Check if response indicates error
      if (
        typeof data.tool_response === "object" &&
        data.tool_response !== null
      ) {
        const resp = data.tool_response as Record<string, unknown>;
        if (resp.error || resp.is_error) {
          success = false;
        }
      }
    } catch {
      resultSize = 0;
    }

    // Layer 1: JSONL event logging
    const hookInput: HookInput = {
      session_id: data.session_id,
      transcript_path: data.transcript_path || "",
      cwd: data.cwd || process.cwd(),
      hook_event_name: data.hook_event_name || "PostToolUse",
    };

    const logEvent = createEvent(hookInput, {
      tool_name: data.tool_name,
      success: success,
      result_size: resultSize,
      tool_use_id: data.tool_use_id,
    });
    appendEvent(logEvent);

    debugLog("PostToolUse", "JSONL event logged", {
      tool_name: data.tool_name,
      success,
      result_size: resultSize,
    });

    // Layer 3: Argus - full observability
    const cwd = data.cwd || process.cwd();
    const projectName = cwd.split("/").pop() || "unknown";

    // Build summary - for large results from action tools, use llm-summarize
    let toolSummary = `${data.tool_name}: ${success ? "success" : "failed"}`;

    // LLM summarize for action tools with substantial results
    const actionTools = [
      "Bash",
      "Edit",
      "Write",
      "Task",
      "WebFetch",
      "WebSearch",
    ];
    if (
      actionTools.includes(data.tool_name) &&
      resultSize > 500 &&
      resultSize < 10000
    ) {
      try {
        const responsePreview = JSON.stringify(data.tool_response).substring(
          0,
          1000,
        );
        const result =
          await $`llm-summarize ${`Tool ${data.tool_name}: ${responsePreview}`}`.quiet();
        const parsed = JSON.parse(result.stdout.toString());
        if (parsed.summary) {
          toolSummary = parsed.summary;
        }
      } catch {
        // Fall back to simple summary
      }
    }

    await postToArgus({
      source: "momentum",
      event_type: "tool",
      hook: "PostToolUse",
      message: toolSummary,
      level: success ? "info" : "warn",
      data: {
        session_id: data.session_id,
        project: projectName,
        tool_name: data.tool_name,
        success,
        result_size: resultSize,
      },
    }).catch(() => {
      // Silent failure
    });
    debugLog("PostToolUse", "Argus event posted", { message: toolSummary });

    debugLog("PostToolUse", "Hook completed successfully");
    process.exit(0);
  } catch (error) {
    debugLog("PostToolUse", "Hook error", { error: String(error) });
    process.exit(0);
  }
}

main();
