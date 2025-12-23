---
allowed-tools: Read
description: Quick project orientation with current tasks and vision
---

@../resources/command-rules.md

# Quick project orientation with current tasks and vision

## Core Instructions

### Step 1: Load Context

**READ**:

1. `{PROJECT_ROOT}/.workflow/artifacts/PROJECT_SUMMARY.md`
2. `{PROJECT_ROOT}/.workflow/artifacts/TASKS.md`

### Step 2: Report Status

**IMMEDIATELY** output relevant status based on what was found:

### If TASKS.md exists:
```
**CONTEXT LOADED**
Project: [Brief project description from IDEA.md if available]
Current iteration: [Iteration number and name from TASKS.md]
Task progress: [X of Y tasks complete]
Tasks status:
  📋 Planned: [count] tasks
  🔄 In Progress: [count] tasks  
  ✅ Complete: [count] tasks

Next available task: [Task #N] - [DESCRIPTION] (if any)
Files read: [list actual files loaded]

What would you like to do?
```

### If only PROJECT_SUMMARY.md exists:
```
**PROJECT CONTEXT LOADED**
Project: [Brief project description from PROJECT_SUMMARY.md]
No active iteration - run `/decompose-iteration` to create tasks
Files read: [list actual files loaded]

What would you like to do?
```

### If no files exist:
```
**NO CONTEXT FOUND**
No project files found in artifacts directory

To get started:
- Create IDEA.md in obsidian for project vision
- Run `/decompose-iteration` to create tasks

What would you like to do?
```

### Step 3: Wait for Direction

**DO NOT START WORK** - this is an entry point for any command.

## Success Criteria

Command succeeds when:

- [ ] PROJECT_SUMMARY.md and TASKS.md read attempted
- [ ] Status reported based on files found
- [ ] User given appropriate next action based on context
- [ ] No work started automatically

## Error Handling

- **IF** no planned tasks found: **REPORT** "All tasks complete! Run `/decompose-iteration` for next iteration"
- **IF** tasks in progress: **REPORT** "Task #N in progress - use `/plan-task N` to continue or `/restore-state` if needed"
- **NOTE**: Files are now optional - load what exists and report accordingly