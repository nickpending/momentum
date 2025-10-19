#!/usr/bin/env bun
/**
 * Momentum SessionStart Hook
 * Production-ready development environment initialization with portfolio management
 */

import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { sendDirectVoiceNotification } from './shared/voice-utils.ts';
import { debugLog, debugLogSeparator } from './shared/debug-log.ts';

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

interface TimeBasedGreetings {
  early: string[];    // 5-8 AM
  morning: string[];  // 9-11 AM
  midday: string[];   // 12-17 PM
  evening: string[];  // 18-22 PM
  late: string[];     // 23-4 AM
}

const ASSISTANT_GREETINGS: TimeBasedGreetings = {
  early: [
    "Early start. Which project would you like to work on?",
    "Assistant ready. What needs attention today?",
    "Good morning. What shall we focus on?",
    "Early session active. Where should we begin?",
    "Morning. What's the priority?"
  ],
  morning: [
    "Assistant mode active. Which project needs work?",
    "Good morning. What would you like to tackle?",
    "Ready to help. What's on the agenda?",
    "Morning. Where shall we start?",
    "Welcome back. What needs attention?",
    "At your service. Which project?",
    "Standing by. What's the focus?"
  ],
  midday: [
    "Assistant ready. What would you like to work on?",
    "At your service. Which project?",
    "Standing by. What's the priority?",
    "Ready when you are. What's next?",
    "What can I help with?",
    "Which project needs attention?",
    "What shall we tackle?"
  ],
  evening: [
    "Evening session. What would you like to work on?",
    "Good evening. Which project?",
    "Evening mode active. What's the focus?",
    "Ready for evening work. What's the plan?",
    "What needs attention tonight?"
  ],
  late: [
    "Working late? What needs attention?",
    "Late session active. Which project?",
    "Evening work mode. What's urgent?",
    "What requires focus?"
  ]
};

const PORTFOLIO_GREETINGS: TimeBasedGreetings = {
  early: [
    "Early portfolio review. What needs attention?",
    "Morning. Which projects should we examine?",
    "Portfolio view active. What's the priority?",
    "Early start. Let's review your work."
  ],
  morning: [
    "Portfolio mode active. What shall we review?",
    "Good morning. Let's examine your projects.",
    "Portfolio view ready. What needs analysis?",
    "Morning. What would you like to explore?"
  ],
  midday: [
    "Portfolio view active. What shall we examine?",
    "Ready to review projects. What's the focus?",
    "Multi-project view loaded. Where to start?",
    "Portfolio ready. What needs attention?"
  ],
  evening: [
    "Evening portfolio review. What shall we examine?",
    "Good evening. Let's review your work.",
    "Portfolio mode active. What's the priority?",
    "Evening session. Which projects need focus?"
  ],
  late: [
    "Late portfolio review. What needs attention?",
    "Evening work. What shall we examine?",
    "Portfolio view active. What's urgent?"
  ]
};

const PROJECT_GREETINGS: TimeBasedGreetings = {
  early: [
    "Early development session. What shall we build?",
    "Systems online. Ready to ship code.",
    "Development environment ready. What's the priority?",
    "Early start today. What needs attention?",
    "Morning deployment window. What's the focus?"
  ],
  morning: [
    "Development systems online. What shall we work on?",
    "Ready to ship. Let's build something.",
    "Good morning. What's on the agenda?",
    "Development environment ready. What's the priority?",
    "Morning. Where shall we begin?",
    "Welcome back. What needs work?",
    "Good to see you. What shall we tackle?",
    "Systems operational. Ready to build.",
    "Morning deployment ready. What's first?",
    "Development mode active. What's next?"
  ],
  midday: [
    "Development environment active. What would you like to tackle?",
    "Ready to ship. What's the next feature?",
    "Systems operational. What needs development?",
    "Momentum loaded. What shall we build?",
    "Development ready. What's the priority?",
    "Afternoon build session. What's the focus?",
    "Ready when you are. What's next?",
    "At your service. Where do we start?",
    "Standing by. What needs work?",
    "Development systems ready. What's urgent?"
  ],
  evening: [
    "Evening development session. What shall we focus on?",
    "Systems ready for evening work. What's the plan?",
    "Development environment active. What needs shipping?",
    "Ready for evening deployment. What's urgent?",
    "Good evening. What shall we work on?",
    "Evening build window. What's the priority?",
    "Ready to continue. What's next?",
    "At your disposal. What needs attention?",
    "Evening session active. What's the goal?",
    "Development ready. What shall we tackle?"
  ],
  late: [
    "Late development session. What requires attention?",
    "Working late? What's urgent?",
    "Late session active. What needs shipping?",
    "Evening work mode. What's the priority?",
    "Late deployment window. What's critical?"
  ]
};

async function validateMomentumSystems(): Promise<{ valid: boolean; issues: string[] }> {
  const homeDir = process.env.HOME!;
  const momentumConfig = process.env.MOMENTUM_HOME || join(homeDir, '.config', 'momentum');

  const contextsPath = join(momentumConfig, 'contexts');
  const agentsPath = join(momentumConfig, 'agents');

  // Convention: modes are lowercase, routing files are {MODE}_ROUTING.md, agents are {MODE}.md
  const expectedModes = ['assistant', 'portfolio', 'project'];

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

function generateTimeBasedGreeting(greetings: TimeBasedGreetings): string {
  const hour = new Date().getHours();

  let timeSlot: keyof TimeBasedGreetings;
  if (hour >= 5 && hour <= 8) {
    timeSlot = 'early';
  } else if (hour >= 9 && hour <= 11) {
    timeSlot = 'morning';
  } else if (hour >= 12 && hour <= 17) {
    timeSlot = 'midday';
  } else if (hour >= 18 && hour <= 22) {
    timeSlot = 'evening';
  } else {
    timeSlot = 'late';
  }

  const options = greetings[timeSlot];
  return options[Math.floor(Math.random() * options.length)];
}

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
    title = 'Momentum Assistant • Development Portfolio';
  } else if (mode === 'portfolio') {
    title = 'Momentum Portfolio • Multi-Project View';
  } else {
    title = `${projectName} • Development Active`;
  }

  // Set terminal title using OSC escape sequence
  process.stderr.write(`\x1b]0;${title}\x07`);
  console.error(`📍 Terminal title set: ${title}`);
}

async function handleAssistantMode(sessionId: string, restoreCommand: string | null = null): Promise<void> {
  // Get current date
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const currentDateTime = new Date().toISOString();

  // Output metadata only - ASSISTANT.md loaded via alias
  let additionalContext = `<!-- HOOK: Momentum SessionStart -->
<!-- CURRENT_DATE: ${currentDate} -->
<!-- CURRENT_DATETIME: ${currentDateTime} -->
<!-- SESSION_ID: ${sessionId} -->
<!-- MODE: assistant -->`;

  // Append restore command if present
  if (restoreCommand) {
    additionalContext += `\n\nRun the ${restoreCommand}`;
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

  // Send ambient voice notification
  const greeting = generateTimeBasedGreeting(ASSISTANT_GREETINGS);
  await sendDirectVoiceNotification(greeting);
}

async function handlePortfolioMode(sessionId: string, restoreCommand: string | null = null): Promise<void> {
  // Get current date
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const currentDateTime = new Date().toISOString();

  // Output metadata
  let additionalContext = `<!-- HOOK: Momentum SessionStart -->
<!-- CURRENT_DATE: ${currentDate} -->
<!-- CURRENT_DATETIME: ${currentDateTime} -->
<!-- SESSION_ID: ${sessionId} -->
<!-- MODE: portfolio -->`;

  // Append restore command if present
  if (restoreCommand) {
    additionalContext += `\n\nRun the ${restoreCommand}`;
  }

  const output = {
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: additionalContext
    }
  };

  console.log(JSON.stringify(output));
  console.error('🚀 Momentum SessionStart initialized (Portfolio mode)');

  // Set terminal title
  setTerminalTitle('portfolio');

  // Send ambient voice notification
  const greeting = generateTimeBasedGreeting(PORTFOLIO_GREETINGS);
  await sendDirectVoiceNotification(greeting);
}

async function handleProjectMode(sessionId: string, projectName: string, restoreCommand: string | null = null): Promise<void> {
  // Get current date
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const currentDateTime = new Date().toISOString();

  // Output metadata
  let additionalContext = `<!-- HOOK: Momentum SessionStart -->
<!-- CURRENT_DATE: ${currentDate} -->
<!-- CURRENT_DATETIME: ${currentDateTime} -->
<!-- SESSION_ID: ${sessionId} -->
<!-- MODE: project -->
<!-- PROJECT: ${projectName} -->`;

  // Append restore command if present
  if (restoreCommand) {
    additionalContext += `\n\nRun the ${restoreCommand}`;
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

  // Send ambient voice notification
  const greeting = generateTimeBasedGreeting(PROJECT_GREETINGS);
  await sendDirectVoiceNotification(greeting);
}

async function handleAutoRestore(sessionType: string): Promise<string | null> {
  const projectRoot = findProjectRoot();

  if (!projectRoot) {
    return null; // Not in a project
  }

  const stateDir = join(projectRoot, '.workflow', 'state');

  if (!existsSync(stateDir)) {
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
    debugLog('SessionStart', `Auto-restore triggered: ${latestState}`, { sessionType });

    return `/restore-state ${latestState}`;
  }

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
      restoreCommand = await handleAutoRestore(sessionType);
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
    } else if (currentMode === 'portfolio') {
      debugLog('SessionStart', 'Handling portfolio mode');
      await handlePortfolioMode(data.session_id, restoreCommand);
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