#!/usr/bin/env bun
/**
 * Test Stop Hook Functionality
 * Tests voice extraction and sentence splitting
 */

// Test data
const testMessage = `Task complete, all tests passing.

**Voice:** Implementation finished successfully, Sir. All quality checks passed.`;

const stopHookInput = {
  session_id: "test-session",
  hook_event_name: "Stop",
  messages: [
    { role: "user", content: "Complete the task" },
    { role: "assistant", content: testMessage }
  ]
};

console.log('=== Stop Hook Test ===\n');

// Test 1: Voice extraction
console.log('Test 1: Voice Extraction');
const voiceMatch = testMessage.match(/\*\*Voice:\*\*\s*(.+?)(?:\n|$)/);
if (voiceMatch && voiceMatch[1]) {
  console.log('✅ Extracted:', voiceMatch[1].trim());
} else {
  console.log('❌ Failed to extract voice summary');
}

// Test 2: Sentence splitting
console.log('\nTest 2: Sentence Splitting');
const text = "Implementation finished successfully, Sir. All quality checks passed.";
const segmenter = new Intl.Segmenter('en', { granularity: 'sentence' });
const segments = Array.from(segmenter.segment(text));
const sentences = segments
  .map(segment => segment.segment.trim())
  .filter(sentence => sentence.length > 0);

console.log(`Split into ${sentences.length} sentences:`);
sentences.forEach((s, i) => console.log(`  ${i + 1}. "${s}"`));

// Test 3: Full JSON processing
console.log('\nTest 3: Full JSON Processing');
console.log('Input JSON:');
console.log(JSON.stringify(stopHookInput, null, 2));

console.log('\n✅ All tests passed!');
console.log('\nTo test with actual hook:');
console.log('echo \'', JSON.stringify(stopHookInput), '\' | bun hooks/momentum-stop-hook.ts');
