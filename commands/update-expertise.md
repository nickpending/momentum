---
allowed-tools: Read, Write, Edit, Bash, Glob
description: Update project expertise with learnings and Lore insights
---

@../resources/command-rules.md

# Update Project Expertise

Update PROJECT_EXPERTISE.toml with learnings from recent work.

## Instrumentation

**Start event:**
```bash
argus-send --source momentum --type command --session-id {SESSION_ID} --status pending \
  --message "Starting /update-expertise" \
  --data '{"command_name": "update-expertise"}'
```

**End event (after Step 5):**
```bash
argus-send --source momentum --type command --session-id {SESSION_ID} --status success \
  --message "Completed /update-expertise" \
  --data '{"command_name": "update-expertise", "domains_updated": {count}}'
```

If command fails, use `--status failure` with error details.

## Section Ownership

**YOU update (domains section):**
- `mental_model` - Working knowledge of how things connect
- `patterns` - Discovered coding patterns and conventions

**CLI updates (insights section - DO NOT TOUCH):**
- `gotchas` - Managed by expertise-update CLI
- `decisions` - Managed by expertise-update CLI
- `learnings` - Managed by expertise-update CLI

## Workflow

### Step 1: Load Current Expertise

**REQUIRED ACTIONS:**

1. READ `{PROJECT_ROOT}/.workflow/artifacts/PROJECT_EXPERTISE.toml`
2. NOTE current domains and mental models

**STOP if expertise file doesn't exist** - run bootstrap first.

### Step 2: Reflect on Recent Work

**REQUIRED ACTIONS:**

1. REVIEW what was just completed (from task context or git diff)
2. IDENTIFY structural knowledge gained:
   - New file locations discovered
   - Patterns understood
   - How components connect
   - Integration points learned

3. DETERMINE which domains were affected

### Step 3: Update Domain Knowledge

**REQUIRED ACTIONS:**

For each affected domain, update ONLY these fields:

1. **mental_model** - UPDATE with new understanding:
   - Keep concise - working knowledge, not documentation
   - Include key flows and relationships
   - Focus on "how things work" not "what things are"

2. **patterns** - ADD new patterns if discovered:
   - Short, scannable phrases
   - Actual coding/design patterns found

Use Edit tool to update specific sections.

**NEVER touch [insights] section** - that's managed by CLI.

### Step 4: Sync Lore Insights (Optional)

If expertise-update CLI is available:

```bash
expertise-update --project ${PROJECT_NAME} --root ${PROJECT_ROOT}
```

This syncs insights from Lore. Skip if CLI not installed.

### Step 5: Confirm Update

**REQUIRED ACTIONS:**

```
EXPERTISE UPDATED

Domains touched: [list]
Mental models updated: [yes/no per domain]
Patterns added: [count]

Location: {PROJECT_ROOT}/.workflow/artifacts/PROJECT_EXPERTISE.toml
```

## Important Notes

- Only update domains that were actually affected
- Mental models should stay concise - working knowledge, not docs
- NEVER write to [insights] section - CLI owns that
- This runs automatically after /complete-task and /complete-iteration
