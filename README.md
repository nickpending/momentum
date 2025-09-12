# Momentum

**Ship working software every iteration.**

A development workflow that turns ideas into working software through rapid iterations. Built for Claude Code.

## What is Momentum?

Momentum is a workflow system that helps you:
- **Start with ideas**, not boilerplate
- **Ship working code** every iteration
- **Never lose context** when Claude runs out of memory
- **Embed quality** directly into your workflow

Instead of planning everything upfront or coding without structure, Momentum guides you through a proven iteration cycle that produces working software quickly.

## Quick Start

### Prerequisites
- [Claude Code CLI](https://claude.ai/download)
- macOS or Linux
- Bash or Zsh shell

### Install

```bash
git clone https://github.com/yourusername/momentum.git
cd momentum
./install.sh
```

The installer will ask where you keep your code and where to store project documentation.

### Your First Project

```bash
# 1. Start Claude with Momentum (from anywhere - home dir is fine)
cd ~
momentum

# 2. In Claude, explore your idea
/ideate "app that tracks daily habits"

# 3. Turn exploration into a project
/plan-idea

# 4. Set up project (in terminal)
setupd habit-tracker
cd ~/development/projects/habit-tracker

# 5. Build your first iteration (in Claude - from project dir)
momentum
/plan-iteration
/decompose-iteration  
/plan-task 1
```

That's it! You're building.

## How It Works

Momentum follows a simple cycle:

```
IDEATE → PLAN → BUILD → SHIP → LEARN → REPEAT
```

Each iteration produces working software. No endless planning. No coding without direction.

### The Commands

Commands run in two places:

**In Terminal:**
- `momentum` - Start Claude with Momentum mode
- `setupd projectname` - Set up a new project

**In Claude Code:**
- `/ideate` - Explore an idea through conversation
- `/plan-idea` - Convert exploration to project vision
- `/plan-iteration` - Plan what to build next
- `/decompose-iteration` - Break features into tasks
- `/plan-task N` - Build specific task
- `/plan-test N` - Write tests for completed task
- `/complete-task N` - Mark task done with evidence
- `/complete-iteration` - Ship and archive
- `/save-state` - Save progress when context fills
- `/restore-state` - Resume from saved state

**💡 Important:** Where you run `momentum` matters:
- **For exploration** (`/ideate`): Run from home dir or anywhere
- **For building** (`/plan-iteration`, `/plan-task`): Run from project directory
- Claude creates `.claude/` in your current directory, so project commands need project context

### The Magic: Context Management

Claude has limited memory. Previous workflows died when hitting context limits. Momentum solves this:

- **Micro-tasks** - Each task fits in one conversation
- **State saving** - `/save-state` when context fills up
- **State restoration** - `/restore-state` to continue exactly where you left off
- **Smart grouping** - Related tasks batch together when it makes sense

You can work on complex projects without losing progress.

## Common Workflows

### Starting Fresh (Exploring Ideas)
```bash
cd ~                 # Start from home dir for exploration
momentum             # Start Claude
/ideate "your idea"  # Explore
/plan-idea          # Create project vision
# Exit Claude
setupd projectname  # Set up directories (in terminal)
cd ~/development/projects/projectname
momentum            # Restart Claude in project dir
/plan-iteration     # Start building
```

### Continuing Work
```bash
cd ~/development/projects/myproject  # Always from project dir
momentum
/load-app-context    # Get oriented
/plan-task 3         # Continue where you left off
```

### When Context Fills Up
```bash
/save-state          # Save current progress
# Start new conversation
momentum
/restore-state       # Pick up exactly where you left off
```

## Philosophy

**Ship working software.** Not perfect software. Working software.

- Build first, test after (tests prove it works)
- Use real services (no mocking internals)
- Complete = it runs and users can use it
- Learn from usage, not speculation

## Troubleshooting

### "Command not found: setupd"
```bash
source ~/.zshrc  # or ~/.bashrc
```

### "Command not found: momentum"
```bash
echo 'alias momentum="claude --append-system-prompt \"$(cat ~/.config/momentum/agents/MOMENTUM.md)\" \"Activate Momentum\""' >> ~/.zshrc
source ~/.zshrc
```

### Claude doesn't recognize /commands
Make sure you're in a project directory:
```bash
setupd myproject
cd ~/development/projects/myproject
momentum
```

## Advanced Features

<details>
<summary>Expert Guidance System (Luminaries)</summary>

Get domain-specific expertise in your project:

```bash
/setup-luminaries    # Configure experts for your project
qlum                # Quick expert sanity check during coding
qwwjd               # "What would [expert] do?"
```

Momentum selects relevant experts based on your project type (e.g., Rob Pike for CLI tools, John Carmack for game servers).
</details>

<details>
<summary>Custom Subagents</summary>

Specialized agents for deep analysis:
- `architecture-analyst` - System structure and patterns
- `implementation-analyst` - Algorithms and technical approaches  
- `architecture-auditor` - Find drift between plan and implementation
- `production-auditor` - Production readiness assessment
</details>

<details>
<summary>Quick Commands</summary>

Rapid development commands in Momentum mode:

**Development:**
- `qcheck` - Code review
- `qtest` - Write one test
- `qcom` - Commit changes
- `qfix` - Debug error

**Planning:**
- `qback` - Add to backlog
- `qnext` - What's next?
- `qsweep` - Check todos
</details>

<details>
<summary>Dynamic Context Hooks (Experimental)</summary>

Momentum includes experimental support for dynamic context injection through hooks:

- **Semantic Routing** - Automatically loads relevant context based on what you're exploring
- **Exploration Mode** - Enhanced exploration conversations with context-aware guidance
- **Auto-save Explorations** - Say "save this exploration" and it knows where to put it

**Requirements:**
- Bun runtime (`curl -fsSL https://bun.sh/install | bash`)
- Hooks are installed per-project by setupd

**How it works:**
When you say things like "let's explore X" or "save this exploration", hooks detect the semantic patterns and inject appropriate context to guide the conversation.
</details>

<details>
<summary>Directory Structure</summary>

Momentum uses two directories:

```
~/obsidian/projects/          # Project documentation
├── explorations/            # Ideas being explored
├── projects/                # Active projects
│   └── myproject/
│       ├── IDEA.md         # Project vision
│       ├── later.md        # Backlog
│       ├── active.md       # Current work
│       └── completed.md    # Done items
└── archive/                # Completed projects

~/development/projects/       # Actual code
└── myproject/
    ├── .workflow/
    │   ├── artifacts/       # Current iteration
    │   ├── state/          # Saved contexts
    │   └── archives/       # Past iterations
    └── [your code]
```
</details>

<details>
<summary>Configuration</summary>

Edit `~/.config/momentum/config` to customize paths:

```bash
export WORKFLOW_DEV="/your/code/directory"
export WORKFLOW_PROJECTS="/your/docs/directory"
```

After changing, run `setupd` again for existing projects to update symlinks.
</details>

## Learn More

- [Full Documentation](docs/) (coming soon)
- [Example Projects](examples/) (coming soon)
- [Video Walkthrough](https://youtube.com/) (coming soon)

## Contributing

Momentum is built through momentum. We ship improvements iteratively:

1. Fork the repo
2. Create your feature branch
3. Ship working improvements
4. Submit a PR with evidence it works

---

**Remember:** The goal is not perfect software. It's software that solves real problems and evolves quickly.