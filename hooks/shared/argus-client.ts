#!/usr/bin/env bun
/**
 * Argus Client
 * Thin wrapper around argus-send library with momentum-specific types
 * Best-effort event posting - silent failure, never blocks
 */

import {
  send,
  loadConfig,
  type ArgusEvent as BaseArgusEvent,
  type ArgusHook,
  type ArgusStatus,
} from "@voidwire/argus-send";
import { debugLog } from "./debug-log.ts";

// Re-export types from argus-send for hook consumers
export type { ArgusHook, ArgusStatus };

/**
 * Event type categories for filtering/grouping
 */
export type ArgusEventType =
  | "tool"
  | "session"
  | "agent"
  | "response"
  | "prompt";

/**
 * Momentum-specific Argus event
 * All agent observability fields go at top level per API spec
 */
export interface ArgusEvent {
  source: string;
  event_type: ArgusEventType;
  hook: ArgusHook;
  session_id?: string;
  message?: string;
  timestamp?: string;
  data?: unknown;
  // Agent observability fields (top-level, not in data)
  tool_name?: string;
  tool_use_id?: string;
  status?: ArgusStatus;
  agent_id?: string;
}

// Cache config on first load
let cachedConfig: ReturnType<typeof loadConfig> | null = null;

function getConfig(): ReturnType<typeof loadConfig> {
  if (!cachedConfig) {
    cachedConfig = loadConfig();
  }
  return cachedConfig;
}

/**
 * Post event to Argus
 * Best-effort with silent failure
 */
export async function postToArgus(event: ArgusEvent): Promise<void> {
  const config = getConfig();

  // Skip if no API key configured
  if (!config.apiKey) {
    debugLog("ArgusClient", "Skipping - no API key configured");
    return;
  }

  debugLog("ArgusClient", "Posting event", {
    source: event.source,
    event_type: event.event_type,
    hook: event.hook,
  });

  // Pass all fields at top level per API spec
  const baseEvent: BaseArgusEvent = {
    source: event.source,
    event_type: event.event_type,
    message: event.message,
    timestamp: event.timestamp,
    data: event.data,
    // Agent observability fields at top level
    session_id: event.session_id,
    hook: event.hook,
    tool_name: event.tool_name,
    tool_use_id: event.tool_use_id,
    status: event.status,
    agent_id: event.agent_id,
  };

  const result = await send(baseEvent);

  if (result.captured) {
    debugLog("ArgusClient", "Event posted successfully", {
      event_id: result.event_id,
    });
  } else {
    debugLog("ArgusClient", "Event post failed", { error: result.error });
  }
}

/**
 * Check if Argus is configured (has API key)
 */
export function isArgusConfigured(): boolean {
  return getConfig().apiKey !== null;
}
