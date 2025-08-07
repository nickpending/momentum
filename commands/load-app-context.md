# Quick project orientation with current tasks and vision

## Step 1: Essential Context ONLY

**REQUIRED FILES** (load these in order):

1. **READ** `.workflow/artifacts/TASKS.md` - current iteration with embedded context and task status
2. **READ** `.workflow/artifacts/IDEA.md` - understand overall project vision and goals

**THAT'S IT.** No other files needed.

## Step 2: Report Status

**IMMEDIATELY** output:

```
**CONTEXT LOADED**
Project: [Brief project description from IDEA.md]
Current iteration: [Iteration number and name from TASKS.md]
Task progress: [X of Y tasks complete]
Tasks status:
  📋 Planned: [count] tasks
  🔄 In Progress: [count] tasks  
  ✅ Complete: [count] tasks

Next available task: [Task #N] - [DESCRIPTION] (if any)
Files read: TASKS.md, IDEA.md

What would you like to do?
```

## Step 3: Wait for Direction

**DO NOT START WORK** - this is an entry point for any command:

## Guidelines

- **MINIMAL LOADING**: Only the two essential files needed to understand project + current iteration
- **FAST AND LIGHT**: Quick project orientation, nothing more

## Error Handling

- **IF** `.workflow/artifacts/TASKS.md` not found: **REPORT** "Missing TASKS.md - run `/decompose-iteration` first"
- **IF** `.workflow/artifacts/IDEA.md` not found: **REPORT** "Missing IDEA.md - create project vision in obsidian first"
- **IF** no planned tasks found: **REPORT** "All tasks complete! Run `/decompose-iteration` for next iteration"
- **IF** tasks in progress**: **REPORT** "Task #N in progress - use `/plan-task N` to continue or `/restore-state` if needed"