# Resources

How to find project resources, evaluate repos, and discover related work.

## Local Project Resources

Start with the project root directory and search for relevant files and directories.

```bash
# Find files by pattern
find . -name "*.md" -type f

# Search content
grep -r "pattern" --include="*.ts"

# List directory structure
tree -L 2
```

## Evaluating Local Repos

Use git for changes and history:

```bash
git log --oneline -20              # recent commits
git log --oneline --since="1 week" # this week's work
git diff HEAD~5                    # recent changes
git diff main..feature-branch      # branch diff
```

## Evaluating Remote Repos

Clone first, then use git commands. Do not use HTTP to access the repository.

```bash
git clone <repo-url>
cd <repo>
git log --oneline -20
git diff HEAD~5
```

## Finding Related Projects

Use lore to find info about other local projects:

```bash
lore search development <project_name>
lore-graph related-to <project>
```

## Key Locations

| Path | Purpose |
|------|---------|
| `${PROJECT_ROOT}/.workflow/artifacts/` | TASKS.md, PROJECT_SUMMARY.md, ITERATION.md |
| `${PROJECT_ROOT}/.workflow/state/` | Saved development state |
| `${WORKFLOW_PROJECTS}/{project}/later.md` | Backlog items |
| `${OBSIDIAN_DIR}/reference/technical/explorations/` | Exploration documents |
