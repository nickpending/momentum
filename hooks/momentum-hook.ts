#!/usr/bin/env bun
/**
 * Momentum Dynamic Context Hook
 * Outputs routing instructions for Claude to interpret
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

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
    const input = await readStdinWithTimeout();
    const data: HookInput = JSON.parse(input);

    // Get project name from current directory
    const cwd = process.cwd();
    const projectName = cwd.split('/').pop() || 'unknown';

    // Use session-specific mode file in /tmp
    const sessionId = data.session_id || 'default';
    const modeFile = `/tmp/momentum-mode-${sessionId}`;
    let mode = 'home'; // Default to home mode for new sessions

    if (existsSync(modeFile)) {
      mode = readFileSync(modeFile, 'utf-8').trim();
    } else {
      // Create mode file for new session
      require('fs').writeFileSync(modeFile, 'home');
    }

    // Determine which routing to load based on mode (NEW)
    let contextsPath: string;
    let routingPath: string;

    if (mode === 'home') {
      // Home mode - use home routing
      contextsPath = join(process.env.HOME!, '.config', 'momentum', 'contexts');
      routingPath = join(contextsPath, 'HOME_ROUTING.md');

      // If home routing doesn't exist, fall back to regular routing
      if (!existsSync(routingPath)) {
        routingPath = join(contextsPath, 'MOMENTUM_ROUTING.md');
      }
    } else {
      // Project mode - use project or global routing (existing logic)
      contextsPath = join(cwd, '.workflow', 'contexts');
      routingPath = join(contextsPath, 'MOMENTUM_ROUTING.md');

      // If no project contexts, use global momentum contexts
      if (!existsSync(routingPath)) {
        contextsPath = join(process.env.HOME!, '.config', 'momentum', 'contexts');
        routingPath = join(contextsPath, 'MOMENTUM_ROUTING.md');
      }
    }

    if (!existsSync(routingPath)) {
      // No routing file found anywhere - silent fail
      process.exit(0);
    }

    let routingContent = readFileSync(routingPath, 'utf-8');

    // Get workflow paths from environment
    const workflowProjects = process.env.WORKFLOW_PROJECTS || `${process.env.HOME}/projects`;
    const workflowDev = process.env.WORKFLOW_DEV || `${process.env.HOME}/development/projects`;
    const momentumConfig = process.env.MOMENTUM_HOME || `${process.env.HOME}/.config/momentum`;
    const momentumHomeDir = join(process.env.HOME!, '.local', 'share', 'momentum', 'home');

    // Replace placeholders with actual values
    routingContent = routingContent.replace(/PROJECT_NAME_PLACEHOLDER/g, projectName);
    routingContent = routingContent.replace(/WORKFLOW_PROJECTS_PLACEHOLDER/g, workflowProjects);
    routingContent = routingContent.replace(/WORKFLOW_DEV_PLACEHOLDER/g, workflowDev);
    routingContent = routingContent.replace(/MOMENTUM_CONFIG_PLACEHOLDER/g, momentumConfig);
    routingContent = routingContent.replace(/MOMENTUM_HOME_DIR_PLACEHOLDER/g, momentumHomeDir);
    routingContent = routingContent.replace(/MOMENTUM_CONTEXTS_PATH/g, contextsPath);
    routingContent = routingContent.replace(/MODEFILE_PLACEHOLDER/g, modeFile);
    
    // Output the entire routing for Claude to interpret
    console.log(routingContent);
    
    // Add metadata for debugging and inject MODEFILE variable
    console.log('\n<!-- HOOK: Momentum routing loaded -->');
    console.log(`<!-- MODEFILE: ${modeFile} -->`);
    console.log(`<!-- MODE: ${mode} -->`);
    console.log(`<!-- PROJECT: ${projectName} -->`);
    console.log(`<!-- USER_PROMPT: ${data.prompt} -->`);

    process.exit(0);
  } catch (error) {
    // Silent fail to not interrupt Claude
    process.exit(0);
  }
}

main();