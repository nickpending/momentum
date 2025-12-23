---
allowed-tools: Read, Write, Edit, Bash, Task, AskUserQuestion
description: Orchestrate iteration decomposition via subagent
---

@../../resources/command-rules.md

# Decompose Iteration (Orchestrated)

Spawn iteration-decomposer subagent, conduct interview, get approval, generate files.

## Step 1: Load Iteration

READ `${PROJECT_ROOT}/.workflow/artifacts/ITERATION.md`

EXTRACT:
- Iteration name and goal
- Feature count
- Tech stack and standards

IF no ITERATION.md exists:
- STOP with: "No iteration planned. Run `/plan-iteration` first."

## Step 2: Spawn Decomposer

SPAWN iteration-decomposer subagent with this prompt:

```
FIRST: Read {PROJECT_ROOT}/.workflow/resources/agent-rules.md — this defines your output format.

Decompose this iteration into task files:
- PROJECT_ROOT: {value}
- Iteration: {name from ITERATION.md}
- Features: {count}

Process:
1. Read ITERATION.md, CLAUDE.md for full context
2. Use Explore subagent for codebase patterns (NOT manual Glob/Grep)
3. Decompose each feature per validation gates
4. Map invariants to tasks
5. Validate assumptions about existing code
6. DO NOT generate files yet — return decomposition plan

Return:
- Feature breakdown with task counts
- Task list with names, files, dependencies
- Assumptions that need validation
- Questions for user (if any)
```

STORE the agent_id for resume.

## Step 3: Interview

IF decomposer returned questions:
- USE AskUserQuestion to gather answers
- RESUME decomposer with: "Continue your operator log. {answers to questions}"

ASK user about:
- Ambiguous behaviors that could go multiple ways
- Implicit requirements not spelled out
- Integration points needing clarification

NEVER ask about:
- Whether to do less (implement everything)
- Which parts to skip (skip nothing)
- Priority order (agent's job)

## Step 4: Present Decomposition

PRESENT decomposition summary:

```
=====================================
DECOMPOSITION COMPLETE - NO FILES YET
=====================================

Iteration: {name}
Features Analyzed: {count}
Tasks Identified: {total}

Multiplication Check:
- Features: {N}
- Tasks: {M}
- Factor: {M/N}x
- ✅ Properly decomposed (not 1:1)

Sample Tasks:
- 1.1: {name} ({files} files)
- 2.3: {name} ({files} files)
- 3.1: {name} ({files} files)

Task Distribution:
- Implementation: {count}
- Design: {count}
- Research: {count}

Ready to generate task files?
```

**🛑 STOP — WAIT FOR APPROVAL**

## Step 5: Generate Files

IF user approves:
- RESUME decomposer with: "Continue your operator log. Generate task files and TASKS.md index. {any additional details}"
- WAIT for completion

READ the agent's report from REPORT path.

## Step 6: Verify

CHECK generated files:
- Task files exist in `.workflow/artifacts/tasks/`
- TASKS.md index created
- Each task has demo command
- Dependencies are valid

IF issues found:
- RESUME decomposer with: "Continue your operator log. {specific corrections}"
- Re-verify after corrections

## Step 7: Complete

```
DECOMPOSITION COMPLETE
======================
Tasks created: {count}
Location: .workflow/artifacts/tasks/
Index: .workflow/artifacts/TASKS.md

First task: {X.Y} - {name}
Suggested start: /plan-task {X.Y}
```
