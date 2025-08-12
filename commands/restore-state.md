# Resume work with full context from saved state

## Usage

```bash
/restore-state                                    # Resume most recent state
/restore-state task-3-20250714-1530             # Resume specific state
```

## ⚠️ CRITICAL: RESTORE STATE + FULL CONTEXT ⚠️

**🛑 LOAD SAVED STATE + EQUIVALENT OF /load-app-context**  
**🛑 PROVIDE COMPLETE CONTEXT FOR RESUMPTION**  
**🛑 CONTINUE SEAMLESSLY FROM STOPPING POINT**

---

## Step 1: Load Saved State

### Find and Load State File

1. **READ** `.workflow/state/task-[specified_or_recent].md`
2. **EXTRACT** essential resumption information:
    - Current progress and phase
    - Files changed and their status
    - Next steps for continuation
    - Key decisions made
    - Any blockers or issues

## Step 2: Load Full Project Context

### Core Context (same as /load-app-context)

1. **READ** `.workflow/artifacts/TASKS.md` - Current task list and status
2. **READ** `.workflow/artifacts/IDEA.md` - Overall project vision and goals

### Extended Context for Resumption

3. **READ** `.workflow/artifacts/ITERATION.md` - Complete iteration with embedded standards
4. **READ** `.workflow/artifacts/APP_CONTEXT.md` (if exists) - System integration context
5. **READ** `CLAUDE.md` (if exists) - Project development context

### Verify Current Environment

1. **CHECK** files mentioned in state exist and match expected status
2. **VERIFY** project environment is ready for continuation

## Step 3: Restore Implementation Context

### Context Integration

```
=====================================
STATE + CONTEXT RESTORED
=====================================

📂 State File: task-[task_number]-[timestamp]
🎯 Project: [project_name_from_idea]
🔄 Task: #[task_number] - [task_name]
📊 Progress: [saved_progress_description]

ITERATION CONTEXT LOADED:
✅ Complete iteration with embedded standards
✅ Design principles and implementation guidelines
✅ Tech stack patterns and constraints
✅ Task requirements and success criteria

SAVED STATE RESTORED:
✅ Current progress: [current_phase]
✅ Files changed: [file_count] files in various states
✅ Key decisions: [decision_count] implementation decisions
✅ Next steps: [next_step_count] actions identified

READY TO RESUME FROM:
[resume_point_from_state]

IMMEDIATE NEXT ACTION:
[first_next_step]
```

### Update Task Status

1. **UPDATE** `.workflow/artifacts/ITERATION.md` - Remove state reference
2. **MAINTAIN** task as 🔄 In Progress
3. **READY** for continued implementation

## Step 4: Continue Implementation

### Implementation Continuation

- **APPLY** embedded standards from ITERATION.md
- **FOLLOW** saved implementation decisions
- **EXECUTE** next steps from saved state
- **MAINTAIN** architectural consistency

### Context Awareness

- **MONITOR** context usage during continued work
- **SAVE** state again if context fills up
- **WORK** toward task completion with full context

---

## Error Handling

**IF** state file not found:

- **LIST** available state files in `.workflow/state/`
- **OFFER** to start fresh with `/load-app-context` equivalent

**IF** iteration context missing:

- **REPORT** missing ITERATION.md or IDEA.md
- **SUGGEST** running `/plan-iteration` first

**IF** environment mismatch:

- **IDENTIFY** file state mismatches
- **SUGGEST** corrections needed
- **WAIT** for environment fixes before continuing

**IF** state is unclear:

- **ASK** for clarification on current progress
- **REQUEST** guidance on next steps
- **PROVIDE** best-effort context restoration

---

## Success Criteria

**Complete Context Restoration:**

- Full project context loaded (equivalent to /load-app-context)
- Saved implementation state restored
- Clear understanding of where to continue

**Efficient Resumption:**

- No loss of implementation progress
- Clear next actions identified
- Full context available for quality implementation