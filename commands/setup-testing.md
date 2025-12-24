---
description: Create or update TESTING.md from tech stack and agent learnings
argument-hint: [create|update] [learning-to-add]
allowed-tools: Read, Write, Edit, Glob, Grep
---

@../resources/command-rules.md

# Setup Testing

Create or update TESTING.md. Agents can add learnings without changing methodology.

## Variables

MODE: $1 (default: create)
LEARNING: $2 (optional, for update mode)

## Workflow

IF MODE not in [create, update]: STOP — ask user for valid mode

---

### If MODE = create

1. GLOB for build files to detect tech stack:
   - `package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`
   - Or READ `{PROJECT_ROOT}/.workflow/artifacts/ITERATION.md` Tech Stack section

2. GLOB `~/.claudex/standards/claudex-{language}.md`
   - IF exists: READ and extract testing patterns
   - IF missing: Continue without claudex standards

3. GLOB for existing tests:
   - `**/test*/**`, `**/tests/**`
   - `**/*_test.*`, `**/*.test.*`, `**/*.spec.*`
   - Note structure and patterns found

4. READ `{PROJECT_ROOT}/.workflow/templates/TESTING_TEMPLATE.md`
   IF missing: STOP — template required, check templates/ exists

5. Generate TESTING.md with:
   - Detected framework and commands
   - Directory structure from step 3
   - Testing Philosophy (fixed — from template)
   - Empty "Learned Patterns" section

6. WRITE `{PROJECT_ROOT}/.workflow/artifacts/TESTING.md`

VERIFY: File exists and contains both `<!-- FIXED -->` and `<!-- LEARNABLE -->` markers

---

### If MODE = update

1. READ `{PROJECT_ROOT}/.workflow/artifacts/TESTING.md`
   IF missing: STOP — run `/setup-testing create` first

2. PRESERVE these sections (methodology — never change):
   - Testing Philosophy
   - Test Framework
   - Basic Commands

3. UPDATE these sections (learnable):
   - Directory Structure
   - Fixtures & Helpers
   - Environment Setup
   - Learned Patterns
   - Common Issues

4. IF LEARNING provided, append to "Learned Patterns":
   ```
   - [{DATE}]: {LEARNING}
   ```

5. WRITE updated TESTING.md

VERIFY: Fixed sections unchanged, learning appended if provided

---

## Report

```
TESTING.MD {created|updated}

Tech stack: {language} + {framework}
Test runner: {command}
Mode: {mode}
{If update with LEARNING: "Added: {LEARNING}"}

Learnable sections ready for agent updates.
```
