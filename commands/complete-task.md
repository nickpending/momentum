# Validate task completion with evidence of working functionality

**Variables**: Variables in CAPS are injected by hooks (see HTML comments above), `{vars}` are runtime values (find/calculate them), `[vars]` are template placeholders (substitute them).

**Key Paths**:
- `{project-root}` - Current project directory (find by locating .workflow/ directory)
- WORKFLOW_PROJECTS - Obsidian projects directory (injected)
- WORKFLOW_DEV - Development projects root (injected)

## ⚠️ CRITICAL: MARK TASK COMPLETE AND DOCUMENT ⚠️

**🛑 NO REDUNDANT DEMOS - ALREADY PROVEN TO WORK**  
**🛑 CAPTURE WHAT ACTUALLY HAPPENED IN TASKS.MD**  
**🛑 UPDATE PROGRESS AND SUGGEST NEXT TASK**

## STREAMLINED COMPLETION SEQUENCE

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

APPEND TO LORE LOG using Bash tool with lore_task_complete function:

lore_task_complete \
  "{current-project-name}" \
  "[Task name from TASKS.md]" \
  "[Core problem this task addressed]" \
  "[Reusable pattern or approach that worked]" \
  "[Key code snippet if applicable, or empty string]" \
  "[discovery1,discovery2,discovery3]" \
  "[How implementation differed from plan]" \
  "[Pattern that could be used elsewhere]" \
  "[keyword1 keyword2 keyword3]" \
  "[library1,framework1,tool1]" \
  "[What made this tricky or easy]"

NOTE: If lore_task_complete function not available, source lib/events.sh first:
source ~/development/projects/lore/lib/events.sh

VERIFICATION: Event captured to Lore for future knowledge retrieval

IF LORE_NOT_INSTALLED:
- Skip this phase entirely
- Continue to Phase 2.6
```

### PHASE 2.6: COMMIT AND PUSH

**CHECKPOINT 2.6: Commit Approved Changes**

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
TASK {task-number} COMPLETED ✅
=====================================

Task: [task name and key accomplishment]
Progress: X/Y tasks complete ([percentage]%)
Next Available: [next task number and name, or "All tasks complete!"]
Dependencies Unblocked: [any tasks now ready to start]

Ready for /plan-task [next-task] or /complete-iteration if all done.
```

## ENFORCEMENT MECHANISMS

### Streamlined Validation

- Quick sanity check ensures software still works
- Task properly marked complete in TASKS.md
- Progress reported with clear next steps

### Efficient Workflow

- Leverage work already validated in /plan-task
- Focus on completion and workflow continuation
- Avoid redundant validation of proven functionality

## FAILURE MODES & RECOVERY

**If demo command fails:** Fix issues before marking complete  
**If TASKS.md missing:** Create or locate correct task file  
**If unclear what's next:** Review dependencies and suggest logical sequence

## SUCCESS CRITERIA

Task completion finalized when:

- [ ] Quick sanity check confirms software works
- [ ] Task marked ✅ Complete in TASKS.md with timestamp
- [ ] Progress assessed and reported
- [ ] Next steps clearly identified
- [ ] Workflow guidance provided