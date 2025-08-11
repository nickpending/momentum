# Quick project orientation with current tasks and vision

## Step 1: Essential Context ONLY

**LOAD FILES** (in order, if they exist):

1. **READ** `.workflow/artifacts/TASKS.md` - current iteration with embedded context and task status
2. **READ** `.workflow/artifacts/IDEA.md` - understand overall project vision and goals  
3. **READ** `.workflow/artifacts/APP_CONTEXT.md` - project-specific integration patterns (if exists)

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

### If only IDEA.md (and optionally APP_CONTEXT.md) exist:
```
**PROJECT CONTEXT LOADED**
Project: [Brief project description from IDEA.md]
[Include "Integration patterns loaded" if APP_CONTEXT.md found]
No active iteration - run `/decompose-iteration` to create tasks
Files read: [list actual files loaded]

What would you like to do?
```

### If no files exist:
```
**NO CONTEXT FOUND**
No project files found in .workflow/artifacts/

To get started:
- Create IDEA.md in obsidian for project vision
- Run `/decompose-iteration` to create tasks
- Run `/create-app-context` to generate integration patterns

What would you like to do?
```

## Step 3: Wait for Direction

**DO NOT START WORK** - this is an entry point for any command:

## Guidelines

- **MINIMAL LOADING**: Only the two essential files needed to understand project + current iteration
- **FAST AND LIGHT**: Quick project orientation, nothing more

## Error Handling

- **IF** no planned tasks found: **REPORT** "All tasks complete! Run `/decompose-iteration` for next iteration"
- **IF** tasks in progress: **REPORT** "Task #N in progress - use `/plan-task N` to continue or `/restore-state` if needed"
- **NOTE**: Files are now optional - load what exists and report accordingly