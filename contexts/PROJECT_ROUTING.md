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
2. If yes: Launch code-reviewer agent for scope
3. Read report, summarize critical issues
**Agent:** code-reviewer

### 🏗️ Architecture Review
**Intent:** Reviewing system architecture, checking complexity, evaluating solution fit
**Examples:** "review the architecture", "is this over-engineered", "technical debt"
**Action:** Execute ALL steps in sequence:
1. Confirm "Review architecture for complexity and debt. Proceed?"
2. If yes: Launch architecture-reviewer agent
3. Read report, summarize concerns
**Agent:** architecture-reviewer

### 🎨 Architecture Analysis
**Intent:** Exploring architectural options, comparing approaches, understanding trade-offs
**Examples:** "architectural options for", "what are the trade-offs", "different approaches"
**Action:** Execute ALL steps in sequence:
1. Confirm "Analyze architectural options for [FEATURE]. Proceed?"
2. If yes: Launch architecture-analyst agent
3. Generate 4-char random ID, save report to ARTIFACTS_DIR/subagents/ARCHITECTURE-{ID}.md
4. Read saved artifact and present options clearly
**Agent:** architecture-analyst

### 💻 Implementation Analysis
**Intent:** Technical implementation approaches, algorithms, data structures, coding options
**Examples:** "how should I implement", "algorithm options", "different ways to implement"
**Action:** Execute ALL steps in sequence:
1. Confirm "Analyze implementation options for [FEATURE/TASK]. Proceed?"
2. If yes: Launch implementation-analyst agent
3. Generate 4-char random ID, save report to ARTIFACTS_DIR/subagents/IMPLEMENTATION-{ID}.md
4. Read saved artifact and present technical options
**Agent:** implementation-analyst

### 🔧 Task Planning
**Trigger:** `/plan-task` followed by number
**Action:** Execute ALL steps in sequence:
1. Check if ARTIFACTS_DIR/TESTING.md exists
2. If missing: Load `MOMENTUM_CONTEXTS_PATH/TEST_SETUP.md`
3. If exists: Say "🎯 Task mode activated" and proceed

### 🏠 Return to Assistant
**Intent:** Returning to assistant mode, exiting development, managing multiple projects
**Examples:** "back to assistant", "exit project", "main mode"
**Action:** Execute ALL steps in sequence:
1. Say "Returning to assistant mode..."
2. Run `echo "assistant" > MODEFILE_PLACEHOLDER`
3. Run `cd MOMENTUM_HOME_DIR_PLACEHOLDER`

## Mode Info

**Current Mode:** Project
**Project:** PROJECT_NAME_PLACEHOLDER
**Planning:** WORKFLOW_PROJECTS_PLACEHOLDER/PROJECT_NAME_PLACEHOLDER
