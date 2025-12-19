# Bootstrap Project Expertise

## Environment Variables

Available in bash commands (use `${VAR}` syntax):
- `${PROJECT_ROOT}` - Absolute path to project root
- `${PROJECT_NAME}` - Project name
- `${WORKFLOW_PROJECTS}` - Obsidian projects root

## Runtime Values

Use `{var}` for values calculated during execution:
- `{timestamp}` - Generated timestamp
- `{date}` - Current date

## Context

PROJECT_EXPERTISE.toml does not exist for this project.

Before proceeding with any work, you must create the expertise file. This is your structural knowledge and mental model of this codebase.

## Instructions

### Step 1: Explore Project Structure

Use the Task tool with Explore subagent to understand the project architecture:

```
Task(subagent_type: "Explore", prompt: "Explore ${PROJECT_ROOT} to understand:
1. Directory structure and organization
2. Key config files (package.json, pyproject.toml, etc.)
3. Framework and language patterns
4. Major code areas and their purposes

Be thorough. Return a structured summary of what you find.")
```

### Step 2: Identify Domains

Based on the exploration, identify 3-6 domains representing major codebase areas:

**Common domains by project type:**
- Web app: `api`, `frontend`, `database`, `auth`
- CLI tool: `commands`, `core`, `config`
- Library: `core`, `utils`, `integrations`
- Data pipeline: `ingestion`, `transform`, `output`

Each domain should be a coherent area with its own files and patterns.

### Step 3: Build Mental Models

For each domain, synthesize:
- File patterns (globs)
- Framework/convention patterns
- How it works conceptually

The mental model is working knowledge - how you'd explain it to yourself next session.

### Step 4: Write Expertise File

Create `${PROJECT_ROOT}/.workflow/artifacts/PROJECT_EXPERTISE.toml`:

```toml
[meta]
project = "${PROJECT_NAME}"
updated = "{date}"
domains = ["domain1", "domain2", "..."]

[domains.domain1]
files = ["src/api/**/*.ts"]
patterns = ["pattern1", "pattern2"]
mental_model = """
Your understanding of how this domain works.
Write as if explaining to yourself next session.
Include key flows, relationships, important files.
"""

[domains.domain2]
# ... repeat for each domain

[insights]
# Leave empty - populated from Lore later
gotchas = []
decisions = []
learnings = []
```

### Step 5: Confirm Creation

After writing the file:

```
PROJECT EXPERTISE CREATED

Domains: [list domains]
Location: ${PROJECT_ROOT}/.workflow/artifacts/PROJECT_EXPERTISE.toml

Ready to proceed with your request.
```

Then continue with the originally requested work.

## Important Notes

- Be specific to THIS project, not generic
- Mental models should be useful, not comprehensive
- Skip trivial or empty domains
- This file evolves as you learn the codebase
