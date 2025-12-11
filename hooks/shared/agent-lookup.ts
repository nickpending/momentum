#!/usr/bin/env bun
/**
 * Agent Lookup
 * Scans agent-*.jsonl files to find which agent owns a given tool_use_id
 * Used by PreToolUse/PostToolUse to correlate tool events with subagents
 */

import {
  existsSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  unlinkSync,
} from "fs";
import { join, dirname } from "path";
import { debugLog } from "./debug-log.ts";

// Cache file stores tool_use_id → agent_id (short hash) mappings
const CACHE_DIR = "/tmp";

interface AgentCache {
  session_id: string;
  mappings: Record<string, string>; // tool_use_id → short_hash
}

function getCachePath(sessionId: string): string {
  return join(CACHE_DIR, `momentum-agent-cache-${sessionId}.json`);
}

/**
 * Read agent cache from disk
 */
function readAgentCache(sessionId: string): AgentCache | null {
  try {
    const path = getCachePath(sessionId);
    if (!existsSync(path)) {
      return null;
    }
    const content = readFileSync(path, "utf-8");
    return JSON.parse(content) as AgentCache;
  } catch {
    return null;
  }
}

/**
 * Write agent cache to disk
 */
function writeAgentCache(cache: AgentCache): void {
  try {
    const path = getCachePath(cache.session_id);
    writeFileSync(path, JSON.stringify(cache, null, 2));
  } catch (error) {
    debugLog("AgentLookup", "Failed to write cache", { error: String(error) });
  }
}

/**
 * Add mapping to cache
 */
function cacheMapping(
  sessionId: string,
  toolUseId: string,
  agentId: string,
): void {
  let cache = readAgentCache(sessionId);
  if (!cache) {
    cache = { session_id: sessionId, mappings: {} };
  }
  cache.mappings[toolUseId] = agentId;
  writeAgentCache(cache);
}

/**
 * Remove mapping from cache (called by PostToolUse)
 */
export function removeCachedMapping(
  sessionId: string,
  toolUseId: string,
): void {
  const cache = readAgentCache(sessionId);
  if (cache && cache.mappings[toolUseId]) {
    delete cache.mappings[toolUseId];
    writeAgentCache(cache);
    debugLog("AgentLookup", "Removed cached mapping", { toolUseId });
  }
}

/**
 * Get cached mapping
 */
function getCachedMapping(sessionId: string, toolUseId: string): string | null {
  const cache = readAgentCache(sessionId);
  return cache?.mappings[toolUseId] || null;
}

/**
 * Scan agent-*.jsonl files to find which agent owns a tool_use_id
 * Returns agent_id (short hash) if found in an agent file, null if main thread
 */
export function findAgentForToolUse(
  transcriptPath: string,
  sessionId: string,
  toolUseId: string,
): string | null {
  // Check cache first
  const cached = getCachedMapping(sessionId, toolUseId);
  if (cached) {
    debugLog("AgentLookup", "Cache hit", { toolUseId, agentId: cached });
    return cached;
  }

  try {
    // Agent files are in same directory as main transcript
    const transcriptDir = dirname(transcriptPath);

    if (!existsSync(transcriptDir)) {
      debugLog("AgentLookup", "Transcript directory not found", {
        transcriptDir,
      });
      return null;
    }

    // Find all agent-*.jsonl files
    const files = readdirSync(transcriptDir).filter(
      (f) => f.startsWith("agent-") && f.endsWith(".jsonl"),
    );

    debugLog("AgentLookup", "Scanning agent files", {
      count: files.length,
      toolUseId,
    });

    for (const file of files) {
      const filePath = join(transcriptDir, file);
      const content = readFileSync(filePath, "utf-8");

      // Check if this file contains the tool_use_id
      if (content.includes(toolUseId)) {
        // Extract agent_id from filename (agent-{id}.jsonl)
        const agentIdMatch = file.match(/^agent-([a-f0-9]+)\.jsonl$/);
        if (agentIdMatch) {
          const agentId = agentIdMatch[1];
          debugLog("AgentLookup", "Found agent for tool", {
            toolUseId,
            agentId,
            file,
          });

          // Cache for subsequent lookups
          cacheMapping(sessionId, toolUseId, agentId);

          return agentId;
        }
      }
    }

    debugLog("AgentLookup", "Tool not found in any agent file", { toolUseId });
    return null;
  } catch (error) {
    debugLog("AgentLookup", "Error scanning agent files", {
      error: String(error),
    });
    return null;
  }
}

/**
 * Delete agent cache file (called by SessionEnd)
 */
export function deleteAgentCache(sessionId: string): void {
  try {
    const path = getCachePath(sessionId);
    if (existsSync(path)) {
      unlinkSync(path);
      debugLog("AgentLookup", "Cache deleted", { session_id: sessionId });
    }
  } catch (error) {
    debugLog("AgentLookup", "Failed to delete cache", {
      error: String(error),
    });
  }
}
