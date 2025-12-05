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
import { readSessionCache } from "./shared/session-cache.ts";

/**
 * Format tool message from tool name and input fields
 * Handles Claude Code tools, known MCPs (Playwright), and fallback for unknown
 */
function formatToolMessage(
  name: string,
  input: Record<string, unknown>,
): string {
  // Known fields in priority order
  const command = input.command as string;
  const filePath = (input.file_path || input.notebook_path) as string;
  const url = input.url as string;
  const query = input.query as string;
  const pattern = input.pattern as string;
  const path = input.path as string;
  const element = input.element as string;
  const text = input.text as string;
  const key = input.key as string;
  const code = input.code as string;
  const description = input.description as string;

  if (command) return `${name}: ${command}`;
  if (url) return `${name} ${url}`;
  if (query) return `${name} "${query}"`;
  if (element && text) return `${name} "${text}" in ${element}`;
  if (element) return `${name} ${element}`;
  if (key) return `${name} ${key}`;
  if (pattern && path) return `${name} "${pattern}" in ${path}`;
  if (pattern) return `${name} "${pattern}"`;
  if (filePath) return `${name} ${filePath}`;
  if (code) return `${name}: ${code.substring(0, 80)}`;
  if (description) return `${name}: ${description}`;

  // Fallback: first string value for unknown MCPs
  const firstString = Object.values(input).find(
    (v) => typeof v === "string",
  ) as string;
  if (firstString) return `${name}: ${firstString.substring(0, 80)}`;

  return name;
}

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
    // Get project name from session cache (set by SessionStart) to avoid cwd issues
    const sessionCache = readSessionCache(data.session_id);
    const projectName = sessionCache?.project || "unknown";

    // Build message from tool input fields
    const toolMessage = formatToolMessage(data.tool_name, data.tool_input);

    await postToArgus({
      source: "momentum",
      event_type: "tool",
      hook: "PostToolUse",
      session_id: data.session_id,
      tool_name: data.tool_name,
      tool_use_id: data.tool_use_id,
      status: success ? "success" : "failure",
      message: toolMessage,
      data: {
        project: projectName,
        tool_input: data.tool_input,
        result_size: resultSize,
      },
    }).catch(() => {
      // Silent failure
    });
    debugLog("PostToolUse", "Argus event posted", { message: toolMessage });

    debugLog("PostToolUse", "Hook completed successfully");
    process.exit(0);
  } catch (error) {
    debugLog("PostToolUse", "Hook error", { error: String(error) });
    process.exit(0);
  }
}

main();
