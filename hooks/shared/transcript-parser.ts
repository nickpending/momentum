#!/usr/bin/env bun
/**
 * Transcript Parser
 * Parse Claude Code JSONL transcripts for token stats and tool usage
 */

import { readFileSync, existsSync } from "fs";
import { debugLog } from "./debug-log.ts";

export interface TranscriptStats {
  total_input_tokens: number;
  total_output_tokens: number;
  cache_creation_tokens: number;
  cache_read_tokens: number;
  tools_used: string[];
  files_changed: string[];
  commands_executed: string[];
  message_count: number;
  model: string | null;
}

interface TranscriptEntry {
  type?: string;
  message?: {
    role: string;
    model?: string;
    content?: Array<{
      type: string;
      name?: string;
      text?: string;
      input?: Record<string, unknown>;
    }>;
    usage?: {
      input_tokens?: number;
      output_tokens?: number;
      cache_creation_input_tokens?: number;
      cache_read_input_tokens?: number;
    };
  };
}

/**
 * Parse JSONL transcript file and aggregate statistics
 */
export function parseTranscript(transcriptPath: string): TranscriptStats {
  const stats: TranscriptStats = {
    total_input_tokens: 0,
    total_output_tokens: 0,
    cache_creation_tokens: 0,
    cache_read_tokens: 0,
    tools_used: [],
    files_changed: [],
    commands_executed: [],
    message_count: 0,
    model: null,
  };

  if (!existsSync(transcriptPath)) {
    debugLog("TranscriptParser", "Transcript not found", {
      path: transcriptPath,
    });
    return stats;
  }

  try {
    const content = readFileSync(transcriptPath, "utf-8");
    const lines = content.trim().split("\n");

    debugLog("TranscriptParser", "Parsing transcript", {
      path: transcriptPath,
      lineCount: lines.length,
    });

    const toolsSet = new Set<string>();
    const filesSet = new Set<string>();
    const commandsSet = new Set<string>();

    // Parse JSONL - handle entries that may span multiple lines
    let currentEntry = "";
    for (const line of lines) {
      currentEntry += line;
      try {
        const entry: TranscriptEntry = JSON.parse(currentEntry);
        currentEntry = "";

        // Count messages
        if (entry.message) {
          stats.message_count++;

          // Extract model from first message that has it
          if (entry.message.model && !stats.model) {
            stats.model = entry.message.model;
          }

          // Aggregate token usage
          if (entry.message.usage) {
            const usage = entry.message.usage;
            stats.total_input_tokens += usage.input_tokens || 0;
            stats.total_output_tokens += usage.output_tokens || 0;
            stats.cache_creation_tokens +=
              usage.cache_creation_input_tokens || 0;
            stats.cache_read_tokens += usage.cache_read_input_tokens || 0;
          }

          // Extract tool usage from content
          if (entry.message.content) {
            for (const block of entry.message.content) {
              if (block.type === "tool_use" && block.name) {
                toolsSet.add(block.name);

                // Extract file paths from Edit/Write tools
                if (
                  (block.name === "Edit" || block.name === "Write") &&
                  block.input?.file_path
                ) {
                  filesSet.add(String(block.input.file_path));
                }

                // Extract commands from Bash tool
                if (block.name === "Bash" && block.input?.command) {
                  // Truncate long commands
                  const cmd = String(block.input.command);
                  commandsSet.add(
                    cmd.length > 100 ? cmd.slice(0, 100) + "..." : cmd,
                  );
                }
              }
            }
          }
        }
      } catch {
        // Incomplete JSON, continue accumulating
        currentEntry += "\n";
      }
    }

    stats.tools_used = Array.from(toolsSet);
    stats.files_changed = Array.from(filesSet);
    stats.commands_executed = Array.from(commandsSet);

    debugLog("TranscriptParser", "Parsing complete", {
      messages: stats.message_count,
      input_tokens: stats.total_input_tokens,
      output_tokens: stats.total_output_tokens,
      tools: stats.tools_used.length,
    });

    return stats;
  } catch (error) {
    debugLog("TranscriptParser", "Parse error", { error: String(error) });
    return stats;
  }
}

/**
 * Get last user message text from transcript
 * Used for providing context to summarization
 */
export function getLastUserMessage(transcriptPath: string): string | null {
  if (!existsSync(transcriptPath)) {
    return null;
  }

  try {
    const content = readFileSync(transcriptPath, "utf-8");
    const lines = content.trim().split("\n");

    // Parse entries
    let currentEntry = "";
    const entries: TranscriptEntry[] = [];

    for (const line of lines) {
      currentEntry += line;
      try {
        const entry: TranscriptEntry = JSON.parse(currentEntry);
        entries.push(entry);
        currentEntry = "";
      } catch {
        currentEntry += "\n";
      }
    }

    // Search from end for user message with text
    for (let i = entries.length - 1; i >= 0; i--) {
      const entry = entries[i];
      if (entry.message?.role === "user" && entry.message.content) {
        for (const block of entry.message.content) {
          if (block.type === "text" && block.text) {
            return block.text;
          }
        }
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Get last assistant message text from transcript
 * Used by Stop hook for CAPTURE/VOICE extraction
 */
export function getLastAssistantMessage(transcriptPath: string): string | null {
  if (!existsSync(transcriptPath)) {
    return null;
  }

  try {
    const content = readFileSync(transcriptPath, "utf-8");
    const lines = content.trim().split("\n");

    // Parse from end to find last assistant message
    let currentEntry = "";
    const entries: TranscriptEntry[] = [];

    for (const line of lines) {
      currentEntry += line;
      try {
        const entry: TranscriptEntry = JSON.parse(currentEntry);
        entries.push(entry);
        currentEntry = "";
      } catch {
        currentEntry += "\n";
      }
    }

    // Search from end for assistant message with text
    for (let i = entries.length - 1; i >= 0; i--) {
      const entry = entries[i];
      if (entry.message?.role === "assistant" && entry.message.content) {
        for (const block of entry.message.content) {
          if (block.type === "text" && block.text) {
            debugLog("TranscriptParser", "Found last assistant message", {
              length: block.text.length,
            });
            return block.text;
          }
        }
      }
    }

    debugLog("TranscriptParser", "No assistant message found");
    return null;
  } catch (error) {
    debugLog("TranscriptParser", "Error reading transcript", {
      error: String(error),
    });
    return null;
  }
}
