#!/usr/bin/env bun
/**
 * Momentum SubagentStart Hook
 * Caches agent_id → agent_type mapping for SubagentStop lookup
 * Posts "activated" event to Argus
 */

import { debugLog, debugLogSeparator } from "./shared/debug-log.ts";
import {
  appendEvent,
  createEvent,
  type HookInput,
} from "./shared/jsonl-logger.ts";
import { postToArgus } from "./shared/argus-client.ts";
import { readSessionCache } from "./shared/session-cache.ts";
import { cacheAgentType } from "./shared/agent-lookup.ts";
import { readStdinWithTimeout } from "./shared/stdin-reader.ts";

interface SubagentStartInput extends HookInput {
  agent_id?: string;
  agent_type?: string;
}

async function main(): Promise<void> {
  try {
    debugLogSeparator();
    debugLog("SubagentStart", "Hook triggered");

    const input = await readStdinWithTimeout();
    const data: SubagentStartInput = JSON.parse(input);

    debugLog("SubagentStart", "RAW INPUT", data);

    const cwd = data.cwd || process.cwd();
    const projectName = cwd.split("/").pop() || "unknown";
    const agentType = data.agent_type || "unknown";
    const agentId = data.agent_id;

    // Cache agent_id → agent_type for SubagentStop lookup
    if (agentId && data.session_id) {
      cacheAgentType(data.session_id, agentId, agentType);
    }

    // Layer 1: JSONL event logging
    const hookInput: HookInput = {
      session_id: data.session_id,
      transcript_path: data.transcript_path || "",
      cwd: cwd,
      hook_event_name: data.hook_event_name || "SubagentStart",
    };

    const logEvent = createEvent(hookInput, {
      agent_type: agentType,
      agent_id: agentId,
      status: "activated",
    });
    appendEvent(logEvent);

    debugLog("SubagentStart", "JSONL event logged", {
      agent_type: agentType,
      agent_id: agentId,
    });

    // Layer 3: Argus - agent activated event
    const sessionCache = readSessionCache(data.session_id);
    await postToArgus({
      source: "momentum",
      event_type: "agent",
      hook: "SubagentStart",
      session_id: data.session_id,
      agent_id: agentId,
      status: "activated",
      message: `Agent ${agentType} activated`,
      data: {
        project: sessionCache?.project || projectName,
        subagent_type: agentType,
      },
    }).catch(() => {});

    debugLog("SubagentStart", "Argus event posted", {
      agent_type: agentType,
      agent_id: agentId,
      status: "activated",
    });

    debugLog("SubagentStart", "Hook completed successfully");
    process.exit(0);
  } catch (error) {
    debugLog("SubagentStart", "Hook error", { error: String(error) });
    process.exit(0);
  }
}

main();
