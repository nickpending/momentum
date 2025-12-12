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

## SEMANTIC INTENT MATCHING

### 🔍 Code Review
**Intent:** Reviewing recent code, checking implementation quality, validating before shipping
**Examples:** "review the code", "check my changes", "is this code good"
**Action:** Execute ALL steps in sequence:
1. Confirm "Review recent code for architecture, implementation, security, correctness. Proceed?"
2. If yes: Launch code-reviewer agent with this prompt format:
   "Review recent code changes.
    PROJECT_ROOT: {value from HTML comment PROJECT_ROOT}
    ARTIFACTS_DIR: {value from HTML comment ARTIFACTS_DIR}"
3. Read report from ARTIFACTS_DIR/subagents/CODE_REVIEW-*.md
4. Summarize critical issues
**Agent:** code-reviewer

### 🏗️ Architecture Review
**Intent:** Reviewing system architecture, checking complexity, evaluating solution fit
**Examples:** "review the architecture", "is this over-engineered", "technical debt"
**Action:** Execute ALL steps in sequence:
1. Confirm "Review architecture for complexity and debt. Proceed?"
2. If yes: Launch architecture-reviewer agent with this prompt format:
   "Review architecture for complexity and technical debt.
    PROJECT_ROOT: {value from HTML comment PROJECT_ROOT}
    ARTIFACTS_DIR: {value from HTML comment ARTIFACTS_DIR}"
3. Read report from ARTIFACTS_DIR/subagents/ARCHITECTURE_REVIEW-*.md
4. Summarize concerns
**Agent:** architecture-reviewer

### 🎨 Architecture Analysis
**Intent:** Exploring architectural options, comparing approaches, understanding trade-offs
**Examples:** "architectural options for", "what are the trade-offs", "different approaches"
**Action:** Execute ALL steps in sequence:
1. Confirm "Analyze architectural options for [FEATURE]. Proceed?"
2. If yes: Launch architecture-analyst agent with this prompt format:
   "Analyze architectural options for [FEATURE].
    PROJECT_ROOT: {value from HTML comment PROJECT_ROOT}
    ARTIFACTS_DIR: {value from HTML comment ARTIFACTS_DIR}"
3. Generate 4-char random ID, save report to ARTIFACTS_DIR/subagents/ARCHITECTURE-{ID}.md
4. Read saved artifact and present options clearly
**Agent:** architecture-analyst

### 💻 Implementation Analysis
**Intent:** Technical implementation approaches, algorithms, data structures, coding options
**Examples:** "how should I implement", "algorithm options", "different ways to implement"
**Action:** Execute ALL steps in sequence:
1. Confirm "Analyze implementation options for [FEATURE/TASK]. Proceed?"
2. If yes: Launch implementation-analyst agent with this prompt format:
   "Analyze implementation options for [FEATURE/TASK].
    PROJECT_ROOT: {value from HTML comment PROJECT_ROOT}
    ARTIFACTS_DIR: {value from HTML comment ARTIFACTS_DIR}"
3. Generate 4-char random ID, save report to ARTIFACTS_DIR/subagents/IMPLEMENTATION-{ID}.md
4. Read saved artifact and present technical options
**Agent:** implementation-analyst

### 🔧 Task Planning
**Trigger:** `/plan-task` followed by number
**Action:** Execute ALL steps in sequence:
1. Check if ARTIFACTS_DIR/TESTING.md exists
2. If missing: Load `MOMENTUM_CONTEXTS_PATH/TEST_SETUP.md`
3. If exists: Say "🎯 Task mode activated" and proceed

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
