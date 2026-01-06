#!/usr/bin/env bun
/**
 * Summarizer Worker
 * Detached process for async session insight extraction
 * Spawned by stop hook, runs independently after hook exits
 */

import {
  summarize,
  loadConfig as loadLLMConfig,
} from "@voidwire/llm-summarize";
import { postToArgus } from "./shared/argus-client.ts";
import { debugLog } from "./shared/debug-log.ts";

// Worker input passed via stdin
interface WorkerInput {
  sessionId: string;
  project: string;
  context: string; // Pre-built context for summarization
  userName?: string;
  tokens: {
    input: number;
    output: number;
  };
  toolsUsed: string[];
  model: string | null;
  capturesCount: number;
}

async function main() {
  try {
    // Read input from stdin
    const chunks: Buffer[] = [];
    for await (const chunk of Bun.stdin.stream()) {
      chunks.push(Buffer.from(chunk));
    }
    const inputText = Buffer.concat(chunks).toString("utf-8");

    if (!inputText.trim()) {
      debugLog("SummarizerWorker", "No input received");
      process.exit(1);
    }

    const input: WorkerInput = JSON.parse(inputText);
    debugLog("SummarizerWorker", "Starting summarization", {
      sessionId: input.sessionId,
      project: input.project,
      contextLength: input.context.length,
      contextPreview: input.context.substring(0, 500),
    });

    // Call llm-summarize library
    const llmConfig = loadLLMConfig();
    const result = await summarize(input.context, llmConfig, {
      mode: "insights",
      userName: input.userName,
    });

    if (result.error) {
      debugLog("SummarizerWorker", "Summarization failed", {
        error: result.error,
      });
      // Post basic event without enrichment
      await postToArgus({
        source: "momentum",
        event_type: "response",
        hook: "Stop",
        session_id: input.sessionId,
        status: "success",
        message: input.context.substring(0, 200),
        data: {
          project: input.project,
          tokens: input.tokens,
          tools_used: input.toolsUsed,
          model: input.model,
          captures_count: input.capturesCount,
          enriched: false,
          enrichment_error: result.error,
        },
      });
      return;
    }

    const insights = result.insights;
    debugLog("SummarizerWorker", "Insights extracted", {
      summary: insights?.summary,
      decisions: insights?.decisions,
      patterns: insights?.patterns_used,
      preferences: insights?.preferences_expressed,
      problems: insights?.problems_solved,
      tools: insights?.tools_heavy,
    });

    // Post enriched event to Argus
    await postToArgus({
      source: "momentum",
      event_type: "response",
      hook: "Stop",
      session_id: input.sessionId,
      status: "success",
      message: insights?.summary || input.context.substring(0, 200),
      data: {
        project: input.project,
        tokens: input.tokens,
        tools_used: input.toolsUsed,
        model: input.model,
        captures_count: input.capturesCount,
        enriched: true,
        // SessionInsights fields for Lore deriver
        decisions: insights?.decisions,
        patterns_used: insights?.patterns_used,
        preferences_expressed: insights?.preferences_expressed,
        problems_solved: insights?.problems_solved,
        tools_heavy: insights?.tools_heavy,
      },
    });

    debugLog("SummarizerWorker", "Argus event posted successfully");
  } catch (error) {
    debugLog("SummarizerWorker", "Worker error", { error: String(error) });
    process.exit(1);
  }
}

main();
