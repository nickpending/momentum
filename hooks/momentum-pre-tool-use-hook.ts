#!/usr/bin/env bun
/**
 * Momentum PreToolUse Hook
 * Logs tool invocations to Layer 1 JSONL for forensics
 */

import { debugLog, debugLogSeparator } from "./shared/debug-log.ts";
import {
  appendEvent,
  createEvent,
  type HookInput,
} from "./shared/jsonl-logger.ts";
import { postToArgus } from "./shared/argus-client.ts";

/**
 * Format tool message from tool name and input fields
 */
function formatToolMessage(
  name: string,
  input: Record<string, unknown>,
): string {
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

  const firstString = Object.values(input).find(
    (v) => typeof v === "string",
  ) as string;
  if (firstString) return `${name}: ${firstString.substring(0, 80)}`;

  return name;
}

interface PreToolUseInput extends HookInput {
  tool_name: string;
  tool_input: Record<string, unknown>;
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
    debugLog("PreToolUse", "Hook triggered");

    const input = await readStdinWithTimeout();
    const data: PreToolUseInput = JSON.parse(input);

    debugLog("PreToolUse", "Input received", {
      session_id: data.session_id,
      tool_name: data.tool_name,
      tool_use_id: data.tool_use_id,
    });

    // Layer 1: JSONL event logging
    const hookInput: HookInput = {
      session_id: data.session_id,
      transcript_path: data.transcript_path || "",
      cwd: data.cwd || process.cwd(),
      hook_event_name: data.hook_event_name || "PreToolUse",
    };

    const logEvent = createEvent(hookInput, {
      tool_name: data.tool_name,
      input_keys: Object.keys(data.tool_input || {}),
      tool_use_id: data.tool_use_id,
    });
    appendEvent(logEvent);

    debugLog("PreToolUse", "JSONL event logged", {
      tool_name: data.tool_name,
      input_keys: Object.keys(data.tool_input || {}),
    });

    // Layer 3: Argus - tool start event
    const cwd = data.cwd || process.cwd();
    const projectName = cwd.split("/").pop() || "unknown";
    const toolMessage = formatToolMessage(data.tool_name, data.tool_input);

    await postToArgus({
      source: "momentum",
      event_type: "tool",
      hook: "PreToolUse",
      message: toolMessage,
      data: {
        session_id: data.session_id,
        project: projectName,
        tool_name: data.tool_name,
        tool_input: data.tool_input,
      },
    }).catch(() => {
      // Silent failure
    });
    debugLog("PreToolUse", "Argus tool-start posted", { message: toolMessage });

    debugLog("PreToolUse", "Hook completed successfully");
    process.exit(0);
  } catch (error) {
    debugLog("PreToolUse", "Hook error", { error: String(error) });
    process.exit(0);
  }
}

main();
