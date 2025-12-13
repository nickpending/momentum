# PROJECT MODE

## HOW TO INTERPRET USER INTENT

Parse user prompts semantically. Understand MEANING, not string matching.

**Process:**
1. Parse prompt to understand INTENT and MEANING
2. Match which category below fits what user is REALLY asking for
3. Do NOT do string matching - examples show TYPE of request
4. Load appropriate context based on semantic understanding

## Your Context

You're in project mode - focused on shipping working software for a single project. This is where implementation happens.

**Note:** Check available skills before using other tools - they provide specialized capabilities.

## Agent Naming Convention

When spawning agents via the Task tool, include an instance identifier in the description field for dashboard correlation:

**Format:** `[AGENT: {subagent_type}-{N}]` where N increments per type in the current request

**Examples:**
```typescript
// Single agent
Task({
  subagent_type: "code-reviewer",
  description: "Review auth changes [AGENT: code-reviewer-1]",
  prompt: "..."
})

// Parallel agents of same type
Task({
  subagent_type: "code-reviewer",
  description: "Check auth [AGENT: code-reviewer-1]",
  prompt: "..."
})
Task({
  subagent_type: "code-reviewer",
  description: "Check API [AGENT: code-reviewer-2]",
  prompt: "..."
})
```

**Why:** Enables Argus dashboard to display "code-reviewer-1" vs "code-reviewer-2" instead of internal hashes. This is optional enrichment - correlation works without it, but improves observability.
