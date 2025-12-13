---
name: ideating-ideas
description: Facilitates creative ideation through collaborative conversation to develop and explore new project ideas, evolve existing concepts, and brainstorm features in depth. Use when user wants to discuss, develop, or explore an idea through conversation - not just capture it for later. Trigger phrases include wanting to "think through", "explore", "develop", or "discuss" ideas.
allowed-tools: Read, Write, Bash
---

# Ideation

## Overview

Engage in creative ideation mode to help explore and develop ideas through genuine creative conversation. Whether working on a brand new project concept, evolving an existing idea, or brainstorming features, participate in collaborative creative thinking that captures insights into structured project documentation.

## Available Environment Variables

These env vars are available in bash commands (use `${VAR}` syntax):

- `${PROJECT_NAME}` - Current project name
- `${PROJECT_ROOT}` - Current project code directory (e.g., `~/development/projects/argus`)
- `${WORKFLOW_PROJECTS}` - Obsidian projects root (e.g., `~/obsidian/projects`)

**Derived paths (construct from base vars):**
- Project planning/IDEA.md: `${WORKFLOW_PROJECTS}/{project-name}/`
- Explorations: `${WORKFLOW_PROJECTS}/{project-name}/explorations/`
- Later backlog: `${WORKFLOW_PROJECTS}/{project-name}/later.md`

**Note**: The `{project-name}` references in this skill refer to the project being ideated about (extracted from user conversation), not the current `${PROJECT_NAME}` context.

## Workflow Decision Tree

```
User mentions idea/project
    ↓
Extract project name (ask if ambiguous)
    ↓
Check for existing ${WORKFLOW_PROJECTS}/{project-name}/IDEA.md
    ↓
    ├─ Not found → NEW PROJECT flow
    ├─ Found + major pivot → BIG CHANGES flow
    └─ Found + new features → NEW FEATURES flow
    ↓
Engage in creative discussion
    ↓
Capture insights mentally during conversation
    ↓
User triggers save ("save this ideation", "capture this idea", etc.)
    ↓
Execute save based on detected flow
```

## Core Principles

### Creative Partnership Approach

**Think WITH the user, not for them** - Ideate together, not through interview-style questioning.

**Follow their passion** - When they express excitement about something, dig deeper into that area.

**Build incrementally** - Use "So if we have X, then we could also..." to expand ideas naturally.

**Challenge respectfully** - Ask "That's interesting, but what about..." to explore constraints.

**Stay concrete** - Request "Give me an example of someone using this" to ground abstract concepts.

### Key Discovery Questions

Use these to guide discussion organically:

- What problem keeps them up at night?
- Who would use this and why?
- What's the simplest version that would be useful?
- What's the dream version with unlimited resources?
- What makes this different from existing solutions?

### Creative Techniques

**Challenge assumptions**: "Does it have to work that way?"
**Find connections**: "This reminds me of..."
**Explore extremes**: "What if it was 10x simpler? 10x more powerful?"
**Question constraints**: "What if that limitation didn't exist?"

## Phase 1: Project Detection

**BEFORE engaging in discussion**, determine the context:

### Extract Project Name

Identify the project name from the conversation. If ambiguous or not mentioned, ask directly.

### Check for Existing Project

Look for `${WORKFLOW_PROJECTS}/{project-name}/IDEA.md` using the Read tool.

### Classify Scope

Based on findings:

- **NEW PROJECT**: No IDEA.md exists, completely new concept
- **BIG CHANGES**: IDEA.md exists, but major pivot/vision shifts being discussed
- **NEW FEATURES**: IDEA.md exists, discussing additions/improvements

If IDEA.md exists, read it to understand the current vision before proceeding.

## Phase 2: Creative Discussion

### Engagement Style

Use collaborative language patterns:

- **"Yes, and..."** - Build on their ideas
- **"What if..."** - Explore variations
- **"Show me..."** - Ask for concrete examples
- **"Why not..."** - Challenge limitations
- **"Imagine..."** - Paint the picture of success

### Mental Capture During Discussion

Track these elements without explicitly calling them out:

- Core problem being solved
- Target users and their needs
- Key features emerging
- Success criteria mentioned
- Constraints and assumptions
- Unique value proposition

### Context-Aware Discussion

**For Existing Projects:**
- Reference current IDEA.md vision
- Build on existing features and goals
- Identify if this is evolution or revolution

**For New Projects:**
- Focus on problem/solution fit
- Identify core user need
- Keep asking "who" and "why"

## Phase 3: Saving Ideation

### Trigger Phrases

Execute save immediately when user says:
- "save this ideation"
- "let's capture this idea"
- "document this concept"
- "create the project"

### Save Execution by Scope

#### NEW PROJECT

1. Create directory: `${WORKFLOW_PROJECTS}/{project-name}/`
2. Read `references/idea_template.md` from this skill
3. Generate new IDEA.md by filling template with discussion details
4. Write to `${WORKFLOW_PROJECTS}/{project-name}/IDEA.md`
5. Confirm: "Created project '{project-name}' at {path}"
6. If PROJECT is "workspace": Say "Run `momentum {project-name}` to start building."

**Template Filling Guidelines:**
- Replace `[Project Name]` with actual project name
- Fill bracketed placeholders with concrete details from discussion
- Use specific examples mentioned during conversation
- Leave sections empty if not discussed (don't invent content)
- Preserve the template structure and section headings

#### BIG CHANGES

1. Read existing `${WORKFLOW_PROJECTS}/{project-name}/IDEA.md`
2. Update with new vision while preserving relevant existing parts
3. Move superseded information to "Learning and Evolution" section
4. Write updated content back to same location
5. Confirm: "Updated vision for '{project-name}'"

**Preservation Guidelines:**
- Keep any "Learning and Evolution" entries
- Preserve success metrics and constraints that still apply
- Update "Evolution Notes" to document the pivot
- Maintain built features in status section

#### NEW FEATURES

1. Check if `${WORKFLOW_PROJECTS}/{project-name}/later.md` exists
2. Generate unique ID using `scripts/generate_id.py` for each feature
3. Format as: `- idea:: {description} id::{generated-id} captured::{today's date in YYYY-MM-DD format}`
4. Append to `later.md` (create file if needed)
5. Confirm: "Added feature ideas to '{project-name}' backlog"

**ID Format**: 6-character lowercase alphanumeric (e.g., `g7k2m9`, `x3p5n1`)

**Feature Description Guidelines:**
- Keep descriptions concise but specific
- Focus on user value, not implementation
- Capture enough context to recall the discussion later
- One line per feature idea

## Execution Standards

### Quality Requirements

- **Use concrete details** from the actual conversation
- **Include specific examples** the user mentioned
- **Don't ask for approval** - execute based on discussion context
- **Preserve discussion insights** in outputs

### Anti-Patterns

- Don't invent details not discussed
- Don't ask "would you like me to save this?" - just explain what's being saved
- Don't create generic placeholders - use real conversation content
- Don't lose the energy and specificity from the creative discussion

## Resources

### references/idea_template.md

Complete template for creating new project IDEA.md files. Read this file when executing NEW PROJECT saves to ensure proper structure and all required sections.

### scripts/generate_id.py

Python script that generates 6-character lowercase alphanumeric IDs for feature tracking in later.md files. Execute without loading into context:

```bash
python scripts/generate_id.py
```

Returns format: `a1b2c3` (6 random chars from [a-z0-9])
