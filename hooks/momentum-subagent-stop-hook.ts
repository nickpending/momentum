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

    debugLog("SubagentStop", "Input received", {
      session_id: data.session_id,
      subagent_type: data.subagent_type,
      duration_ms: data.duration_ms,
    });

    const cwd = data.cwd || process.cwd();
    const projectName = cwd.split("/").pop() || "unknown";

    // Detect Claude Code internal agents: no type provided and instant completion
    const isSystemAgent =
      !data.subagent_type &&
      (data.duration_ms === 0 || data.duration_ms === undefined);
    const agentType = isSystemAgent
      ? "system"
      : data.subagent_type || "unknown";

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

    // Layer 3: Argus real-time event (must await before exit)
    await postToArgus({
      source: "momentum",
      event_type: "agent",
      hook: "SubagentStop",
      session_id: data.session_id,
      status: status,
      message: `Agent ${agentType} completed`,
      data: {
        project: projectName,
        agent_type: agentType,
        duration_ms: data.duration_ms || 0,
      },
    }).catch(() => {
      // Silent failure - Argus is best-effort
    });
    debugLog("SubagentStop", "Argus event posted");

    debugLog("SubagentStop", "Hook completed successfully");
    process.exit(0);
  } catch (error) {
    debugLog("SubagentStop", "Hook error", { error: String(error) });
    process.exit(0);
  }
}

main();
