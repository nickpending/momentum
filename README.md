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

# Start exploring ideas (from anywhere)
cd ~
momentum

# In Claude, start exploring
"I have an idea for a habit tracking app"
# (Momentum automatically detects ideation and guides the conversation)

# Create the project
"save this idea"
# (Creates project in configured directory)

# Set up development (in terminal)
setupd habit-tracker
cd ~/development/projects/habit-tracker

# Start building (from project directory)
momentum
/plan-iteration
```

That's it! You're shipping working software.

## 🎮 How It Works

Momentum follows a simple cycle:

```
EXPLORE → DECIDE → BUILD → SHIP → LEARN → REPEAT
```

### Semantic Interaction

No need to memorize commands. Just talk naturally:

**For Ideation:**
- "I have an idea for..." → Automatic ideation mode
- "What if we built..." → Creative brainstorming
- "Save this exploration" → Captures ideas in the right place

**For Building:**
- `/plan-iteration` → Collaborative iteration planning
- `/plan-task 1` → Evidence-based task execution
- "Review the code" → Launches code reviewer with confirmation

**For Analysis:**
- "Analyze the architecture" → Multi-option architectural analysis (planning phase)
- "Is this over-engineered?" → Post-implementation architecture review
- "Check for production issues" → Comprehensive audit orchestration

### The Commands

**In Terminal:**
- `momentum` - Start Claude with Momentum mode
- `setupd projectname` - Set up a new project structure

**In Claude Code:**
- `/plan-iteration` - Collaboratively plan what to build next
- `/decompose-iteration` - Break iteration into micro-tasks
- `/plan-task N` - Execute specific task with evidence
- `/complete-iteration` - Ship and archive with verification
- `/save-state` / `/restore-state` - Manage context across sessions

**💡 Important:** Location matters:
- **For exploration**: Run `momentum` from anywhere - ideas don't need project context
- **For building**: Run from project directory - commands need project artifacts

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