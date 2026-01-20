<!--
PURPOSE: Reference documentation for flux CLI - task management
LOCATION: contexts/SYSTEM/TOOLS/FLUX.md
RELATED FILES:
- README.md - Tools directory overview
-->

# Flux

Task management CLI for Obsidian-based workflows.

## Overview

Flux manages tasks (todos, bugs, ideas) in an Obsidian vault. It supports project scoping, active/backlog lists, recurring items, and archiving. All commands can be scoped to a specific project with `-p/--project`.

## When to Use

Trigger phrases:
- "add a task", "add a todo", "add a bug"
- "mark done", "complete task"
- "list tasks", "show backlog"
- "activate task", "defer task"
- "flux add", "flux list", "flux done"

## Common Operations

### Scoping

All commands support `-p/--project` to scope to a specific project. Without `-p`, commands operate on global items only.

### Add Items

```bash
flux add "implement auth middleware" -p momentum
flux add "fix login bug" -p momentum -t bug
flux add "fix login bug" -p momentum -t bug --urgent    # also adds to Today
```

### Complete and Cancel

```bash
flux done a3f2d1
flux done a3f2d1 -p momentum
flux cancel a3f2d1
```

### Activate and Defer

```bash
flux activate a3f2d1 -p momentum           # move to Today
flux activate a3f2d1 --week                # move to This Week
flux defer a3f2d1                          # move back to backlog
```

### List Items

```bash
flux list                        # global active items
flux list -p momentum            # momentum's active items
flux list -b                     # global backlog
flux list -b -p momentum         # momentum's backlog
flux list -c                     # today's completed
flux list -c -p momentum         # momentum's completed
flux list -t bug                 # filter by type
```

### Maintenance

```bash
flux recurring --dry-run         # show due recurring items
flux lint --fix                  # fix format issues
flux archive --dry-run           # show what would be archived
```

## Examples

```bash
# Add urgent bug to momentum project
flux add "fix authentication timeout" -p momentum -t bug --urgent

# See what's active for a project
flux list -p momentum

# Complete a task
flux done a3f2d1 -p momentum

# Check backlog
flux list -b -p momentum

# Activate something for next week
flux activate a3f2d1 --week
```
