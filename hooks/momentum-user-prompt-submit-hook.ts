#!/usr/bin/env bun
/**
 * Momentum Dynamic Context Hook
 * Outputs routing instructions for Claude to interpret
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { debugLog, debugLogSeparator } from './shared/debug-log.ts';
import { loadConfig } from './shared/config-loader.ts';
import { loadVoiceStyle, loadVerbosityLevel, buildVoiceInstructions } from './shared/voice-loader.ts';

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

    if (existsSync(modeFile)) {
      const modeFileContent = readFileSync(modeFile, 'utf-8').trim().split('\n');
      mode = modeFileContent[0] || 'assistant';
      debugLog('UserPromptSubmit', 'Mode file found', { mode });
    } else {
      // Create mode file for new session
      require('fs').writeFileSync(modeFile, 'assistant');
      debugLog('UserPromptSubmit', 'Mode file created', { mode: 'assistant' });
    }

    // Determine which routing to load based on mode
    let contextsPath: string;
    let routingPath: string;
    const config = loadConfig();
    const momentumConfig = config.momentum.install;

    debugLog('UserPromptSubmit', 'Determining routing path', { mode, momentumConfig });

    if (mode === 'assistant') {
      contextsPath = join(momentumConfig, 'contexts');
      routingPath = join(contextsPath, 'ASSISTANT_ROUTING.md');
      debugLog('UserPromptSubmit', 'Using assistant routing', { contextsPath, routingPath });
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

    // Get workflow paths from config
    const workflowProjects = config.paths.projects;
    const workflowDev = config.paths.dev;
    const momentumHomeDir = config.momentum.workspace;

    // Check for Lore availability first (needed for placeholder replacement)
    const loreConfigPath = join(config.lore.config, 'config');
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

    // Check for .gitignore in project mode
    let gitignoreWarning = '';
    if (mode === 'project') {
      const gitignorePath = join(cwd, '.gitignore');
      if (!existsSync(gitignorePath)) {
        gitignoreWarning = '\n\n**⚠️ GITIGNORE MISSING**: This project has no .gitignore file. Run the gitignore skill immediately to protect against committing sensitive data.\n';
        debugLog('UserPromptSubmit', 'Gitignore check failed', { gitignorePath });
      } else {
        debugLog('UserPromptSubmit', 'Gitignore check passed', { gitignorePath });
      }
    }

    // Always inject full routing for consistent semantic intent matching
    debugLog('UserPromptSubmit', 'Full routing injection');
    console.log(routingContent);

    // Inject gitignore warning if needed
    if (gitignoreWarning) {
      console.log(gitignoreWarning);
    }

    // Load and inject voice instructions
    try {
      const momentumHome = config.momentum.install;
      const voiceStyle = loadVoiceStyle(config.voice.style, momentumHome);
      const verbosityLevel = config.voice.verbosity[mode as 'assistant' | 'project'] || 'normal';
      const verbosity = loadVerbosityLevel(verbosityLevel, momentumHome);
      const voiceInstructions = buildVoiceInstructions(voiceStyle, verbosity);

      console.log(`\n${voiceInstructions}`);
      debugLog('UserPromptSubmit', 'Voice instructions injected', { mode, style: config.voice.style, verbosity: verbosityLevel });
    } catch (error) {
      debugLog('UserPromptSubmit', 'Failed to load voice instructions', { error: String(error) });
      // Continue without voice instructions - they're optional
    }

    // Calculate project-specific paths
    const projectRoot = cwd;
    const workflowDir = join(projectRoot, '.workflow');
    const artifactsDir = join(workflowDir, 'artifacts');
    const stateDir = join(workflowDir, 'state');
    const projectObsidianDir = join(workflowProjects, projectName);
    const explorationsDir = join(projectObsidianDir, 'explorations');

    // Lore paths from config if available
    const loreConfig = loreAvailable ? config.lore.config : null;
    const loreData = loreAvailable ? config.lore.data : null;
    const loreCache = loreAvailable ? config.lore.cache : null;

    // Get user name from config
    const userName = config.personalization.name;

    // Always output metadata and paths for context awareness
    console.log('\n<!-- HOOK: Momentum routing loaded -->');
    console.log(`<!-- CURRENT_DATE: ${currentDate} -->`);
    console.log(`<!-- CURRENT_DATETIME: ${currentDateTime} -->`);
    console.log(`<!-- SESSION_ID: ${sessionId} -->`);
    console.log(`<!-- MODE: ${mode} -->`);
    console.log(`<!-- PROJECT: ${projectName} -->`);
    console.log(`<!-- NAME: ${userName} -->`);
    console.log('');
    console.log('<!-- PATH VARIABLES -->');
    console.log(`<!-- PROJECT_ROOT: ${projectRoot} -->`);
    console.log(`<!-- WORKFLOW_DIR: ${workflowDir} -->`);
    console.log(`<!-- ARTIFACTS_DIR: ${artifactsDir} -->`);
    console.log(`<!-- STATE_DIR: ${stateDir} -->`);
    console.log(`<!-- CONTEXTS_PATH: ${contextsPath} -->`);
    console.log(`<!-- MOMENTUM_CONFIG: ${momentumConfig} -->`);
    console.log(`<!-- MOMENTUM_HOME_DIR: ${momentumHomeDir} -->`);
    console.log(`<!-- WORKFLOW_PROJECTS: ${workflowProjects} -->`);
    console.log(`<!-- WORKFLOW_DEV: ${workflowDev} -->`);
    console.log(`<!-- PROJECT_OBSIDIAN_DIR: ${projectObsidianDir} -->`);
    console.log(`<!-- EXPLORATIONS_DIR: ${explorationsDir} -->`);
    console.log(`<!-- MODEFILE: ${modeFile} -->`);
    if (loreAvailable) {
      console.log(`<!-- LORE_CONFIG: ${loreConfig} -->`);
      console.log(`<!-- LORE_DATA: ${loreData} -->`);
      console.log(`<!-- LORE_CACHE: ${loreCache} -->`);
    }
    console.log('');
    console.log('<!-- CAPABILITIES -->');
    console.log(`<!-- LORE_AVAILABLE: ${loreAvailable} -->`);
    console.log(`<!-- SETUPD_AVAILABLE: true -->`);

    debugLog('UserPromptSubmit', 'Hook completed successfully');
    process.exit(0);
  } catch (error) {
    debugLog('UserPromptSubmit', 'Hook error', { error: String(error) });
    // Silent fail to not interrupt Claude
    process.exit(0);
  }
}

main();