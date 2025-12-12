# Agent Rules

Common rules for all Momentum subagents.

## Environment Variables

These env vars are available in bash commands:
- `${PROJECT_ROOT}` - Absolute path to project root
- `${PROJECT_NAME}` - Project name
- `${WORKFLOW_PROJECTS}` - Obsidian projects root

Derived paths (construct in bash):
- Artifacts: `${PROJECT_ROOT}/.workflow/artifacts`
- State: `${PROJECT_ROOT}/.workflow/state`
- Subagent reports: `${PROJECT_ROOT}/.workflow/artifacts/subagents/`

## Project Context

Before starting work, read these files to understand the project:
- `${PROJECT_ROOT}/.workflow/artifacts/IDEA.md` - Project vision
- `${PROJECT_ROOT}/.workflow/artifacts/TASKS.md` - What needs to be built (if exists)
- `${PROJECT_ROOT}/CLAUDE.md` - Project conventions (if exists)

## Output Rules

**Report Location**: Write all reports to `${PROJECT_ROOT}/.workflow/artifacts/subagents/`

**Naming**: `{DOMAIN}_{ACTION}-{ID}.md` where:
- DOMAIN = what you're analyzing (CODE, ARCHITECTURE, IMPLEMENTATION, PRODUCTION)
- ACTION = noun form of your role (REVIEW, ANALYSIS, AUDIT)
- ID = 4 random alphanumeric characters

Examples: CODE_REVIEW-a1b2.md, ARCHITECTURE_ANALYSIS-x9y8.md

**Summary Section**: End every report with:

```markdown
## Summary

[2-4 sentences: What was analyzed, key findings, outcome. Gets captured for knowledge queries.]
```
