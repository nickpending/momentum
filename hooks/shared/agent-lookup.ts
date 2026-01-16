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
  pending: PendingAgent[]; // Agents awaiting activation (Task called, first tool not yet seen)
  activated: Record<string, ActivatedAgent>; // agent_id → parent info for correlation
}

interface PendingAgent {
  tool_use_id: string;
  correlation_id: string; // Synthetic ID for exact matching (replaces fragile prompt matching)
  subagent_type: string;
  instance_id?: string; // From [AGENT: code-reviewer-1] if present
  timestamp: number;
}

interface ActivatedAgent {
  parent_tool_use_id: string;
  subagent_type: string;
  instance_id?: string;
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
    pending: [],
    activated: {},
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
 * Add a pending agent (called from PreToolUse when Task tool is invoked)
 * The agent is awaiting activation - we have tool_use_id and correlation_id but no agent_id yet
 */
export function addPendingAgent(
  sessionId: string,
  agent: Omit<PendingAgent, "timestamp">,
): void {
  let cache = readAgentCache(sessionId);
  if (!cache) {
    cache = initCache(sessionId);
  }
  // Ensure pending array exists (for legacy cache files)
  if (!cache.pending) cache.pending = [];

  cache.pending.push({
    ...agent,
    timestamp: Date.now(),
  });
  writeAgentCache(cache);
  debugLog("AgentLookup", "Added pending agent", {
    tool_use_id: agent.tool_use_id,
    correlation_id: agent.correlation_id,
    subagent_type: agent.subagent_type,
    instance_id: agent.instance_id,
    pending_count: cache.pending.length,
  });
}

/**
 * Extract CORRELATION_ID from agent prompt text
 * Looks for pattern: CORRELATION_ID: {id} at start of prompt
 */
export function extractCorrelationId(promptText: string): string | null {
  const match = promptText.match(/^CORRELATION_ID:\s*(\S+)/m);
  return match?.[1] || null;
}

/**
 * Match a pending agent by correlation_id
 * Called when we discover an agent_id and need to correlate with parent Task
 * Returns the match and removes it from pending list
 */
export function matchPendingAgent(
  sessionId: string,
  correlationId: string,
): PendingAgent | null {
  const cache = readAgentCache(sessionId);
  if (!cache?.pending?.length) return null;

  // Find matching agent by correlation_id (exact match)
  const index = cache.pending.findIndex(
    (p) => p.correlation_id === correlationId,
  );
  if (index === -1) {
    debugLog("AgentLookup", "No pending agent matched correlation_id", {
      correlation_id: correlationId,
      pending_count: cache.pending.length,
    });
    return null;
  }

  // Remove from pending and return
  const [matched] = cache.pending.splice(index, 1);
  writeAgentCache(cache);
  debugLog("AgentLookup", "Matched pending agent by correlation_id", {
    correlation_id: correlationId,
    tool_use_id: matched.tool_use_id,
    subagent_type: matched.subagent_type,
    instance_id: matched.instance_id,
  });
  return matched;
}

/**
 * Register an activated agent (agent_id now known, correlated with parent)
 * Called after matchPendingAgent succeeds
 */
export function registerActivatedAgent(
  sessionId: string,
  agentId: string,
  info: ActivatedAgent,
): void {
  let cache = readAgentCache(sessionId);
  if (!cache) {
    cache = initCache(sessionId);
  }
  // Ensure activated map exists
  if (!cache.activated) cache.activated = {};

  cache.activated[agentId] = info;
  writeAgentCache(cache);
  debugLog("AgentLookup", "Registered activated agent", {
    agent_id: agentId,
    parent_tool_use_id: info.parent_tool_use_id,
    subagent_type: info.subagent_type,
    instance_id: info.instance_id,
  });
}

/**
 * Get parent info for an activated agent
 * Called by PreToolUse/PostToolUse to include parent_tool_use_id in events
 */
export function getActivatedAgent(
  sessionId: string,
  agentId: string,
): ActivatedAgent | null {
  const cache = readAgentCache(sessionId);
  return cache?.activated?.[agentId] || null;
}

/**
 * Remove a pending agent by tool_use_id (called on Task PostToolUse)
 * Cleans up in case agent never activated (error, timeout, etc.)
 */
export function removePendingAgent(sessionId: string, toolUseId: string): void {
  const cache = readAgentCache(sessionId);
  if (!cache?.pending?.length) return;

  const index = cache.pending.findIndex((p) => p.tool_use_id === toolUseId);
  if (index !== -1) {
    cache.pending.splice(index, 1);
    writeAgentCache(cache);
    debugLog("AgentLookup", "Removed pending agent", {
      tool_use_id: toolUseId,
    });
  }
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
 * Read agent file first line to extract the prompt (user message content)
 * Used for prompt matching to correlate agent_id with parent Task
 */
export function readAgentPrompt(
  transcriptPath: string,
  agentId: string,
): string | null {
  try {
    const transcriptDir = dirname(transcriptPath);
    const agentFile = join(transcriptDir, `agent-${agentId}.jsonl`);

    if (!existsSync(agentFile)) {
      debugLog("AgentLookup", "Agent file not found", { agentId, agentFile });
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
