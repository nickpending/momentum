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
import { debugLog } from './debug-log.ts';

interface VoiceConfig {
  provider?: string;
  voice_id?: string;
  api_key?: string;
}

/**
 * Parse voice profile name from main clarvis config
 */
function parseVoiceProfileName(configContent: string): string | null {
  try {
    const lines = configContent.split('\n');
    let inClarvisSection = false;

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed === '[clarvis]') {
        inClarvisSection = true;
        continue;
      }

      if (trimmed.startsWith('[') && trimmed !== '[clarvis]') {
        inClarvisSection = false;
        continue;
      }

      if (inClarvisSection && trimmed && !trimmed.startsWith('#')) {
        if (trimmed.startsWith('voice = ')) {
          const value = trimmed.split('=')[1].trim().replace(/"/g, '');
          return value.split('#')[0].trim();
        }
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Parse voice configuration from voice profile file
 */
function parseVoiceConfig(profileContent: string): VoiceConfig | null {
  try {
    const lines = profileContent.split('\n');
    let inVoiceSection = false;
    const config: Partial<VoiceConfig> = {};

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed === '[voice]') {
        inVoiceSection = true;
        continue;
      }

      if (trimmed.startsWith('[') && trimmed !== '[voice]') {
        inVoiceSection = false;
        continue;
      }

      if (inVoiceSection && trimmed && !trimmed.startsWith('#')) {
        if (trimmed.startsWith('provider = ')) {
          const value = trimmed.split('=')[1].trim().replace(/"/g, '');
          config.provider = value.split('#')[0].trim();
        } else if (trimmed.startsWith('voice_id = ')) {
          const value = trimmed.split('=')[1].trim().replace(/"/g, '');
          config.voice_id = value.split('#')[0].trim();
        } else if (trimmed.startsWith('api_key = ')) {
          const value = trimmed.split('=')[1].trim().replace(/"/g, '');
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
 * Load voice configuration from clarvis config and voice profile
 * Returns empty config if unavailable (lspeak will use default)
 */
function loadVoiceConfig(): VoiceConfig {
  const homeDir = process.env.HOME;
  if (!homeDir) {
    return {};
  }

  const configPath = join(homeDir, '.config', 'clarvis', 'config.toml');

  if (!existsSync(configPath)) {
    return {};
  }

  try {
    // Read main config to get voice profile name
    const configContent = readFileSync(configPath, 'utf-8');
    const profileName = parseVoiceProfileName(configContent);

    if (!profileName) {
      return {};
    }

    // Load voice profile
    const profilePath = join(homeDir, '.config', 'clarvis', 'voices', `${profileName}.toml`);

    if (!existsSync(profilePath)) {
      return {};
    }

    const profileContent = readFileSync(profilePath, 'utf-8');
    const voiceConfig = parseVoiceConfig(profileContent);

    return voiceConfig || {};
  } catch (error) {
    return {};
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
    debugLog('Voice', 'sendDirectVoiceNotification called', { message: message.substring(0, 50), voiceConfig });

    // Use Bun.which to find lspeak in PATH (proper way for Bun.spawn)
    const lspeakPath = Bun.which('lspeak');
    if (!lspeakPath) {
      debugLog('Voice', 'lspeak not found in PATH');
      return;
    }
    debugLog('Voice', 'Found lspeak', { path: lspeakPath });

    // Split message into sentences
    const sentences = message.match(/[^.!?]+[.!?]+/g) || [message];

    // Speak each sentence separately
    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (!trimmed) continue;

      const lspeakArgs = [lspeakPath];

      // Add provider if specified
      if (voiceConfig.provider) {
        lspeakArgs.push('--provider', voiceConfig.provider);
      }

      // Add voice ID if specified (except for system provider)
      if (voiceConfig.voice_id && voiceConfig.provider !== 'system') {
        lspeakArgs.push('--voice', voiceConfig.voice_id);
      }

      lspeakArgs.push(trimmed);

      // Set environment for elevenlabs if needed
      const env: Record<string, string> = {};
      if (voiceConfig.provider === 'elevenlabs' && voiceConfig.api_key) {
        env.ELEVENLABS_API_KEY = voiceConfig.api_key;
      }

      debugLog('Voice', 'Executing lspeak', { command: lspeakArgs.join(' ') });

      // Execute lspeak
      const proc = Bun.spawn(lspeakArgs, {
        stdout: 'ignore',
        stderr: 'ignore',
        env
      });
      await proc.exited;

      debugLog('Voice', 'lspeak completed', { exitCode: proc.exitCode });
    }
  } catch (error) {
    // Log errors for debugging but don't throw
    debugLog('Voice', 'sendDirectVoiceNotification error', { error: String(error) });
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
    // Use Bun.which to find lspeak in PATH (proper way for Bun.spawn)
    const lspeakPath = Bun.which('lspeak');
    if (!lspeakPath) {
      return false;
    }

    const voiceConfig = loadVoiceConfig();
    const testArgs = [lspeakPath];

    // Add provider if specified
    if (voiceConfig.provider) {
      testArgs.push('--provider', voiceConfig.provider);
    }

    // Add voice ID if specified (except for system provider)
    if (voiceConfig.voice_id && voiceConfig.provider !== 'system') {
      testArgs.push('--voice', voiceConfig.voice_id);
    }

    testArgs.push('--help');

    // Test lspeak with user's configured voice
    const proc = Bun.spawn(testArgs, {
      stdout: 'ignore',
      stderr: 'ignore'
    });
    await proc.exited;

    return proc.exitCode === 0;
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