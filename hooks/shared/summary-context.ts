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
 * Build structured context for prompt summarization
 */
export function buildPromptContext(opts: SummaryContextOptions): string {
  const previous = opts.previousTurn?.substring(0, 300) || "Session start";
  const content = opts.content.substring(0, 500);
  const userLine = opts.userName ? `User: ${opts.userName}\n` : "";

  return `Event Type: ${opts.eventType}
Project: ${opts.project}
${userLine}Previous Assistant: ${previous}
User Prompt: ${content}`;
}

/**
 * Build structured context for response summarization
 */
export function buildResponseContext(opts: SummaryContextOptions): string {
  const previous = opts.previousTurn?.substring(0, 300) || "Session start";
  const content = opts.content.substring(0, 1000);
  const userLine = opts.userName ? `User: ${opts.userName}\n` : "";

  return `Event Type: ${opts.eventType}
Project: ${opts.project}
${userLine}User Asked: ${previous}
Assistant Response: ${content}`;
}
