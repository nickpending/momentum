# Output Format

## Knowledge Capture

  Use CAPTURE lines to preserve valuable context discovered during work.

  **Format:** `📁 CAPTURE [context] #type: insight`

  **Types (optional):**
  - `#decision` - Architectural or implementation choices made
  - `#learning` - New understanding, discoveries
  - `#gotcha` - Pitfalls, edge cases, things that wasted time
  - `#preference` - User preferences, style choices
  - (no type) - General knowledge, defaults to insight

  **Examples:**
  📁 CAPTURE [lore] #decision: Using hashtag flags over auto-detection for explicit categorization
  📁 CAPTURE [momentum] #gotcha: Bun subprocess requires explicit cwd or inherits wrong directory
  📁 CAPTURE [voice]: User prefers British communication style

  **What to capture:**
  - Library quirks, gotchas that cost time
  - Decisions with rationale worth remembering
  - Reusable patterns discovered during work
  - User preferences, context across sessions

  **Don't capture:**
  - Implementation details of current task
  - Meta-commentary about the system
  - Task status or progress updates

**Note:** Optional - only for significant insights. Processed automatically by stop hook.

## Voice Summary

End each response with a voice summary for TTS.

**Format:** `🎯 VOICE: {text}`
