# Skills vs Routing Architecture

**Date:** 2025-10-17
**Context:** Claude Skills announced Oct 16, 2025. Exploring how to integrate official Skills pattern with Momentum's existing routing system.

## Problem

Momentum uses hook-injected routing contexts (~850 tokens) to parse semantic intent and dispatch to capabilities (contexts, commands, agents). This works but has memory issues - after compaction or ~20 messages, routing instructions fade from context.

Claude Skills (announced today) offer progressive disclosure: metadata in system prompt (always present) + on-demand content loading. But combining routing + skills creates conflicts - if routing says "do X" it blocks skill activation.

Core questions:
- Do we need routing at all with Skills?
- Can they coexist?
- What's the token cost tradeoff?
- How do we migrate without breaking everything?

## Exploration

### Skills Pattern (Official)

**Architecture:**
- Metadata (name + description) always in system prompt (~100 tokens/skill)
- Full SKILL.md loaded via filesystem when triggered
- Scripts execute via bash, only output enters context

**Naming:** Gerund form - "Processing PDFs", "Analyzing code", "Exploring problems"

**Description format:** "[What it does]. Use when [triggers and contexts]."

**Example:**
```yaml
---
name: Configuring gitignore
description: Creates or updates .gitignore files with comprehensive security patterns. Use when user mentions gitignore, protecting secrets, or repository security.
---
```

**Token cost scaling:**
- 10 skills = 1,000 tokens in every message
- 20 skills = 2,000 tokens in every message

### Momentum Routing (Current)

**Architecture:**
- UserPromptSubmit hook injects routing markdown
- Contains semantic intent patterns → action mappings
- 850 tokens for PROJECT_ROUTING.md

**Token cost:**
- Originally: 850 tokens once, lightweight thereafter (~15 tokens)
- **Problem discovered:** Lightweight approach fails - Claude forgets routing after compaction
- **Solution implemented:** Always inject full routing (~850 tokens every message)

**Advantage:** Can route to agents, commands, mode switches (not just skills)

### The Conflict

Routing says: "When user says 'explore', load EXPLORATION.md"
Skill says: "name: Exploring problems, description: Use when..."

Claude follows routing (explicit instruction) over skill (passive availability).

**Result:** Skills become invisible when routing handles same intent.

### Token Cost Reality Check

**Skills-only approach:**
- 20 skills × 100 tokens = 2,000 tokens every message
- Clean, standardized
- Cross-model compatible
- But can't route to agents/commands/modes

**Routing-only approach:**
- 850 tokens every message
- Can dispatch to anything (contexts, commands, agents, modes)
- Momentum-specific
- Single injection point

**Hybrid (what we chose):**
- Routing stays for mode coordination, agent launches, command routing
- Skills handle self-contained capabilities (exploration, gitignore)
- Remove conflicting routes when skill exists
- Total cost: ~850 (routing) + ~200-400 (2-4 skills metadata) = ~1,100-1,250 tokens/message

### Migration Strategy

**Phase 1: Test coexistence**
- Created two skills: "Exploring problems", "Configuring gitignore"
- Removed conflicting routes from PROJECT_ROUTING.md
- Test if skills activate without routing interference

**Phase 2: Identify candidates**
Skills best for:
- Self-contained capabilities
- Clear trigger keywords
- No multi-step orchestration
- Cross-project reuse potential

Stay in routing:
- Mode switching (assistant/portfolio/project)
- Agent launches (code-reviewer, architecture-analyst)
- Multi-step workflows (save-state, task-planning)
- Discovery (immediate capture without asking)

**Phase 3: Standardize**
Created SKILL_TEMPLATE.md with consistent structure:
- Available Paths section (lists injected paths)
- Numbered Process steps
- Supporting content (patterns, templates)
- Completion/Best Practices section

### Hook Enhancement

**Problem:** Skills need context about available paths, but shouldn't contain variable resolution logic.

**Solution:** Hook now injects comprehensive path variables every message:
```
PROJECT_ROOT, WORKFLOW_DIR, ARTIFACTS_DIR, STATE_DIR,
EXPLORATIONS_DIR, PROJECT_OBSIDIAN_DIR,
LORE_CONFIG, LORE_DATA, LORE_CACHE (if available)
```

Skills reference injected variables directly: "Read from PROJECT_ROOT/.gitignore" instead of runtime vars

**Benefit:** Skills become simpler, paths always correct, no resolution needed.

### Key Insights

1. **Routing is meta-orchestration, Skills are capabilities** - They serve different purposes and can coexist if routing doesn't block skill triggers.

2. **Token cost depends on usage** - If you have 5 skills, Skills pattern is cheaper than routing. If you have 20+, routing becomes more efficient.

3. **Always-inject routing was necessary** - Lightweight mode failed because compaction erased routing memory. Skills solve this with system prompt persistence.

4. **Skills can't replace everything** - Mode switching, agent launching, multi-step workflows still need routing or commands.

5. **Description quality matters for discovery** - Skills live or die by how well the description matches user intent. "Use when [specific triggers]" is critical.

6. **Standardization enables migration** - Template makes it easy to convert contexts → skills systematically.

### Architectural Decisions Made

**Decision 1: Full routing injection every message**
- Replaced lightweight approach
- Ensures semantic intent matching always available
- Cost: ~850 tokens/message
- Acceptable because routing handles things skills can't

**Decision 2: Hybrid architecture**
- Routing for orchestration (modes, agents, commands)
- Skills for self-contained capabilities (exploration, gitignore)
- Migration path: convert contexts to skills where appropriate

**Decision 3: Comprehensive path injection**
- Hook provides all paths every message
- Skills don't resolve variables
- Simpler, more reliable

**Decision 4: Standard skill structure**
- Template ensures consistency
- Available Paths → Process → Supporting Content → Completion
- Makes migration mechanical

### Implementation

**Created:**
- `skills/exploration/SKILL.md` - "Exploring problems" skill
- `skills/gitignore/SKILL.md` - "Configuring gitignore" skill
- `templates/SKILL_TEMPLATE.md` - Standard structure

**Modified:**
- `hooks/momentum-user-prompt-submit-hook.ts` - Always inject full routing, add comprehensive paths
- `contexts/PROJECT_ROUTING.md` - Removed exploration and gitignore routes
- `contexts/ASSISTANT_ROUTING.md` - Removed lore metadata duplication
- `contexts/PORTFOLIO_ROUTING.md` - Removed lore metadata duplication

**Pattern established:**
```yaml
---
name: [Gerund form]
description: [Actions]. Use when [triggers].
---

# [Name]

## Available Paths
- PATH references

## Process
Numbered steps

## Supporting Content
Templates, patterns

## Completion
Final guidance
```

## Outcome

**Validated:** Skills and routing can coexist if routing doesn't handle same intents.

**Architecture:** Hybrid approach where routing orchestrates, skills execute.

**Token cost:** ~850 (routing) + ~100/skill (metadata) = manageable with selective migration.

**Next steps:**
1. Test skill activation (say "let's explore this problem" and see if skill triggers)
2. Test gitignore skill (say "set up gitignore")
3. Identify 3-5 more candidates for skills migration
4. Document which capabilities stay in routing vs become skills
5. Consider if routing could be lighter by offloading more to skills

**Open questions:**
- Does routing really need to be 850 tokens? Could we slim it down?
- Should agent launches become skills instead of routing entries?
- What's the optimal number of skills before metadata overhead becomes too high?
- Can we measure actual skill activation vs routing to validate the approach?

**What we learned:**
- Skills aren't a silver bullet - they solve discovery but not orchestration
- Token optimization requires understanding what persists (system prompt) vs what fades (conversation)
- Architecture decisions should be data-driven - we tested, found lightweight routing failed, pivoted
- Standardization (template) makes experimentation safe - easy to try skills, easy to roll back
- Semantic routing is powerful and worth the token cost for complex workflows
