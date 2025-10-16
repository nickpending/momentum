#!/usr/bin/env bun
/**
 * Momentum Dynamic Context Hook
 * Outputs routing instructions for Claude to interpret
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { debugLog, debugLogSeparator } from './shared/debug-log.ts';

interface HookInput {
  session_id: string;
  prompt: string;
  transcript_path?: string;
  hook_event_name: string;
}

async function readStdinWithTimeout(timeout: number = 5000): Promise<string> {
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

async function main() {
  try {
    debugLogSeparator();
    debugLog('UserPromptSubmit', 'Hook triggered');

    const input = await readStdinWithTimeout();
    const data: HookInput = JSON.parse(input);

    debugLog('UserPromptSubmit', 'Input received', {
      session_id: data.session_id,
      prompt: data.prompt.substring(0, 100),
      cwd: process.cwd()
    });

    // Get project name from current directory
    const cwd = process.cwd();
    const projectName = cwd.split('/').pop() || 'unknown';

    // Use session-specific mode file in /tmp
    const sessionId = data.session_id || 'default';
    const modeFile = `/tmp/momentum-mode-${sessionId}`;
    let mode = 'assistant'; // Default to assistant mode for new sessions
    let routingLoaded = false;

    if (existsSync(modeFile)) {
      const modeFileContent = readFileSync(modeFile, 'utf-8').trim().split('\n');
      mode = modeFileContent[0] || 'assistant';
      // Check if routing loaded for THIS specific mode (search entire file)
      routingLoaded = modeFileContent.includes(`${mode}-routing-loaded`);
      debugLog('UserPromptSubmit', 'Mode file found', {
        mode,
        routingLoaded,
        modeFileContent
      });
    } else {
      // Create mode file for new session
      require('fs').writeFileSync(modeFile, 'assistant');
      debugLog('UserPromptSubmit', 'Mode file created', { mode: 'assistant' });
    }

    // Determine which routing to load based on mode
    let contextsPath: string;
    let routingPath: string;
    const momentumConfig = process.env.MOMENTUM_HOME || `${process.env.HOME}/.config/momentum`;

    debugLog('UserPromptSubmit', 'Determining routing path', { mode, momentumConfig });

    if (mode === 'assistant' || mode === 'portfolio') {
      // Assistant or Portfolio mode - use global routing files
      contextsPath = join(momentumConfig, 'contexts');
      routingPath = join(contextsPath, mode === 'assistant' ? 'ASSISTANT_ROUTING.md' : 'PORTFOLIO_ROUTING.md');
      debugLog('UserPromptSubmit', 'Using global routing', { contextsPath, routingPath });
    } else {
      // Project mode - use project or global routing
      contextsPath = join(cwd, '.workflow', 'contexts');
      routingPath = join(contextsPath, 'PROJECT_ROUTING.md');

      // If no project contexts, use global momentum contexts
      if (!existsSync(routingPath)) {
        debugLog('UserPromptSubmit', 'Project routing not found, using global');
        contextsPath = join(momentumConfig, 'contexts');
        routingPath = join(contextsPath, 'PROJECT_ROUTING.md');
      }
      debugLog('UserPromptSubmit', 'Using project routing', { contextsPath, routingPath });
    }

    if (!existsSync(routingPath)) {
      debugLog('UserPromptSubmit', 'No routing file found, exiting', { routingPath });
      // No routing file found anywhere - silent fail
      process.exit(0);
    }

    debugLog('UserPromptSubmit', 'Reading routing file', { routingPath });
    let routingContent = readFileSync(routingPath, 'utf-8');

    // Get workflow paths from environment
    const workflowProjects = process.env.WORKFLOW_PROJECTS || `${process.env.HOME}/projects`;
    const workflowDev = process.env.WORKFLOW_DEV || `${process.env.HOME}/development/projects`;
    const momentumHomeDir = join(process.env.HOME!, '.local', 'share', 'momentum', 'home');

    // Check for Lore availability first (needed for placeholder replacement)
    const loreConfigPath = join(process.env.HOME!, '.config', 'lore', 'config');
    const loreAvailable = existsSync(loreConfigPath);

    debugLog('UserPromptSubmit', 'Replacing placeholders', {
      projectName,
      workflowProjects,
      workflowDev,
      momentumConfig,
      momentumHomeDir,
      contextsPath,
      modeFile,
      loreAvailable
    });

    // Replace placeholders with actual values
    routingContent = routingContent.replace(/PROJECT_NAME_PLACEHOLDER/g, projectName);
    routingContent = routingContent.replace(/WORKFLOW_PROJECTS_PLACEHOLDER/g, workflowProjects);
    routingContent = routingContent.replace(/WORKFLOW_DEV_PLACEHOLDER/g, workflowDev);
    routingContent = routingContent.replace(/MOMENTUM_CONFIG_PLACEHOLDER/g, momentumConfig);
    routingContent = routingContent.replace(/MOMENTUM_HOME_DIR_PLACEHOLDER/g, momentumHomeDir);
    routingContent = routingContent.replace(/MOMENTUM_CONTEXTS_PATH/g, contextsPath);
    routingContent = routingContent.replace(/MODEFILE_PLACEHOLDER/g, modeFile);
    routingContent = routingContent.replace(/LORE_AVAILABLE_PLACEHOLDER/g, String(loreAvailable));

    // Get current date in ISO format
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const currentDateTime = new Date().toISOString(); // Full ISO timestamp

    // Smart routing injection: full on first message, lightweight after
    if (routingLoaded) {
      debugLog('UserPromptSubmit', 'Routing already loaded, lightweight injection');
      // Lightweight metadata only - routing already loaded for this mode
      console.log('<!-- Routing loaded. Parse user intent semantically. -->');
    } else {
      debugLog('UserPromptSubmit', 'First routing load for this mode, full injection');
      // Full routing injection on first message or mode switch
      console.log(routingContent);

      // Mark routing as loaded for THIS specific mode (only if not already present)
      const currentContent = readFileSync(modeFile, 'utf-8');
      if (!currentContent.includes(`${mode}-routing-loaded`)) {
        const { appendFileSync } = require('fs');
        appendFileSync(modeFile, `\n${mode}-routing-loaded`);
        debugLog('UserPromptSubmit', 'Marked routing as loaded');
      } else {
        debugLog('UserPromptSubmit', 'Routing marker already present');
      }
    }

    // Always output metadata for context awareness
    console.log('\n<!-- HOOK: Momentum routing loaded -->');
    console.log(`<!-- CURRENT_DATE: ${currentDate} -->`);
    console.log(`<!-- CURRENT_DATETIME: ${currentDateTime} -->`);
    console.log(`<!-- MODEFILE: ${modeFile} -->`);
    console.log(`<!-- MODE: ${mode} -->`);
    console.log(`<!-- PROJECT: ${projectName} -->`);
    console.log(`<!-- LORE_AVAILABLE: ${loreAvailable} -->`);

    debugLog('UserPromptSubmit', 'Hook completed successfully');
    process.exit(0);
  } catch (error) {
    debugLog('UserPromptSubmit', 'Hook error', { error: String(error) });
    // Silent fail to not interrupt Claude
    process.exit(0);
  }
}

main();