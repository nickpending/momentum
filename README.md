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

## 🚨 Breaking Changes in 4.0.0

**If you're upgrading from 3.x:**

### What Changed
- **Project-Only Architecture** - Assistant mode eliminated, Momentum is now purely project-focused
- **Workspace Mode** - Run `momentum` with no args for exploration without project constraints
- **State-Based Startup** - Automatic detection and guidance through project lifecycle
- **Simplified Hooks** - Removed dual-mode complexity, faster context injection

### What This Means
- **No more assistant mode** - `momentum` launches workspace, `momentum <project>` launches project
- **Cleaner workflow** - One mode, state-driven progression (new → vision → planned → active)
- **Faster startup** - Removed ~500 lines of mode-switching code

### Migration Steps
1. Run `./install.sh` to upgrade to 4.0.0
2. Remove any shell aliases/functions for old momentum command
3. Use `momentum` for exploration, `momentum <project>` for building

**No backward compatibility** - This is a clean architectural simplification.

## ✨ Features

- 🚀 **Context-Aware Conversations** - Dynamic hooks detect semantic patterns and inject relevant context
- 🧠 **Evidence-Based Planning** - AI agents investigate and present options instead of prescriptive solutions
- 🎯 **Working Software First** - Ship functional code every iteration, test after to prove it works
- 📦 **Memory Management** - Save/restore state across Claude's context limits without losing progress
- 🔒 **Quality Embedded** - Risk-based testing and verification built into task completion
- ⚡ **Micro-Tasks** - Each task fits in one conversation, no endless context juggling
- 🎨 **Expert Guidance** - Luminary system provides domain-specific advice from programming legends
- 🛡️ **Behavioral Guards** - Anti-speculation and anti-lazy enforcement prevents hallucination
- 🎙️ **Voice System** - Configurable personality (jarvis/professional/casual) and verbosity levels
- 🔊 **TTS Integration** - Optional text-to-speech for voice summaries via lspeak (progressive enhancement)
- 📁 **Knowledge Capture** - CAPTURE lines preserve insights across sessions via lore integration
- 📊 **Three-Layer Observability** - JSONL forensics, Lore knowledge, and Argus real-time dashboard
- 🎭 **MCP Integration** - Playwright MCP server for browser automation in projects

## 🎬 Quick Start

```bash
# Install Momentum
git clone https://github.com/nickpending/momentum.git
cd momentum
./install.sh

# Option 1: Workspace mode (exploration, ideation, research)
momentum
# Full capabilities, no project constraints

# Option 2: Project mode (building software)
momentum habit-tracker
# Creates directories if needed, guides through ideation → planning → building

# In project mode, start building
/plan-iteration     # Plan what to build
/plan-task 1        # Execute first task with evidence
```

**Two modes:**
- `momentum` - Workspace for exploration, ideation, lore research
- `momentum <project>` - Project mode for building and shipping

**State progression:**
- **new** → Offers ideation to capture vision
- **vision** → Suggests `/plan-iteration` to start planning
- **planned** → Suggests `/decompose-iteration` to create tasks
- **active** → Shows progress, suggests next task

That's it! You're shipping working software.

## 🎮 How It Works

Momentum is a project-focused development workflow system with two modes:

### Workspace Mode

**For exploration and ideation:**
```bash
momentum
```

**What you get:**
- Full momentum capabilities without project constraints
- Use ideation to create new projects
- Use lore for research and knowledge queries
- Use exploration for thinking through problems
- When you create a project, momentum guides you: "Run `momentum <project>` to start building"

### Project Mode

**For building software:**
```bash
momentum <project-name>
```

**State-based progression:**
1. **new** (no IDEA.md) → Offers ideation to capture vision
2. **vision** (has IDEA.md) → Suggests `/plan-iteration` to start planning
3. **planned** (has ITERATION.md) → Suggests `/decompose-iteration` to create tasks
4. **active** (has TASKS.md) → Shows iteration status, suggests next task

**Then you build:**
- Execute tasks with `/plan-task N`
- Ship working software every iteration
- Complete iteration with `/complete-iteration`

### Development Cycle

```
EXPLORE → IDEATE → PLAN → DECOMPOSE → BUILD → SHIP → REPEAT
   ↓         ↓        ↓         ↓         ↓       ↓
workspace   new   vision   planned   active   active
```

### Semantic Interaction

No need to memorize commands. Just talk naturally:

**Natural language:**
- "let's explore" → Load exploration context
- "save this exploration" → Capture exploration to file
- "review the code" → Launch code reviewer (with confirmation)
- "is this over-engineered?" → Architecture review for complexity
- "analyze the architecture for X" → Multi-option architectural analysis
- "how should I implement X" → Technical implementation options
- "set up gitignore" → Configure project security
- "that fixed it!" → Auto-document discovery

**Slash commands:**
- `/plan-iteration` → Collaborative iteration planning
- `/plan-task N` → Evidence-based task execution
- `/complete-iteration` → Ship and archive with verification
- `/save-state` / `/restore-state` → Manage context across sessions

### The Commands

**In Terminal:**
- `momentum` - Launch workspace mode (exploration, ideation, research)
- `momentum <project>` - Launch project mode (building software)
- `setupd <project>` - Manually set up project structure (rarely needed)

**In Claude Code:**
- `/plan-iteration` - Collaboratively plan what to build next
- `/decompose-iteration` - Break iteration into concrete tasks
- `/plan-task N` - Execute specific task with evidence
- `/complete-iteration` - Ship and archive with verification
- `/save-state` / `/restore-state` - Manage context across sessions

**💡 The Flow:** `momentum <project>` → `/plan-iteration` → `/decompose-iteration` → `/plan-task 1` → build → ship

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

**Required:**
- **macOS or Linux**
- **Claude Code CLI** - [Download here](https://claude.ai/download)
- **Bash or Zsh shell**
- **Bun runtime** - For dynamic context hooks - [Install](https://bun.sh)

**Optional (Progressive Enhancement):**
- **lspeak** - TTS for voice summaries - [GitHub](https://github.com/nickpending/lspeak)
- **lore** - Knowledge capture and search - [GitHub](https://github.com/nickpending/lore)
- **llmcli-tools** - Gitignore compliance, observability tools (argus-send, lore-capture, llm-summarize) - [GitHub](https://github.com/nickpending/llmcli-tools)
- **Argus** - Real-time observability dashboard - [GitHub](https://github.com/nickpending/argus)
- **Playwright MCP** - Browser automation - `npx @playwright/mcp@latest` + `npx playwright install chrome`

### Install from Source

```bash
git clone https://github.com/nickpending/momentum.git
cd momentum
./install.sh
```

The installer will ask where you keep code and documentation.

### Configuration

Momentum uses TOML for structured configuration:

```toml
# ~/.config/momentum/config.toml
[personalization]
name = "Your Name"

[paths]
dev = "/path/to/development/projects"
projects = "/path/to/obsidian/projects"

[voice]
style = "jarvis"  # jarvis, professional, casual

[voice.verbosity]
assistant = "terse"   # Brief responses
project = "brief"     # Focus on essentials

[voice.tts]
enabled = true
provider = "system"  # system (free) or elevenlabs (premium)
```

**Directory Structure:**
- Config: `~/.config/momentum/`
- Voice styles: `~/.config/momentum/voices/`
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
echo 'alias momentum="cd ~/.local/share/momentum/home && claude --append-system-prompt \"$(cat ~/.config/momentum/agents/ASSISTANT.md)\" \"TODAY IS: $(date +%Y-%m-%d). Activate Assistant\""' >> ~/.zshrc
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
├── agents/            # Mode agents (ASSISTANT.md, PROJECT.md)
├── commands/          # Core workflow slash commands
├── contexts/          # Semantic routing contexts for each mode
├── subagents/         # Specialized analysis agents
├── skills/            # Agent skills (experimental capability packages)
├── templates/         # Project scaffolding templates
├── bin/               # setupd and other executables
└── hooks/             # Dynamic context injection hooks
```

## 🎯 Roadmap

**v4.2.3** (Current):
- [x] Workspace mode for exploration without project constraints
- [x] State-based initialization (new → vision → planned → active)
- [x] Knowledge capture system (CAPTURE lines → lore integration)
- [x] Consolidated output format (CAPTURE + VOICE in single context)
- [x] MCP integration (playwright server for browser automation)
- [x] Granular permission system (reduce approval prompts)
- [x] TOML configuration with voice customization
- [x] Semantic routing with dynamic context injection
- [x] Evidence-based agent system (6 specialized agents)
- [x] Skills architecture with plugin support
- [x] Three-layer observability (JSONL forensics, Lore knowledge, Argus real-time)
- [x] Argus integration with LLM-powered summaries
- [x] Library-first architecture (llmcli-tools imports instead of CLI calls)
- [x] Session cache for reliable project detection across hooks

**Next** (v4.3+):
- [ ] PreCompact hook for auto-save before context compression
- [ ] Notification system for background processes
- [ ] Enhanced backlog management
- [ ] Pattern learning from successful iterations

**Future** (v5.0+):
- [ ] Language-specific quality patterns
- [ ] Team collaboration workflows
- [ ] Integration with CI/CD pipelines
- [ ] Workflow analytics and metrics

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