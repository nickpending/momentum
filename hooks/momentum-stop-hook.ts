#!/usr/bin/env bun
/**
 * Momentum Stop Hook
 * Processes CAPTURE lines via lore and speaks VOICE summaries via lspeak TTS
 */

import { existsSync } from "fs";
import { debugLog, debugLogSeparator } from "./shared/debug-log.ts";
import { loadConfig } from "./shared/config-loader.ts";
import { PROJECT_NAME } from "./shared/momentum-paths.ts";
import { $ } from "bun";
import {
  appendEvent,
  createEvent,
  type HookInput,
} from "./shared/jsonl-logger.ts";
import {
  parseTranscript,
  getLastUserMessage,
} from "./shared/transcript-parser.ts";
import { buildResponseContext } from "./shared/summary-context.ts";
import {
  captureKnowledge,
  captureTeaching,
  type KnowledgeCaptureType,
} from "@voidwire/lore";
import { readStdinWithTimeout } from "./shared/stdin-reader.ts";
import { join } from "path";

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

interface TeachBlock {
  domain: string;
  confidence: string;
  text: string;
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
 * Extract 🗣️ VOICE: summary from assistant message
 */
function extractVoiceSummary(content: string): string | null {
  const voiceMatch = content.match(/🗣️\s*VOICE:\s*(.+?)(?:\n|$)/i);
  if (voiceMatch && voiceMatch[1]) {
    return voiceMatch[1].trim();
  }
  return null;
}

/**
 * Extract 📁 CAPTURE lines from assistant message
 * Supports optional #type flag: 📁 CAPTURE [context] #type: insight
 */
function extractCaptureLines(
  content: string,
): Array<{ context: string; type: string; insight: string }> {
  const captures: Array<{ context: string; type: string; insight: string }> =
    [];

  // Match CAPTURE lines with optional #type flag
  // Format: 📁 CAPTURE [context] #type: insight  OR  📁 CAPTURE [context]: insight
  const captureRegex =
    /📁\s*CAPTURE\s*\[([^\]]+)\](?:\s+#(\w+))?:\s*(.+?)(?:\n|$)/gi;
  let match;

  while ((match = captureRegex.exec(content)) !== null) {
    if (match[1] && match[3]) {
      captures.push({
        context: match[1].trim(),
        type: match[2]?.trim() || "knowledge", // Default to "knowledge" if no type
        insight: match[3].trim(),
      });
    }
  }

  return captures;
}

/**
 * Extract 📚 TEACH lines from assistant message
 * Format: TEACH [domain] ~confidence: content
 */
function extractTeachLines(content: string): TeachBlock[] {
  const blocks: TeachBlock[] = [];

  // Regex: TEACH\s*\[([^\]]+)\]\s*~(\w+):\s*(.+)
  // Group 1: domain (inside brackets)
  // Group 2: confidence (after ~, before :)
  // Group 3: content (rest of line)
  const regex = /TEACH\s*\[([^\]]+)\]\s*~(\w+):\s*(.+?)(?:\n|$)/gi;

  let match;
  while ((match = regex.exec(content)) !== null) {
    if (match[1] && match[2] && match[3]) {
      blocks.push({
        domain: match[1].trim(),
        confidence: match[2].trim().toLowerCase(),
        text: match[3].trim(),
      });
    }
  }

  return blocks;
}

/**
 * Process CAPTURE lines via lore library
 */
function processCaptureLines(
  captures: Array<{ context: string; type: string; insight: string }>,
): void {
  if (captures.length === 0) {
    return;
  }

  debugLog("StopHook", `Processing ${captures.length} CAPTURE lines`, {});

  for (const capture of captures) {
    debugLog("StopHook", "Calling lore captureKnowledge", {
      context: capture.context,
      insight: capture.insight,
      type: capture.type,
    });

    const result = captureKnowledge({
      context: capture.context,
      text: capture.insight,
      type: capture.type as KnowledgeCaptureType,
    });

    if (result.success) {
      debugLog("StopHook", "CAPTURE logged successfully", {
        context: capture.context,
        type: capture.type,
      });
    } else {
      debugLog("StopHook", "lore capture failed", {
        error: result.error,
        context: capture.context,
      });
    }
  }
}

/**
 * Process TEACH lines via lore library
 */
function processTeachLines(blocks: TeachBlock[]): void {
  if (blocks.length === 0) {
    return;
  }

  debugLog("StopHook", `Processing ${blocks.length} TEACH lines`, {});

  for (const block of blocks) {
    debugLog("StopHook", "Calling lore captureTeaching", {
      domain: block.domain,
      confidence: block.confidence,
      text: block.text,
    });

    const result = captureTeaching({
      domain: block.domain,
      confidence: block.confidence,
      text: block.text,
      source: "momentum",
    });

    if (result.success) {
      debugLog("StopHook", "TEACH logged successfully", {
        domain: block.domain,
      });
    } else {
      debugLog("StopHook", "lore capture teaching failed", {
        error: result.error,
        domain: block.domain,
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
  // Note: config uses "assistant" key for workspace mode, "project" for project mode
  const configKey = mode === "workspace" ? "assistant" : "project";
  const verbosity =
    config.voice.verbosity[configKey as keyof typeof config.voice.verbosity] ||
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

    // Add model if specified
    if (ttsConfig.model) {
      args.push("--model", ttsConfig.model);
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
    const userName = config.personalization.name;

    // Extract last assistant message from transcript
    const lastMessageContent = await extractLastAssistantMessage(
      data.transcript_path,
    );
    if (!lastMessageContent) {
      debugLog("StopHook", "No assistant message found in transcript", {});
      process.exit(0);
    }

    // Determine current mode from environment or default to project
    const mode = process.env.MOMENTUM_MODE || "project";

    // Extract and process CAPTURE lines (Layer 2: Lore)
    const captures = extractCaptureLines(lastMessageContent);
    if (captures.length > 0) {
      debugLog("StopHook", `Found ${captures.length} CAPTURE lines`, {});
      await processCaptureLines(captures);
    }

    // Extract and process TEACH lines (Layer 2: Lore)
    const teachBlocks = extractTeachLines(lastMessageContent);
    if (teachBlocks.length > 0) {
      debugLog("StopHook", `Found ${teachBlocks.length} TEACH lines`, {});
      processTeachLines(teachBlocks);
    }

    // Extract Voice: summary
    const voiceSummary = extractVoiceSummary(lastMessageContent);

    // Parse transcript for token stats
    const transcriptStats = parseTranscript(data.transcript_path);
    debugLog("StopHook", "Transcript parsed", {
      input_tokens: transcriptStats.total_input_tokens,
      output_tokens: transcriptStats.total_output_tokens,
      tools: transcriptStats.tools_used.length,
      model: transcriptStats.model,
    });

    // Use PROJECT_NAME from momentum-paths (consistent with other hooks)
    const cwd = data.cwd || process.cwd();
    const projectName = PROJECT_NAME;

    // Strip VOICE marker (it's for TTS, not observability)
    const contentForSummary = lastMessageContent
      .replace(/🗣️\s*VOICE:.*$/s, "")
      .trim();

    // Get user prompt for context
    const userPrompt = getLastUserMessage(data.transcript_path);

    // Build context for summarization (used by worker)
    const context = buildResponseContext({
      eventType: "Stop",
      project: projectName,
      sessionId: data.session_id,
      content: contentForSummary,
      previousTurn: userPrompt || undefined,
      userName,
    });

    // Layer 1: JSONL event logging (synchronous, no LLM call)
    const hookInput: HookInput = {
      session_id: data.session_id,
      transcript_path: data.transcript_path,
      cwd: cwd,
      hook_event_name: data.hook_event_name || "Stop",
    };
    const logEvent = createEvent(hookInput, {
      response_length: lastMessageContent.length,
      tokens: {
        input: transcriptStats.total_input_tokens,
        output: transcriptStats.total_output_tokens,
        cache_creation: transcriptStats.cache_creation_tokens,
        cache_read: transcriptStats.cache_read_tokens,
      },
      tools_used: transcriptStats.tools_used,
      has_voice: !!voiceSummary,
      captures_count: captures.length,
      model: transcriptStats.model,
      summary: contentForSummary.substring(0, 200), // Truncated, worker enriches Argus
    });
    appendEvent(logEvent);
    debugLog("StopHook", "JSONL event logged");

    // Layer 3: Spawn detached worker for async Argus enrichment
    // Worker calls llm-summarize, posts enriched event to Argus
    const hooksDir = import.meta.dir;
    const workerPath = join(hooksDir, "summarizer-worker.ts");
    const workerInput = JSON.stringify({
      sessionId: data.session_id,
      project: projectName,
      context,
      userName,
      tokens: {
        input: transcriptStats.total_input_tokens,
        output: transcriptStats.total_output_tokens,
      },
      toolsUsed: transcriptStats.tools_used,
      model: transcriptStats.model,
      capturesCount: captures.length,
    });

    debugLog("StopHook", "Spawning worker", { workerPath, hooksDir });
    const worker = Bun.spawn(["bun", workerPath], {
      stdin: "pipe",
      stdout: "ignore",
      stderr: "ignore",
      cwd: hooksDir, // Ensure worker can find node_modules
    });
    worker.stdin.write(workerInput);
    worker.stdin.end();
    worker.unref(); // Allow hook to exit while worker continues
    debugLog("StopHook", "Summarizer worker spawned");

    // TTS: Speak voice summary if present
    if (!voiceSummary) {
      debugLog("StopHook", "No Voice: marker found", {});
      process.exit(0);
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
    process.exit(0);
  } catch (error) {
    // Log error but don't fail - TTS is optional
    debugLog("StopHook", "Error in stop hook", { error: String(error) });
    process.exit(0);
  }
}

main();
