/**
 * Shared Voice Infrastructure for Momentum Hooks
 * Provides ambient feedback infrastructure through direct lspeak calls
 *
 * ARCHITECTURE: This module provides ONLY the infrastructure for voice notifications.
 * Hook-specific personalities, time-based greetings, and contextual messages
 * remain in their respective hooks to preserve sophisticated behavior.
 *
 * VOICE CONFIGURATION: Reads from ~/.config/clarvis/config.toml to respect
 * user's existing voice provider settings (elevenlabs vs system)
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface VoiceConfig {
  provider: 'elevenlabs' | 'system';
  voice_id?: string;
}

/**
 * Parse TOML-like config to extract voice configuration
 * Simple parser for the specific clarvis config structure we need
 */
function parseVoiceConfig(configContent: string): VoiceConfig | null {
  try {
    const lines = configContent.split('\n');
    let inVoiceSection = false;
    const config: Partial<VoiceConfig> = {};

    for (const line of lines) {
      const trimmed = line.trim();

      // Track if we're in [voice] section
      if (trimmed === '[voice]') {
        inVoiceSection = true;
        continue;
      }

      // Exit voice section when we hit another section
      if (trimmed.startsWith('[') && trimmed !== '[voice]') {
        inVoiceSection = false;
        continue;
      }

      // Parse voice section lines
      if (inVoiceSection && trimmed && !trimmed.startsWith('#')) {
        if (trimmed.startsWith('provider = ')) {
          const value = trimmed.split('=')[1].trim().replace(/"/g, '');
          if (value === 'elevenlabs' || value === 'system') {
            config.provider = value;
          }
        } else if (trimmed.startsWith('voice_id = ')) {
          const value = trimmed.split('=')[1].trim().replace(/"/g, '');
          // Remove inline comments (everything after #)
          config.voice_id = value.split('#')[0].trim();
        } else if (trimmed.startsWith('api_key = ')) {
          const value = trimmed.split('=')[1].trim().replace(/"/g, '');
          // Remove inline comments (everything after #)
          config.api_key = value.split('#')[0].trim();
        }
      }
    }

    return config.provider ? config as VoiceConfig : null;
  } catch (error) {
    return null;
  }
}

/**
 * Load voice configuration from clarvis config
 * Falls back to system voice if config unavailable
 */
function loadVoiceConfig(): VoiceConfig {
  const homeDir = process.env.HOME;
  if (!homeDir) {
    return { provider: 'system' };
  }

  const configPath = join(homeDir, '.config', 'clarvis', 'config.toml');

  if (!existsSync(configPath)) {
    return { provider: 'system' };
  }

  try {
    const configContent = readFileSync(configPath, 'utf-8');
    const voiceConfig = parseVoiceConfig(configContent);

    return voiceConfig || { provider: 'system' };
  } catch (error) {
    return { provider: 'system' };
  }
}

/**
 * Send direct voice notification using lspeak
 * Fails silently on errors to avoid blocking hook execution
 *
 * @param message - The message to speak via lspeak
 * @returns Promise that resolves when voice command completes or fails
 */
export async function sendDirectVoiceNotification(message: string): Promise<void> {
  try {
    const voiceConfig = loadVoiceConfig();
    const lspeakArgs = ['lspeak'];

    // Build command based on voice provider configuration
    if (voiceConfig.provider === 'elevenlabs' && voiceConfig.voice_id) {
      lspeakArgs.push('--provider', 'elevenlabs');
      lspeakArgs.push('--voice', voiceConfig.voice_id);
    } else if (voiceConfig.provider === 'system') {
      // System voice doesn't need additional args
    }

    lspeakArgs.push(message);

    // Execute lspeak with appropriate configuration
    // Uses ignore flags to prevent output interference with hook communication
    await Bun.spawn(lspeakArgs, {
      stdout: 'ignore',
      stderr: 'ignore'
    });
  } catch (error) {
    // Voice failures are non-critical for hook functionality
    // Fail silently to avoid breaking hook execution flow
    // Don't log errors to avoid cluttering hook output streams
  }
}

/**
 * Select random message from array of options
 * Provides variation in ambient feedback without predictable patterns
 *
 * @param messages - Array of message options to choose from
 * @returns Random message from the array, or empty string if array is empty
 */
export function getRandomMessage(messages: string[]): string {
  if (messages.length === 0) {
    return '';
  }
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Send random voice message from array of options
 * Combines getRandomMessage and sendDirectVoiceNotification for convenience
 *
 * @param messages - Array of message options to choose from and speak
 * @returns Promise that resolves when voice command completes or fails
 */
export async function sendRandomVoiceMessage(messages: string[]): Promise<void> {
  if (messages.length === 0) {
    return;
  }
  const message = getRandomMessage(messages);
  await sendDirectVoiceNotification(message);
}

/**
 * Validate that lspeak is available and functional
 * Useful for hooks that want to check voice capability before attempting notifications
 *
 * @returns Promise<boolean> - true if lspeak is available and working
 */
export async function isVoiceAvailable(): Promise<boolean> {
  try {
    const voiceConfig = loadVoiceConfig();
    const testArgs = ['lspeak'];

    // Build test command based on voice provider configuration
    if (voiceConfig.provider === 'elevenlabs' && voiceConfig.voice_id) {
      testArgs.push('--provider', 'elevenlabs');
      testArgs.push('--voice', voiceConfig.voice_id);
    }

    testArgs.push('--help');

    // Test lspeak with user's configured provider
    const result = await Bun.spawn(testArgs, {
      stdout: 'ignore',
      stderr: 'ignore'
    });

    return result.exitCode === 0;
  } catch (error) {
    return false;
  }
}

/**
 * Send voice notification with fallback behavior
 * Attempts voice notification but provides fallback if voice is unavailable
 *
 * @param message - Primary message for voice notification
 * @param fallbackAction - Function to execute if voice is unavailable
 * @returns Promise that resolves when either voice or fallback completes
 */
export async function sendVoiceWithFallback(
  message: string,
  fallbackAction?: () => void
): Promise<void> {
  try {
    await sendDirectVoiceNotification(message);
  } catch (error) {
    // If voice fails and fallback is provided, execute it
    if (fallbackAction) {
      fallbackAction();
    }
  }
}