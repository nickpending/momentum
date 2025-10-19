# Generate lightweight project summary for context loading

**Variables**: `$VARS` are environment variables (expand them), `{vars}` are runtime values (find/calculate them), `[vars]` are template placeholders (substitute them).

**Key Paths**:
- `{project-root}` - Current project directory (find by locating .workflow/ directory)
- `$WORKFLOW_PROJECTS` - Obsidian projects directory (from environment)
- `$WORKFLOW_DEV` - Development projects root (from environment)

## Purpose

Generate a lightweight PROJECT_SUMMARY.md (40-50 lines) by extracting key information from IDEA.md, ITERATION.md, and TASKS.md. This replaces loading full context files during /load-app-context.

## Step 1: Load Source Files

**READ** these files to extract information:

1. `{project-root}/.workflow/artifacts/IDEA.md` - project vision and tech stack
2. `{project-root}/.workflow/artifacts/ITERATION.md` (if exists) - current iteration details
3. `{project-root}/.workflow/artifacts/TASKS.md` (if exists) - task progress
4. `{project-root}/.workflow/templates/PROJECT_SUMMARY_TEMPLATE.md` - output template

## Step 2: Extract Key Information

### From IDEA.md

- **PROJECT_NAME**: Extract from heading or directory name
- **BRIEF_DESCRIPTION**: First paragraph under Vision section
- **CORE_PURPOSE**: Solution section summary (2-3 sentences)
- **TECH_STACK**: Tech Stack section (just the list, not explanations)
- **ARCHITECTURE_TYPE**: Architecture section summary
- **DATABASE_INFO**: Database type and key patterns (if mentioned)
- **KEY_CONSTRAINTS**: From Constraints section (top 3-5 only)

### From Directory Structure

Run `ls -la` to map project organization:
- **SOURCE_DIRS**: Main source code directories (src/, lib/, app/, etc.)
- **CONFIG_DIRS**: Configuration locations (.claude/, .workflow/, config/)
- **BUILD_ARTIFACTS**: Build outputs (dist/, build/, target/)
- **KEY_FILES**: Important root files (package.json, README.md, etc.)

### From ITERATION.md (if exists)

- **ITERATION_NUMBER**: Extract from heading
- **ITERATION_NAME**: Extract from heading
- **ITERATION_GOAL**: Working Software Goal section
- **MAIN_SERVICES**: From Integration Architecture section
- **DATA_FLOW_SUMMARY**: Brief data flow overview (2-3 lines)

### From TASKS.md (if exists)

- **COMPLETED**: Count of ✅ Complete tasks
- **TOTAL**: Total task count

### From Project Commands & Utilities

**Document what the project provides and how to work with it:**

1. **Installed Commands** - What users actually run:
   - Check README.md or IDEA.md for main commands
   - Check for binaries installed to ~/.local/bin or /usr/local/bin
   - Check install scripts for what they set up
   - Format: `command-name [args]` - What it does
   - Example: `setupd --switch <project>` - Switch between projects

2. **Setup/Installation**:
   - Installation scripts: `./install.sh`, `./setup.py`, etc.
   - Configuration needed after install

3. **Development Commands** - Build, test, run:
   - If Makefile: Key targets (install, build, test, clean)
   - If package.json: Key scripts (dev, build, test)
   - If Cargo.toml: Key commands (build, test, run)
   - If pyproject.toml: Key commands (uv sync, uv run)
   - Format: `command` - Purpose
   - Example: `make install` - Install binaries to ~/.local/bin

**Output format for COMMANDS_USAGE variable:**
```
## How to Use
- `{main-command} [args]` - Primary usage
- `./{install-script}` - Installation

## Development
- `{build-command}` - Build the project
- `{test-command}` - Run tests
- `{install-command}` - Install locally
```

**Balance detail with brevity** - Include enough for the model to work effectively (5-8 key commands), skip exhaustive listings.

## Step 3: Populate Template

**READ** template and replace all variables:

```
{PROJECT_NAME} → extracted project name
{BRIEF_DESCRIPTION} → 1-2 sentence description
{CORE_PURPOSE} → 2-3 sentence purpose statement
{TECH_STACK} → comma-separated tech stack
{ARCHITECTURE_TYPE} → architecture pattern (e.g., "Command-driven workflow orchestration")
{DATABASE_INFO} → database type and key info (e.g., "SQLite with WAL mode")
{KEY_CONSTRAINTS} → bullet list of top constraints (3-5 items)
{SOURCE_DIRS} → main source directories (e.g., "src/, hooks/, commands/")
{CONFIG_DIRS} → configuration directories (e.g., ".claude/, .workflow/")
{BUILD_ARTIFACTS} → build output directories (if present)
{KEY_FILES} → important root files (package.json, README.md, etc.)
{ITERATION_NUMBER} → current iteration number
{ITERATION_NAME} → iteration name
{ITERATION_GOAL} → iteration goal (1 sentence)
{COMPLETED} → completed task count
{TOTAL} → total task count
{MAIN_SERVICES} → bullet list of main services (3-5 items)
{DATA_FLOW_SUMMARY} → brief data flow (2-3 lines)
{COMMANDS_USAGE} → categorized list of project commands with usage examples
```

**Handle missing data gracefully:**
- If no ITERATION.md: Use "No active iteration" for iteration fields
- If no TASKS.md: Use "0/0" for progress
- If no commands found: Use "Standard development tools only" or omit section
- If sections missing: Use "N/A" or omit

## Step 4: Write PROJECT_SUMMARY.md

**CREATE** file at: `{project-root}/.workflow/artifacts/PROJECT_SUMMARY.md`

Target length: 40-50 lines (lightweight context)

## Step 5: Output Confirmation

```
=====================================
PROJECT SUMMARY UPDATED
=====================================

✅ Project: {PROJECT_NAME}
✅ Iteration: {ITERATION_NUMBER} - {ITERATION_NAME}
✅ Progress: {COMPLETED}/{TOTAL} tasks complete
✅ Output: {project-root}/.workflow/artifacts/PROJECT_SUMMARY.md

Summary ready for /load-app-context
```

## When to Run

This command should be called by:
- `/plan-iteration` - After creating new iteration
- `/complete-iteration` - After archiving completed iteration
- Manually when project context changes

## Error Handling

**IF** IDEA.md not found:
- Cannot generate summary
- Report error: "IDEA.md required for project summary"

**IF** template not found:
- Create basic PROJECT_SUMMARY.md structure without template
- Warn about missing template

## Success Criteria

- PROJECT_SUMMARY.md is 50-100 lines (concise but complete)
- All key project info is captured
