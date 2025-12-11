#!/usr/bin/env bun
/**
 * Momentum SubagentStop Hook
 * Logs agent completions to Layer 1 JSONL, Layer 2 Lore, and Layer 3 Argus
 */

import { debugLog, debugLogSeparator } from "./shared/debug-log.ts";
import {
  appendEvent,
  createEvent,
  type HookInput,
} from "./shared/jsonl-logger.ts";
import { postToArgus } from "./shared/argus-client.ts";
import { captureKnowledge } from "lore-capture";
import { Glob } from "bun";

interface SubagentStopInput extends HookInput {
  subagent_type?: string;
  subagent_result?: unknown;
  duration_ms?: number;
  agent_id?: string;
  agent_transcript_path?: string;
}

/**
 * Find subagent_type by reading transcript and matching agent_id
 * SubagentStop fires ~50ms before toolUseResult is written, so we wait and retry
 */
async function findSubagentTypeFromTranscript(
  transcriptPath: string,
  agentId: string,
): Promise<string | null> {
  const maxAttempts = 5;
  const delayMs = 150;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (attempt > 0) {
      await Bun.sleep(delayMs);
    }

    try {
      const file = Bun.file(transcriptPath);
      const content = await file.text();
      const lines = content.trim().split("\n");

      // Build map of tool_use_id -> subagent_type from Task calls
      const taskCalls = new Map<string, string>();
      let foundAgentId = false;

      for (const line of lines) {
        try {
          const entry = JSON.parse(line);

          // Collect Task tool_use calls
          if (entry.message?.role === "assistant" && entry.message?.content) {
            for (const block of entry.message.content) {
              if (block.type === "tool_use" && block.name === "Task") {
                const subagentType = block.input?.subagent_type;
                if (subagentType && block.id) {
                  taskCalls.set(block.id, subagentType);
                }
              }
            }
          }

          // Look for toolUseResult with matching agentId
          if (entry.toolUseResult?.agentId === agentId) {
            foundAgentId = true;
            // Found the result - get tool_use_id from the tool_result message
            const toolUseId = entry.message?.content?.[0]?.tool_use_id;
            debugLog("SubagentStop", "Found agentId in transcript", {
              attempt,
              agentId,
              toolUseId,
              taskCallsSize: taskCalls.size,
              hasToolUseId: taskCalls.has(toolUseId || ""),
            });
            if (toolUseId && taskCalls.has(toolUseId)) {
              return taskCalls.get(toolUseId)!;
            }
          }
        } catch {
          continue;
        }
      }

      debugLog("SubagentStop", "Transcript scan complete", {
        attempt,
        agentId,
        foundAgentId,
        taskCallsCount: taskCalls.size,
      });
    } catch (error) {
      debugLog("SubagentStop", "Failed to read transcript", {
        attempt,
        error: String(error),
      });
    }
  }

  return null;
}

async function readStdinWithTimeout(timeout: number = 3000): Promise<string> {
  return new Promise((resolve) => {
    let data = "";
    const timer = setTimeout(() => {
      resolve("{}");
    }, timeout);

    process.stdin.on("data", (chunk) => {
      data += chunk.toString();
    });

    process.stdin.on("end", () => {
      clearTimeout(timer);
      resolve(data);
    });

    process.stdin.on("error", () => {
      clearTimeout(timer);
      resolve("{}");
    });
  });
}

/**
 * Extract ## Summary section from markdown content
 */
function extractSummary(content: string): string | null {
  const match = content.match(/## Summary\n\n(.+?)(?:\n\n#|$)/s);
  return match?.[1]?.trim() || null;
}

/**
 * Find most recent report file for agent type
 */
async function findLatestReport(
  subagentsDir: string,
  agentType: string,
): Promise<string | null> {
  const pattern = `${agentType.toUpperCase()}-*.md`;
  const glob = new Glob(pattern);

  const files: string[] = [];
  for await (const file of glob.scan({ cwd: subagentsDir })) {
    files.push(file);
  }

  if (files.length === 0) {
    return null;
  }

  // Sort by filename (includes timestamp) and get most recent
  files.sort();
  return files[files.length - 1];
}

async function main(): Promise<void> {
  try {
    debugLogSeparator();
    debugLog("SubagentStop", "Hook triggered");

    const input = await readStdinWithTimeout();
    const data: SubagentStopInput = JSON.parse(input);

    // Log ALL raw fields to discover what Claude Code sends
    debugLog("SubagentStop", "RAW INPUT", data);

    debugLog("SubagentStop", "Input received", {
      session_id: data.session_id,
      subagent_type: data.subagent_type,
      duration_ms: data.duration_ms,
      agent_id: data.agent_id,
    });

    const cwd = data.cwd || process.cwd();
    const projectName = cwd.split("/").pop() || "unknown";

    // Try to get subagent_type from transcript since Claude Code doesn't send it directly
    let agentType = data.subagent_type || null;
    if (!agentType && data.transcript_path && data.agent_id) {
      agentType = await findSubagentTypeFromTranscript(
        data.transcript_path,
        data.agent_id,
      );
      debugLog("SubagentStop", "Resolved subagent_type from transcript", {
        agent_id: data.agent_id,
        subagent_type: agentType,
      });
    }

    // Fallback to "unknown" if still not found
    agentType = agentType || "unknown";

    // Determine status from result
    let status: "success" | "error" = "success";
    if (
      typeof data.subagent_result === "object" &&
      data.subagent_result !== null
    ) {
      const result = data.subagent_result as Record<string, unknown>;
      if (result.error || result.is_error) {
        status = "error";
      }
    }

    // Layer 1: JSONL event logging
    const hookInput: HookInput = {
      session_id: data.session_id,
      transcript_path: data.transcript_path || "",
      cwd: cwd,
      hook_event_name: data.hook_event_name || "SubagentStop",
    };

    const logEvent = createEvent(hookInput, {
      agent_type: agentType,
      duration_ms: data.duration_ms || 0,
      status: status,
    });
    appendEvent(logEvent);

    debugLog("SubagentStop", "JSONL event logged", {
      agent_type: agentType,
      duration_ms: data.duration_ms,
      status,
    });

    // Layer 2: Lore knowledge capture (skip system agents)
    if (agentType !== "system" && agentType !== "unknown") {
      const subagentsDir = `${cwd}/.workflow/artifacts/subagents`;

      try {
        const reportFile = await findLatestReport(subagentsDir, agentType);

        if (reportFile) {
          const reportPath = `${subagentsDir}/${reportFile}`;
          const content = await Bun.file(reportPath).text();
          const summary = extractSummary(content);

          if (summary) {
            const result = captureKnowledge({
              context: projectName,
              text: `[${agentType}] ${summary}`,
              type: "learning",
            });

            if (result.success) {
              debugLog("SubagentStop", "Lore capture successful", {
                agent_type: agentType,
                report: reportFile,
              });
            } else {
              debugLog("SubagentStop", "Lore capture failed", {
                error: result.error,
              });
            }
          } else {
            debugLog("SubagentStop", "No Summary section in report", {
              report: reportFile,
            });
          }
        } else {
          debugLog("SubagentStop", "No report file found", {
            agent_type: agentType,
            dir: subagentsDir,
          });
        }
      } catch (error) {
        // Silent failure - Lore is best-effort
        debugLog("SubagentStop", "Lore capture error", {
          error: String(error),
        });
      }
    }

    // Layer 3: Argus - SKIP agent events from SubagentStop
    // Reason: SubagentStop fires BEFORE toolUseResult is written to transcript,
    // blocking us from correlating agent_id with subagent_type.
    // Agent lifecycle events are handled by PreToolUse (pending) and PostToolUse (success).
    debugLog(
      "SubagentStop",
      "Skipping Argus agent event (handled by PostToolUse)",
      {
        agent_id: data.agent_id,
      },
    );

    debugLog("SubagentStop", "Hook completed successfully");
    process.exit(0);
  } catch (error) {
    debugLog("SubagentStop", "Hook error", { error: String(error) });
    process.exit(0);
  }
}

main();
