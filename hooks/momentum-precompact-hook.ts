#!/usr/bin/env bun
/**
 * Momentum PreCompact Hook
 * Automatically saves development state before compaction using claude CLI
 */

import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { sendDirectVoiceNotification } from './shared/voice-utils.ts';
import { debugLog, debugLogSeparator } from './shared/debug-log.ts';
import { processTranscript } from './shared/transcript-processor.ts';

interface PreCompactInput {
  session_id: string;
  transcript_path: string;
  hook_event_name: string;
  compact_type?: string;
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

async function readStdinWithTimeout(timeout: number = 2000): Promise<string> {
  return new Promise((resolve) => {
    let data = '';
    const timer = setTimeout(() => {
      resolve('{}');
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
    debugLogSeparator();
    debugLog('PreCompact', 'Hook triggered');

    const input = await readStdinWithTimeout();
    const data: PreCompactInput = JSON.parse(input);

    debugLog('PreCompact', 'Input received', {
      session_id: data.session_id,
      transcript_path: data.transcript_path,
      compact_type: data.compact_type,
      cwd: process.cwd()
    });

    const projectRoot = findProjectRoot();
    const projectName = process.cwd().split('/').pop() || 'unknown';
    const isInProject = projectRoot !== null;

    console.error('🔄 Momentum PreCompact triggered');
    debugLog('PreCompact', 'Project context', {
      projectRoot,
      projectName,
      isInProject
    });

    if (!isInProject) {
      console.error('⚠️  Not in momentum project - skipping state save');
      debugLog('PreCompact', 'Not in project, skipping');
      await sendDirectVoiceNotification("Sir, compaction in progress outside project context");
      process.exit(0);
    }

    // Ensure state directory exists
    const stateDir = join(projectRoot, '.workflow', 'state');
    if (!existsSync(stateDir)) {
      debugLog('PreCompact', 'Creating state directory', { stateDir });
      mkdirSync(stateDir, { recursive: true });
    }

    const timestamp = generateTimestamp();
    const stateFile = join(stateDir, `state-${timestamp}.md`);

    console.error(`💾 Saving state to ${stateFile}`);
    debugLog('PreCompact', 'Saving state', { stateFile, timestamp });

    // Process transcript and generate state
    try {
      // Read and process transcript
      const transcriptContent = readFileSync(data.transcript_path, 'utf-8');
      const processedTranscript = processTranscript(transcriptContent);

      debugLog('PreCompact', 'Transcript processed', {
        originalSize: transcriptContent.length,
        processedSize: processedTranscript.length
      });

      // Read save-state template
      const saveStateTemplate = readFileSync(
        join(projectRoot, '.claude/commands/save-state.md'),
        'utf-8'
      );

      // Build prompt with transcript + template
      const prompt = `${processedTranscript}\n\n---\n\n${saveStateTemplate}`;

      // Write prompt to temp file for claude CLI
      const tempPromptFile = join(stateDir, '.temp-prompt.md');
      writeFileSync(tempPromptFile, prompt, 'utf-8');

      debugLog('PreCompact', 'Invoking claude CLI');

      // Generate state via claude (suppress voice notifications via env var)
      const stateContent = execSync(
        `cat "${tempPromptFile}" | claude -p "Generate state"`,
        {
          encoding: 'utf-8',
          cwd: projectRoot,
          maxBuffer: 10 * 1024 * 1024,
          env: {
            ...process.env,
            MOMENTUM_SUPPRESS_VOICE: 'true'
          }
        }
      );

      debugLog('PreCompact', 'State content generated', {
        contentLength: stateContent.length
      });

      // Clean up temp file
      if (existsSync(tempPromptFile)) {
        execSync(`rm "${tempPromptFile}"`);
      }

      // Write state file
      writeFileSync(stateFile, stateContent, 'utf-8');

      console.error(`✅ State saved: state-${timestamp}.md`);
      debugLog('PreCompact', 'State file written successfully');

      await sendDirectVoiceNotification(`Sir, ${projectName} state preserved before compaction`);

    } catch (error: any) {
      console.error('❌ Failed to generate state:', error);
      debugLog('PreCompact', 'State generation failed', {
        error: String(error),
        stderr: error.stderr?.toString(),
        stdout: error.stdout?.toString()
      });
      await sendDirectVoiceNotification("Sir, state save encountered an error");
    }

    debugLog('PreCompact', 'Hook completed successfully');
    process.exit(0);

  } catch (error) {
    console.error('💥 Momentum PreCompact error:', error);
    debugLog('PreCompact', 'Hook error', { error: String(error) });
    await sendDirectVoiceNotification("Sir, compaction error encountered");
    process.exit(0);
  }
}

main();
