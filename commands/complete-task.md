# Validate task completion with evidence of working functionality

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

### PHASE 3: PROGRESS REPORT (REQUIRED)

**CHECKPOINT 3: Workflow Guidance**

```
REQUIRED: Report progress and suggest next steps:
- COUNT completed vs remaining tasks
- IDENTIFY next available task(s) based on dependencies
- ASSESS overall iteration progress

COMPLETION REPORT:
=====================================
TASK $TASK_NUMBER COMPLETED ✅
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