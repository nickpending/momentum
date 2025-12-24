# Momentum

<div align="center">

**Development environment for Claude Code**

[![Status](https://img.shields.io/badge/Status-Active-green?style=flat)](#)
[![Built for](https://img.shields.io/badge/Built%20for-Claude%20Code-blueviolet?style=flat)](https://claude.ai/download)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

---

Momentum wraps Claude Code with an iteration-first workflow, context that survives session limits, and a development partner with actual personality.

You work in focused iterations that ship working software. Context persists across conversations. An assistant named Sable remembers what you're building and why.

## What It Does

**Launches Claude Code with:**
- Identity-first system prompts (role, name, personality, then instructions)
- Project state detection (new → vision → planned → active)
- Hooks for context injection and knowledge capture
- Specialized agents for code review, architecture analysis, planning
- Voice system with configurable personality and verbosity

**Preserves context:**
- `/save-state` before context fills
- `/restore-state` to resume exactly where you left off
- Project expertise persists across sessions
- CAPTURE lines save insights to searchable knowledge base

**Ships working software:**
- Evidence-based planning (investigate before proposing)
- Micro-tasks that fit in one conversation
- Demo-driven completion (prove it works)

## Quick Start

```bash
git clone https://github.com/nickpending/momentum.git
cd momentum && ./install.sh

# Workspace mode - research, ideation, prototypes
momentum

# Project mode - focused building with state tracking
momentum myproject
```

The `momentum` command:
1. Sets up `.claude/` with hooks, commands, skills, agents
2. Renders the system prompt with your personality config
3. Launches Claude Code with `--append-system-prompt`

## Two Modes

| Mode | Command | What You Get |
|------|---------|--------------|
| **Workspace** | `momentum` | Full capabilities, no project constraints. Exploration, ideation, research. |
| **Project** | `momentum <name>` | State tracking, iteration workflow, task management. Ships software. |

## The Workflow

```
momentum myproject
    │
    ├─ State: new (no IDEA.md)
    │   └─ Offer ideation to capture vision
    │
    ├─ State: vision (has IDEA.md)
    │   └─ Suggest /plan-iteration
    │
    ├─ State: planned (has ITERATION.md)
    │   └─ Suggest /decompose-iteration
    │
    └─ State: active (has TASKS.md)
        └─ Show progress, suggest next task
```

**Commands:**

| Command | Purpose |
|---------|---------|
| `/plan-iteration` | Collaborative planning — investigate before proposing |
| `/orchestration:decompose-iteration` | Break iteration into concrete tasks (spawns agent) |
| `/orchestration:plan-task N` | Plan task implementation (spawns task-planner) |
| `/orchestration:build-task N` | Build from approved plan |
| `/orchestration:test-task N` | Write and run tests (spawns test-runner) |
| `/complete-task` | Verify with working demo, capture to Lore |
| `/complete-iteration` | Archive and synthesize learnings |
| `/save-state` / `/restore-state` | Preserve and resume progress |

**Quick commands:**
- `qcheck` — Senior engineer code review
- `qtest` — Write one integration test
- `qcom` — Commit with conventional message
- `qfix` — Debug and fix an error

## Architecture

### Prompt Composition

```
momentum <project>
    │
    ├── bin/momentum (bash launcher)
    │   └── calls render-project-prompt.ts
    │
    ├── render-project-prompt.ts
    │   └── Mustache renders contexts/*.md with config values
    │
    └── System prompt:
        contexts/{mode}-identity.md
         + contexts/base.md
         + voice style
         + verbosity level
```

Identity comes first: role opener, name, personality. Then mode-specific principles. Then shared mechanics.

### Hooks

TypeScript hooks (Bun runtime) fire on Claude Code lifecycle events:

| Hook | Purpose |
|------|---------|
| **SessionStart** | Detect project state, inject context, sync expertise from Lore |
| **UserPromptSubmit** | Add per-turn metadata (date, session ID) |
| **PreToolUse** | Log tool invocation to JSONL |
| **PostToolUse** | Log tool completion, track duration |
| **Stop** | Process CAPTURE lines, generate TTS summary, post to Argus |
| **SubagentStop** | Track agent completion, extract summary for Lore |
| **SessionEnd** | Cleanup session cache |

### Specialized Agents

Agents spawn via orchestrated commands or natural language:

| Agent | Triggered By | Purpose |
|-------|--------------|---------|
| **task-planner** | `/orchestration:plan-task` | Codebase analysis, complexity assessment, implementation plans |
| **test-runner** | `/orchestration:test-task` | Risk-based invariant testing, writes and runs tests |
| **iteration-decomposer** | `/orchestration:decompose-iteration` | Break features into concrete tasks |
| **code-reviewer** | "review the code" | Security, bugs, quality with confidence scoring |
| **architecture-analyst** | "analyze the architecture" | Multiple options with trade-offs |
| **architecture-reviewer** | "is this over-engineered?" | Complexity assessment, right-sizing |
| **architecture-auditor** | "check drift from design" | Compare plan vs implementation |
| **production-auditor** | `/orchestration:audit-production` | Release blockers, secrets scan |
| **implementation-analyst** | "how should I implement X" | Technical approaches |

Agents write operator logs (progress) and reports (findings) to `.workflow/agents/`.

### Voice System

Personality shapes identity, not just output:

**Styles:** sable (ethereal/measured), jarvis (efficient/warm), professional, casual

**Verbosity:** terse, brief, normal

```toml
# ~/.config/momentum/config.toml
[voice]
style = "sable"

[voice.verbosity]
project = "brief"
```

The default "Sable" personality: serene calm, quiet authority, measured wisdom, dry wit. Inspired by Tilda Swinton's Ancient One.

### Skills

For open-ended work without project constraints:

- **exploration** — Technical exploration with structured capture
- **ideation** — Develop project ideas through conversation

### Observability

Three layers of data:

| Layer | Purpose | Location |
|-------|---------|----------|
| **JSONL** | Forensics, audit trail | `~/.local/share/momentum/events/*.jsonl` |
| **Lore** | Searchable knowledge | `~/.local/share/lore/` |
| **Argus** | Real-time dashboard | SQLite + WebSocket |

### Knowledge Capture

**CAPTURE lines** in responses save to Lore:
```
📁 CAPTURE [context] #decision: Why we chose X over Y
📁 CAPTURE [context] #gotcha: This API returns 500 when...
📁 CAPTURE [context] #learning: The pattern for X is...
```

**Project expertise** persists per-project structural knowledge:
```
.workflow/artifacts/PROJECT_EXPERTISE.toml
├── [domains.api] mental_model, patterns, files
├── [domains.frontend] mental_model, patterns, files
└── [insights] gotchas, decisions, learnings
```

## Installation

**Requirements:**
- macOS or Linux
- [Claude Code CLI](https://claude.ai/download)
- [Bun](https://bun.sh) runtime

**Optional integrations:**
- [Argus](https://github.com/nickpending/argus) — Real-time observability dashboard
- [Lore](https://github.com/nickpending/lore) — Knowledge capture and search
- [llmcli-tools](https://github.com/nickpending/llmcli-tools) — @voidwire packages for utilities

```bash
git clone https://github.com/nickpending/momentum.git
cd momentum
./install.sh
```

The installer asks for:
- Code directory (e.g., `~/development/projects/`)
- Documentation directory (e.g., `~/obsidian/projects/`)
- Your name and assistant name

## Configuration

```toml
# ~/.config/momentum/config.toml

[personalization]
name = "Your Name"
assistant_name = "Sable"
timezone = "America/Los_Angeles"

[paths]
dev = "~/development/projects"
projects = "~/obsidian/projects"

[voice]
style = "sable"  # sable, jarvis, professional, casual

[voice.verbosity]
project = "brief"   # terse, brief, normal
assistant = "terse"

[voice.tts]
enabled = true
provider = "elevenlabs"  # system or elevenlabs
```

## Project Structure

```
momentum/
├── bin/              # momentum launcher, setupd
├── hooks/            # TypeScript hooks (Bun)
│   └── shared/       # Config loading, path resolution, Argus client
├── contexts/         # System prompt components
│   ├── project-identity.md
│   ├── workspace-identity.md
│   └── base.md
├── commands/         # Slash command prompts
│   └── orchestration/ # Multi-agent workflows
├── subagents/        # Specialized agent definitions
├── skills/           # Exploration, ideation
├── voices/
│   ├── styles/       # Personality TOML files
│   └── verbosity/    # Response length TOML files
├── templates/        # Artifact scaffolding
└── resources/        # Shared guidelines (agent-rules.md, etc.)
```

**Per-project state** lives in `.workflow/`:
```
.workflow/
├── artifacts/        # TASKS.md, ITERATION.md, PROJECT_SUMMARY.md
│   ├── tasks/        # Individual task files
│   └── subagents/    # Agent reports
├── state/            # Saved state files
└── agents/
    ├── operators/    # Agent activity logs
    └── reports/      # Analysis reports
```

## Philosophy

**Ship working software every iteration.** Not plans. Not docs. Working code you can demo.

**Build first, test after.** Get it running, prove it works. Tests validate, they don't drive.

**Evidence over speculation.** Investigate actual code before proposing. Report findings with file:line references.

**Context survives interruption.** Save state, restore state, keep building.

**Personality shapes identity.** The assistant isn't a tool. It's a development partner with a voice.

## Contributing

```bash
git clone https://github.com/nickpending/momentum.git
cd momentum
momentum  # Explore in workspace mode
```

Areas we'd welcome:
- Additional specialized agents
- Language-specific quality patterns
- Voice personalities
- Integration patterns

## License

[MIT](LICENSE)

---

<div align="center">

**Stop planning. Start shipping.**

</div>
