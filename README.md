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

- 🚀 **Context-Aware Conversations** - Dynamic hooks inject mode-specific context with minimal per-turn overhead
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

### Natural Interaction

No need to memorize commands. Just talk naturally:

**Natural language:**
- "let's explore" → Use exploration skill
- "I have an idea" → Use ideation skill
- "review the code" → Launch code reviewer agent
- "is this over-engineered?" → Architecture review for complexity
- "how should I implement X" → Technical implementation options

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

Momentum uses identity-first prompt composition with specialized agents:

```
Mode Selection              Identity + Base              Specialized Agents
       │                         │                            │
momentum ──────────► workspace-identity.md ◄──┐
momentum <project> ──► project-identity.md ◄──┼── base.md
       │                         │             └── personality
       │                         │                            │
       └──► Evidence Collection ──► Options Presentation
```

**Prompt Composition:**
- **Identity First**: Role, name, and personality establish who the assistant is at prompt start
- **Mode-Specific Principles**: Each mode has distinct constraints and startup behavior
- **Shared Mechanics**: Base.md provides agents, resources, guards, and output formatting

**Key Design Decisions:**
- **Mustache Templating**: Variables like `{{{PERSONALITY}}}` inject at render time
- **Personality at Top**: Voice style shapes identity, not just output formatting
- **Evidence-Based Agents**: Investigate actual code, present multiple verified options
- **Minimal Per-Turn Injection**: Only metadata (date/time/session) injected per message

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
assistant_name = "Sable"  # Your assistant's identity

[paths]
dev = "/path/to/development/projects"
projects = "/path/to/obsidian/projects"

[voice]
style = "sable"  # sable, jarvis, professional, casual

[voice.verbosity]
assistant = "terse"   # Workspace mode verbosity
project = "brief"     # Project mode verbosity

[voice.tts]
enabled = true
provider = "elevenlabs"  # system (free) or elevenlabs (premium)
```

**Directory Structure:**
- Config: `~/.config/momentum/`
- Voice styles: `~/.config/momentum/voices/`
- Projects: `~/obsidian/projects/` (configurable)
- Code: `~/development/projects/` (configurable)

### Voice Personalities

Momentum supports custom assistant personalities. The default "Sable" personality is inspired by Tilda Swinton's Ancient One - ethereal calm with quiet authority.

**Creating a custom ElevenLabs voice:**

Use this voice design prompt with ElevenLabs to create a matching voice:

```
Perfect audio quality. A woman in her 40s with a crisp British accent.
Aristocratic but not stuffy — think ancient knowledge, not old money. Cool, precise diction
with a subtle breathiness. A knowing quality, like she sees more than
she says. Slight Scottish undertone beneath the RP accent.
Normal speaking pace. Calm authority without warmth — detached compassion.
Almost theatrical precision in articulation.
```

Voice styles are defined in `voices/styles/*.toml` and inject personality at the top of the system prompt, shaping identity from the start.

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
# Re-run installer to set up momentum function
./install.sh
source ~/.zshrc
```

### Claude doesn't recognize /commands
Make sure you're in a project directory:
```bash
setupd myproject
cd ~/development/projects/myproject
momentum
```

### Hooks not working
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
├── contexts/          # System prompt components
│   ├── base.md            # Shared mechanics (agents, resources, guards, output)
│   ├── project-identity.md    # Project mode identity and principles
│   └── workspace-identity.md  # Workspace mode identity
├── voices/            # Voice and personality configuration
│   ├── styles/            # Personality styles (sable, jarvis, professional)
│   └── verbosity/         # Response length (terse, brief, normal)
├── commands/          # Core workflow slash commands
├── subagents/         # Specialized analysis agents
├── skills/            # Agent skills (exploration, ideation)
├── templates/         # Project scaffolding templates
├── bin/               # setupd and other executables
└── hooks/             # Dynamic context injection hooks
```

## 🎯 Roadmap

**v4.4.0** (Current):
- [x] Identity-first prompt architecture (contexts/ directory)
- [x] Personality injection at prompt top (shapes identity, not just output)
- [x] Assistant name configuration (`assistant_name` in config.toml)
- [x] Split personality/verbosity injection points
- [x] Sable voice personality (Tilda Swinton-inspired)
- [x] ElevenLabs voice design prompt included
- [x] Prescriptive startup behaviors (how to greet, not scripted responses)

**v4.3.x** (Previous):
- [x] Consolidated system prompt (system.md + project.md + workspace.md)
- [x] Mustache templating for dynamic prompt generation
- [x] Minimal per-turn injection (metadata only: date/time/session)
- [x] CLI capabilities auto-detection at session start
- [x] Voice instructions injected at session start, not per-turn
- [x] Optimized prompts (-320 lines, instructions over documentation)
- [x] Environment variable unification (${VAR} syntax)

**v4.2.x**:
- [x] Workspace mode for exploration without project constraints
- [x] State-based initialization (new → vision → planned → active)
- [x] Knowledge capture system (CAPTURE lines → lore integration)
- [x] MCP integration (playwright server for browser automation)
- [x] TOML configuration with voice customization
- [x] Evidence-based agent system (6 specialized agents)

**Next** (v4.5+):
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