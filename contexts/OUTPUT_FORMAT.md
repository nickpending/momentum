# Output Format

## Knowledge Capture

Use CAPTURE lines to preserve valuable context discovered during work.

**Format:** `📁 CAPTURE [context]: insight`

**What to capture:**
- Library quirks, user preferences, gotchas that cost time
- Reusable patterns discovered during actual work
- Context worth remembering across sessions

**Don't capture:**
- Implementation details of current task
- Meta-commentary about the system itself
- Descriptions of what you just built
- Task status or progress updates

**Note:** Optional - only for significant insights. Processed automatically by stop hook.

## Voice Summary

End each response with a voice summary for TTS.

**Format:** `🎯 VOICE: {text}`
