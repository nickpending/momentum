# Momentum

**Ship working software every iteration. Learn from real usage. Adapt quickly.**

An iteration-first development workflow that maintains forward progress through continuous shipping and learning. Designed for Claude Code but works with any AI coding assistant.

## Quick Start

```bash
# Install momentum
./install.sh claude    # or: cursor, manual

# Start exploring an idea (globally available)
/ideate "interesting problem"

# Transform exploration into project vision
/plan-idea

# Set up development environment
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

### Custom Slash Commands (The Magic)

These custom commands turn Claude Code into a development powerhouse. They're not just shortcuts - they enforce the iteration workflow and embed quality standards directly into your process.

**The Context Window Solution:**
Previous workflows failed when tasks were too large to complete before hitting context limits. Momentum solves this:
- `/decompose-iteration` breaks features into micro-tasks (1-2 files each, single responsibility)
- Each task is sized to complete within one AI conversation
- `/plan-task` intelligently groups related micro-tasks when it makes sense
- Result: Tasks actually complete instead of dying mid-implementation

**Exploration Phase:**
- `/ideate` - Start exploring through conversation, not premature file creation (global command)
  - Interviews you about the idea
  - Creates exploration artifacts only when requested
  - Bridges unstructured thinking → structured project

- `/plan-idea` - Transform exploration into concrete project vision (global command)
  - Loads existing explorations for continuation
  - Dynamic interview based on exploration content
  - Creates IDEA.md in obsidian project space
  - Bridges exploration → project structure

**Planning Commands:**
- `/plan-iteration` - Interview-based iteration planning
  - Asks concrete questions about what you're building
  - Analyzes `later.md` and recommends relevant items
  - Moves selected items to `active.md` with promoted date
  - Embeds tech-specific standards into ITERATION.md
  - Forces you to define evidence of completion
  
- `/decompose-iteration` - Break features into implementable tasks
  - Turns high-level features into concrete work items
  - Adds linting/quality gates to each task
  - Creates actionable TASKS.md

- `/plan-task [N]` - Create implementation plan for specific task
  - Loads task context and standards
  - Creates step-by-step implementation guidance
  - Includes verification steps

**Development Commands:**
- `/load-app-context` - Quick project orientation
  - Loads IDEA, current iteration, tasks, and discoveries
  - Perfect for resuming work or onboarding
  
- `/save-state` - Capture discoveries and decisions
  - Saves technical discoveries that cause context overflow
  - Documents architectural decisions
  - Preserves open questions and breakthroughs
  
- `/restore-state` - Resume with full context
  - Reloads all saved states
  - Reconstructs working context
  - Continues exactly where you left off

**Quality Commands:**
- `/plan-test` - Write tests after implementation
  - Tests prove functionality, not drive development
  - Uses real services by default
  - Follows existing test patterns

**Shipping Commands:**
- `/complete-task [N]` - Validate task completion
  - Requires evidence of working functionality
  - Updates task status with proof
  - Maintains momentum through clear completion
  
- `/complete-iteration` - Archive and prepare next cycle
  - Archives completed iteration
  - Moves checked items from `active.md` to `completed.md`
  - Updates feature statuses in IDEA.md
  - Sets up for next iteration

### Custom Subagents

Momentum includes specialized subagents for deep analysis:

- **architecture-analyst** - Determines system structure, patterns, and integration points
- **implementation-analyst** - Defines algorithms, data structures, and technical approaches
- **architecture-auditor** - Audits what actually got built vs what was planned (finds dead code, violations, drift)

The `/plan-task` command can invoke the analysts for complex features, or you can call any of them directly. They output detailed guidance to `.workflow/artifacts/subagents/`.

### Feature Status Flow

Features progress through defined states:

- **📋 Planned** → Ready for iteration planning
- **🔄 In Progress** → Currently being developed (iteration-N) 
- **✅ Built** → Completed with evidence of user accessibility

## Installation

```bash
cd ~/development/projects
git clone https://github.com/nickpending/momentum.git
cd momentum
./install.sh
```

This installs:
- Momentum system to `~/.config/momentum/`
- Global commands (like `/ideate`) to `~/.claude/commands/`
- Custom subagents to `~/.claude/agents/`
- `setupd` command to `~/.local/bin/`
- Configuration to `~/.config/momentum/config`

**Note**: Your personal CLAUDE.md is preserved. Momentum uses its own MOMENTUM.md agent configuration.

## Configuration

### User Configuration File: `~/.config/momentum/config`

The install script creates your personal config file. Edit this file to customize paths:

```bash
# Edit your personal config
vim ~/.config/momentum/config

# Core Paths (customize these)
export WORKFLOW_PROJECTS="${WORKFLOW_PROJECTS:-$HOME/obsidian/projects}"  # Ideation files
export WORKFLOW_DEV="${WORKFLOW_DEV:-$HOME/development/projects}"         # Development projects
```

### How Configuration Works

1. **Install**: `install.sh` creates config at `~/.config/momentum/config`
2. **Shell**: Your shell sources the config (added to `~/.zshrc`)
3. **setupd**: Reads your config to know where to create projects
4. **Momentum mode**: Uses environment variables for workflow operations

The config bridges the workflow system with your specific directory structure.

### Understanding Variables in Workflow Files

When you see variables in workflow artifacts (TASKS.md, ITERATION.md, etc.), here's what they mean:

- **`$VARIABLES`** - Environment variables from your config (like `$WORKFLOW_PROJECTS`)
- **`{variables}`** - Runtime values calculated by the system (like `{project-root}`)  
- **`[variables]`** - Template placeholders you fill in (like `[task-name]`)

### Customizing Paths

If you need to change your workspace locations:

1. Update the paths in `~/.config/momentum/config`:
   - `WORKFLOW_PROJECTS` - obsidian projects location  
   - `WORKFLOW_DEV` - development projects location

2. Source the updated config:
   ```bash
   source ~/.config/momentum/config
   ```

3. **Re-run setupd for existing projects** to fix symlinks:
   ```bash
   setupd myproject  # Recreates symlinks with new paths
   ```

Note: Symlinks are created with resolved paths, not environment variables, so they must be recreated after moving directories.

### Integration with Obsidian

The workflow bridges **ideation** (obsidian) with **implementation** (development) through a task lifecycle:

#### Task Lifecycle: `later.md` → `active.md` → `completed.md`

1. **later.md** - Backlog of ideas, todos, and bugs
   - Lives in `$WORKFLOW_PROJECTS/{projectname}/`
   - Items waiting to be worked on
   - Format: `- type:: Description id::xxxxx captured:: YYYY-MM-DD`

2. **active.md** - Current work in progress
   - Lives in `$WORKFLOW_PROJECTS/{projectname}/`
   - Items selected during `/plan-iteration`
   - Two sections: Today (urgent) and This Week (iteration scope)
   - Format: `- [ ] Description id::xxxxx captured:: date promoted:: date`

3. **completed.md** - Historical record
   - Lives in `$WORKFLOW_PROJECTS/{projectname}/`
   - Items moved here during `/complete-iteration`
   - Organized by month and date
   - Format: `- Description id::xxxxx captured:: date completed:: YYYY-MM-DD HH:MM`

#### Other Obsidian Files
- **IDEA.md** - Project vision and feature tracking
- **Discoveries** - Architectural decisions and learnings

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
- **qback** - Add to project later.md in obsidian

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

You can customize these paths in `~/.config/momentum/config` after installation.

## File Organization

```bash
momentum/                         # This repository
├── agents/
│   └── MOMENTUM.md              # Momentum mode agent configuration
├── bin/
│   └── setupd                   # Project setup script  
├── user-commands/               # Global user commands
│   ├── ideate.md               # Exploration command
│   └── plan-idea.md            # Exploration to project command
├── commands/                    # Project workflow commands
│   ├── plan-iteration.md       # Planning commands
│   ├── plan-task.md           
│   └── ...   
├── subagents/                   # Custom analysis agents
│   ├── architecture-analyst.md
│   └── implementation-analyst.md                  
├── templates/                   # Document templates
├── resources/                   # Design principles
├── config                       # Environment configuration
└── install.sh                   # System installer

~/.config/momentum/config        # User configuration
~/.claude/commands/              # Global commands
$WORKFLOW_PROJECTS/              # Obsidian workspace
└── explorations/               # Active explorations
    projects/                   # Active development  
    archive/                    # Completed work
```

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