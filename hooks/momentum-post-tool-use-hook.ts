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
import {
  findAgentForToolUse,
  removeCachedMapping,
} from "./shared/agent-lookup.ts";
import { readStdinWithTimeout } from "./shared/stdin-reader.ts";
import { formatToolMessage } from "./shared/tool-formatter.ts";

interface PostToolUseInput extends HookInput {
  tool_name: string;
  tool_input: Record<string, unknown>;
  tool_response: unknown;
  tool_use_id?: string;
}

/**
 * Task tool input structure
 */
interface TaskToolInput {
  prompt?: string;
  subagent_type?: string;
  description?: string;
  run_in_background?: boolean;
  resume?: string;
}

/**
 * Task tool response structure (toolUseResult)
 */
interface TaskToolResponse {
  isAsync?: boolean;
  agentId?: string;
  description?: string;
  prompt?: string;
  status?: string;
}

async function main(): Promise<void> {
  try {
    debugLogSeparator();
    debugLog("PostToolUse", "Hook triggered");

    const input = await readStdinWithTimeout();
    const data: PostToolUseInput = JSON.parse(input);

    // Log ALL raw fields to discover what Claude Code sends
    debugLog("PostToolUse", "RAW INPUT", data);

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

    // Look up agent_id if this tool belongs to a subagent
    let subagentOwner: string | null = null;
    if (data.tool_use_id && data.transcript_path) {
      subagentOwner = findAgentForToolUse(
        data.transcript_path,
        data.session_id,
        data.tool_use_id,
      );
      if (subagentOwner) {
        debugLog("PostToolUse", "Tool belongs to agent", {
          tool_use_id: data.tool_use_id,
          agent_id: subagentOwner,
        });
      }
      // Clean up cache entry now that tool is complete
      removeCachedMapping(data.session_id, data.tool_use_id);
    }

    // Check if this is a Task tool call (agent completion)
    if (data.tool_name === "Task") {
      const toolInput = data.tool_input as TaskToolInput;
      const toolResponse = data.tool_response as TaskToolResponse;
      const agentId = toolResponse?.agentId;

      if (agentId) {
        // Emit agent completion event
        await postToArgus({
          source: "momentum",
          event_type: "agent",
          hook: "PostToolUse",
          session_id: data.session_id,
          agent_id: agentId,
          tool_use_id: data.tool_use_id,
          status: success ? "success" : "failure",
          message: `Agent ${toolInput.subagent_type || "unknown"} completed`,
          data: {
            project: projectName,
            subagent_type: toolInput.subagent_type,
            description: toolInput.description,
            is_resume: !!toolInput.resume,
            is_background: toolInput.run_in_background || false,
          },
        }).catch(() => {});

        debugLog("PostToolUse", "Agent completion event posted", {
          agent_id: agentId,
          tool_use_id: data.tool_use_id,
          subagent_type: toolInput.subagent_type,
        });
      }
    } else {
      // Regular tool event
      const isBackground = data.tool_input.run_in_background === true;

      await postToArgus({
        source: "momentum",
        event_type: "tool",
        hook: "PostToolUse",
        session_id: data.session_id,
        tool_name: data.tool_name,
        tool_use_id: data.tool_use_id,
        agent_id: subagentOwner || undefined,
        is_background: isBackground,
        status: success ? "success" : "failure",
        message: toolMessage,
        data: {
          project: projectName,
          tool_input: data.tool_input,
          result_size: resultSize,
        },
      }).catch(() => {});

      debugLog("PostToolUse", "Argus event posted", {
        message: toolMessage,
        agent_id: subagentOwner,
      });
    }

    debugLog("PostToolUse", "Hook completed successfully");
    process.exit(0);
  } catch (error) {
    debugLog("PostToolUse", "Hook error", { error: String(error) });
    process.exit(0);
  }
}

main();
