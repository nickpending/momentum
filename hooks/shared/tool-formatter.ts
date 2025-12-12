#!/usr/bin/env bun
/**
 * Tool Formatter
 * Shared utility for formatting tool messages across hooks
 */

/**
 * Format tool message from tool name and input fields
 * Handles Claude Code tools, known MCPs (Playwright), and fallback for unknown
 */
export function formatToolMessage(
  name: string,
  input: Record<string, unknown>,
): string {
  // Known fields in priority order
  const command = input.command as string;
  const filePath = (input.file_path || input.notebook_path) as string;
  const url = input.url as string;
  const query = input.query as string;
  const pattern = input.pattern as string;
  const path = input.path as string;
  const element = input.element as string;
  const text = input.text as string;
  const key = input.key as string;
  const code = input.code as string;
  const description = input.description as string;

  if (command) return `${name}: ${command}`;
  if (url) return `${name} ${url}`;
  if (query) return `${name} "${query}"`;
  if (element && text) return `${name} "${text}" in ${element}`;
  if (element) return `${name} ${element}`;
  if (key) return `${name} ${key}`;
  if (pattern && path) return `${name} "${pattern}" in ${path}`;
  if (pattern) return `${name} "${pattern}"`;
  if (filePath) return `${name} ${filePath}`;
  if (code) return `${name}: ${code.substring(0, 80)}`;
  if (description) return `${name}: ${description}`;

  // Fallback: first string value for unknown MCPs
  const firstString = Object.values(input).find(
    (v) => typeof v === "string",
  ) as string;
  if (firstString) return `${name}: ${firstString.substring(0, 80)}`;

  return name;
}
