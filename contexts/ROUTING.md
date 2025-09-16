# MOMENTUM DYNAMIC ROUTING

## 🚨 MOMENTUM BEHAVIORAL GUARDS (ALWAYS ACTIVE)

**Anti-patterns to prevent during every interaction:**

1. **Anti-Lazy**: "This is complex" → Break it down step by step, don't bail out
2. **Check Working Directory**: Before doing anything, check where you are with pwd/ls
3. **Side-Effect Awareness**: Code changes affect other parts - think through ripple effects
4. **Architectural Thinking**: New features need proper patterns, not hacks
5. **Smart Mocking**: Mock external APIs, test with real internal services
6. **No Temporary Fixes**: If something doesn't work, figure out WHY, don't work around it
7. **Quality Patterns**: Use established patterns the cool kids use, not spaghetti code
8. **Integration First**: How does this fit with existing system architecture?

**Remember: Build working, well-structured software that integrates properly.**

## 🚨 CRITICAL: HOW TO INTERPRET THESE INSTRUCTIONS

**YOU MUST understand the SEMANTIC MEANING of the user's prompt, not search for exact string matches.**

When you receive a user prompt:
1. **PARSE the prompt to understand its INTENT and MEANING**
2. **THINK about which category below matches what the user is REALLY asking for**
3. **DO NOT do string matching** - the examples are to help you understand the TYPE of request
4. **LOAD the appropriate context based on semantic understanding**

## CONTEXT LOADING RULES

### 🔍 Exploration

**WHEN THE USER IS ASKING ABOUT (semantic understanding):**
- Exploring a codebase or system
- Understanding how something works
- Investigating options or approaches
- Thinking through problems
- Discussing possibilities

**Example phrases that indicate this context:**
- "let's explore", "I'm thinking about", "what if we"
- "I have an idea", "let's brainstorm", "help me think through"
- "I want to understand", "let's discuss"

**YOU MUST IMMEDIATELY:**

Load exploration context for productive ideation.

**CONTEXT FILES:** 
- `MOMENTUM_CONTEXTS_PATH/EXPLORATION.md` ✅

**AGENT:** None

### 💾 Save Exploration

**WHEN THE USER IS ASKING ABOUT (semantic understanding):**
- Saving the current exploration discussion
- Capturing the ideas just discussed
- Documenting the conversation
- Recording insights for later

**Example phrases that indicate this context:**
- "save this exploration", "capture this", "let's document this"
- "record this idea", "save what we discussed"
- After good discussion: "great, let's save this"

**YOU MUST IMMEDIATELY:**

Save the exploration using paths from context.

**CONTEXT FILES:** 
- `MOMENTUM_CONTEXTS_PATH/EXPLORATION.md` ✅

**AGENT:** None

**SPECIAL INSTRUCTIONS:**
- Review conversation for key insights
- Save to explorations path specified in context
- Name based on main topic discussed
- Execute immediately without asking for details

### 🔍 Code Review

**WHEN THE USER IS ASKING ABOUT (semantic understanding):**
- Reviewing recent code changes
- Checking code quality or architecture
- Analyzing implementation decisions
- Validating code before shipping
- Getting feedback on code structure
- Ensuring code follows best practices

**Example phrases that indicate this context:**
- "review the code", "check my changes", "look at recent commits"
- "is this code good", "review recent work", "code review"
- "validate the implementation", "check the architecture"
- "let's review what we built", "how's the code looking"

**YOU MUST IMMEDIATELY:**

Launch the code-reviewer agent to analyze recent changes:

Use Task tool with:
- subagent_type: "code-reviewer"  
- description: "Review recent code changes"
- prompt: "Review recent code changes for: 1) Architecture patterns and consistency, 2) Implementation quality and best practices, 3) Security vulnerabilities, 4) Functional correctness (test it actually works). Output specific findings with file references to .workflow/artifacts/subagents/"

After agent completes, read its report and summarize critical issues first.

**CONTEXT FILES:** None

**AGENT:** code-reviewer

### 🎯 Discovery Documentation

**WHEN THE USER IS ASKING ABOUT (semantic understanding):**
- Just solved a problem
- Found something interesting
- Fixed a bug or issue
- Learned something valuable
- Made a breakthrough

**Example phrases that indicate this context:**
- "that fixed it!", "found the issue", "that works"
- "interesting discovery", "learned something", "figured it out"
- "this solves the problem", "now I understand"

**YOU MUST IMMEDIATELY:**

Document the discovery without ceremony:

**LOCATION:** `.workflow/discoveries/`
**FILENAME:** `DISCOVERY-[YYYY-MM-DD]-[topic].md`

**CONTENT TO INCLUDE:**
```markdown
# Discovery: [Topic]

## Date: YYYY-MM-DD

## Context
What we were trying to do

## The Discovery
What we found/learned/fixed

## Why It Matters
Impact and importance

## How to Apply
Concrete usage or implementation
```

Execute immediately. No questions needed.

**CONTEXT FILES:** None

**AGENT:** None

## PROJECT INFORMATION

**Current Project:** PROJECT_NAME_PLACEHOLDER
**Planning Path:** WORKFLOW_PROJECTS_PLACEHOLDER/PROJECT_NAME_PLACEHOLDER
**Working Path:** Current directory (.workflow/ present)

All paths are pre-configured. Execute based on intent.