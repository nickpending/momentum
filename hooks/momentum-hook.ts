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
    
    // Try project contexts first, fallback to global
    let contextsPath = join(cwd, '.workflow', 'contexts');
    let routingPath = join(contextsPath, 'ROUTING.md');

    // If no project contexts, use global momentum contexts
    if (!existsSync(routingPath)) {
      contextsPath = join(process.env.HOME!, '.config', 'momentum', 'contexts');
      routingPath = join(contextsPath, 'ROUTING.md');

      if (!existsSync(routingPath)) {
        // No routing file found anywhere - silent fail
        process.exit(0);
      }
    }

    let routingContent = readFileSync(routingPath, 'utf-8');

    // Get workflow projects path from environment
    const workflowProjects = process.env.WORKFLOW_PROJECTS || `${process.env.HOME}/projects`;

    // Replace placeholders with actual values
    routingContent = routingContent.replace(/PROJECT_NAME_PLACEHOLDER/g, projectName);
    routingContent = routingContent.replace(/WORKFLOW_PROJECTS_PLACEHOLDER/g, workflowProjects);
    routingContent = routingContent.replace(/MOMENTUM_CONTEXTS_PATH/g, contextsPath);
    
    // Output the entire routing for Claude to interpret
    console.log(routingContent);
    
    // Add metadata for debugging
    console.log('\n<!-- HOOK: Momentum routing loaded -->');
    console.log(`<!-- PROJECT: ${projectName} -->`);
    console.log(`<!-- USER_PROMPT: ${data.prompt} -->`);
    
    process.exit(0);
  } catch (error) {
    // Silent fail to not interrupt Claude
    process.exit(0);
  }
}

main();