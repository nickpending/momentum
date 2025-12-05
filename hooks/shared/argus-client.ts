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
} from "argus-send";
import { debugLog } from "./debug-log.ts";

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
 * Specific hooks that trigger events
 */
export type ArgusHook =
  | "Stop"
  | "SessionStart"
  | "SessionEnd"
  | "SubagentStart"
  | "SubagentStop"
  | "PreToolUse"
  | "PostToolUse"
  | "UserPromptSubmit";

/**
 * Momentum-specific Argus event with hook field
 */
export interface ArgusEvent {
  source: string;
  event_type: ArgusEventType;
  hook: ArgusHook;
  session_id?: string;
  message?: string;
  level?: "debug" | "info" | "warn" | "error";
  timestamp?: string;
  data?: unknown;
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

  // Convert to base ArgusEvent (hook goes in data)
  const baseEvent: BaseArgusEvent = {
    source: event.source,
    event_type: event.event_type,
    message: event.message,
    level: event.level,
    timestamp: event.timestamp,
    data: {
      hook: event.hook,
      session_id: event.session_id,
      ...(typeof event.data === "object" && event.data !== null
        ? event.data
        : { payload: event.data }),
    },
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
