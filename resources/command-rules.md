# Command Rules

Common rules for all Momentum slash commands.

## Environment Variables

Available in bash commands (use `${VAR}` syntax):
- `${PROJECT_ROOT}` - Absolute path to project root
- `${PROJECT_NAME}` - Project name
- `${WORKFLOW_PROJECTS}` - Obsidian projects root
- `${MOMENTUM_CACHE}` - Momentum cache directory (saves.log)

## Runtime Values

Use `{var}` for values calculated during execution:
- `{timestamp}` - Generated timestamp
- `{task-number}` - Task number from context or arguments
- `{id}` - Generated identifier
