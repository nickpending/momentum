#!/usr/bin/env bun
/**
 * Momentum SessionStart Hook
 * Simplified - just inject PROJECT.md metadata for project mode
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

interface SessionStartInput {
  session_id: string;
  hook_event_name: string;
  matcher?: string;
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
    const currentDate = new Date().toISOString().split("T")[0];
    const currentDateTime = new Date().toISOString();
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
        // Call gitignore-check from llmcli-tools
        const llmcliTools = join(
          process.env.HOME!,
          "development",
          "projects",
          "llmcli-tools",
        );
        const gitignoreCheck = join(
          llmcliTools,
          "packages",
          "gitignore-check",
          "gitignore-check.ts",
        );

        const complianceCheck = Bun.spawnSync(["bun", gitignoreCheck, cwd]);

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

    console.log(JSON.stringify(output));
    console.error(
      `🚀 Momentum SessionStart initialized (Project: ${projectName})`,
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
