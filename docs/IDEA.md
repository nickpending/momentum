---
type: project
domain: technical
status: active
started: 2025-08-07
---
# IDEA: Momentum - Iteration-First Development Workflow

## Vision

A development workflow that maintains forward progress through continuous shipping and learning. Ship working software every iteration, learn from real usage, adapt quickly.

## Problem

Current development workflows either:
- Over-plan before building (waterfall tendencies)
- Under-structure iterations (chaos)
- Lose context between work sessions
- Don't capture learning effectively
- Force rigid categorization too early

Developers need a workflow that:
- Captures exploration naturally
- Evolves ideas into projects smoothly
- Maintains context across interruptions
- Embeds quality standards
- Ships frequently to validate assumptions

## Solution

**Momentum** - An iteration-first workflow system that:

1. **Exploration First**: Start with `/ideate` to capture thinking before committing to structure
2. **Interview-Driven Planning**: Gather concrete details through conversation, not assumptions
3. **Embedded Standards**: Tech-specific quality gates built into iteration documents
4. **State Management**: Save/restore context to handle interruptions gracefully
5. **Evidence-Based Progress**: Mark features complete only with working software

## Features

### Core Workflow Features

- **📋 Planned** - Global `/ideate` command for exploration
- **📋 Planned** - Interview-based iteration planning
- **📋 Planned** - Task decomposition with embedded standards
- **📋 Planned** - State save/restore for context management
- **📋 Planned** - Evidence-based task completion
- **📋 Planned** - Automatic archival of completed iterations

### Quality Features

- **📋 Planned** - Embedded linting/formatting in task workflow
- **📋 Planned** - Tech stack detection and standard loading
- **📋 Planned** - Test-after-implementation philosophy
- **📋 Planned** - Integration testing with real services

### Organization Features

- **📋 Planned** - Exploration → Project → Archive lifecycle
- **📋 Planned** - Environment-variable based configuration
- **📋 Planned** - Claude Code slash command integration
- **📋 Planned** - Obsidian + development directory bridging

## Architecture

### Directory Structure
```
obsidian/
├── explorations/     # Active thinking
├── projects/         # Active development  
└── archive/          # Completed work

development/
└── projects/         # Implementation with .workflow/
```

### Command Architecture
- Global commands in `~/.claude/commands/`
- Project commands in `.claude/commands/`
- Workflow artifacts in `.workflow/artifacts/`
- State files in `.workflow/state/`

### Integration Points
- Claude Code via slash commands
- Obsidian for ideation and documentation
- Git for version control
- Docker for service dependencies

## Tech Stack

- **Shell**: Zsh for setupd script
- **Markdown**: All documentation and commands
- **Environment**: Variables for configuration
- **Claude Code**: Primary AI assistant integration

## Constraints

- Must work with Claude Code's slash command system
- Should be shell-agnostic where possible (zsh-only is acceptable)
- No complex dependencies or installations
- Must handle context limits gracefully
- Should work with any programming language

## Success Criteria

- Time from idea to working software < 1 day
- Zero friction for capturing explorations
- Seamless context restoration after interruptions
- Quality gates prevent shipping broken code
- Natural evolution from exploration to implementation

## Open Questions

- How to handle multi-project dependencies?
- Should we version the workflow system itself?
- How to share project templates across teams?
- Integration with CI/CD pipelines?

## Relationship to Other Projects

**Lore**: Momentum generates development artifacts (iterations, discoveries, decisions) that lore indexes. Momentum can query lore for past solutions and patterns when planning new iterations or solving familiar problems.

## Next Steps

1. Test workflow on real project
2. Document installation process
3. Create video walkthrough
4. Share with friends for feedback
5. Iterate based on usage