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

    // Layer 3: Argus - full observability, all tools
    const cwd = data.cwd || process.cwd();
    const projectName = cwd.split("/").pop() || "unknown";

    // Build tool-specific message
    let message = `${data.tool_name}`;
    let hook: "SubagentStart" | "PreToolUse" = "PreToolUse";

    switch (data.tool_name) {
      case "Task":
        const subagentType =
          (data.tool_input?.subagent_type as string) || "unknown";
        message = `Subagent: ${subagentType}`;
        hook = "SubagentStart";
        break;
      case "Bash":
        const cmd = (data.tool_input?.command as string) || "";
        message = `Bash: ${cmd.substring(0, 80)}`;
        break;
      case "Edit":
      case "Write":
      case "NotebookEdit":
        const file =
          data.tool_input?.file_path ||
          (data.tool_input?.notebook_path as string) ||
          "";
        message = `${data.tool_name}: ${file.split("/").pop()}`;
        break;
      case "Read":
        const readFile = (data.tool_input?.file_path as string) || "";
        message = `Read: ${readFile.split("/").pop()}`;
        break;
      case "Glob":
        const pattern = (data.tool_input?.pattern as string) || "";
        message = `Glob: ${pattern}`;
        break;
      case "Grep":
        const grepPattern = (data.tool_input?.pattern as string) || "";
        message = `Grep: ${grepPattern.substring(0, 50)}`;
        break;
      case "Skill":
        const skill = (data.tool_input?.skill as string) || "unknown";
        message = `Skill: ${skill}`;
        break;
      case "SlashCommand":
        const slashCmd = (data.tool_input?.command as string) || "unknown";
        message = `Command: ${slashCmd}`;
        break;
      case "WebFetch":
        const url = (data.tool_input?.url as string) || "";
        message = `WebFetch: ${url.substring(0, 60)}`;
        break;
      case "WebSearch":
        const query = (data.tool_input?.query as string) || "";
        message = `WebSearch: ${query.substring(0, 50)}`;
        break;
      case "TodoWrite":
        message = `TodoWrite: updating task list`;
        break;
      case "AskUserQuestion":
        message = `AskUserQuestion: prompting user`;
        break;
      case "EnterPlanMode":
        message = `EnterPlanMode`;
        break;
      case "ExitPlanMode":
        message = `ExitPlanMode`;
        break;
      default:
        // MCP tools and others
        if (data.tool_name.startsWith("mcp__")) {
          const mcpTool = data.tool_name
            .replace("mcp__", "")
            .replace(/__/g, ".");
          message = `MCP: ${mcpTool}`;
        }
        break;
    }

    await postToArgus({
      source: "momentum",
      event_type: data.tool_name === "Task" ? "agent" : "tool",
      hook,
      message,
      level: "info",
      data: {
        session_id: data.session_id,
        project: projectName,
        tool_name: data.tool_name,
        input_preview: JSON.stringify(data.tool_input).substring(0, 200),
      },
    }).catch(() => {
      // Silent failure - Argus is best-effort
    });
    debugLog("PreToolUse", "Argus event posted", {
      tool: data.tool_name,
      message,
    });

    debugLog("PreToolUse", "Hook completed successfully");
    process.exit(0);
  } catch (error) {
    debugLog("PreToolUse", "Hook error", { error: String(error) });
    process.exit(0);
  }
}

main();
