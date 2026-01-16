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
  mkdirSync,
  renameSync,
} from "fs";
import { join, dirname } from "path";
import { debugLog } from "./debug-log.ts";

// Cache stored in XDG state directory (runtime state, not config or data)
// Falls back to /tmp if HOME not available
const STATE_DIR = process.env.HOME
  ? join(process.env.HOME, ".local", "state", "momentum")
  : "/tmp";

// Ensure state directory exists
try {
  if (!existsSync(STATE_DIR)) {
    mkdirSync(STATE_DIR, { recursive: true });
  }
} catch {
  // Silent fail - will use /tmp fallback
}

interface AgentCache {
  session_id: string;
  mappings: Record<string, string>; // tool_use_id → short_hash
}

// Agent types cache (SubagentStart → SubagentStop handoff)
interface AgentTypesCache {
  session_id: string;
  types: Record<string, string>; // agent_id → agent_type
}

function getAgentTypesCachePath(sessionId: string): string {
  return join(STATE_DIR, `agent-types-${sessionId}.json`);
}

/**
 * Read agent types cache from disk
 */
function readAgentTypesCache(sessionId: string): AgentTypesCache | null {
  try {
    const path = getAgentTypesCachePath(sessionId);
    if (!existsSync(path)) return null;
    const content = readFileSync(path, "utf-8");
    return JSON.parse(content) as AgentTypesCache;
  } catch {
    return null;
  }
}

/**
 * Write agent types cache atomically
 */
function writeAgentTypesCache(cache: AgentTypesCache): void {
  try {
    const path = getAgentTypesCachePath(cache.session_id);
    const tempPath = `${path}.tmp.${process.pid}`;
    writeFileSync(tempPath, JSON.stringify(cache, null, 2));
    renameSync(tempPath, path);
  } catch (error) {
    debugLog("AgentLookup", "Failed to write agent types cache", {
      error: String(error),
    });
  }
}

/**
 * Cache agent_id → agent_type mapping
 * Called by SubagentStart hook
 */
export function cacheAgentType(
  sessionId: string,
  agentId: string,
  agentType: string,
): void {
  let cache = readAgentTypesCache(sessionId);
  if (!cache) {
    cache = { session_id: sessionId, types: {} };
  }
  cache.types[agentId] = agentType;
  writeAgentTypesCache(cache);
  debugLog("AgentLookup", "Cached agent type", {
    agent_id: agentId,
    agent_type: agentType,
  });
}

/**
 * Lookup agent_type by agent_id
 * Called by SubagentStop hook
 */
export function lookupAgentType(
  sessionId: string,
  agentId: string,
): string | null {
  const cache = readAgentTypesCache(sessionId);
  return cache?.types[agentId] || null;
}

/**
 * Delete agent types cache
 * Called by SessionEnd hook
 */
export function deleteAgentTypesCache(sessionId: string): void {
  try {
    const path = getAgentTypesCachePath(sessionId);
    if (existsSync(path)) {
      unlinkSync(path);
      debugLog("AgentLookup", "Agent types cache deleted", {
        session_id: sessionId,
      });
    }
  } catch (error) {
    debugLog("AgentLookup", "Failed to delete agent types cache", {
      error: String(error),
    });
  }
}

function getCachePath(sessionId: string): string {
  return join(STATE_DIR, `agent-cache-${sessionId}.json`);
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
 * Write agent cache to disk atomically (temp file + rename)
 * Prevents corruption if hook exits mid-write
 */
function writeAgentCache(cache: AgentCache): void {
  try {
    const path = getCachePath(cache.session_id);
    const tempPath = `${path}.tmp.${process.pid}`;

    // Write to temp file first
    writeFileSync(tempPath, JSON.stringify(cache, null, 2));

    // Atomic rename (POSIX guarantees atomicity for same-filesystem rename)
    renameSync(tempPath, path);
  } catch (error) {
    debugLog("AgentLookup", "Failed to write cache", { error: String(error) });
  }
}

/**
 * Initialize empty cache with all required fields
 */
function initCache(sessionId: string): AgentCache {
  return {
    session_id: sessionId,
    mappings: {},
  };
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
    cache = initCache(sessionId);
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
    const transcriptDir = dirname(transcriptPath);

    if (!existsSync(transcriptDir)) {
      debugLog("AgentLookup", "Transcript directory not found", {
        transcriptDir,
      });
      return null;
    }

    // Build list of directories to scan for agent files
    // New structure: {transcript_dir}/{session_id}/subagents/agent-*.jsonl
    // Old structure: {transcript_dir}/agent-*.jsonl (for backwards compat)
    const subagentsDir = join(transcriptDir, sessionId, "subagents");
    const searchDirs: string[] = [];

    if (existsSync(subagentsDir)) {
      searchDirs.push(subagentsDir);
    }
    // Also check old location for backwards compatibility
    searchDirs.push(transcriptDir);

    let allFiles: { dir: string; file: string }[] = [];
    for (const dir of searchDirs) {
      try {
        const files = readdirSync(dir).filter(
          (f) => f.startsWith("agent-") && f.endsWith(".jsonl"),
        );
        allFiles = allFiles.concat(files.map((f) => ({ dir, file: f })));
      } catch {
        // Directory might not exist or be readable
      }
    }

    debugLog("AgentLookup", "Scanning agent files", {
      count: allFiles.length,
      toolUseId,
      searchDirs,
    });

    for (const { dir, file } of allFiles) {
      const filePath = join(dir, file);
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
            dir,
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
 * Read agent file first line to extract the prompt (user message content)
 * Used for prompt matching to correlate agent_id with parent Task
 */
export function readAgentPrompt(
  transcriptPath: string,
  agentId: string,
  sessionId?: string,
): string | null {
  try {
    const transcriptDir = dirname(transcriptPath);

    // Try new location first: {transcript_dir}/{session_id}/subagents/agent-{id}.jsonl
    // Fall back to old location: {transcript_dir}/agent-{id}.jsonl
    const agentFilename = `agent-${agentId}.jsonl`;
    let agentFile: string | null = null;

    if (sessionId) {
      const newPath = join(
        transcriptDir,
        sessionId,
        "subagents",
        agentFilename,
      );
      if (existsSync(newPath)) {
        agentFile = newPath;
      }
    }

    if (!agentFile) {
      const oldPath = join(transcriptDir, agentFilename);
      if (existsSync(oldPath)) {
        agentFile = oldPath;
      }
    }

    if (!agentFile) {
      debugLog("AgentLookup", "Agent file not found", {
        agentId,
        transcriptDir,
      });
      return null;
    }

    // Read first line only - contains user message with prompt
    const content = readFileSync(agentFile, "utf-8");
    const firstLine = content.split("\n")[0];
    if (!firstLine) return null;

    const entry = JSON.parse(firstLine);
    // The first entry is a user message, content field matches Task input prompt
    const prompt = entry.message?.content;

    if (prompt) {
      debugLog("AgentLookup", "Extracted agent prompt", {
        agentId,
        prompt_preview: prompt.substring(0, 100),
      });
    }
    return prompt || null;
  } catch (error) {
    debugLog("AgentLookup", "Error reading agent prompt", {
      agentId,
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
