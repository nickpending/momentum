---
allowed-tools: Read, Grep, Glob, Bash
description: Validate task completion with evidence of working functionality
---

@../resources/command-rules.md

# Validate task completion with evidence of working functionality

## Instrumentation

**Start event:**
```bash
argus-send --source momentum --event-type command --status pending \
  --message "Starting /complete-task {TASK_NUMBER}" \
  --data '{"command_name": "complete-task", "task_number": "{TASK_NUMBER}"}'
```

**End event (after Phase 4):**
```bash
argus-send --source momentum --event-type command --status success \
  --message "Completed /complete-task {TASK_NUMBER}" \
  --data '{"command_name": "complete-task", "task_number": "{TASK_NUMBER}"}'
```

If command fails, use `--status failure` with error details.

## ⚠️ CRITICAL: MARK TASK COMPLETE AND DOCUMENT

**REQUIRED:**
- Capture what actually happened in TASKS.md
- Update progress and suggest next task
- Quick sanity check only - no redundant demos

**NEVER:**
- Re-run demos already proven to work
- Skip implementation notes
- Leave task in progress state

## Workflow

Execution phases for task completion:

1. **Load and Verify** - Load task context, review changes via git diff, get approval
2. **Mark Complete** - Update task status in TASKS.md with implementation notes
3. **Capture to Lore** - Record knowledge to Lore if available
4. **Update Expertise** - Sync learnings to project expertise
5. **Commit and Push** - Commit approved changes
6. **Report Progress** - Show completion status and suggest next steps
7. **Return to Root** - Navigate back to PROJECT_ROOT

## Core Instructions

### PHASE 1: LOAD AND VERIFY (REQUIRED)

**CHECKPOINT 1: Load Task Context**

```
REQUIRED: Understand what was done:
- READ TASKS.md to find the task
- VERIFY task is currently 🔄 In Progress
- CHECK that tests are passing (if any were written)
- CONFIRM linting/quality checks still pass

DO NOT:
- Re-run demos that already worked
- Re-test functionality already proven
- Repeat validation already done

VERIFICATION: Task ready to be marked complete
```

**CHECKPOINT 1.5: Review Changes (Human Sanity Check)**

```
REQUIRED: Show what changed for human review:

IF git repo exists:
  1. RUN: `git diff --stat` to show which files changed
  2. RUN: `git diff` to show actual changes
  3. SUMMARIZE: In plain language what changed and why (based on task requirements)

OUTPUT FORMAT:
**Files Changed:**
[output of git diff --stat]

**Change Summary:**
- [File]: [What changed and why it was needed for this task]
- [File]: [What changed and why it was needed for this task]

**Sanity Check Questions:**
- Does this match what the task asked for?
- Are there any unexpected changes?
- Is anything obviously missing?
- Any files modified that shouldn't have been?

**APPROVAL GATE:**
After showing the diff, ask user: "Proceed with marking complete and committing these changes?"
- If NO: STOP immediately - output "Cancelled" and exit
- If YES: Continue to CHECKPOINT 2

ERROR HANDLING:
- If not a git repo: Skip diff, ask "Proceed with marking complete?" (no commit will happen)
- If no changes: Show "No changes detected" and ask to proceed

PURPOSE: Human reviews changes and approves before any modifications
```

### PHASE 2: MARK COMPLETE WITH IMPLEMENTATION NOTES (REQUIRED)

**CHECKPOINT 2: Update Task Status and Document What Happened**

```
REQUIRED: Mark task complete and capture implementation reality:
- UPDATE task status from 🔄 In Progress to ✅ Complete
- ADD completion timestamp
- DOCUMENT what actually happened during implementation

CAPTURE THESE DETAILS IN NOTES:
- **Deviations:** Did implementation differ from plan? How?
- **Discoveries:** What did you learn that wasn't obvious before?
- **Gotchas:** Any tricky parts future devs should know?
- **Dependencies:** Any new dependencies or integrations added?
- **Decisions:** Key choices made and why
- **Files:** Any files created/modified beyond what was planned

TASK UPDATE FORMAT:
- **Status:** ✅ Complete (YYYY-MM-DD)
- **Implementation Notes:** 
  - [What actually got built vs planned]
  - [Any surprises or discoveries]
  - [Key decisions and tradeoffs]
  - [Files touched: actual list if different from plan]

EXAMPLE:
- **Status:** ✅ Complete (2024-01-15)
- **Implementation Notes:**
  - Added retry logic to handle flaky WebSocket (not in original plan)
  - Discovered existing auth middleware, reused instead of creating new
  - Chose localStorage over sessionStorage for persistence across tabs
  - Files: Also modified middleware/auth.ts to expose token refresh

VERIFICATION: Task marked complete with useful implementation details
```

### PHASE 2.5: CAPTURE TO LORE (IF AVAILABLE)

**CHECKPOINT 2.5: Generate Lore Event**

```
CHECK LORE AVAILABILITY:
Check the LORE_AVAILABLE metadata from the hook (in the user prompt submit hook output).

IF LORE_AVAILABLE is true:
Based on the task you just completed and the implementation notes, generate a JSON event
capturing the knowledge gained. Think about what would be valuable to remember for
future similar tasks.

CAPTURE TO LORE using lore CLI:

lore capture task \
  --project="{current-project-name}" \
  --name="[Task name from TASKS.md]" \
  --problem="[Core problem this task addressed]" \
  --solution="[Reusable pattern or approach that worked]" \
  --code="[Key code snippet if applicable, or empty string]" \
  --discoveries="[discovery1,discovery2,discovery3]" \
  --deviations="[How implementation differed from plan]" \
  --pattern="[Pattern that could be used elsewhere]" \
  --keywords="[keyword1,keyword2,keyword3]" \
  --tech="[library1,framework1,tool1]" \
  --difficulty="[What made this tricky or easy]"

NOTE: lore is installed globally via bun at ~/.bun/bin/lore

VERIFICATION: Event captured to Lore for future knowledge retrieval

IF LORE_NOT_INSTALLED:
- Skip this phase entirely
- Continue to Phase 2.6
```

### PHASE 2.6: UPDATE EXPERTISE

**CHECKPOINT 2.6: Update Project Expertise**

```
Run /update-expertise
```

### PHASE 2.7: COMMIT AND PUSH

**CHECKPOINT 2.7: Commit Approved Changes**

```
IF GIT REPO:
  Commit and push the changes that were approved in CHECKPOINT 1.5
```

### PHASE 3: PROGRESS REPORT (REQUIRED)

**CHECKPOINT 3: Workflow Guidance**

```
REQUIRED: Report progress and suggest next steps:
- COUNT completed vs remaining tasks
- IDENTIFY next available task(s) based on dependencies
- ASSESS overall iteration progress

COMPLETION REPORT:
=====================================
TASK {TASK_NUMBER} COMPLETED ✅
=====================================

Task: [task name and key accomplishment]
Progress: X/Y tasks complete ([percentage]%)
Next Available: [next task number and name, or "All tasks complete!"]
Dependencies Unblocked: [any tasks now ready to start]

Ready for /plan-task [next-task] or /complete-iteration if all done.
```

### PHASE 4: RETURN TO PROJECT ROOT (REQUIRED)

**CHECKPOINT 4: Navigate Back to Project Root**

```
REQUIRED: Return to project root directory:
- RUN: cd {PROJECT_ROOT}
- VERIFY: You are back in the project root

PURPOSE: Maintain consistent working directory after task completion
```

## Error Handling

**If demo command fails:**
- Fix issues before marking complete
- Don't proceed to completion
- Re-run validation after fixes

**If TASKS.md missing:**
- Report specific error
- Don't create - locate correct task file
- Verify ARTIFACTS_DIR path

**If unclear what's next:**
- Review task dependencies
- Check TASKS.md for remaining work
- Suggest logical sequence

**If git diff fails:**
- Continue without diff review
- Note in output that changes couldn't be shown
- Still require user approval to proceed

## Notes

**Enforcement mechanisms:**
- Quick sanity check ensures software still works
- Task properly marked complete in TASKS.md with implementation notes
- Progress reported with clear next steps

**Efficient workflow:**
- Leverage work already validated in /plan-task
- Focus on completion and workflow continuation
- Avoid redundant validation of proven functionality

## Success Criteria

Task completion finalized when:

- [ ] Quick sanity check confirms software works
- [ ] Task marked ✅ Complete in TASKS.md with timestamp
- [ ] Progress assessed and reported
- [ ] Next steps clearly identified
- [ ] Workflow guidance provided
- [ ] Returned to project root directory