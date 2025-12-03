#!/usr/bin/env bun
/**
 * Argus Client
 * Best-effort event posting to Argus observability platform
 * Silent failure - never blocks or throws
 */

import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { debugLog } from "./debug-log.ts";

/**
 * Event type categories for filtering/grouping
 */
export type ArgusEventType =
  | "response"
  | "session"
  | "agent"
  | "tool"
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

export interface ArgusEvent {
  source: string;
  event_type: ArgusEventType;
  hook: ArgusHook;
  message?: string;
  level?: "debug" | "info" | "warn" | "error";
  timestamp?: string;
  data?: unknown;
}

interface ArgusConfig {
  host: string;
  apiKey: string | null;
}

/**
 * Load Argus configuration from ~/.config/argus/config.toml
 */
function loadConfig(): ArgusConfig {
  const configPath = join(process.env.HOME!, ".config", "argus", "config.toml");
  const defaultHost = "http://127.0.0.1:8765";

  if (!existsSync(configPath)) {
    return { host: defaultHost, apiKey: null };
  }

  try {
    const content = readFileSync(configPath, "utf-8");

    // Parse server.host (default: 127.0.0.1)
    const hostMatch = content.match(/^\s*host\s*=\s*"([^"]+)"/m);
    const host = hostMatch ? hostMatch[1] : "127.0.0.1";

    // Parse server.port (default: 8765)
    const portMatch = content.match(/^\s*port\s*=\s*(\d+)/m);
    const port = portMatch ? portMatch[1] : "8765";

    // Parse api_keys array, extract first key
    const keysMatch = content.match(/api_keys\s*=\s*\[([^\]]+)\]/);
    let apiKey: string | null = null;
    if (keysMatch) {
      const firstKey = keysMatch[1].match(/"([^"]+)"/);
      apiKey = firstKey ? firstKey[1] : null;
    }

    return {
      host: `http://${host}:${port}`,
      apiKey,
    };
  } catch {
    return { host: defaultHost, apiKey: null };
  }
}

// Cache config on first load
let cachedConfig: ArgusConfig | null = null;

function getConfig(): ArgusConfig {
  if (!cachedConfig) {
    cachedConfig = loadConfig();
  }
  return cachedConfig;
}

/**
 * Post event to Argus
 * Best-effort with 2s timeout, silent failure
 */
export async function postToArgus(event: ArgusEvent): Promise<void> {
  const config = getConfig();

  // Skip if no API key configured
  if (!config.apiKey) {
    debugLog("ArgusClient", "Skipping - no API key configured");
    return;
  }

  // Add timestamp if missing
  if (!event.timestamp) {
    event.timestamp = new Date().toISOString();
  }

  debugLog("ArgusClient", "Posting event", {
    source: event.source,
    event_type: event.event_type,
    host: config.host,
  });

  try {
    const response = await fetch(`${config.host}/events`, {
      method: "POST",
      headers: {
        "X-API-Key": config.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
      signal: AbortSignal.timeout(2000),
    });

    if (response.ok) {
      debugLog("ArgusClient", "Event posted successfully", {
        status: response.status,
      });
    } else {
      debugLog("ArgusClient", "Event post failed", {
        status: response.status,
        statusText: response.statusText,
      });
    }
  } catch (error) {
    debugLog("ArgusClient", "Event post error", { error: String(error) });
  }
}

/**
 * Check if Argus is configured (has API key)
 */
export function isArgusConfigured(): boolean {
  return getConfig().apiKey !== null;
}
