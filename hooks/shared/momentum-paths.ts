/**
 * Momentum Path Resolution
 * Single source of truth for all path constants used across hooks.
 *
 * REQUIRES: Launch via 'momentum' command which exports base env vars.
 * Direct 'claude' launch will fail with clear error.
 */

import { join } from "path";

/**
 * Require an environment variable - throws if missing.
 * No fallbacks, no silent defaults. Explicit errors catch misconfiguration.
 */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Required environment variable ${name} is not set. Launch via 'momentum' command.`,
    );
  }
  return value;
}

// =============================================================================
// BASE VARIABLES (from momentum script - required)
// =============================================================================

/** Absolute path to current project (dev directory) */
export const PROJECT_ROOT = requireEnv("PROJECT_ROOT");

/** Project name (directory name, used for obsidian paths) */
export const PROJECT_NAME = requireEnv("PROJECT_NAME");

/** Root of obsidian/planning projects */
export const WORKFLOW_PROJECTS = requireEnv("WORKFLOW_PROJECTS");

/** Obsidian vault root */
export const OBSIDIAN_DIR = requireEnv("OBSIDIAN_DIR");

// =============================================================================
// DERIVED PATHS (calculated from base variables)
// =============================================================================

/** Project workflow directory: ${PROJECT_ROOT}/.workflow */
export const WORKFLOW_DIR = join(PROJECT_ROOT, ".workflow");

/** Artifacts directory: ${WORKFLOW_DIR}/artifacts */
export const ARTIFACTS_DIR = join(WORKFLOW_DIR, "artifacts");

/** State directory: ${WORKFLOW_DIR}/state */
export const STATE_DIR = join(WORKFLOW_DIR, "state");

/** Contexts directory: ${WORKFLOW_DIR}/contexts */
export const CONTEXTS_DIR = join(WORKFLOW_DIR, "contexts");

/** Project obsidian directory: ${WORKFLOW_PROJECTS}/${PROJECT_NAME} */
export const PROJECT_OBSIDIAN_DIR = join(WORKFLOW_PROJECTS, PROJECT_NAME);

/** Explorations directory: ${OBSIDIAN_DIR}/reference/technical/explorations */
export const EXPLORATIONS_DIR = join(
  OBSIDIAN_DIR,
  "reference",
  "technical",
  "explorations",
);

// =============================================================================
// OPTIONAL VARIABLES (from momentum script - may not be set)
// =============================================================================

/** Workspace tag (only in workspace mode, optional) */
export const WORKSPACE_TAG = process.env.MOMENTUM_WORKSPACE_TAG || "";

/** Mode override (optional, hooks determine from context if not set) */
export const MODE_OVERRIDE = process.env.MOMENTUM_MODE || "";
