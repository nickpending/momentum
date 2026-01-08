---
allowed-tools: Read, Bash, Task
description: Orchestrate test writing and running via subagent
argument-hint: task-number
---

@../../resources/command-rules.md

# Test Task (Orchestrated)

Spawn test-runner agent to write and run tests for a completed task.

**Runs after `orchestration:build-task` completes.**

## Instrumentation

**Start event:**
```bash
argus-send --source momentum --type command --session-id {SESSION_ID} --status pending \
  --message "Starting /orchestration:test-task {TASK_NUMBER}" \
  --data '{"command_name": "orchestration:test-task", "task_number": "{TASK_NUMBER}"}'
```

**End event (after Phase 7):**
```bash
argus-send --source momentum --type command --session-id {SESSION_ID} --status success \
  --message "Completed /orchestration:test-task {TASK_NUMBER}" \
  --data '{"command_name": "orchestration:test-task", "task_number": "{TASK_NUMBER}", "tests_passed": {count}}'
```

If command fails, use `--status failure` with error details.

## Core Principles

- **Delegate**: Agent writes and runs tests. You validate and present.
- **Validate format**: Check agent outputs per agent-rules.md
- **Approve plan**: User reviews test plan before agent writes
- **Resume on failure**: Use agent resume, not fresh spawns
- **Use TodoWrite**: Track phases

---

## Phase 1: Check Prerequisites

**Goal:** Verify testing can proceed

**Actions:**
1. Create todo list with all phases
2. CHECK `{PROJECT_ROOT}/.workflow/artifacts/TESTING.md` exists
3. CHECK build artifacts exist for task {TASK_NUMBER}

IF missing: STOP with clear error message.

---

## Phase 2: Spawn Test Runner

**Goal:** Delegate to test-runner agent

**Actions:**
1. Generate CORRELATION_ID: `test-task-{TASK_NUMBER}-{8 random hex chars}`
2. SPAWN test-runner with:

```
CORRELATION_ID: {generated correlation_id}
SESSION_ID: {SESSION_ID from hook context}

FIRST: Read these files before starting:
1. {PROJECT_ROOT}/.workflow/resources/agent-philosophy.md — How to think
2. {PROJECT_ROOT}/.workflow/resources/agent-rules.md — Output format and instrumentation

Write and run tests for task {TASK_NUMBER}.
PROJECT_ROOT: {value}

Return after Phase 4 (operator file with test plan) for approval.
```

3. STORE agent_id for resume

---

## Phase 3: Validate Test Plan

**Goal:** Ensure agent produced valid plan

**DO NOT SKIP.**

**Actions:**
1. READ agent's operator file
2. Validate contains: risk assessment, proposed tests, invariants

IF malformed: RESUME agent with specific issues.

---

## Phase 4: Present Test Plan

**Goal:** Get user approval

**Actions:**
1. PRESENT summary:

```
TEST PLAN

Task: {TASK_NUMBER}
Tests planned: {count}
Invariants: {list from operator}

Approve? (YES/NO)
```

2. **WAIT for approval**

IF NO: **Ask user** what to adjust, RESUME agent.

---

## Phase 5: Execute

**Goal:** Agent writes and runs tests

**DO NOT START without Phase 4 approval.**

**Actions:**
1. RESUME agent: "Approved. Continue with Phase 5."
2. Agent writes tests, runs them, fixes failures

---

## Phase 6: Validate Results

**Goal:** Ensure tests pass

**Actions:**
1. READ agent's final response
2. Validate: REPORT exists, all tests passing

IF tests failing: RESUME agent to fix. Max 3 attempts, then escalate.

---

## Phase 7: Report

**Goal:** Summarize results

**Actions:**
1. Mark todos complete
2. PRESENT:

```
TESTS COMPLETE

Task: {TASK_NUMBER}
Tests: {count} passing
Report: {path}

Next: /complete-task {TASK_NUMBER}
```

**DO NOT auto-proceed.**
