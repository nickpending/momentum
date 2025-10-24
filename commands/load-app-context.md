# Quick project orientation with current tasks and vision

**Variables**: Variables in CAPS are injected by hooks (see HTML comments above), `{vars}` are runtime values (find/calculate them), `[vars]` are template placeholders (substitute them).

**Key Paths**:
- `{project-root}` - Current project directory (find by locating .workflow/ directory)
- WORKFLOW_PROJECTS - Obsidian projects directory (injected)
- WORKFLOW_DEV - Development projects root (injected)

## Step 1: Load Context

**READ**:

1. `{project-root}/.workflow/artifacts/PROJECT_SUMMARY.md`
2. `{project-root}/.workflow/artifacts/TASKS.md`

## Step 2: Report Status

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
No project files found in {project-root}/.workflow/artifacts/

To get started:
- Create IDEA.md in obsidian for project vision
- Run `/decompose-iteration` to create tasks

What would you like to do?
```

## Step 3: Wait for Direction

**DO NOT START WORK** - this is an entry point for any command.

## Error Handling

- **IF** no planned tasks found: **REPORT** "All tasks complete! Run `/decompose-iteration` for next iteration"
- **IF** tasks in progress: **REPORT** "Task #N in progress - use `/plan-task N` to continue or `/restore-state` if needed"
- **NOTE**: Files are now optional - load what exists and report accordingly