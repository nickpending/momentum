#!/usr/bin/env bun

/**
 * Quick test of voice loading system
 * Run: bun test-voice-loader.ts
 */

import { loadVoiceStyle, loadVerbosityLevel, buildVoiceInstructions } from './hooks/shared/voice-loader';
import { join } from 'path';

// Test from project directory (before installation)
const PROJECT_ROOT = import.meta.dir;
const MOMENTUM_INSTALL = PROJECT_ROOT; // voices/ is in project root

console.log('=== Voice Loader Test ===\n');

// Test 1: Load JARVIS style
console.log('Test 1: Loading JARVIS voice style...');
try {
  const jarvis = loadVoiceStyle('jarvis', MOMENTUM_INSTALL);
  console.log('✅ JARVIS loaded');
  console.log('  Name:', jarvis.name);
  console.log('  Prompt length:', jarvis.personality.prompt.length, 'chars');
} catch (error) {
  console.log('❌ Failed:', error);
}

// Test 2: Load terse verbosity
console.log('\nTest 2: Loading terse verbosity...');
try {
  const terse = loadVerbosityLevel('terse', MOMENTUM_INSTALL);
  console.log('✅ Terse loaded');
  console.log('  Name:', terse.name);
  console.log('  Prompt length:', terse.instructions.prompt.length, 'chars');
} catch (error) {
  console.log('❌ Failed:', error);
}

// Test 3: Build complete voice instructions
console.log('\nTest 3: Building voice instructions (jarvis + terse)...');
try {
  const jarvis = loadVoiceStyle('jarvis', MOMENTUM_INSTALL);
  const terse = loadVerbosityLevel('terse', MOMENTUM_INSTALL);
  const instructions = buildVoiceInstructions(jarvis, terse);
  console.log('✅ Instructions built');
  console.log('  Length:', instructions.length, 'characters');
  console.log('  Preview:\n');
  console.log(instructions.substring(0, 300) + '...\n');
} catch (error) {
  console.log('❌ Failed:', error);
}

// Test 4: All combinations
console.log('\nTest 4: Testing all style + verbosity combinations...');
const styles = ['jarvis', 'professional', 'casual'];
const verbosities = ['terse', 'brief', 'normal'];

let passed = 0;
let failed = 0;

for (const style of styles) {
  for (const verbosity of verbosities) {
    try {
      const voiceStyle = loadVoiceStyle(style, MOMENTUM_INSTALL);
      const verbosityLevel = loadVerbosityLevel(verbosity, MOMENTUM_INSTALL);
      const instructions = buildVoiceInstructions(voiceStyle, verbosityLevel);
      console.log(`✅ ${style} + ${verbosity}: ${instructions.length} chars`);
      passed++;
    } catch (error) {
      console.log(`❌ ${style} + ${verbosity}: ${error}`);
      failed++;
    }
  }
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('\n🎉 All tests passed! Voice system ready for installation.');
} else {
  console.log('\n⚠️  Some tests failed. Check voice TOML files.');
  process.exit(1);
}
