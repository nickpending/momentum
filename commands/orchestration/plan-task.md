---
allowed-tools: Read, Bash, Task
description: Orchestrate task planning via subagent
argument-hint: task-number
---

@../../resources/command-rules.md

# Plan Task (Orchestrated)

Spawn task-planner subagent, handle specialist routing, synthesize final plan.

## Step 1: Get Task Details

Check if you've already read TASKS.md in this conversation. If not, read it:
- `${PROJECT_ROOT}/.workflow/artifacts/TASKS.md`

Extract task {task-number} title and description.

## Step 2: Spawn Planner

SPAWN task-planner subagent with this prompt:

```
FIRST: Read {PROJECT_ROOT}/resources/agent-rules.md — this defines your output format.

Then plan this task:
- PROJECT_ROOT: {value}
- task-number: {task-number}
- task-description: {extracted from TASKS.md}

Planning process:
1. Read TASKS.md, extract task details and scan related tasks
2. Decide grouping: "Would user care if I completed ONLY this task?"
3. Route by type (Implementation/Design/Research)
4. For implementation: explore codebase, read actual files
5. Assess complexity, define approach, identify risks, define success criteria
6. Write report and operator log per agent-rules.md

Return per agent-rules.md format.
```

STORE the agent_id for resume.

## Step 3: Route Specialists

If the planner needs architecture help, spawn architecture-analyst.

If it needs implementation guidance, spawn implementation-analyst.

## Step 4: Finalize

If specialists ran, resume the task-planner with their analysis so it can finalize.

## Step 5: Read Report

Read the agent's report using the REPORT path returned in its final response.

This contains the full plan, rationale, and implementation steps.

## Step 6: Verify

Compare the agent's plan against the original task requirements:

**Gaps** (missing pieces):
- Does the plan cover ALL deliverables listed in TASKS.md?
- Does the demo command match what's expected?
- Are the dependencies and constraints addressed?

**Deviations** (changed requirements):
- Did the agent reinterpret or modify the task scope?
- Did it substitute different approaches than what was specified?
- Did it add unrequested features or remove specified ones?

If gaps OR deviations exist:
1. Check if the report already explains the rationale for each deviation/gap
2. If rationale is missing, RESUME the agent and ask why
3. Present findings to the user with specific examples AND rationale (from report or agent)
4. Ask: "Should I have the agent revise, or proceed as-is?"
5. If user wants revision, RESUME the agent with the specific issues to address
6. Do NOT fill gaps or correct deviations yourself — the agent owns its domain

## Step 7: Present

PRESENT final plan to user:

```
PLAN READY

Task: {task-number} - {title}
Complexity: {complexity}
Specialists: {arch/impl/none}

{plan summary}

Ready to implement? (YES/NO)
```

WAIT for approval before any implementation.
