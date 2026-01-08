---
allowed-tools: Read, Write, Edit, Bash, Task, AskUserQuestion
description: Orchestrate iteration decomposition via subagent
---

@../../resources/command-rules.md

# Decompose Iteration (Orchestrated)

Spawn iteration-decomposer subagent, conduct interview, get approval, generate files.

## Instrumentation

**Start event:**
```bash
argus-send --source momentum --type command --session-id {SESSION_ID} --status pending \
  --message "Starting /orchestration:decompose-iteration" \
  --data '{"command_name": "orchestration:decompose-iteration"}'
```

**End event (after Step 7):**
```bash
argus-send --source momentum --type command --session-id {SESSION_ID} --status success \
  --message "Completed /orchestration:decompose-iteration" \
  --data '{"command_name": "orchestration:decompose-iteration", "tasks_created": {count}}'
```

If command fails, use `--status failure` with error details.

## Step 1: Load Iteration

READ `{PROJECT_ROOT}/.workflow/artifacts/ITERATION.md`

EXTRACT:
- Iteration name and goal
- Feature count
- Tech stack and standards

IF no ITERATION.md exists:
- STOP with: "No iteration planned. Run `/plan-iteration` first."

## Step 2: Spawn Decomposer

**Actions:**
1. Generate CORRELATION_ID: `decompose-iteration-{8 random hex chars}`
2. SPAWN iteration-decomposer subagent with this prompt:

```
CORRELATION_ID: {generated correlation_id}
SESSION_ID: {SESSION_ID from hook context}

FIRST: Read these files before starting:
1. {PROJECT_ROOT}/.workflow/resources/agent-philosophy.md — How to think
2. {PROJECT_ROOT}/.workflow/resources/agent-rules.md — Output format and instrumentation

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

Present decomposition using standard output format:

   ▸ Iteration name and feature count
   ▸ Total tasks identified
   ▸ Multiplication check (tasks should exceed features — not 1:1)
   ▸ Sample tasks with file counts
   ▸ Task distribution by type

Ask user: "Ready to generate task files?"

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

Report using standard output format:

   ▸ Tasks created with count
   ▸ Location and index path
   ▸ First task identified

Suggest: `/plan-task {X.Y}` to begin implementation.
