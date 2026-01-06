/**
 * Summary Context Builder
 * Shared helper for building structured context for LLM summarization
 */

export interface SummaryContextOptions {
  eventType: string;
  project: string;
  sessionId: string;
  content: string;
  previousTurn?: string;
  userName?: string;
}

/**
 * Build structured context for prompt summarization (blocking - keep brief)
 */
export function buildPromptContext(opts: SummaryContextOptions): string {
  const previous = opts.previousTurn?.substring(0, 300) || "Session start";
  const content = opts.content.substring(0, 500);

  return `Project: ${opts.project}
Previous Assistant: ${previous}
User Prompt: ${content}`;
}

/**
 * Build structured context for response summarization (async worker - no truncation)
 */
export function buildResponseContext(opts: SummaryContextOptions): string {
  const previous = opts.previousTurn || "Session start";

  return `Project: ${opts.project}
User Asked: ${previous}
Assistant Response: ${opts.content}`;
}
