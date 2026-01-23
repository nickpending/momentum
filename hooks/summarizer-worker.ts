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
import { captureInsight } from "@voidwire/lore/capture";

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

interface SessionInsights {
  summary: string;
  decisions?: string[];
  patterns_used?: string[];
  preferences_expressed?: string[];
  problems_solved?: string[];
  tools_heavy?: string[];
}

async function captureInsightsToLore(
  insights: SessionInsights | undefined,
  sessionId: string,
  project: string,
): Promise<void> {
  if (!insights) return;

  try {
    for (const decision of insights.decisions || []) {
      captureInsight({
        session_id: sessionId,
        project,
        insight_type: "decision",
        text: decision,
        source: "auto",
      });
    }

    for (const pattern of insights.patterns_used || []) {
      captureInsight({
        session_id: sessionId,
        project,
        insight_type: "pattern",
        text: pattern,
        source: "auto",
      });
    }

    for (const problem of insights.problems_solved || []) {
      captureInsight({
        session_id: sessionId,
        project,
        insight_type: "problem",
        text: problem,
        source: "auto",
      });
    }

    for (const pref of insights.preferences_expressed || []) {
      captureInsight({
        session_id: sessionId,
        project,
        insight_type: "preference",
        text: pref,
        source: "auto",
      });
    }

    for (const tool of insights.tools_heavy || []) {
      captureInsight({
        session_id: sessionId,
        project,
        insight_type: "tool",
        text: tool,
        source: "auto",
      });
    }

    if (insights.summary) {
      captureInsight({
        session_id: sessionId,
        project,
        insight_type: "summary",
        text: insights.summary,
        source: "auto",
      });
    }

    debugLog("SummarizerWorker", "Lore insights captured");
  } catch (error) {
    debugLog("SummarizerWorker", "Lore capture failed (non-critical)", {
      error: String(error),
    });
  }
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
      },
    });

    debugLog("SummarizerWorker", "Argus event posted successfully");

    await captureInsightsToLore(insights, input.sessionId, input.project);
  } catch (error) {
    debugLog("SummarizerWorker", "Worker error", { error: String(error) });
    process.exit(1);
  }
}

main();
