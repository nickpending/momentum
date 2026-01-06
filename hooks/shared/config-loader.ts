/**
 * Momentum Config Loader
 * Loads configuration from TOML file with fallback to environment variables
 */

import { existsSync } from "fs";
import { join } from "path";
import { debugLog } from "./debug-log.ts";

export interface MomentumConfig {
  personalization: {
    name: string;
    assistant_name?: string; // Assistant's name (e.g., "Sable", "Jarvis")
    timezone?: string; // IANA timezone, defaults to America/Los_Angeles
  };
  paths: {
    dev: string;
    projects: string;
  };
  momentum: {
    install: string;
    workspace: string;
  };
  lore: {
    config: string;
    data: string;
    cache: string;
  };
  voice: {
    style: string;
    verbosity: {
      assistant: string;
      project: string;
    };
    tts?: {
      enabled?: boolean;
      provider?: string;
      model?: string;
      api_key?: string;
      voice_id?: string;
      cache_threshold?: number;
      cache?: {
        terse?: boolean;
        brief?: boolean;
        normal?: boolean;
      };
    };
  };
  behavior?: {
    teaching?: number;
    wit?: number;
    pushback?: number;
    depth?: number;
    teaching_config?: {
      enabled?: boolean;
      domains?: string[];
      min_confidence?: string;
      max_length?: string;
    };
    triggers?: {
      on_confusion?: boolean;
      on_agreement?: boolean;
      on_architecture?: boolean;
      on_completion?: boolean;
    };
  };
}

/**
 * Load Momentum configuration from TOML file
 * Throws error if config.toml is missing - this indicates broken installation
 */
export function loadConfig(): MomentumConfig {
  const homeDir = process.env.HOME!;
  const configPath = join(homeDir, ".config", "momentum", "config.toml");

  if (!existsSync(configPath)) {
    throw new Error(
      `Momentum config.toml not found at ${configPath}. Run install.sh to create it.`,
    );
  }

  // Bun has native TOML support - just require/import it
  const config = require(configPath) as MomentumConfig;

  // Validate required fields exist
  if (
    !config.personalization?.name ||
    !config.paths?.dev ||
    !config.paths?.projects
  ) {
    throw new Error(`Invalid config.toml structure - missing required fields`);
  }

  debugLog("ConfigLoader", "Config loaded successfully", { configPath });
  return config;
}
