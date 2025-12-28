---
allowed-tools: Read, Grep, Glob, Edit, Write, Bash, Task
description: Execute implementation from planner's output
argument-hint: task-number
---

@../../resources/command-rules.md

# Build Task (Orchestrated)

You are executing an implementation plan created by the task-planner agent. Your role is building working software, applying standards, and documenting discoveries.

**This command runs after `orchestration:plan-task` completes and user approves.**

## Instrumentation

**Start event:**
```bash
argus-send --source momentum --event-type command --status pending \
  --message "Starting /orchestration:build-task {TASK_NUMBER}" \
  --data '{"command_name": "orchestration:build-task", "task_number": "{TASK_NUMBER}"}'
```

**End event (after Phase 7):**
```bash
argus-send --source momentum --event-type command --status success \
  --message "Completed /orchestration:build-task {TASK_NUMBER}" \
  --data '{"command_name": "orchestration:build-task", "task_number": "{TASK_NUMBER}"}'
```

If command fails, use `--status failure` with error details.

## Core Principles

- **Follow the plan**: The planner decided the approach. You execute it.
- **Apply embedded standards**: Use linting, formatting from ITERATION.md tech stack.
- **Real services only**: No mocking internal code. Use actual databases, APIs.
- **Demo or it didn't happen**: Working demo command is the success gate.
- **Document discoveries**: Capture invariants, risks, gotchas for future.
- **Use TodoWrite**: Track phases throughout.

---

## Phase 1: Load Planner Output

**Goal:** Find and read the implementation plan

**Actions:**
1. Create todo list with all phases
2. LOCATE both planner outputs for task {TASK_NUMBER}:

**Report** (detailed plan):
```
{PROJECT_ROOT}/.workflow/agents/reports/task_plan-*.md
```

**Operator log** (decisions marked with **NOTE:**):
```
{PROJECT_ROOT}/.workflow/agents/operators/*task*{TASK_NUMBER}*.md
```

3. GLOB for files referencing task {TASK_NUMBER}

IF neither found:
- STOP with error: "No plan found for task {TASK_NUMBER}. Run /orchestration:plan-task first."

4. READ both files and extract:
   - Implementation approach
   - Files to create/modify
   - Integration points
   - Success criteria (demo command)
   - Identified risks
   - Key decisions (from **NOTE:** markers in operator log)

---

## Phase 2: Load Embedded Standards

**Goal:** Understand quality gates for this implementation

**Actions:**
1. READ from `{PROJECT_ROOT}/.workflow/artifacts/ITERATION.md`:
   - Tech stack section (linting, formatting, testing commands)
   - Embedded standards that apply to this task

2. READ from `{PROJECT_ROOT}/.workflow/artifacts/TASKS.md`:
   - Task {TASK_NUMBER} full details
   - Dependencies and constraints

3. Update todo: Phase 2 complete

---

## Phase 3: Present and Confirm

**Goal:** Get explicit user approval before building

**DO NOT START Phase 4 without approval.**

**Actions:**
1. PRESENT implementation summary to user:

```
BUILD READY

Task: {TASK_NUMBER} - {title}
Plan: {report path}

Approach:
{summary from planner report}

Files to touch:
- {file list from plan}

Standards to apply:
- {linting/formatting from ITERATION.md}

Success: {demo command} → {expected output}

Ready to build? (YES/NO)
```

2. **WAIT for user approval**

IF NO:
- **Ask user** what needs adjustment
- Clarify concerns
- Re-present after addressing

---

## Phase 4: Build Implementation

**Goal:** Execute the plan and produce working software

**DO NOT START without Phase 3 approval.**

**Actions:**
1. CREATE/MODIFY files per plan:
   - Apply embedded standards patterns
   - Focus on core functionality first
   - Use real services from start
   - Handle essential errors only

2. INTEGRATE with existing system:
   - Wire to existing APIs/services
   - Verify with running services (docker-compose up if needed)
   - Check existing features still work

3. RUN quality checks:
   - Linting/formatting from ITERATION.md tech stack
   - Fix issues before proceeding

4. VERIFY demo works:
   - Run the demo command from success criteria
   - Capture actual output
   - Compare to expected

IF demo fails:
- Debug systematically
- Fix before proceeding
- **Never claim complete with failing demo**

5. CLEANUP demo artifacts:
   - Delete test data created during demo
   - Remove temporary files
   - Revert database entries created for demo
   - Reset any state modified for verification
   - Leave codebase clean, not polluted with demo garbage

6. Update todo: Phase 4 complete

---

## Phase 5: Document Discoveries

**Goal:** Capture learnings for future reference

**Actions:**
1. COMPARE initial risk assessment (from plan) to actual findings:

**CONFIRMED RISKS** (guessed right):
- [Component] - Was HIGH risk, confirmed by [what happened]

**UPGRADED RISKS** (more dangerous than expected):
- [Component] - Thought LOW, actually HIGH because [discovery]

**DOWNGRADED RISKS** (simpler than expected):
- [Component] - Thought HIGH, actually simple because [reason]

**NEW DISCOVERIES** (didn't anticipate):
- [Invariant/gotcha discovered during building]

2. IDENTIFY invariants discovered (properties that must ALWAYS hold):
   - State invariants: Object state constraints
   - Data invariants: Field validation rules
   - Relationship invariants: Cross-object dependencies

3. Document what broke/almost broke and why it matters

---

## Phase 6: Update TASKS.md

**Goal:** Persist discoveries to task file

**Actions:**
1. USE Edit tool to update ONLY the "Discovered During Implementation" section:

```markdown
**Discovered During Implementation:**
- **Invariants (from iteration planning):**
  - [existing]
- **Additional Invariants (found during building):**
  - [new discoveries]
- **Failure Modes:**
  - [failures encountered]
- **Risk Assessment:**
  - [confirmed/upgraded/downgraded risks]
```

2. **DO NOT change task status** — remains "🔄 In Progress"
3. Update todo: Phase 6 complete

---

## Phase 7: Report Completion

**Goal:** Summarize build and hand off to validation

**Actions:**
1. Mark all todos complete
2. PRESENT final summary:

```
BUILD COMPLETE

Task: {TASK_NUMBER} - {title}
Working software demonstrated
Integration verified
Standards applied ({lint/format commands})
Discoveries documented in TASKS.md

Demo verified:
$ {demo command}
{actual output}

Task status: In Progress
Next: /complete-task {TASK_NUMBER}
```

**DO NOT proceed to complete-task automatically — let user decide.**

---

## Error Handling

**If blocked:**
- Simplify approach, break down into smaller steps
- Check dependencies met
- **Ask user** for guidance

**If integration fails:**
- Check services running
- Verify connection strings and APIs
- Review existing integration patterns

**If standards fail:**
- Fix lint/format issues
- Don't skip quality gates

**If demo broken:**
- Debug systematically
- Fix before claiming build complete
- **Never proceed with failing demo**
