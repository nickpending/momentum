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
import { readSessionCache } from "./shared/session-cache.ts";
import { findAgentForToolUse } from "./shared/agent-lookup.ts";
import { readStdinWithTimeout } from "./shared/stdin-reader.ts";
import { formatToolMessage } from "./shared/tool-formatter.ts";

interface PreToolUseInput extends HookInput {
  tool_name: string;
  tool_input: Record<string, unknown>;
  tool_use_id?: string;
}

async function main(): Promise<void> {
  try {
    debugLogSeparator();
    debugLog("PreToolUse", "Hook triggered");

    const input = await readStdinWithTimeout();
    const data: PreToolUseInput = JSON.parse(input);

    // Log ALL raw fields to discover what Claude Code sends
    debugLog("PreToolUse", "RAW INPUT", data);

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
    // Get project name from session cache (set by SessionStart) to avoid cwd issues
    const sessionCache = readSessionCache(data.session_id);
    const projectName = sessionCache?.project || "unknown";
    const toolMessage = formatToolMessage(data.tool_name, data.tool_input);

    // Look up agent_id if this tool belongs to a subagent
    let agentId: string | null = null;
    if (data.tool_use_id && data.transcript_path) {
      agentId = findAgentForToolUse(
        data.transcript_path,
        data.session_id,
        data.tool_use_id,
      );
      if (agentId) {
        debugLog("PreToolUse", "Tool belongs to agent", {
          tool_use_id: data.tool_use_id,
          agent_id: agentId,
        });
      }
    }

    // Check if this is a Task tool (agent spawn)
    if (data.tool_name === "Task") {
      const taskInput = data.tool_input as {
        subagent_type?: string;
        description?: string;
        prompt?: string;
        run_in_background?: boolean;
      };

      // Extract instance_id from description if present: [AGENT: code-reviewer-1]
      const instanceMatch = taskInput.description?.match(
        /\[AGENT:\s*([^\]]+)\]/,
      );
      const instanceId = instanceMatch?.[1];

      // Post "pending" event - SubagentStart will handle "activated"
      await postToArgus({
        source: "momentum",
        event_type: "agent",
        hook: "PreToolUse",
        session_id: data.session_id,
        tool_use_id: data.tool_use_id,
        status: "pending",
        message: `Agent ${taskInput.subagent_type || "unknown"} starting`,
        data: {
          project: projectName,
          subagent_type: taskInput.subagent_type,
          description: taskInput.description,
          prompt_preview: taskInput.prompt?.substring(0, 200),
          is_background: taskInput.run_in_background || false,
          instance_id: instanceId,
        },
      }).catch(() => {});

      debugLog("PreToolUse", "Argus agent-pending posted", {
        subagent_type: taskInput.subagent_type,
        tool_use_id: data.tool_use_id,
        instance_id: instanceId,
      });
    } else {
      // Regular tool event
      const isBackground = data.tool_input.run_in_background === true;

      await postToArgus({
        source: "momentum",
        event_type: "tool",
        hook: "PreToolUse",
        session_id: data.session_id,
        tool_name: data.tool_name,
        tool_use_id: data.tool_use_id,
        agent_id: agentId || undefined,
        is_background: isBackground,
        message: toolMessage,
        data: {
          project: projectName,
          tool_input: data.tool_input,
        },
      }).catch(() => {});

      debugLog("PreToolUse", "Argus tool-start posted", {
        message: toolMessage,
        agent_id: agentId,
      });
    }

    debugLog("PreToolUse", "Hook completed successfully");
    process.exit(0);
  } catch (error) {
    debugLog("PreToolUse", "Hook error", { error: String(error) });
    process.exit(0);
  }
}

main();
