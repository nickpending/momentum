#!/usr/bin/env bun
/**
 * Momentum SessionStart Hook
 * Production-ready development environment initialization with portfolio management
 */

import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { sendDirectVoiceNotification } from './shared/voice-utils.ts';

interface SessionStartInput {
  session_id: string;
  hook_event_name: string;
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

const DEVELOPMENT_GREETINGS: TimeBasedGreetings = {
  early: [
    "Early development session. What shall we build?",
    "Systems online. Ready to ship code.",
    "Development environment ready. What's the priority?",
    "Early start today. What needs attention?",
    "Morning deployment window. What's the focus?"
  ],
  morning: [
    "Development systems online. What shall we work on?",
    "Ready to ship. Which project needs attention?",
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

  const validations: SystemValidation[] = [
    {
      name: 'MOMENTUM_ROUTING.md',
      path: join(momentumConfig, 'contexts', 'MOMENTUM_ROUTING.md'),
      exists: false,
      required: true
    },
    {
      name: 'HOME_ROUTING.md',
      path: join(momentumConfig, 'contexts', 'HOME_ROUTING.md'),
      exists: false,
      required: true
    },
    {
      name: 'ASSISTANT.md',
      path: join(momentumConfig, 'agents', 'ASSISTANT.md'),
      exists: false,
      required: false
    }
  ];

  // Check file existence
  for (const validation of validations) {
    validation.exists = existsSync(validation.path);
  }

  // Identify issues
  const issues: string[] = [];
  for (const validation of validations) {
    if (validation.required && !validation.exists) {
      issues.push(`❌ Missing required file: ${validation.name}`);
    } else if (validation.exists) {
      console.error(`✅ Found: ${validation.name}`);
    }
  }

  const valid = issues.length === 0;
  if (valid) {
    console.error('✅ Momentum systems validated');
  }

  return { valid, issues };
}

function generateTimeBasedGreeting(): string {
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

  const options = DEVELOPMENT_GREETINGS[timeSlot];
  return options[Math.floor(Math.random() * options.length)];
}

async function initializeSessionState(sessionId: string): Promise<string> {
  const modeFile = `/tmp/momentum-mode-${sessionId}`;

  let currentMode = 'home'; // Default for new sessions

  if (existsSync(modeFile)) {
    currentMode = readFileSync(modeFile, 'utf-8').trim();
    console.error(`📍 Session ${sessionId} restored to ${currentMode} mode`);
  } else {
    writeFileSync(modeFile, currentMode);
    console.error(`📍 Session ${sessionId} initialized in ${currentMode} mode`);
  }

  return currentMode;
}

function setTerminalTitle(mode: string, projectName?: string): void {
  let title: string;

  if (mode === 'home') {
    title = 'Momentum Home • Development Portfolio';
  } else {
    title = `${projectName} • Development Active`;
  }

  // Set terminal title using OSC escape sequence
  process.stderr.write(`\x1b]0;${title}\x07`);
  console.error(`📍 Terminal title set: ${title}`);
}

async function handleHomeMode(sessionId: string): Promise<void> {
  const homeDir = process.env.HOME!;
  const momentumConfig = process.env.MOMENTUM_HOME || join(homeDir, '.config', 'momentum');
  const assistantPath = join(momentumConfig, 'agents', 'ASSISTANT.md');

  // Get current date
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const currentDateTime = new Date().toISOString();

  // Output metadata only - ASSISTANT.md loaded via alias
  const additionalContext = `<!-- HOOK: Momentum SessionStart -->
<!-- CURRENT_DATE: ${currentDate} -->
<!-- CURRENT_DATETIME: ${currentDateTime} -->
<!-- SESSION_ID: ${sessionId} -->
<!-- MODE: home -->`;

  const output = {
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: additionalContext
    }
  };

  console.log(JSON.stringify(output));
  console.error('🚀 Momentum SessionStart initialized');

  // Set terminal title
  setTerminalTitle('home');

  // Send ambient voice notification
  const greeting = generateTimeBasedGreeting();
  await sendDirectVoiceNotification(greeting);
}

async function handleProjectMode(projectName: string): Promise<void> {
  // Set terminal title with project name
  setTerminalTitle('project', projectName);

  // This shouldn't happen during session start - we're always in home mode initially
  console.error('⚠️ Unexpected project mode during session start');
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
    // Read hook input with timeout protection
    const input = await readStdinWithTimeout();
    const data: SessionStartInput = JSON.parse(input);

    // System validation first
    const { valid, issues } = await validateMomentumSystems();

    if (!valid) {
      for (const issue of issues) {
        console.error(issue);
      }
      console.error('⚠️ MOMENTUM SYSTEM VALIDATION FAILED');
    }

    // Initialize session state
    const currentMode = await initializeSessionState(data.session_id);

    // Determine project context
    const cwd = process.cwd();
    const projectName = cwd.split('/').pop() || 'unknown';
    const isHomeMode = currentMode === 'home' || cwd.includes('.local/share/momentum/home');

    // Mode-specific initialization
    if (isHomeMode) {
      await handleHomeMode(data.session_id);
    } else {
      await handleProjectMode(projectName);
    }

    // Log completion
    console.error('🚀 Momentum SessionStart completed successfully');

    process.exit(0);
  } catch (error) {
    console.error('💥 Momentum SessionStart error:', error);

    // Fallback voice notification on error
    console.log('clarvis:[context:assistant intent:error]');
    console.log('Momentum initialization encountered an error. Check system configuration.');

    // Exit cleanly to not block Claude
    process.exit(0);
  }
}

main();