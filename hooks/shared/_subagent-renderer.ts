/**
 * JIT Subagent Renderer
 * Renders subagent templates with resource substitution at session start.
 * Writes rendered files to .claude/agents/ for main agent to use.
 */

import {
  readFileSync,
  existsSync,
  readdirSync,
  writeFileSync,
  mkdirSync,
} from "fs";
import { join } from "path";
import Mustache from "mustache";
import { PROJECT_ROOT } from "./momentum-paths.ts";
import { debugLog } from "./debug-log.ts";

// Disable HTML escaping - we want raw content
Mustache.escape = (text: string) => text;

interface RenderResult {
  rendered: number;
  errors: string[];
}

/**
 * Load all resources from resources/ directory into a nested view object.
 * Mustache interprets dots as path separators, so "agent-rules.md" becomes:
 * { "agent-rules": { "md": content } }
 * Template uses {{{agent-rules.md}}} naturally.
 */
function loadResources(resourcesDir: string): Record<string, unknown> {
  const resources: Record<string, unknown> = {};

  if (!existsSync(resourcesDir)) {
    debugLog("SubagentRenderer", "Resources directory not found", {
      resourcesDir,
    });
    return resources;
  }

  for (const file of readdirSync(resourcesDir)) {
    if (!file.endsWith(".md")) continue;

    try {
      const content = readFileSync(join(resourcesDir, file), "utf-8");
      // Split filename into nested path for Mustache
      // agent-rules.md -> { "agent-rules": { "md": content } }
      const basename = file.replace(/\.md$/, "");
      resources[basename] = { md: content };
      debugLog("SubagentRenderer", "Resource loaded", {
        file,
        path: `${basename}.md`,
        size: content.length,
      });
    } catch (error) {
      debugLog("SubagentRenderer", "Failed to load resource", {
        file,
        error: String(error),
      });
    }
  }

  return resources;
}

/**
 * Render all subagents with resource substitution.
 * Writes to PROJECT_ROOT/.claude/agents/
 */
export function renderSubagents(momentumInstall: string): RenderResult {
  const result: RenderResult = { rendered: 0, errors: [] };

  const subagentsDir = join(momentumInstall, "subagents");
  const resourcesDir = join(momentumInstall, "resources");
  const targetDir = join(PROJECT_ROOT, ".claude/agents");

  // Ensure target directory exists
  mkdirSync(targetDir, { recursive: true });

  // Load resources
  const resources = loadResources(resourcesDir);
  debugLog("SubagentRenderer", "Resources loaded", {
    count: Object.keys(resources).length,
  });

  if (!existsSync(subagentsDir)) {
    debugLog("SubagentRenderer", "Subagents directory not found", {
      subagentsDir,
    });
    return result;
  }

  // Process each subagent
  for (const file of readdirSync(subagentsDir)) {
    if (!file.endsWith(".md")) continue;

    try {
      const templatePath = join(subagentsDir, file);
      const template = readFileSync(templatePath, "utf-8");

      // Render with Mustache (handles files with or without patterns)
      const rendered = Mustache.render(template, resources);

      // Write to target
      const targetPath = join(targetDir, file);
      writeFileSync(targetPath, rendered);

      result.rendered++;
      debugLog("SubagentRenderer", "Rendered", { file, size: rendered.length });
    } catch (error) {
      result.errors.push(`${file}: ${String(error)}`);
      debugLog("SubagentRenderer", "Render failed", {
        file,
        error: String(error),
      });
    }
  }

  return result;
}
