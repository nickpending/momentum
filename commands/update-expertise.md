---
allowed-tools: Read, Write, Edit, Bash, Glob
description: Update project expertise with learnings and Lore insights
---

@../resources/command-rules.md

# Update Project Expertise

Update PROJECT_EXPERTISE.toml with learnings from recent work and sync insights from Lore.

## Workflow

### Step 1: Load Current Expertise

**REQUIRED ACTIONS:**

1. READ `${PROJECT_ROOT}/.workflow/artifacts/PROJECT_EXPERTISE.toml`
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

### Step 3: Update Mental Models

**REQUIRED ACTIONS:**

For each affected domain:

1. READ the current mental_model
2. IDENTIFY gaps or outdated information
3. UPDATE with new understanding:
   - Keep it concise and useful
   - Write as working knowledge, not documentation
   - Include key flows and relationships

4. UPDATE patterns if new ones discovered

Use Edit tool to update specific sections.

### Step 4: Sync Lore Insights

**REQUIRED ACTIONS:**

Run the expertise-update CLI to pull insights from Lore:

```bash
expertise-update --project ${PROJECT_NAME} --root ${PROJECT_ROOT}
```

This will:
- Query Lore for gotchas, decisions, learnings
- Merge into the insights section
- Preserve existing insights

### Step 5: Confirm Update

**REQUIRED ACTIONS:**

```
EXPERTISE UPDATED

Domains touched: [list]
Mental models updated: [yes/no per domain]
Lore insights synced: [count added]

Location: ${PROJECT_ROOT}/.workflow/artifacts/PROJECT_EXPERTISE.toml
```

## Important Notes

- Only update domains that were actually affected
- Mental models should stay concise - working knowledge, not docs
- Lore sync is additive - won't remove existing insights
- This runs automatically after /complete-task and /complete-iteration
