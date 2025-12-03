#!/usr/bin/env bun
/**
 * Session Cache
 * Persists session context from SessionStart for use by other hooks
 * Stored in /tmp/momentum-session-{session_id}.json
 */

import { existsSync, readFileSync, writeFileSync, unlinkSync } from "fs";
import { join } from "path";
import { debugLog } from "./debug-log.ts";

export interface SessionContext {
  session_id: string;
  mode: string; // project | workspace
  project: string; // derived from cwd
  user: string; // from config
  git_branch: string | null; // current branch
  iteration_number: number | null;
  iteration_name: string | null;
  created_at: string; // ISO timestamp
  source: string; // startup | resume | clear | compact
}

const CACHE_DIR = "/tmp";

function getCachePath(sessionId: string): string {
  return join(CACHE_DIR, `momentum-session-${sessionId}.json`);
}

/**
 * Write session context to cache
 * Called by SessionStart hook
 */
export function writeSessionCache(context: SessionContext): void {
  try {
    const path = getCachePath(context.session_id);
    writeFileSync(path, JSON.stringify(context, null, 2));
    debugLog("SessionCache", "Cache written", {
      session_id: context.session_id,
      project: context.project,
      mode: context.mode,
      path,
    });
  } catch (error) {
    debugLog("SessionCache", "Failed to write cache", { error: String(error) });
  }
}

/**
 * Read session context from cache
 * Returns null if cache doesn't exist or is invalid
 */
export function readSessionCache(sessionId: string): SessionContext | null {
  try {
    const path = getCachePath(sessionId);
    if (!existsSync(path)) {
      debugLog("SessionCache", "Cache miss", { session_id: sessionId });
      return null;
    }
    const content = readFileSync(path, "utf-8");
    const context = JSON.parse(content) as SessionContext;
    debugLog("SessionCache", "Cache hit", {
      session_id: sessionId,
      project: context.project,
      mode: context.mode,
    });
    return context;
  } catch (error) {
    debugLog("SessionCache", "Failed to read cache", { error: String(error) });
    return null;
  }
}

/**
 * Delete session cache
 * Called by SessionEnd hook for cleanup
 */
export function deleteSessionCache(sessionId: string): void {
  try {
    const path = getCachePath(sessionId);
    if (existsSync(path)) {
      unlinkSync(path);
      debugLog("SessionCache", "Cache deleted", { session_id: sessionId });
    }
  } catch (error) {
    debugLog("SessionCache", "Failed to delete cache", {
      error: String(error),
    });
  }
}

/**
 * Get current git branch
 * Returns null if not in a git repo or git fails
 */
export async function getGitBranch(cwd: string): Promise<string | null> {
  try {
    const proc = Bun.spawn(["git", "rev-parse", "--abbrev-ref", "HEAD"], {
      cwd,
      stdout: "pipe",
      stderr: "pipe",
    });
    const output = await new Response(proc.stdout).text();
    const exitCode = await proc.exited;
    if (exitCode === 0) {
      return output.trim();
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Parse iteration info from TASKS.md
 * Returns null values if no active iteration
 */
export function parseIterationInfo(tasksPath: string): {
  number: number | null;
  name: string | null;
} {
  try {
    if (!existsSync(tasksPath)) {
      return { number: null, name: null };
    }

    const content = readFileSync(tasksPath, "utf-8");

    // Look for "Iteration: N - Name" pattern in first 50 lines
    const lines = content.split("\n").slice(0, 50);
    for (const line of lines) {
      // Match patterns like "**Iteration:** 2 - Tool Integration"
      const match = line.match(
        /\*?\*?Iteration:?\*?\*?\s*(\d+)\s*[-–—]\s*(.+)/i,
      );
      if (match) {
        return {
          number: parseInt(match[1], 10),
          name: match[2].trim(),
        };
      }
    }

    return { number: null, name: null };
  } catch {
    return { number: null, name: null };
  }
}
