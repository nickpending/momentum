#!/usr/bin/env bun
/**
 * Momentum SessionStart Hook
 * Injects PROJECT.md metadata, writes session cache, logs to observability layers
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { debugLog, debugLogSeparator } from "./shared/debug-log.ts";
import { loadConfig } from "./shared/config-loader.ts";
import {
  loadVoiceStyle,
  loadVerbosityLevel,
  buildVoiceInstructions,
} from "./shared/voice-loader.ts";
import {
  writeSessionCache,
  getGitBranch,
  parseIterationInfo,
  type SessionContext,
} from "./shared/session-cache.ts";
import {
  appendEvent,
  createSessionStartEvent,
  type HookInput,
} from "./shared/jsonl-logger.ts";
import { postToArgus } from "./shared/argus-client.ts";
import { readStdinWithTimeout } from "./shared/stdin-reader.ts";

interface SessionStartInput extends HookInput {
  source?: string; // startup | resume | clear | compact
}

async function main(): Promise<void> {
  try {
    debugLogSeparator();
    debugLog("SessionStart", "Hook triggered");

    const input = await readStdinWithTimeout();
    const data: SessionStartInput = JSON.parse(input);

    debugLog("SessionStart", "Input received", {
      session_id: data.session_id,
      hook_event_name: data.hook_event_name,
      matcher: data.matcher,
      cwd: process.cwd(),
    });

    const config = loadConfig();
    // Local timezone for user-facing context; internal timestamps stay UTC
    const TZ = config.personalization.timezone || "America/Los_Angeles";
    const now = new Date();
    const currentDate = now.toLocaleDateString("en-CA", { timeZone: TZ }); // YYYY-MM-DD
    const currentDateTime = now
      .toLocaleString("sv-SE", { timeZone: TZ })
      .replace(" ", "T"); // YYYY-MM-DDTHH:MM:SS
    const userName = config.personalization.name;
    const cwd = process.cwd();
    const projectName = cwd.split("/").pop() || "unknown";

    // Detect project state
    const projectObsidianDir = join(config.paths.projects, projectName);
    const ideaPath = join(projectObsidianDir, "IDEA.md");
    const iterationPath = join(cwd, ".workflow", "artifacts", "ITERATION.md");
    const tasksPath = join(cwd, ".workflow", "artifacts", "TASKS.md");

    // Check if this is workspace mode (no project)
    const isWorkspace =
      projectName === "workspace" ||
      cwd.includes(join(config.momentum.workspace, "workspace"));

    // Handle workspace tagging for Argus
    // Format: workspace:{tag} or workspace:{session_prefix}
    let workspaceTag = "";
    if (isWorkspace) {
      const envTag = process.env.MOMENTUM_WORKSPACE_TAG;
      if (envTag) {
        workspaceTag = envTag;
      } else {
        // Auto-generate from first 4 chars of session_id
        workspaceTag = data.session_id?.substring(0, 4) || "anon";
      }
    }

    const hasIdea = existsSync(ideaPath);
    const hasIteration = existsSync(iterationPath);
    const hasTasks = existsSync(tasksPath);

    let projectState: "new" | "vision" | "planned" | "active" | "workspace";
    let iterationInfo = "";

    if (isWorkspace) {
      projectState = "workspace";
    } else if (!hasIdea) {
      projectState = "new";
    } else if (!hasIteration) {
      projectState = "vision";
    } else if (!hasTasks) {
      projectState = "planned";
    } else {
      projectState = "active";

      // Parse TASKS.md for active projects
      try {
        const tasksContent = readFileSync(tasksPath, "utf-8");

        // Extract iteration info
        const iterationMatch = tasksContent.match(
          /\*\*Iteration:\*\* (\d+) - (.+)/,
        );
        const iterationNumber = iterationMatch ? iterationMatch[1] : "?";
        const iterationName = iterationMatch ? iterationMatch[2] : "Unknown";

        // Count tasks
        const completedTasks = (tasksContent.match(/- \[x\]/g) || []).length;
        const totalTasks = (tasksContent.match(/- \[[x ]\]/g) || []).length;

        // Find next available task
        const nextTaskMatch = tasksContent.match(/- \[ \] (\d+) -/);
        const nextTask = nextTaskMatch ? nextTaskMatch[1] : null;

        // Build iteration info string
        iterationInfo = `\n<!-- ITERATION_NUMBER: ${iterationNumber} -->
<!-- ITERATION_NAME: ${iterationName} -->
<!-- TASKS_COMPLETE: ${completedTasks} -->
<!-- TASKS_TOTAL: ${totalTasks} -->`;

        if (nextTask) {
          iterationInfo += `\n<!-- NEXT_TASK: ${nextTask} -->`;
        }

        debugLog("SessionStart", "Task info parsed", {
          iterationNumber,
          iterationName,
          completedTasks,
          totalTasks,
          nextTask,
        });
      } catch (error) {
        debugLog("SessionStart", "Failed to parse TASKS.md", {
          error: String(error),
        });
      }
    }

    debugLog("SessionStart", "Project state detected", {
      projectName,
      state: projectState,
      hasIdea,
      hasTasks,
    });

    // Check gitignore compliance for non-workspace projects
    let gitignoreWarning = "";
    if (!isWorkspace) {
      try {
        const complianceCheck = Bun.spawnSync(["gitignore-check", cwd]);

        if (complianceCheck.exitCode === 1) {
          const result = JSON.parse(complianceCheck.stdout.toString());
          if (!result.compliant && result.missing.length > 0) {
            gitignoreWarning = `\n\n⚠️  **Gitignore Compliance Warning**\nProject .gitignore missing ${result.missing.length} base security pattern(s).\nRun: \`gitignore-check . --fix\` to auto-fix.`;
            debugLog("SessionStart", "Gitignore non-compliant", {
              missing: result.missing.length,
            });
          }
        }
      } catch (error) {
        debugLog("SessionStart", "Gitignore compliance check failed", {
          error: String(error),
        });
      }
    }

    // Build metadata for PROJECT.md
    let additionalContext = `<!-- HOOK: Momentum SessionStart -->
<!-- CURRENT_DATE: ${currentDate} -->
<!-- CURRENT_DATETIME: ${currentDateTime} -->
<!-- SESSION_ID: ${data.session_id} -->
<!-- MODE: project -->
<!-- PROJECT: ${projectName} -->
<!-- PROJECT_STATE: ${projectState} -->${iterationInfo}
<!-- NAME: ${userName} -->`;

    // Load and append voice instructions for project mode
    try {
      const momentumHome = config.momentum.install;
      const voiceStyle = loadVoiceStyle(config.voice.style, momentumHome);
      const verbosityLevel = config.voice.verbosity.project || "brief";
      const verbosity = loadVerbosityLevel(verbosityLevel, momentumHome);
      const voiceInstructions = buildVoiceInstructions(voiceStyle, verbosity);

      if (voiceInstructions) {
        additionalContext += `\n\n${voiceInstructions}`;
      }

      debugLog("SessionStart", "Voice instructions loaded", {
        style: config.voice.style,
        verbosity: verbosityLevel,
      });
    } catch (error) {
      debugLog("SessionStart", "Failed to load voice instructions", {
        error: String(error),
      });
    }

    // Append gitignore compliance warning if present
    if (gitignoreWarning) {
      additionalContext += gitignoreWarning;
    }

    const output = {
      hookSpecificOutput: {
        hookEventName: "SessionStart",
        additionalContext: additionalContext,
      },
    };

    // ==========================================
    // OBSERVABILITY LAYER INTEGRATION
    // ==========================================

    // Get git branch for session context
    const gitBranch = await getGitBranch(cwd);

    // Parse iteration info from TASKS.md
    const iterationParsed = parseIterationInfo(tasksPath);

    // Build session context for caching
    // For workspace mode, use workspace:{tag} format
    const effectiveProject = isWorkspace
      ? `workspace:${workspaceTag}`
      : projectName;

    const sessionContext: SessionContext = {
      session_id: data.session_id,
      mode: isWorkspace ? "workspace" : "project",
      project: effectiveProject,
      user: userName,
      git_branch: gitBranch,
      iteration_number: iterationParsed.number,
      iteration_name: iterationParsed.name,
      created_at: currentDateTime,
      source: data.source || "startup",
    };

    // Write session cache for other hooks
    writeSessionCache(sessionContext);
    debugLog("SessionStart", "Session cache written", {
      session_id: data.session_id,
      mode: sessionContext.mode,
      git_branch: gitBranch,
    });

    // Layer 1: JSONL event logging
    const hookInput: HookInput = {
      session_id: data.session_id,
      transcript_path: data.transcript_path || "",
      cwd: cwd,
      hook_event_name: data.hook_event_name || "SessionStart",
    };

    const logEvent = createSessionStartEvent(hookInput, sessionContext, {
      project_state: projectState,
      source: data.source || "startup",
    });
    appendEvent(logEvent);
    debugLog("SessionStart", "JSONL event logged");

    // Layer 3: Argus real-time event (must await before exit)
    await postToArgus({
      source: "momentum",
      event_type: "session",
      hook: "SessionStart",
      session_id: data.session_id,
      message: `Session started: ${effectiveProject} (${projectState})`,
      data: {
        project: effectiveProject,
        mode: sessionContext.mode,
        project_state: projectState,
        git_branch: gitBranch,
        iteration_number: iterationParsed.number,
        iteration_name: iterationParsed.name,
        source: data.source || "startup",
      },
    }).catch(() => {
      // Silent failure - Argus is best-effort
    });
    debugLog("SessionStart", "Argus event posted", {
      project: effectiveProject,
    });

    // ==========================================

    console.log(JSON.stringify(output));
    console.error(
      `🚀 Momentum SessionStart initialized (Project: ${effectiveProject})`,
    );

    debugLog("SessionStart", "Hook completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("💥 Momentum SessionStart error:", error);
    debugLog("SessionStart", "Hook error", { error: String(error) });
    process.exit(0);
  }
}

main();
