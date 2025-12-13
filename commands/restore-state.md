---
allowed-tools: Read, Bash, Edit
description: Resume work with full context from saved state
---

@../resources/command-rules.md

# Resume work with full context from saved state

## ⚠️ CRITICAL: RESTORE STATE + FULL CONTEXT

**REQUIRED:**
- Resume from state (project context already loaded)
- Provide complete context for resumption
- Continue seamlessly from stopping point

## Core Instructions

### Step 1: Load Saved State

### Find and Load State File

1. **READ** `${PROJECT_ROOT}/.workflow/state/state-{specified_or_recent}.md`
2. **EXTRACT** essential resumption information:
    - Current progress and phase
    - Files changed and their status
    - Next steps for continuation
    - Key decisions made
    - Any blockers or issues
3. **READ** files from "Files Touched" section for work context

### Step 2: Load Extended Context

### Extended Context for Resumption

1. **READ** `${PROJECT_ROOT}/.workflow/artifacts/PROJECT_SUMMARY.md` (if exists) - System integration context
2. **READ** `CLAUDE.md` (if exists) - Project development context

### Verify Current Environment

1. **CHECK** files mentioned in state exist and match expected status
2. **RUN** `git status` and compare to saved Git State
3. **VERIFY** project environment is ready for continuation
4. **NOTE** any drift (commits, branch changes, file modifications since save)

### Step 3: Restore Implementation Context

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

1. **UPDATE** `${PROJECT_ROOT}/.workflow/artifacts/ITERATION.md` - Remove state reference
2. **MAINTAIN** task as 🔄 In Progress
3. **READY** for continued implementation

### Step 4: Continue Implementation

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

- **LIST** available state files in `${PROJECT_ROOT}/.workflow/state/`
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

Command succeeds when:

- [ ] Full project context loaded (equivalent to /load-app-context)
- [ ] Saved implementation state restored
- [ ] Clear understanding of where to continue
- [ ] No loss of implementation progress
- [ ] Clear next actions identified
- [ ] Full context available for quality implementation