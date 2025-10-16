#!/usr/bin/env bun
/**
 * XDG-compliant debug logging utility for hooks
 * Logs to $XDG_STATE_HOME/momentum/debug.log
 */

import { appendFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// XDG Base Directory spec - state files go in XDG_STATE_HOME
const XDG_STATE_HOME = process.env.XDG_STATE_HOME || join(process.env.HOME!, '.local', 'state');
const MOMENTUM_STATE_DIR = join(XDG_STATE_HOME, 'momentum');
const LOG_FILE = join(MOMENTUM_STATE_DIR, 'debug.log');

// Ensure state directory exists
function ensureStateDir(): void {
  try {
    if (!existsSync(MOMENTUM_STATE_DIR)) {
      mkdirSync(MOMENTUM_STATE_DIR, { recursive: true });
    }
  } catch (error) {
    // Silent fail - don't interrupt hooks
  }
}

export function debugLog(hookName: string, message: string, data?: any): void {
  ensureStateDir();

  const timestamp = new Date().toISOString();
  const logLine = data
    ? `[${timestamp}] [${hookName}] ${message}\n${JSON.stringify(data, null, 2)}\n`
    : `[${timestamp}] [${hookName}] ${message}\n`;

  try {
    appendFileSync(LOG_FILE, logLine);
  } catch (error) {
    // Silent fail - don't interrupt hooks
  }
}

export function debugLogSeparator(): void {
  ensureStateDir();

  try {
    appendFileSync(LOG_FILE, '\n' + '='.repeat(80) + '\n\n');
  } catch (error) {
    // Silent fail
  }
}

export function getLogPath(): string {
  return LOG_FILE;
}
