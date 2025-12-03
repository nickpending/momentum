#!/usr/bin/env bun
/**
 * JSONL Event Logger
 * Atomic append to daily event files in ~/.local/share/momentum/events/
 */

import { existsSync, mkdirSync, appendFileSync } from "fs";
import { join } from "path";
import { debugLog } from "./debug-log.ts";
import { readSessionCache, type SessionContext } from "./session-cache.ts";

// XDG Base Directory spec
const XDG_DATA_HOME =
  process.env.XDG_DATA_HOME || join(process.env.HOME!, ".local", "share");
const EVENTS_DIR = join(XDG_DATA_HOME, "momentum", "events");

export interface LogEvent {
  ts: string;
  session_id: string;
  hook: string;
  project: string;
  mode: string;
  user: string;
  git_branch?: string | null;
  iteration_number?: number | null;
  iteration_name?: string | null;
  transcript_path?: string;
  data: Record<string, unknown>;
}

/** Common hook input fields from Claude Code */
export interface HookInput {
  session_id: string;
  transcript_path: string;
  cwd: string;
  hook_event_name: string;
  permission_mode?: string;
}

/**
 * Ensure events directory exists
 */
function ensureEventsDir(): void {
  try {
    if (!existsSync(EVENTS_DIR)) {
      mkdirSync(EVENTS_DIR, { recursive: true });
      debugLog("JsonlLogger", "Created events directory", { path: EVENTS_DIR });
    }
  } catch (error) {
    debugLog("JsonlLogger", "Failed to create events dir", {
      error: String(error),
    });
  }
}

/**
 * Get today's event file path (YYYY-MM-DD_events.jsonl)
 */
function getTodayEventFile(): string {
  const today = new Date().toISOString().split("T")[0];
  return join(EVENTS_DIR, `${today}_events.jsonl`);
}

/**
 * Append event to today's JSONL file
 * Non-blocking, silent failure
 */
export function appendEvent(event: LogEvent): void {
  ensureEventsDir();

  try {
    const line = JSON.stringify(event) + "\n";
    const file = getTodayEventFile();
    appendFileSync(file, line);
    debugLog("JsonlLogger", "Event appended", { hook: event.hook, file });
  } catch (error) {
    debugLog("JsonlLogger", "Failed to append event", { error: String(error) });
  }
}

/**
 * Create a log event using session cache + hook input
 * Falls back to derived values if cache miss
 */
export function createEvent(
  hookInput: HookInput,
  data: Record<string, unknown>,
): LogEvent {
  const cache = readSessionCache(hookInput.session_id);

  if (cache) {
    debugLog("JsonlLogger", "Using cached session context", {
      session_id: hookInput.session_id,
      project: cache.project,
      mode: cache.mode,
    });
  } else {
    debugLog("JsonlLogger", "Cache miss, using fallback values", {
      session_id: hookInput.session_id,
    });
  }

  return {
    ts: new Date().toISOString(),
    session_id: hookInput.session_id,
    hook: hookInput.hook_event_name,
    project: cache?.project || hookInput.cwd.split("/").pop() || "unknown",
    mode: cache?.mode || "project",
    user: cache?.user || process.env.USER || "unknown",
    git_branch: cache?.git_branch,
    iteration_number: cache?.iteration_number,
    iteration_name: cache?.iteration_name,
    transcript_path: hookInput.transcript_path,
    data,
  };
}

/**
 * Create event for SessionStart (before cache exists)
 * Takes context directly since this hook creates the cache
 */
export function createSessionStartEvent(
  hookInput: HookInput,
  context: SessionContext,
  data: Record<string, unknown>,
): LogEvent {
  debugLog("JsonlLogger", "Creating SessionStart event", {
    session_id: hookInput.session_id,
    project: context.project,
    mode: context.mode,
  });

  return {
    ts: new Date().toISOString(),
    session_id: hookInput.session_id,
    hook: hookInput.hook_event_name,
    project: context.project,
    mode: context.mode,
    user: context.user,
    git_branch: context.git_branch,
    iteration_number: context.iteration_number,
    iteration_name: context.iteration_name,
    transcript_path: hookInput.transcript_path,
    data,
  };
}

export function getEventsDir(): string {
  return EVENTS_DIR;
}
