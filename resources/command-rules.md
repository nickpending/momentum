# Command Rules

Common rules for all Momentum slash commands.

## Environment Variables (Bash only)

Use `${VAR}` syntax in bash commands:
- `${PROJECT_ROOT}` — Absolute path to project root
- `${PROJECT_NAME}` — Project name
- `${WORKFLOW_PROJECTS}` — Obsidian projects root
- `${OBSIDIAN_DIR}` — Obsidian vault root
- `${MOMENTUM_CACHE}` — Momentum cache directory

## Placeholders

**From context (CAPS):**
- `{PROJECT_ROOT}` — Substitute with actual path
- `{PROJECT_NAME}` — Current project name
- `{WORKFLOW_PROJECTS}` — Obsidian projects root
- `{OBSIDIAN_DIR}` — Obsidian vault root
- `{TASK_NUMBER}` — Task number from arguments

**Generated (lowercase):**
- `{id}` — Random identifier
- `{slug}` — Derived from content
- `{timestamp}` — Current timestamp
