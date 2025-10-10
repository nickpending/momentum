#!/usr/bin/env bun
/**
 * Momentum Context Compression Hook
 * Triggered before Claude context compression - injects save-state context and provides ambient feedback
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { sendDirectVoiceNotification } from './shared/voice-utils.ts';

interface HookInput {
  session_id: string;
  transcript_path: string;
  hook_event_name: string;
  compact_type?: string;
}

/**
 * Generate contextual voice message for compression
 * Includes project context like session start hook
 */
function getCompressionVoiceMessage(projectName: string, isInProject: boolean): string {
  if (isInProject) {
    const projectMessages = [
      `Sir, archiving ${projectName} session state`,
      `Context limit reached. Securing ${projectName} progress`,
      `Sir, compressing ${projectName} development context`,
      `Preserving ${projectName} session for continuity`,
      `Sir, ${projectName} context archived. Preparing fresh workspace`,
      `${projectName} development state secured. Ready to resume`,
      `Sir, ${projectName} session compressed. All progress preserved`
    ];
    return projectMessages[Math.floor(Math.random() * projectMessages.length)];
  } else {
    const fallbackMessages = [
      "Sir, archiving current session state",
      "Context limit approaching. Securing progress",
      "Sir, compressing development context",
      "Session compressed. Limited state preservation"
    ];
    return fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
  }
}

// Error fallback messages (text sent to Claude when context injection fails)
function getErrorFallbackMessage(projectName: string, isInProject: boolean): string {
  if (isInProject) {
    const projectErrors = [
      `Context compression active for ${projectName}. Save-state template missing - manual state save recommended.`,
      `${projectName} compression proceeding with limited state preservation. Check SAVE_STATE.md template.`,
      `Warning: ${projectName} context compression without full state capture. Manual intervention advised.`
    ];
    return projectErrors[Math.floor(Math.random() * projectErrors.length)];
  } else {
    const fallbackErrors = [
      "Context compression in progress. Not in momentum project - limited state preservation.",
      "Compression proceeding outside momentum project. Manual state save recommended.",
      "Context compression active. No project context available for state preservation."
    ];
    return fallbackErrors[Math.floor(Math.random() * fallbackErrors.length)];
  }
}


function findProjectRoot(): string | null {
  let currentDir = process.cwd();

  while (currentDir !== '/') {
    if (existsSync(join(currentDir, '.workflow'))) {
      return currentDir;
    }
    currentDir = join(currentDir, '..');
  }

  return null;
}

function generateTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');

  return `${year}${month}${day}-${hour}${minute}`;
}

function generateShortTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');

  return `${year}${month}${day}-${hour}${minute}`;
}

function getCurrentMode(sessionId: string): string {
  const modeFile = `/tmp/momentum-mode-${sessionId}`;

  if (existsSync(modeFile)) {
    return readFileSync(modeFile, 'utf-8').trim();
  }

  return 'unknown';
}

async function readStdinWithTimeout(timeout: number = 2000): Promise<string> {
  return new Promise((resolve) => {
    let data = '';
    const timer = setTimeout(() => {
      resolve('{}'); // Default empty JSON
    }, timeout);

    process.stdin.on('data', (chunk) => {
      data += chunk.toString();
    });

    process.stdin.on('end', () => {
      clearTimeout(timer);
      resolve(data);
    });

    process.stdin.on('error', () => {
      clearTimeout(timer);
      resolve('{}');
    });
  });
}

async function main(): Promise<void> {
  try {
    // Read hook input with timeout protection
    const input = await readStdinWithTimeout();
    const data: HookInput = JSON.parse(input);

    // Get project context
    const projectRoot = findProjectRoot();
    const currentMode = getCurrentMode(data.session_id);
    const isInProject = projectRoot !== null;
    const projectName = process.cwd().split('/').pop() || 'unknown';

    console.error('🔄 Momentum context compression triggered');

    // 1. Send immediate contextual voice notification
    const voiceMessage = getCompressionVoiceMessage(projectName, isInProject);
    await sendDirectVoiceNotification(voiceMessage);

    if (isInProject) {
      // 2. Load and process SAVE_STATE.md context
      let contextsPath = join(projectRoot, '.workflow', 'contexts');
      let saveStatePath = join(contextsPath, 'SAVE_STATE.md');

      // If no project contexts, use global momentum contexts
      if (!existsSync(saveStatePath)) {
        contextsPath = join(process.env.HOME!, '.config', 'momentum', 'contexts');
        saveStatePath = join(contextsPath, 'SAVE_STATE.md');
      }

      if (existsSync(saveStatePath)) {
        // Read and process the save-state context template
        let saveStateContent = readFileSync(saveStatePath, 'utf-8');

        // Replace placeholders with actual values
        const timestamp = generateTimestamp();
        const shortTimestamp = generateShortTimestamp();

        saveStateContent = saveStateContent.replace(/SESSION_ID_PLACEHOLDER/g, data.session_id);
        saveStateContent = saveStateContent.replace(/TIMESTAMP_PLACEHOLDER/g, timestamp);
        saveStateContent = saveStateContent.replace(/TIMESTAMP_SHORT_PLACEHOLDER/g, shortTimestamp);
        saveStateContent = saveStateContent.replace(/PROJECT_NAME_PLACEHOLDER/g, projectName);
        saveStateContent = saveStateContent.replace(/PROJECT_ROOT_PLACEHOLDER/g, projectRoot);
        saveStateContent = saveStateContent.replace(/COMPRESSION_REASON_PLACEHOLDER/g, 'Context compression triggered automatically');

        // Output the processed save-state context
        console.log(saveStateContent);

        console.error('💾 Save-state context injected');
      } else {
        // Fallback if no save-state context found
        console.log('');
        const errorMessage = getErrorFallbackMessage(projectName, isInProject);
        console.log(errorMessage);

        console.error('⚠️ Save-state context not found');
      }
    } else {
      // Not in a momentum project - just ambient notification
      console.log('');
      const fallbackMessage = getErrorFallbackMessage(projectName, isInProject);
      console.log(fallbackMessage);

      console.error('⚠️ Not in momentum project - limited state preservation');
    }

    // 3. Add metadata for debugging
    console.log('\n<!-- HOOK: Momentum compression hook executed -->');
    console.log(`<!-- SESSION_ID: ${data.session_id} -->`);
    console.log(`<!-- MODE: ${currentMode} -->`);
    console.log(`<!-- PROJECT: ${projectName} -->`);
    console.log(`<!-- IN_PROJECT: ${isInProject} -->`);
    console.log(`<!-- COMPRESSION_TYPE: ${data.compact_type || 'auto'} -->`);

    console.error('✅ Momentum compression hook completed');
    process.exit(0);

  } catch (error) {
    console.error('💥 Momentum compression hook error:', error);

    // Error fallback - still provide some ambient feedback
    const projectName = process.cwd().split('/').pop() || 'unknown';
    const errorVoice = "Sir, compression error encountered. Proceeding with caution";
    await sendDirectVoiceNotification(errorVoice);

    console.log('');
    const errorMessage = `Compression error encountered for ${projectName}. Manual state save strongly recommended.`;
    console.log(errorMessage);

    process.exit(0);
  }
}

main();