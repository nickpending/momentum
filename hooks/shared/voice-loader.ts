/**
 * Voice Loader
 * Loads voice styles and verbosity levels from TOML configuration
 * Also provides direct TTS for hook notifications
 */

import { existsSync } from "fs";
import { join } from "path";
import { $ } from "bun";
import { debugLog } from "./debug-log.ts";
import { loadConfig } from "./config-loader.ts";

export interface VoiceStyle {
  name: string;
  description: string;
  personality: {
    prompt: string;
  };
}

export interface VerbosityLevel {
  name: string;
  description: string;
  instructions: {
    prompt: string;
  };
}

/**
 * Load a personality style from TOML file
 * @param styleName - Name of the style (e.g., "jarvis", "sable")
 * @param momentumHome - Path to momentum config directory
 * @returns Parsed voice style
 * @throws Error if style file not found or invalid
 */
export function loadVoiceStyle(
  styleName: string,
  momentumHome: string,
): VoiceStyle {
  const stylePath = join(momentumHome, "personalities", `${styleName}.toml`);

  if (!existsSync(stylePath)) {
    throw new Error(`Voice style '${styleName}' not found at ${stylePath}`);
  }

  try {
    // Bun has native TOML support - just require it
    const parsed = require(stylePath) as VoiceStyle;

    // Validate structure
    if (!parsed.personality?.prompt) {
      throw new Error(
        `Invalid voice style structure in ${stylePath}: missing personality.prompt`,
      );
    }

    debugLog("VoiceLoader", "Voice style loaded", { styleName, stylePath });
    return parsed;
  } catch (error) {
    debugLog("VoiceLoader", "Failed to load voice style", {
      styleName,
      error: String(error),
    });
    throw error;
  }
}

/**
 * Load a speech summary verbosity level from TOML file
 * @param level - Verbosity level (e.g., "terse", "normal", "brief")
 * @param momentumHome - Path to momentum config directory
 * @returns Parsed verbosity level
 * @throws Error if verbosity file not found or invalid
 */
export function loadVerbosityLevel(
  level: string,
  momentumHome: string,
): VerbosityLevel {
  const verbosityPath = join(
    momentumHome,
    "speech",
    "summaries",
    `${level}.toml`,
  );

  if (!existsSync(verbosityPath)) {
    throw new Error(`Verbosity level '${level}' not found at ${verbosityPath}`);
  }

  try {
    // Bun has native TOML support - just require it
    const parsed = require(verbosityPath) as VerbosityLevel;

    // Validate structure
    if (!parsed.instructions?.prompt) {
      throw new Error(
        `Invalid verbosity structure in ${verbosityPath}: missing instructions.prompt`,
      );
    }

    debugLog("VoiceLoader", "Verbosity level loaded", { level, verbosityPath });
    return parsed;
  } catch (error) {
    debugLog("VoiceLoader", "Failed to load verbosity level", {
      level,
      error: String(error),
    });
    throw error;
  }
}

/**
 * Build combined voice instructions from style and verbosity
 * @param voiceStyle - Voice personality style
 * @param verbosityLevel - Verbosity/detail level
 * @returns Combined instruction prompt
 */
export function buildVoiceInstructions(
  voiceStyle: VoiceStyle,
  verbosityLevel: VerbosityLevel,
): string {
  return `${voiceStyle.personality.prompt}\n\n${verbosityLevel.instructions.prompt}`;
}

/**
 * Speak text directly via lspeak (for hook notifications)
 * Uses momentum config.toml for TTS settings
 * @param message - Text to speak
 */
export async function speakDirect(message: string): Promise<void> {
  try {
    // Load config
    const config = loadConfig();
    const ttsConfig = config.voice.tts;

    if (!ttsConfig?.enabled) {
      debugLog("VoiceLoader", "TTS disabled in config", {});
      return;
    }

    // Build lspeak command
    const args: string[] = ["lspeak"];

    // Add provider if specified
    if (ttsConfig.provider) {
      args.push("--provider", ttsConfig.provider);
    }

    // Add voice ID if specified (except for system provider)
    if (ttsConfig.voice_id && ttsConfig.provider !== "system") {
      args.push("--voice", ttsConfig.voice_id);
    }

    // Add cache threshold if specified
    if (ttsConfig.cache_threshold !== undefined) {
      args.push("--cache-threshold", ttsConfig.cache_threshold.toString());
    }

    // Add message as argument
    args.push(message);

    // Set environment variables if needed
    const env: Record<string, string> = {};
    if (ttsConfig.provider === "elevenlabs" && ttsConfig.api_key) {
      env.ELEVENLABS_API_KEY = ttsConfig.api_key;
    }

    debugLog("VoiceLoader", "Speaking direct", { message, args });

    // Execute lspeak
    await $`${args}`.env(env);

    debugLog("VoiceLoader", "Direct speech complete", {});
  } catch (error) {
    // Log error but don't throw - TTS is optional
    debugLog("VoiceLoader", "Direct speech failed", {
      error: String(error),
      message,
    });
  }
}
