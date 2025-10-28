#!/usr/bin/env bun
/**
 * Momentum SessionStart Hook
 * Production-ready development environment initialization with project management
 */

import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { debugLog, debugLogSeparator } from './shared/debug-log.ts';
import { loadConfig } from './shared/config-loader.ts';
import { loadVoiceStyle, loadVerbosityLevel, buildVoiceInstructions } from './shared/voice-loader.ts';

interface SessionStartInput {
  session_id: string;
  hook_event_name: string;
  matcher?: string;
}

interface SystemValidation {
  name: string;
  path: string;
  exists: boolean;
  required: boolean;
}

// Greetings removed - model handles naturally per design decision in task 2.1

async function validateMomentumSystems(): Promise<{ valid: boolean; issues: string[] }> {
  const config = loadConfig();
  const momentumConfig = config.momentum.install;

  const contextsPath = join(momentumConfig, 'contexts');
  const agentsPath = join(momentumConfig, 'agents');

  // Convention: modes are lowercase, routing files are {MODE}_ROUTING.md, agents are {MODE}.md
  const expectedModes = ['assistant', 'project'];

  // Scan for actual files
  const { readdirSync } = require('fs');
  const contextFiles = existsSync(contextsPath)
    ? readdirSync(contextsPath).filter((f: string) => f.endsWith('_ROUTING.md'))
    : [];
  const agentFiles = existsSync(agentsPath)
    ? readdirSync(agentsPath).filter((f: string) => f.endsWith('.md'))
    : [];

  // Check what's expected vs found
  const expectedRoutingFiles = expectedModes.map(m => `${m.toUpperCase()}_ROUTING.md`);
  const expectedAgentFiles = expectedModes.map(m => `${m.toUpperCase()}.md`);

  const missingRouting = expectedRoutingFiles.filter(f => !contextFiles.includes(f));
  const missingAgents = expectedAgentFiles.filter(f => !agentFiles.includes(f));

  const issues: string[] = [];

  // Report missing critical files
  if (missingRouting.length > 0) {
    issues.push(...missingRouting.map(f => `Missing routing file: ${f}`));
  }

  // Note: ASSISTANT.md loaded by alias, not required in agents/
  const criticalAgents = missingAgents.filter(f => f !== 'ASSISTANT.md');
  if (criticalAgents.length > 0) {
    issues.push(...criticalAgents.map(f => `Missing agent file: ${f}`));
  }

  const valid = issues.length === 0;

  // Output structured validation to model
  const validationReport = {
    status: valid ? 'ok' : 'degraded',
    modes: expectedModes,
    routing: {
      expected: expectedRoutingFiles,
      found: contextFiles,
      missing: missingRouting
    },
    agents: {
      expected: expectedAgentFiles,
      found: agentFiles,
      missing: missingAgents,
      note: 'ASSISTANT.md loaded by momentum alias, not required in agents/'
    }
  };

  if (!valid) {
    console.log('\n⚠️ MOMENTUM SYSTEM VALIDATION FAILED:');
    console.log(JSON.stringify(validationReport, null, 2));
    console.log('\nThe momentum system has missing files.');
    console.log('To fix: cd to momentum project directory and run ./install.sh\n');
  }

  // Diagnostic output to stderr
  console.error(valid ? '✅ Momentum systems validated' : '⚠️ Momentum validation issues detected');

  return { valid, issues };
}

// generateTimeBasedGreeting() removed - no longer needed

async function initializeSessionState(sessionId: string): Promise<string> {
  const modeFile = `/tmp/momentum-mode-${sessionId}`;

  let currentMode = 'assistant'; // Default for new sessions

  if (existsSync(modeFile)) {
    // Read only the first line (the mode), ignore routing markers
    currentMode = readFileSync(modeFile, 'utf-8').trim().split('\n')[0] || 'assistant';
    console.error(`📍 Session ${sessionId} restored to ${currentMode} mode`);
  } else {
    writeFileSync(modeFile, currentMode);
    console.error(`📍 Session ${sessionId} initialized in ${currentMode} mode`);
  }

  return currentMode;
}

function setTerminalTitle(mode: string, projectName?: string): void {
  let title: string;

  if (mode === 'assistant') {
    title = 'Momentum Assistant';
  } else {
    title = `${projectName} • Development Active`;
  }

  // Set terminal title using OSC escape sequence
  process.stderr.write(`\x1b]0;${title}\x07`);
  console.error(`📍 Terminal title set: ${title}`);
}

function loadVoiceInstructionsForMode(mode: 'assistant' | 'project'): string {
  try {
    const config = loadConfig();
    const momentumHome = config.momentum.install;

    // Load voice style
    const voiceStyle = loadVoiceStyle(config.voice.style, momentumHome);

    // Get verbosity level for this mode
    const verbosityLevel = config.voice.verbosity[mode] || 'normal';
    const verbosity = loadVerbosityLevel(verbosityLevel, momentumHome);

    // Build combined instructions
    const voiceInstructions = buildVoiceInstructions(voiceStyle, verbosity);

    debugLog('SessionStart', 'Voice instructions loaded', {
      mode,
      style: config.voice.style,
      verbosity: verbosityLevel
    });

    return voiceInstructions;
  } catch (error) {
    debugLog('SessionStart', 'Failed to load voice instructions', { error: String(error) });
    // Return empty string on error - voice instructions are optional
    return '';
  }
}

async function handleAssistantMode(sessionId: string, restoreCommand: string | null = null): Promise<void> {
  // Get current date
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const currentDateTime = new Date().toISOString();
  const config = loadConfig();
  const userName = config.personalization.name;

  // Output metadata only - ASSISTANT.md loaded via alias
  let additionalContext = `<!-- HOOK: Momentum SessionStart -->
<!-- CURRENT_DATE: ${currentDate} -->
<!-- CURRENT_DATETIME: ${currentDateTime} -->
<!-- SESSION_ID: ${sessionId} -->
<!-- MODE: assistant -->
<!-- NAME: ${userName} -->`;

  // Append restore command if present
  if (restoreCommand) {
    additionalContext += `\n\nRun the ${restoreCommand}`;
  }

  // Load and append voice instructions
  const voiceInstructions = loadVoiceInstructionsForMode('assistant');
  if (voiceInstructions) {
    additionalContext += `\n\n${voiceInstructions}`;
  }

  const output = {
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: additionalContext
    }
  };

  console.log(JSON.stringify(output));
  console.error('🚀 Momentum SessionStart initialized (Assistant mode)');

  // Set terminal title
  setTerminalTitle('assistant');
}

async function handleProjectMode(sessionId: string, projectName: string, restoreCommand: string | null = null): Promise<void> {
  // Get current date
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const currentDateTime = new Date().toISOString();
  const config = loadConfig();
  const userName = config.personalization.name;

  // Output metadata
  let additionalContext = `<!-- HOOK: Momentum SessionStart -->
<!-- CURRENT_DATE: ${currentDate} -->
<!-- CURRENT_DATETIME: ${currentDateTime} -->
<!-- SESSION_ID: ${sessionId} -->
<!-- MODE: project -->
<!-- PROJECT: ${projectName} -->
<!-- NAME: ${userName} -->`;

  // Append restore command if present
  if (restoreCommand) {
    additionalContext += `\n\nRun the ${restoreCommand}`;
  }

  // Load and append voice instructions
  const voiceInstructions = loadVoiceInstructionsForMode('project');
  if (voiceInstructions) {
    additionalContext += `\n\n${voiceInstructions}`;
  }

  const output = {
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: additionalContext
    }
  };

  console.log(JSON.stringify(output));
  console.error(`🚀 Momentum SessionStart initialized (Project mode: ${projectName})`);

  // Set terminal title with project name
  setTerminalTitle('project', projectName);
}

async function handleAutoRestore(sessionType: string, sessionId: string): Promise<string | null> {
  // Read modefile to determine current mode and project
  const modeFile = `/tmp/momentum-mode-${sessionId}`;

  if (!existsSync(modeFile)) {
    debugLog('SessionStart', 'No modefile found for auto-restore');
    return null; // No mode file yet
  }

  const modeLines = readFileSync(modeFile, 'utf-8').trim().split('\n');
  const mode = modeLines[0];

  // Only auto-restore in project mode
  if (mode !== 'project') {
    debugLog('SessionStart', `Mode is ${mode}, not project - skipping auto-restore`);
    return null;
  }

  // Check if project name exists on line 2
  const projectName = modeLines[1]?.trim();
  if (!projectName) {
    debugLog('SessionStart', 'Project mode but no project name in modefile');
    return null;
  }

  // Build project path
  const config = loadConfig();
  const workflowDev = config.paths.dev;
  const projectRoot = join(workflowDev, projectName);

  if (!existsSync(projectRoot)) {
    debugLog('SessionStart', `Project directory not found: ${projectRoot}`);
    return null;
  }

  const stateDir = join(projectRoot, '.workflow', 'state');

  if (!existsSync(stateDir)) {
    debugLog('SessionStart', `No state directory: ${stateDir}`);
    return null; // No state directory
  }

  // Both "clear" and "compact" use the same logic: restore from latest state file
  const fs = require('fs');
  const stateFiles = fs.readdirSync(stateDir)
    .filter((f: string) => f.startsWith('state-') && f.endsWith('.md'))
    .sort()
    .reverse();

  if (stateFiles.length > 0) {
    const latestState = stateFiles[0].replace('.md', '');
    const reason = sessionType === 'compact' ? 'after compaction' : 'from saved state';

    console.error(`✅ Auto-restore ${reason}: ${latestState}`);
    debugLog('SessionStart', `Auto-restore triggered: ${latestState}`, { sessionType, projectName });

    return `/restore-state ${latestState}`;
  }

  debugLog('SessionStart', 'No state files found in state directory');
  return null;
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

async function readStdinWithTimeout(timeout: number = 3000): Promise<string> {
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
      resolve('{}'); // Fallback on error
    });
  });
}

async function main(): Promise<void> {
  try {
    debugLogSeparator();
    debugLog('SessionStart', 'Hook triggered');

    // Read hook input with timeout protection
    const input = await readStdinWithTimeout();
    const data: SessionStartInput = JSON.parse(input);

    debugLog('SessionStart', 'Input received', {
      session_id: data.session_id,
      hook_event_name: data.hook_event_name,
      matcher: data.matcher,
      cwd: process.cwd()
    });

    // System validation first
    const { valid, issues } = await validateMomentumSystems();

    if (!valid) {
      debugLog('SessionStart', 'Validation failed', { issues });
      for (const issue of issues) {
        console.error(issue);
      }
      console.error('⚠️ MOMENTUM SYSTEM VALIDATION FAILED');
    } else {
      debugLog('SessionStart', 'Validation passed');
    }

    // Check for auto-restore based on session type (passed as command argument)
    const sessionType = process.argv[2] || 'startup';
    debugLog('SessionStart', `Session type: "${sessionType}"`);

    // Check for auto-restore (don't exit early - pass command to mode handlers)
    let restoreCommand: string | null = null;
    if (sessionType === 'clear' || sessionType === 'compact') {
      debugLog('SessionStart', `Session type ${sessionType} detected, checking for auto-restore`);
      restoreCommand = await handleAutoRestore(sessionType, data.session_id);
      if (restoreCommand) {
        debugLog('SessionStart', `Auto-restore will be passed to mode handler: ${restoreCommand}`);
      } else {
        debugLog('SessionStart', 'Auto-restore conditions not met');
      }
    } else {
      debugLog('SessionStart', `Session type ${sessionType}, skipping auto-restore`);
    }

    // Initialize session state
    debugLog('SessionStart', `Initializing session state for ${data.session_id}`);
    const currentMode = await initializeSessionState(data.session_id);
    debugLog('SessionStart', `Session mode: ${currentMode}`);

    // Determine project context
    const cwd = process.cwd();
    const projectName = cwd.split('/').pop() || 'unknown';

    debugLog('SessionStart', 'Project context', {
      cwd,
      projectName,
      currentMode
    });

    // Mode-specific initialization with optional restore command
    if (currentMode === 'assistant') {
      debugLog('SessionStart', 'Handling assistant mode');
      await handleAssistantMode(data.session_id, restoreCommand);
    } else if (currentMode === 'project') {
      debugLog('SessionStart', 'Handling project mode');
      await handleProjectMode(data.session_id, projectName, restoreCommand);
    } else {
      // Default to assistant for unknown modes
      debugLog('SessionStart', `Unknown mode "${currentMode}", defaulting to assistant`);
      await handleAssistantMode(data.session_id, restoreCommand);
    }

    // Log completion
    console.error('🚀 Momentum SessionStart completed successfully');
    debugLog('SessionStart', 'Hook completed successfully');

    process.exit(0);
  } catch (error) {
    console.error('💥 Momentum SessionStart error:', error);
    debugLog('SessionStart', 'Hook error', { error: String(error) });

    // Fallback voice notification on error
    console.log('clarvis:[context:assistant intent:error]');
    console.log('Momentum initialization encountered an error. Check system configuration.');

    // Exit cleanly to not block Claude
    process.exit(0);
  }
}

main();