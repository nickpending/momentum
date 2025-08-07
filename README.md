# Momentum

**Ship working software every iteration. Learn from real usage. Adapt quickly.**

An iteration-first development workflow that maintains forward progress through continuous shipping and learning. Designed for Claude Code but works with any AI coding assistant.

## Quick Start

```bash
# Install momentum
./install.sh claude    # or: cursor, manual

# Start exploring an idea (globally available)
/ideate "interesting problem"

# When ready to build, set up a project
setupd myproject

# Start iterating
cd $WORKFLOW_DEV/myproject
/plan-iteration    # Plan what to build
/plan-task 1       # Build it
```

## Core Philosophy

### Iteration-First Development
Every iteration must produce **working software** that solves real problems.

```
IDEATE → PLAN ITERATION → LOOP (
    PLAN TASK → IMPLEMENT → TEST → COMPLETE TASK
) → COMPLETE ITERATION → SHIP → LEARN → repeat
```

The workflow enforces quality through:
- Interview-based planning (gather real requirements)
- Embedded standards (linting/quality built into tasks)
- Evidence-based completion (prove it works)
- Test-after-implementation (tests prove functionality)

### Evidence-Based Progress
- Only mark features ✅ Built when users can accomplish their intended goals
- Tests prove it works, don't write tests during development  
- Ship frequently to maximize learning opportunities
- Default to simple solutions unless real evidence demands complexity

## Workflow Structure

### Exploration → Project → Archive

```
$WORKFLOW_PROJECTS/               # Obsidian workspace
├── explorations/                 # Active thinking (created by /ideate)
│   └── 2025-01-16-auth-patterns/
├── projects/                     # Active development
│   └── myproject/
│       └── IDEA.md
└── archive/                      # Completed/abandoned
    └── 2025/

$WORKFLOW_DEV/myproject/          # Development workspace
├── .claude/
│   └── commands/                 # → symlink to workflow commands
├── .workflow/
│   ├── artifacts/                # Current iteration files
│   │   ├── IDEA.md              # → symlink to obsidian
│   │   ├── ITERATION.md         # Current features
│   │   └── TASKS.md             # Decomposed tasks
│   ├── archives/                # Completed iterations
│   ├── state/                   # Saved contexts
│   ├── templates/               # → symlink
│   └── resources/               # → symlink
└── [your code...]
```

### Workflow Commands

**Exploration:**
- `/ideate` - Start exploring an idea through discussion (global command)

**Planning:**
- `/plan-iteration` - Interview-based iteration planning with embedded standards
- `/decompose-iteration` - Break features into implementable tasks
- `/plan-task` - Create implementation plan with linting/quality checks

**Implementation:**
- `/load-app-context` - Quick project orientation
- `/save-state` - Capture discoveries, decisions, and progress
- `/restore-state` - Resume work with full context

**Testing:**
- `/plan-test` - Write tests for implemented features

**Completion:**
- `/complete-task` - Validate task completion with evidence
- `/complete-iteration` - Archive iteration and prepare for next

### Feature Status Flow

Features progress through defined states:

- **📋 Planned** → Ready for iteration planning
- **🔄 In Progress** → Currently being developed (iteration-N) 
- **✅ Built** → Completed with evidence of user accessibility

## Agent Support

### Claude (Automatic)
```bash
# Basic install (template with placeholder values)
./install.sh claude

# Personalized install (replaces template variables with your details)
./install.sh claude --name="Your Name" --git-email="you@example.com" --email="your@email.com" --timezone="America/New_York"
```

### Other Tools (Manual)
```bash  
./install.sh manual
# Copy agents/CLAUDE.md to your tool's config location
```

**Important**: The workflow creates slash commands in `.claude/commands/` for Claude Code compatibility. The internal workflow still uses `.workflow/` for artifacts and resources.

## Configuration

### User Configuration File: `~/.config/workflow/config`

The install script creates your personal config file from the template. Edit this file to customize paths:

```bash
# Edit your personal config
vim ~/.config/workflow/config

# Core Paths (customize these)
export WORKFLOW_PROJECTS="${WORKFLOW_PROJECTS:-$HOME/obsidian/projects}"  # Ideation files
export WORKFLOW_DEV="${WORKFLOW_DEV:-$HOME/development/projects}"         # Development projects  
export WORKFLOW_HOME="${WORKFLOW_HOME:-$HOME/development/projects/momentum}"  # Momentum system location
```

### How Configuration Works

1. **Install**: `install.sh` copies `config` template to `~/.config/workflow/config`
2. **Shell**: Your shell sources the config (added to `~/.zshrc`)
3. **setupd**: Reads your config to know where to create projects
4. **Agent**: Uses environment variables for quick commands (qback, qdiscovery)

The config bridges the workflow system with your specific directory structure.

### Moving or Renaming Momentum

If you rename the momentum directory or move your folders:

1. Update the paths in `~/.config/workflow/config`:
   - `WORKFLOW_HOME` - momentum repository location
   - `WORKFLOW_PROJECTS` - obsidian projects location  
   - `WORKFLOW_DEV` - development projects location

2. Source the updated config:
   ```bash
   source ~/.config/workflow/config
   ```

3. **Re-run setupd for existing projects** to fix symlinks:
   ```bash
   setupd myproject  # Recreates symlinks with new paths
   ```

Note: Symlinks are created with resolved paths, not environment variables, so they must be recreated after moving directories.

### Integration with Obsidian
- **IDEA.md** lives in `$WORKFLOW_PROJECTS/{name}/` (ideation/vision)
- **01-backlog.md** lives in obsidian (project management)
- **Discoveries** live in obsidian (architectural decisions)

The workflow bridges **ideation** (obsidian) with **implementation** (development).

## Optional Integration: Claudex Standards

Momentum can integrate with [Claudex](https://github.com/nickpending/claudex) for language-specific coding standards:

- Standards are loaded by `/plan-iteration` and embedded in ITERATION.md
- Provides tech-specific linting, patterns, and quality gates
- Install separately at `~/.claudex/standards/`
- Not required - momentum works without it

## Quality Standards

### Built-in Principles
- **No mocking internal code** - Only mock external APIs (OpenAI, Stripe, email)
- **No browser automation for basic tests** - Test APIs directly, components with testing libraries
- **Real services default** - Use actual DB, APIs, WebSocket in tests
- **Security by default** - Input validation, env vars for secrets, no sensitive data in logs

### Quick Commands
The agent configuration includes rapid development commands:

- **qcheck** - Skeptical senior engineer code review
- **qtest** - Write ONE integration test using real services
- **qcom** - Commit with conventional message
- **qfix** - Debug and fix specific error
- **qback** - Add to project backlog in obsidian

## Architecture Patterns

### Composition Over Monoliths
- Break complex problems into single-purpose tools with clean interfaces
- Tools communicate via data contracts, not shared implementations  
- Each tool follows single application development pattern
- Extract tools only when composition provides clear value

### Working Software First
- Build core functionality first, add features based on real usage
- Keep each iteration shippable and valuable
- Add complexity only when real usage demands it
- Refactor when technical debt measurably slows iteration velocity

## Prerequisites

### Directory Structure

Momentum works with two workspace directories (they can be the same if you prefer):

1. **Ideation workspace** - Where you capture ideas, explorations, and project documentation
   - Default: `~/obsidian/projects/`
   - This is where IDEA.md, explorations, and archives live
   - Can be any directory, preferably synced (Obsidian, Notion, etc.)

2. **Development workspace** - Where you write code
   - Default: `~/development/projects/`
   - This is where actual code projects live
   - Can be the same as ideation workspace if you prefer everything together

```bash
# Create default structure (optional - installer will create if missing)
mkdir -p ~/obsidian/projects
mkdir -p ~/development/projects
```

You can customize these paths in `~/.config/workflow/config` after installation.

## Installation

```bash
cd ~/development/projects
git clone https://github.com/nickpending/momentum.git
cd momentum
./install.sh claude --name="Your Name" --git-email="you@example.com" --email="you@company.com" --timezone="America/New_York"
```

This installs:
- Workflow commands to project `.claude/commands/`
- Global `/ideate` command to `~/.claude/commands/`
- Personalized agent configuration
- Obsidian exploration structure

## File Organization

```bash
momentum/                         # This repository
├── agents/
│   └── CLAUDE.md                # Agent configuration template
├── bin/
│   └── setupd                   # Project setup script  
├── commands/                    # Workflow commands
│   ├── ideate.md               # Global exploration command
│   ├── plan-iteration.md       # Planning commands
│   ├── plan-task.md           
│   └── ...                     
├── templates/                   # Document templates
├── resources/                   # Design principles
├── config                       # Environment configuration
└── install.sh                   # System installer

~/.config/workflow/config        # User configuration
~/.claude/commands/              # Global commands
$WORKFLOW_PROJECTS/              # Obsidian workspace
└── explorations/               # Active explorations
    projects/                   # Active development  
    archive/                    # Completed work

## Example Usage

### Starting a New Project

```bash
# 1. Create IDEA.md in obsidian with project vision and features
# 2. Set up development environment
setupd myproject

# 3. Plan first iteration  
cd $WORKFLOW_DEV/myproject
# Use /plan-iteration in your AI tool

# 4. Break down features into tasks
# Use /decompose-iteration in your AI tool

# 5. Implement tasks iteratively
# Use /plan-task, implement, /complete-task cycle

# 6. Ship iteration
# Use /complete-iteration to archive and prepare next cycle
```

### Continuing Existing Project

```bash  
cd $WORKFLOW_DEV/myproject
# Use /load-app-context for quick orientation
# Continue with task implementation or start new iteration
```

## Success Metrics

- **Time from idea to working software** - How quickly can we validate assumptions
- **Learning velocity** - How quickly do we discover what users actually need  
- **User value delivered** - Measured through usage, feedback, and outcomes
- **Iteration frequency** - How often we can ship and learn

---

**Remember: The goal is not to build perfect software. The goal is to build software that solves real problems and can evolve quickly as understanding improves.**