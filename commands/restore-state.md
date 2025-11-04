# Resume work with full context from saved state

**Variables**: Variables in CAPS are injected by hooks (see HTML comments above), `{vars}` are runtime values (find/calculate them), `[vars]` are template placeholders (substitute them).

**Key Paths**:
- STATE_DIR - Saved state files
- ARTIFACTS_DIR - Workflow artifacts (TASKS.md, IDEA.md, ITERATION.md, PROJECT_SUMMARY.md)

## Usage

```bash
/restore-state                                    # Resume most recent state
/restore-state task-3-20250714-1530             # Resume specific state
```

## ⚠️ CRITICAL: RESTORE STATE + FULL CONTEXT ⚠️

**🛑 RESUME FROM STATE (PROJECT CONTEXT ALREADY LOADED)**
**🛑 PROVIDE COMPLETE CONTEXT FOR RESUMPTION**
**🛑 CONTINUE SEAMLESSLY FROM STOPPING POINT**

---

## Step 1: Load Saved State

### Find and Load State File

1. **READ** `STATE_DIR/task-[specified_or_recent].md`
2. **EXTRACT** essential resumption information:
    - Current progress and phase
    - Files changed and their status
    - Next steps for continuation
    - Key decisions made
    - Any blockers or issues
3. **READ** files from "Files Touched" section for work context

## Step 2: Load Extended Context

### Extended Context for Resumption

1. **READ** `ARTIFACTS_DIR/PROJECT_SUMMARY.md` (if exists) - System integration context
2. **READ** `CLAUDE.md` (if exists) - Project development context

### Verify Current Environment

1. **CHECK** files mentioned in state exist and match expected status
2. **RUN** `git status` and compare to saved Git State
3. **VERIFY** project environment is ready for continuation
4. **NOTE** any drift (commits, branch changes, file modifications since save)

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

GIT STATE:
✅ Branch: [current_branch] [if_changed: ⚠️ Was: saved_branch]
✅ Commit: [current_sha] [if_changed: ⚠️ Was: saved_sha]
✅ Status: [clean/dirty] [if_changed_show_diff]

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

1. **UPDATE** `ARTIFACTS_DIR/ITERATION.md` - Remove state reference
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

- **LIST** available state files in `STATE_DIR/`
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