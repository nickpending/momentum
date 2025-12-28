---
allowed-tools: Read, Bash, Task
description: Orchestrate task planning via subagent
argument-hint: task-number
---

@../../resources/command-rules.md

# Plan Task (Orchestrated)

You are orchestrating a task-planner subagent to create an implementation plan. Your role is delegation, validation, and handoff — not planning.

## Instrumentation

**Start event:**
```bash
argus-send --source momentum --event-type command --status pending \
  --message "Starting /orchestration:plan-task {TASK_NUMBER}" \
  --data '{"command_name": "orchestration:plan-task", "task_number": "{TASK_NUMBER}"}'
```

**End event (after Phase 6):**
```bash
argus-send --source momentum --event-type command --status success \
  --message "Completed /orchestration:plan-task {TASK_NUMBER}" \
  --data '{"command_name": "orchestration:plan-task", "task_number": "{TASK_NUMBER}", "complexity": "{complexity}"}'
```

If command fails, use `--status failure` with error details.

## Core Principles

- **Delegate, don't plan**: The agent plans. You orchestrate, validate, present.
- **Validate agent output**: Check format compliance before accepting results.
- **Resume, don't restart**: Use agent resume for corrections, not fresh spawns.
- **Own nothing in the agent's domain**: Don't fill gaps or fix deviations yourself.
- **Use TodoWrite**: Track phases throughout.

---

## Phase 1: Load Context

**Goal:** Understand what task to plan

**Actions:**
1. Create todo list with all phases
2. READ the task file:
   - `{PROJECT_ROOT}/.workflow/artifacts/tasks/task-{TASK_NUMBER}-*.md` (glob for slug)
3. Extract task title, type, deliverables, dependencies

IF task file not found:
- STOP with error: "Task file not found. Run /decompose-iteration first."

---

## Phase 2: Spawn Planner Agent

**Goal:** Delegate planning to task-planner subagent

**Actions:**
1. SPAWN task-planner subagent with this prompt:

```
FIRST: Read {PROJECT_ROOT}/.workflow/resources/agent-rules.md — this defines your output format.

Then plan this task:
- PROJECT_ROOT: {value}
- TASK_NUMBER: {TASK_NUMBER}
- task-file: {PROJECT_ROOT}/.workflow/artifacts/tasks/task-{TASK_NUMBER}-*.md

Planning process:
1. Read task file, extract details and scan related tasks
2. Decide grouping: "Would user care if I completed ONLY this task?"
3. Route by type (Implementation/Design/Research)
4. For implementation: explore codebase, read actual files
5. Assess complexity, define approach, identify risks, define success criteria
6. Write report and operator log per agent-rules.md

Return per agent-rules.md format.
```

2. STORE the agent_id for resume
3. Update todo: Phase 2 complete

---

## Phase 3: Route Specialists

**Goal:** Provide expert support if agent needs it

**Actions:**
1. Parse agent's PLAN_FLAGS from response
2. IF `needs_arch: true`: Spawn architecture-analyst, collect insights
3. IF `needs_impl: true`: Spawn implementation-analyst, collect insights
4. IF specialists ran: RESUME task-planner with:
   - "Continue your operator log. {specialist analysis summaries}"

IF no specialists needed: Proceed to Phase 4.

---

## Phase 4: Validate Agent Output

**Goal:** Ensure agent produced compliant output

**DO NOT SKIP this phase.**

**Actions:**
1. PARSE the agent's final response for required fields:

```
REPORT: {path}
OPERATOR: {path}
PLAN_FLAGS: {"needs_arch": bool, "needs_impl": bool, "complexity": "simple|medium|complex"}
```

2. **Validate format:**
   - REPORT path exists and is readable
   - OPERATOR path exists and is readable
   - PLAN_FLAGS contains all required keys

IF any validation fails:
1. RESUME agent with: "Your output format is incorrect. Required format per agent-rules.md: REPORT: {path}, OPERATOR: {path}, PLAN_FLAGS: {json}. Missing/malformed: {specific issues}. Continue your operator log and provide corrected output."
2. Re-validate after resume
3. Maximum 2 resume attempts, then escalate to user

---

## Phase 5: Verify Plan Quality

**Goal:** Ensure plan matches task requirements

**Actions:**
1. READ the agent's report using the REPORT path
2. Compare against original task requirements:

**Gaps** (missing pieces):
- Does the plan cover ALL deliverables listed in TASKS.md?
- Does the demo command match what's expected?
- Are the dependencies and constraints addressed?

**Deviations** (changed requirements):
- Did the agent reinterpret or modify the task scope?
- Did it substitute different approaches than what was specified?
- Did it add unrequested features or remove specified ones?

IF gaps OR deviations exist:
1. Check if the report already explains the rationale
2. If rationale missing, RESUME agent with: "Continue your operator log. {ask why for specific gaps/deviations}"
3. **Present findings to user** with specific examples AND rationale
4. **Ask user:** "Should I have the agent revise, or proceed as-is?"
5. If user wants revision, RESUME agent with specific issues
6. Do NOT fill gaps or correct deviations yourself — agent owns its domain

---

## Phase 6: Present and Hand Off

**Goal:** Get user approval and hand off to build-task

**DO NOT START without completing Phase 5.**

**Actions:**
1. PRESENT final plan to user:

```
PLAN READY

Task: {TASK_NUMBER} - {title}
Complexity: {complexity from PLAN_FLAGS}
Specialists: {arch/impl/none}
Report: {REPORT path}
Operator: {OPERATOR path}

{plan summary from report}

Ready to build? (YES/NO)
```

2. **WAIT for user approval**

IF YES:
- Mark all todos complete
- Immediately invoke `/orchestration:build-task {TASK_NUMBER}`

IF NO:
- **Ask user** what needs adjustment
- RESUME agent to revise
- Re-present after revision

**DO NOT attempt implementation yourself — build-task handles that.**
