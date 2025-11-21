#!/usr/bin/env bun
/**
 * Momentum Stop Hook
 * Processes CAPTURE lines via lore-capture and speaks VOICE summaries via lspeak TTS
 */

import { existsSync } from "fs";
import { debugLog, debugLogSeparator } from "./shared/debug-log.ts";
import { loadConfig } from "./shared/config-loader.ts";
import { $ } from "bun";

interface StopHookInput {
  session_id: string;
  hook_event_name: string;
  transcript_path: string;
  cwd: string;
}

interface TranscriptEntry {
  message?: {
    role: string;
    content: Array<{
      type: string;
      text?: string;
    }>;
  };
}

/**
 * Read transcript file and extract last assistant message content
 */
async function extractLastAssistantMessage(
  transcriptPath: string,
): Promise<string | null> {
  try {
    debugLog("StopHook", "Reading transcript", { transcriptPath });

    const file = Bun.file(transcriptPath);
    const content = await file.text();

    if (!content.trim()) {
      debugLog("StopHook", "Transcript file empty", {});
      return null;
    }

    // Split into JSONL entries
    const lines = content.trim().split("\n");
    const jsonlEntries: string[] = [];
    let currentEntry = "";

    // Reconstruct JSONL entries that may have been split by embedded newlines
    for (const line of lines) {
      currentEntry += line;
      try {
        JSON.parse(currentEntry);
        jsonlEntries.push(currentEntry);
        currentEntry = "";
      } catch {
        currentEntry += "\n";
      }
    }

    debugLog("StopHook", "Parsed JSONL entries", {
      entryCount: jsonlEntries.length,
    });

    // Search from most recent to oldest (last 20 entries for performance)
    const lastEntries = jsonlEntries.slice(-20);
    for (const jsonEntry of lastEntries.reverse()) {
      try {
        const entry: TranscriptEntry = JSON.parse(jsonEntry);

        // Look for assistant messages with text content
        if (entry.message?.role === "assistant" && entry.message.content) {
          for (const contentItem of entry.message.content) {
            if (contentItem.type === "text" && contentItem.text) {
              debugLog("StopHook", "Found assistant message", {
                textLength: contentItem.text.length,
                preview: contentItem.text.substring(0, 100),
              });
              return contentItem.text;
            }
          }
        }
      } catch {
        continue;
      }
    }

    debugLog("StopHook", "No assistant message found in entries", {});
    return null;
  } catch (error) {
    debugLog("StopHook", "Error reading transcript", { error: String(error) });
    return null;
  }
}

/**
 * Split text into sentences using Intl.Segmenter for proper boundary detection
 */
function splitIntoSentences(text: string): string[] {
  // If text is very short, return as is
  if (text.length < 10) {
    return [text];
  }

  try {
    // Use Intl.Segmenter for proper sentence boundary detection
    const segmenter = new Intl.Segmenter("en", { granularity: "sentence" });
    const segments = Array.from(segmenter.segment(text));

    // Extract the text from each segment and filter out empty ones
    const sentences = segments
      .map((segment) => segment.segment.trim())
      .filter((sentence) => sentence.length > 0);

    return sentences.length > 0 ? sentences : [text];
  } catch (error) {
    // Fallback to original text if Intl.Segmenter fails
    debugLog("StopHook", "Sentence segmentation failed, using fallback", {
      error: String(error),
    });
    return [text];
  }
}

/**
 * Extract 🎯 VOICE: summary from assistant message
 */
function extractVoiceSummary(content: string): string | null {
  const voiceMatch = content.match(/🎯\s*VOICE:\s*(.+?)(?:\n|$)/i);
  if (voiceMatch && voiceMatch[1]) {
    return voiceMatch[1].trim();
  }
  return null;
}

/**
 * Extract 📁 CAPTURE lines from assistant message
 */
function extractCaptureLines(
  content: string,
): Array<{ context: string; insight: string }> {
  const captures: Array<{ context: string; insight: string }> = [];

  // Match all CAPTURE lines in the content
  const captureRegex = /📁\s*CAPTURE\s*\[([^\]]+)\]:\s*(.+?)(?:\n|$)/gi;
  let match;

  while ((match = captureRegex.exec(content)) !== null) {
    if (match[1] && match[2]) {
      captures.push({
        context: match[1].trim(),
        insight: match[2].trim(),
      });
    }
  }

  return captures;
}

/**
 * Process CAPTURE lines via lore-capture
 */
async function processCaptureLines(
  captures: Array<{ context: string; insight: string }>,
  mode: string,
): Promise<void> {
  if (captures.length === 0) {
    return;
  }

  debugLog("StopHook", `Processing ${captures.length} CAPTURE lines`, { mode });

  for (const capture of captures) {
    try {
      debugLog("StopHook", "Calling lore-capture", {
        context: capture.context,
        insight: capture.insight,
        type: mode,
      });

      await $`lore-capture knowledge --context=${capture.context} --text=${capture.insight} --type=${mode}`.quiet();

      debugLog("StopHook", "CAPTURE logged successfully", {
        context: capture.context,
      });
    } catch (error) {
      // Log error but don't block - capture is optional
      debugLog("StopHook", "lore-capture failed", {
        error: String(error),
        context: capture.context,
      });
    }
  }
}

/**
 * Check if lspeak is available
 */
async function isLspeakAvailable(): Promise<boolean> {
  try {
    await $`which lspeak`.quiet();
    return true;
  } catch {
    return false;
  }
}

/**
 * Determine if cache should be used based on mode and verbosity
 */
function shouldUseCache(
  mode: string,
  config: ReturnType<typeof loadConfig>,
): boolean {
  // Get verbosity level for current mode
  const verbosity =
    config.voice.verbosity[mode as keyof typeof config.voice.verbosity] ||
    "normal";

  // Check cache config for this verbosity level
  const cacheConfig = config.voice.tts?.cache;
  if (!cacheConfig) {
    // Default: cache for terse/brief, don't cache for normal
    return verbosity !== "normal";
  }

  // Use explicit cache configuration
  const shouldCache = cacheConfig[verbosity as keyof typeof cacheConfig];
  return shouldCache ?? verbosity !== "normal";
}

/**
 * Speak sentences via lspeak
 */
async function speakSentences(
  sentences: string[],
  mode: string,
  config: ReturnType<typeof loadConfig>,
): Promise<void> {
  const ttsConfig = config.voice.tts;
  if (!ttsConfig?.enabled) {
    debugLog("StopHook", "TTS disabled in config", {});
    return;
  }

  // Check if lspeak is available
  if (!(await isLspeakAvailable())) {
    debugLog("StopHook", "lspeak not installed, skipping TTS", {});
    return;
  }

  const useCache = shouldUseCache(mode, config);

  // Build environment variables
  const env: Record<string, string> = {};
  if (ttsConfig.provider === "elevenlabs" && ttsConfig.api_key) {
    env.ELEVENLABS_API_KEY = ttsConfig.api_key;
  }

  // Process each sentence sequentially to avoid audio overlap
  for (const sentence of sentences) {
    const args: string[] = ["lspeak"];

    // Add cache control
    if (!useCache) {
      args.push("--no-cache");
    }

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

    // Add sentence as argument (like clarvis does)
    args.push(sentence);

    debugLog("StopHook", "Speaking sentence", { sentence, args, useCache });

    try {
      // Use Bun $ shell (finds lspeak in PATH, unlike Bun.spawn)
      await $`${args}`.env(env);
    } catch (error) {
      // Log error but don't block - TTS is optional
      debugLog("StopHook", "lspeak failed", { error: String(error), sentence });
    }
  }
}

/**
 * Read JSON from stdin with timeout
 */
async function readStdinWithTimeout(timeout: number = 5000): Promise<string> {
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

async function main() {
  try {
    debugLogSeparator();
    debugLog("StopHook", "Hook triggered");

    // Read input from stdin
    const input = await readStdinWithTimeout();
    const data: StopHookInput = JSON.parse(input);

    debugLog("StopHook", "Hook input", {
      sessionId: data.session_id,
      transcriptPath: data.transcript_path,
    });

    // Load configuration
    const config = loadConfig();

    // Extract last assistant message from transcript
    const lastMessageContent = await extractLastAssistantMessage(
      data.transcript_path,
    );
    if (!lastMessageContent) {
      debugLog("StopHook", "No assistant message found in transcript", {});
      return;
    }

    // Determine current mode from environment or default to project
    const mode = process.env.MOMENTUM_MODE || "project";

    // Extract and process CAPTURE lines
    const captures = extractCaptureLines(lastMessageContent);
    if (captures.length > 0) {
      debugLog("StopHook", `Found ${captures.length} CAPTURE lines`, {});
      await processCaptureLines(captures, mode);
    }

    // Extract Voice: summary
    const voiceSummary = extractVoiceSummary(lastMessageContent);
    if (!voiceSummary) {
      debugLog("StopHook", "No Voice: marker found", {});
      return;
    }

    debugLog("StopHook", "Extracted voice summary", { voiceSummary });

    // Split into sentences
    const sentences = splitIntoSentences(voiceSummary);
    debugLog("StopHook", `Split into ${sentences.length} sentences`, {
      sentences,
    });

    // Speak sentences
    await speakSentences(sentences, mode, config);

    debugLog("StopHook", "TTS complete", {});
  } catch (error) {
    // Log error but don't fail - TTS is optional
    debugLog("StopHook", "Error in stop hook", { error: String(error) });
  }
}

main();
