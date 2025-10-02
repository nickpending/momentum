# Momentum

<div align="center">

  **Your development workflow partner that ships working software every iteration**

  [GitHub](https://github.com/nickpending/momentum) | [Issues](https://github.com/nickpending/momentum/issues) | [Roadmap](#roadmap)

  [![Status](https://img.shields.io/badge/Status-Active-green?style=flat)](#status-active)
  [![Built for](https://img.shields.io/badge/Built%20for-Claude%20Code-blueviolet?style=flat)](https://claude.ai/download)
  [![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

---

**Momentum** transforms scattered ideas into shipped software through evidence-based iterations. It partners with Claude Code to maintain forward progress, preserve context across memory limits, and embed quality directly into your workflow.

Think of it as having a development partner who never forgets context and always ships working code.

## Status: Active

**This is production-ready software in active daily use.** It's been shipping working software for months across multiple projects. Each iteration strengthens the workflow patterns.

## 🚨 Breaking Changes in 2.0

**If you're upgrading from 1.x, your workflow has changed:**

### What Changed
- **`momentum` now starts in Home mode** - Portfolio command center, not project mode
- **Navigation is semantic** - Say "work on projectname" to switch to project
- **Two-mode system** - Home (assistant) for planning, Project (momentum) for building

### Old Workflow (1.x)
```bash
cd ~/development/projects/myproject
momentum                          # Started directly in project mode
/plan-iteration                   # Immediately available
```

### New Workflow (2.0)
```bash
momentum                          # Starts in Home mode (from anywhere)
"work on myproject"               # Switches to project mode
/plan-iteration                   # Now available
```

### Why This Change
The home mode provides a portfolio-level command center. You can:
- Navigate to any project semantically
- Query across all projects
- Start ideation without project context
- Get development guidance before diving in

### Migration
Re-run `install.sh` to update your shell alias. The new alias includes temporal context and home mode activation.

## ✨ Features

- 🚀 **Context-Aware Conversations** - Dynamic hooks detect semantic patterns and inject relevant context
- 🧠 **Evidence-Based Planning** - AI agents investigate and present options instead of prescriptive solutions
- 🎯 **Working Software First** - Ship functional code every iteration, test after to prove it works
- 📦 **Memory Management** - Save/restore state across Claude's context limits without losing progress
- 🔒 **Quality Embedded** - Risk-based testing and verification built into task completion
- ⚡ **Micro-Tasks** - Each task fits in one conversation, no endless context juggling
- 🎨 **Expert Guidance** - Luminary system provides domain-specific advice from programming legends
- 🛡️ **Behavioral Guards** - Anti-speculation and anti-lazy enforcement prevents hallucination

## 🎬 Quick Start

```bash
# Install Momentum
git clone https://github.com/nickpending/momentum.git
cd momentum
./install.sh

# Start Momentum (from anywhere - enters Home mode)
momentum

# In Claude Home mode, explore an idea
"I have an idea for a habit tracking app"
# (Automatically detects ideation, guides creative conversation)

"save this idea"
# (Creates IDEA.md in configured planning directory)

# Set up project development structure
"work on habit-tracker"
# (Runs setupd --switch, creates project if needed, switches to project mode)

# Now in Project mode - start building
/plan-iteration
# (Collaboratively plan what to build)

/plan-task 1
# (Execute first task with evidence-based completion)
```

**Two modes, seamless flow:**
- **Home mode** - Portfolio command center (ideation, navigation, guidance)
- **Project mode** - Development partner (building, testing, shipping)

That's it! You're shipping working software.

## 🎮 How It Works

Momentum operates in two modes, each optimized for different types of work:

### The Two-Mode System

**Home Mode (Assistant)** - Your portfolio command center
- Start from anywhere: `momentum`
- Navigate projects: "work on projectname"
- Explore ideas without project context
- Query across all projects
- Get high-level development guidance

**Project Mode (Momentum)** - Your development partner
- Accessed via: "work on projectname" from Home mode
- Plan iterations collaboratively
- Execute tasks with evidence-based completion
- Ship working software every iteration

### Development Cycle

```
HOME: IDEATE → NAVIGATE → PROJECT: BUILD → SHIP → HOME: REFLECT → REPEAT
```

### Semantic Interaction

No need to memorize commands. Just talk naturally:

**In Home Mode:**
- "work on projectname" → Switch to project development
- "show projects" → List all your projects
- "what should I work on" → Get guidance on priorities
- "I have an idea for..." → Start ideation conversation
- "I'm stuck" → Get debugging help or suggestions

**In Project Mode:**
- `/plan-iteration` → Collaborative iteration planning
- `/plan-task N` → Evidence-based task execution
- "let's explore" → Load exploration context
- "save this exploration" → Capture exploration to file
- "review the code" → Launch code reviewer (with confirmation)
- "is this over-engineered?" → Architecture review for complexity
- "analyze the architecture for X" → Multi-option architectural analysis
- "how should I implement X" → Technical implementation options
- "set up gitignore" → Configure project security
- "that fixed it!" → Auto-document discovery
- "back to home" → Return to home mode

### The Commands

**In Terminal:**
- `momentum` - Start Claude in Home mode (from anywhere)
- `setupd projectname` - Set up a new project structure (rarely needed - "work on X" handles this)

**In Home Mode:**
- "work on projectname" - Switch to project development
- "show projects" - List all projects
- "what should I work on" - Get guidance on priorities
- Natural ideation conversations

**In Project Mode:**
- `/plan-iteration` - Collaboratively plan what to build next
- `/plan-task N` - Execute specific task with evidence
- `/complete-iteration` - Ship and archive with verification
- `/save-state` / `/restore-state` - Manage context across sessions

**💡 The Flow:** Start with `momentum` (Home mode), then say "work on projectname" to switch to Project mode for building.

## 🏗️ Architecture

Momentum uses a multi-agent architecture optimized for evidence-based decisions:

```
Natural Language Input    Semantic Routing         Specialized Agents
        │                      │                         │
"I have an idea" ──► Ideation Context ──► Creative Discussion
"Review the code" ──► Confirmation ──► Code Reviewer Agent
"Analyze options" ──► Analysis Request ──► Architecture Analyst
        │                      │                         │
        └──► Evidence Collection ──► Options Presentation
```

- **Semantic Routing**: Detects intent from natural language, loads appropriate context
- **Evidence-Based Agents**: Investigate actual code, present multiple verified options
- **Context Management**: Preserves state across Claude's memory limitations
- **Quality Embedded**: Verification and standards built into task completion

## 🔧 Installation

### Prerequisites

- **macOS or Linux**
- **Claude Code CLI** - [Download here](https://claude.ai/download)
- **Bash or Zsh shell**
- **Bun runtime** (optional) - For dynamic context hooks

### Install from Source

```bash
git clone https://github.com/nickpending/momentum.git
cd momentum
./install.sh
```

The installer will ask where you keep code and documentation.

### Configuration

Momentum follows XDG-like patterns:
- Config: `~/.config/momentum/`
- Projects: `~/obsidian/projects/` (configurable)
- Code: `~/development/projects/` (configurable)

## 🚀 Usage Patterns

### Starting Fresh
```bash
cd ~                          # From anywhere for exploration
momentum
"I have an idea for X"        # Natural conversation triggers ideation
"save this idea"              # Creates project in configured location

setupd project-name          # Set up development structure
cd ~/development/projects/project-name
momentum
/plan-iteration              # Start building
```

### Continuing Work
```bash
cd ~/development/projects/myproject
momentum
/plan-task 3                 # Continue specific task
```

### When Context Fills
```bash
/save-state                  # Preserve current progress
# Start new conversation
momentum
/restore-state               # Resume exactly where you left off
```

## 🧪 Advanced Features

### Specialized Agents

Momentum includes specialized AI agents for deep analysis:

```bash
# In conversation - these trigger automatically with confirmation
"Review the code"               # → code-reviewer agent (evidence-based)
"Analyze the architecture"      # → architecture-analyst agent (planning)
"Is this over-engineered?"      # → architecture-reviewer agent (post-implementation)
"Check for production issues"   # → production-auditor agent (comprehensive)
```

**Available Agents:**
- **architecture-analyst** - Presents multiple architectural options with trade-offs (planning phase)
- **implementation-analyst** - Technical approaches for algorithms and data structures
- **architecture-reviewer** - Post-implementation analysis for over-engineering and complexity
- **architecture-auditor** - Identifies drift between planned and actual architecture
- **production-auditor** - Comprehensive production-readiness assessment
- **code-reviewer** - Evidence-based security, quality, and functional correctness review

### Expert Guidance (Luminaries)

Get domain-specific advice from programming legends:

```bash
# After running setupd, configure experts
/setup-luminaries

# Quick expert guidance during development
qlum                    # Poses relevant question from experts
qwwld                   # "What would the luminaries do?"
```

Experts are automatically selected based on your project type (e.g., Rob Pike for CLI tools, John Carmack for performance-critical code).

### Quick Commands

Rapid development shortcuts in Momentum mode:

```bash
# Development
qcheck     # Code review by skeptical senior engineer
qtest      # Write one integration test for current work
qcom       # Stage all changes and commit with conventional message
qpush      # Push to origin main
qfix       # Debug and fix provided error

# Planning
qback      # Add idea/todo/bug to project backlog
qnext      # Suggest logical next step based on current work
qsweep     # Check what needs attention (active tasks, old items)

# Analysis
qenv       # Check environment variable usage vs .env.example
qwhy       # Explain why last command failed and how to fix
qalt       # Suggest alternative approach to current problem
```

## 🔧 Troubleshooting

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

### Semantic routing not working
Ensure Bun is installed for dynamic context hooks:
```bash
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
```

Visit the project directory for comprehensive guides and examples:

- **Core Concepts**: Understanding iterations, tasks, and evidence-based completion
- **Agent System**: How specialized agents investigate and present options
- **Context Management**: Preserving state across Claude's memory limitations
- **Quality Embedding**: Built-in verification and standards enforcement

## 🤝 Contributing

Momentum is built through its own workflow - we ship improvements iteratively:

```bash
# Fork and clone
git fork https://github.com/nickpending/momentum.git
cd momentum

# Start exploring improvements
momentum
"I have an idea to improve X"

# Build and test
setupd momentum-improvement
cd ~/development/projects/momentum-improvement
momentum
/plan-iteration
```

Areas where we'd love contributions:
- Additional specialized agents for domain-specific analysis
- Enhanced semantic routing patterns for natural language detection
- Integration patterns for additional development tools
- Quality embedding patterns for different languages/frameworks

## 📈 Why Momentum?

**The Problem**: Development workflows are either too rigid (waterfall) or too chaotic (just start coding). Context gets lost when Claude's memory fills. Quality is an afterthought.

**The Solution**: Momentum guides evidence-based iterations that always ship working software. Context preserves across sessions. Quality is embedded in completion criteria.

**The Philosophy**: Your development partner should help you think through problems, present options, and ship working code - not make decisions for you.

## Project Structure

```
momentum/
├── commands/           # Core workflow commands
├── contexts/          # Semantic routing contexts
├── subagents/         # Specialized analysis agents
├── templates/         # Project scaffolding templates
├── scripts/           # Installation and setup utilities
└── hooks/            # Dynamic context injection (experimental)
```

## 🎯 Roadmap

**Current** (Active Development):
- [x] Evidence-based agent verification system with anti-hallucination guards
- [x] Semantic routing for natural language interaction via TypeScript hooks
- [x] Collaborative iteration planning (vs prescriptive approaches)
- [x] Multi-option architectural analysis with trade-off presentation
- [x] Post-implementation architecture review for over-engineering detection
- [x] Risk-based testing philosophy over coverage metrics
- [x] Dynamic context injection with Miessler-inspired patterns
- [x] Behavioral guards preventing speculation and lazy analysis

**Next** (v2.0):
- [ ] Enhanced context preservation across longer projects
- [ ] Integration with additional development tools
- [ ] Pattern learning from successful project workflows
- [ ] Cross-project insight sharing
- [ ] Enhanced semantic routing accuracy

**Future** (v3.0+):
- [ ] Language-specific quality patterns
- [ ] Team collaboration workflows
- [ ] Integration with CI/CD pipelines
- [ ] Workflow analytics and optimization

## 📄 License

[MIT](LICENSE) - Use it, fork it, make it better through momentum.

## 🙏 Acknowledgments

Built for and with:
- [Claude Code](https://claude.ai/download) - The AI development environment that makes this possible
- Evidence-based planning principles from successful software teams
- The iteration-first philosophy proven across hundreds of shipped projects

---

<div align="center">

  **Stop planning everything upfront. Start shipping working software.**

  [Get Started](#-quick-start) | [Star on GitHub](https://github.com/nickpending/momentum)

</div>