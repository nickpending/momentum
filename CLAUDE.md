# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Momentum is a Claude Code plugin that transforms development workflows through identity-first prompt composition, specialized agents, and evidence-based iterations. It's a shell function + TypeScript hooks + markdown prompts system.

## Technology Stack

- **Runtime**: Bun (for hooks)
- **Hooks**: TypeScript (in `hooks/`)
- **Prompts/Commands**: Markdown with Mustache templating
- **Configuration**: TOML (`~/.config/momentum/config.toml`)
- **Package Manager**: pnpm (for hooks dependencies)

## Common Commands

```bash
# Install/reinstall
./install.sh

# Run hooks locally (from hooks directory)
cd hooks && bun run momentum-session-start-hook.ts

# Check hook syntax
bun build hooks/momentum-session-start-hook.ts --outdir=/dev/null

# Package manager for hooks
cd hooks && pnpm install
```

## Architecture

### Prompt Composition Flow

```
momentum <project>
    │
    ├── bin/momentum (shell script)
    │   └── calls hooks/render-project-prompt.ts
    │
    ├── hooks/render-project-prompt.ts
    │   └── Mustache renders contexts/*.md with config values
    │
    └── Final system prompt:
        project-identity.md
         + base.md
         + voice (from voices/styles/*.toml)
         + verbosity (from voices/verbosity/*.toml)
```

### Key Directories

| Directory | Purpose |
|-----------|---------|
| `contexts/` | System prompt components (identity, base mechanics) |
| `commands/` | Slash commands (markdown with YAML frontmatter) |
| `hooks/` | TypeScript hooks for Claude Code events |
| `subagents/` | Specialized agent definitions |
| `skills/` | Agent skills (exploration, ideation) |
| `voices/styles/` | Personality TOML files |
| `voices/verbosity/` | Response length TOML files |
| `bin/` | Shell executables (momentum, setupd) |
| `templates/` | Project scaffolding templates |
| `resources/` | Design principles, agent rules |

### Hooks System

Hooks in `hooks/` respond to Claude Code events:
- `momentum-session-start-hook.ts` - Initial context injection
- `momentum-user-prompt-submit-hook.ts` - Per-turn metadata injection
- `momentum-stop-hook.ts` - End of response processing
- `momentum-pre-tool-use-hook.ts` / `momentum-post-tool-use-hook.ts` - Tool interception

Hooks use Mustache templating with variables like `{{{PERSONALITY}}}`, `{{{NAME}}}`.

### Workflow Artifacts

When running in a project, state lives in `.workflow/`:
- `.workflow/artifacts/` - TASKS.md, ITERATION.md, PROJECT_SUMMARY.md
- `.workflow/state/` - Saved development state files
- `.workflow/agents/reports/` - Agent output reports
- `.workflow/agents/operators/` - Operator logs

### Agent System

Subagents in `subagents/` are specialized analysis agents:
- `architecture-analyst.md` - Planning phase architecture options
- `architecture-reviewer.md` - Post-implementation complexity review
- `code-reviewer.md` - Evidence-based code review
- `implementation-analyst.md` - Technical approach guidance
- `production-auditor.md` - Release readiness assessment
- `task-planner.md` - Task decomposition and planning

Agents follow rules in `resources/agent-rules.md` for consistent output format.

## Conventions

### Mustache Variables

System prompts use triple-brace Mustache syntax:
- `{{{NAME}}}` - User's name
- `{{{ASSISTANT_NAME}}}` - Assistant identity
- `{{{PROJECT_NAME}}}` - Current project
- `{{{PERSONALITY}}}` - Voice style content
- `{{{VOICE_SECTION}}}` - Voice output formatting
- `{{{VOICE_VERBOSITY}}}` - Response length guidance

### Command Format

Commands in `commands/` use YAML frontmatter:
```yaml
---
name: command-name
description: What this command does
allowed_tools: [Read, Write, Glob, Grep, Bash]
---

Command prompt content here...
```

### Commit Messages

Follow conventional commits: `type(scope): description`
- Types: feat, fix, refactor, test, docs, chore
- Under 72 characters
- Describe what the commit does, not what you did
