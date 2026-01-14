/**
 * Momentum Config Loader
 * Loads configuration from TOML file with profile overlay support
 */

import { existsSync } from "fs";
import { join } from "path";
import { debugLog } from "./debug-log.ts";

/**
 * Deep merge two objects, with source overriding target
 */
function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const result = { ...target };

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceVal = source[key];
      const targetVal = (target as Record<string, unknown>)[key];

      if (
        sourceVal &&
        typeof sourceVal === "object" &&
        !Array.isArray(sourceVal) &&
        targetVal &&
        typeof targetVal === "object" &&
        !Array.isArray(targetVal)
      ) {
        (result as Record<string, unknown>)[key] = deepMerge(
          targetVal as object,
          sourceVal as object,
        );
      } else if (sourceVal !== undefined) {
        (result as Record<string, unknown>)[key] = sourceVal;
      }
    }
  }

  return result;
}

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
  personality?: {
    style: string; // loads personalities/{style}.toml
  };
  voice: {
    style: string; // fallback if personality.style not set
    output_enabled?: boolean; // fallback if speech.enabled not set
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
  speech?: {
    enabled?: boolean; // Whether to include VOICE marker (default: true)
    marker_format?: string; // "basic" or "v3" - loads contexts/speech/marker-{format}.md
    summary_verbosity?: string; // loads speech/summaries/{level}.toml
  };
  output?: {
    verbosity?: string; // text verbosity ceiling - loads contexts/output/verbosity/{level}.md
    format?: string; // response structure - loads contexts/output/format/{format}.md
    capture_enabled?: boolean; // Whether to include CAPTURE section (default: true)
    teach_enabled?: boolean; // Whether to include TEACH section (default: true)
    max_length?: number; // Max response length hint
  };
  behavior?: {
    communication?: {
      formality?: { value: number; scale: string };
      directness?: { value: number; scale: string };
      warmth?: { value: number; scale: string };
      confidence?: { value: number; scale: string };
    };
    thinking?: {
      skepticism?: { value: number; scale: string };
      curiosity?: { value: number; scale: string };
      caution?: { value: number; scale: string };
      precision?: { value: number; scale: string };
    };
    interaction?: {
      teaching?: { value: number; scale: string };
      pushback?: { value: number; scale: string };
      wit?: { value: number; scale: string };
      initiative?: { value: number; scale: string };
    };
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
 * Load Momentum configuration from TOML file with optional profile overlay
 * Profile overlays allow per-interface configuration (e.g., discord, api)
 *
 * @param profileName - Optional profile name to load from ~/.config/momentum/profiles/{name}.toml
 * @returns Merged configuration (base config + profile overlay)
 */
export function loadConfig(profileName?: string): MomentumConfig {
  const homeDir = process.env.HOME!;
  const configDir = join(homeDir, ".config", "momentum");
  const configPath = join(configDir, "config.toml");

  if (!existsSync(configPath)) {
    throw new Error(
      `Momentum config.toml not found at ${configPath}. Run install.sh to create it.`,
    );
  }

  // Bun has native TOML support - just require/import it
  let config = require(configPath) as MomentumConfig;

  // Validate required fields exist
  if (
    !config.personalization?.name ||
    !config.paths?.dev ||
    !config.paths?.projects
  ) {
    throw new Error(`Invalid config.toml structure - missing required fields`);
  }

  // Load and merge profile overlay if specified
  const effectiveProfile = profileName || process.env.MOMENTUM_PROFILE;
  if (effectiveProfile) {
    const profilePath = join(configDir, "profiles", `${effectiveProfile}.toml`);

    if (existsSync(profilePath)) {
      const profileConfig = require(profilePath) as Partial<MomentumConfig>;
      config = deepMerge(config, profileConfig);
      debugLog("ConfigLoader", "Profile overlay applied", {
        profile: effectiveProfile,
        profilePath,
      });
    } else {
      debugLog("ConfigLoader", "Profile not found, using base config", {
        profile: effectiveProfile,
        profilePath,
      });
    }
  }

  debugLog("ConfigLoader", "Config loaded successfully", {
    configPath,
    profile: effectiveProfile || "none",
  });
  return config;
}
