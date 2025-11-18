---
name: setting-up-gitignore
description: This skill should be used when users need to create or update a .gitignore file for their project. It provides comprehensive security-focused patterns and automatically detects the tech stack to include appropriate language-specific exclusions. Use when users ask to "set up gitignore", "create a secure gitignore", "add gitignore protection", or similar requests.
allowed-tools: Read, Glob, Write
---

# Gitignore Setup

## Overview

This skill creates or updates a .gitignore file with comprehensive security-focused patterns and language-specific exclusions. It always includes essential security patterns (credentials, secrets, workspace files) and automatically detects the project's tech stack to add relevant language-specific patterns.

## Available Paths

These paths are injected by momentum and available for use:

- `PROJECT` - Current project name
- `PROJECT_ROOT` - Current project directory
- `WORKFLOW_DIR` - Workflow configuration directory
- `ARTIFACTS_DIR` - Workflow artifacts directory
- `WORKFLOW_PROJECTS` - Global Obsidian projects directory
- `WORKFLOW_DEV` - Global development projects root

## Workflow

### 1. Check for Existing .gitignore

Check if `.gitignore` exists in the project root:

- **If exists**: Read the file to understand what's already ignored
- **If missing**: Will create a new file from scratch

### 2. Detect Tech Stack

Detect languages and frameworks by examining file patterns in the project:

**Python detection:**
- Look for: `*.py` files, `pyproject.toml`, `requirements.txt`, `setup.py`, `Pipfile`

**JavaScript/TypeScript detection:**
- Look for: `package.json`, `*.js`, `*.ts`, `*.jsx`, `*.tsx` files
- Framework markers: `.next/`, `node_modules/`, `yarn.lock`, `pnpm-lock.yaml`

**Go detection:**
- Look for: `*.go` files, `go.mod`, `go.sum`

**Rust detection:**
- Look for: `*.rs` files, `Cargo.toml`

**Ruby detection:**
- Look for: `*.rb` files, `Gemfile`, `Rakefile`

**Java detection:**
- Look for: `*.java` files, `pom.xml`, `build.gradle`, `*.gradle`

Use file-based detection by searching the project directory. Multiple languages may be detected.

### 3. Build Complete .gitignore Content

Assemble the .gitignore content in this order:

**Step 3.1: Start with Base Patterns (Always Include)**

Read and include `assets/base.gitignore`, which contains:
- Security patterns (`.env`, `*.key`, `*_secret*`, etc.)
- Workspace protection (`.workflow/`, `.claude/`, `.claudex/`)
- Sensitive data (`.sqlite`, `*.db`, backups)
- IDE patterns (`.vscode/`, `.idea/`, etc.)
- System files (`.DS_Store`, `Thumbs.db`, etc.)
- Build artifacts (`dist/`, `build/`, `logs/`, etc.)

**Step 3.2: Add Language-Specific Patterns**

For each detected language, append the corresponding pattern file:

- **Python detected** → Read and append `assets/python.gitignore`
- **JavaScript/TypeScript detected** → Read and append `assets/javascript.gitignore`
- **Go detected** → Read and append `assets/go.gitignore`
- **Rust detected** → Read and append `assets/rust.gitignore`
- **Ruby detected** → Read and append `assets/ruby.gitignore`
- **Java detected** → Read and append `assets/java.gitignore`

### 4. Handle Existing Content

**If .gitignore already exists:**

1. Preserve all existing patterns
2. Identify patterns from the assembled content that are already present
3. Only append patterns that don't already exist
4. Add a blank line before appending new patterns for readability
5. **Important**: If an existing entry seems unusual or potentially incorrect, ask the user before removing it

**Pattern matching rules:**
- Exact matches: If `node_modules/` exists, don't add it again
- Functional equivalents: If `.env*` exists, don't add `.env` or `.env.local` (they're covered)
- Comments and whitespace don't matter for duplication

### 5. Write the File

**Creating new .gitignore:**
- Write the complete assembled content to `.gitignore`

**Updating existing .gitignore:**
- Append only the new patterns that weren't already present
- Maintain the original file structure

### 6. Report Completion

After creating or updating the file, report:

1. What was done: "Created .gitignore" or "Updated .gitignore"
2. Detected languages: "Added [Python/Node/Go/etc.] patterns"
3. Key protections: "Protected: secrets, credentials, workspace files, and build artifacts"

Example output:
```
Updated .gitignore with comprehensive security patterns for Python and Node
Protected: secrets, credentials, workspace files, and build artifacts
Added Python and JavaScript/TypeScript patterns
```

## Assets

This skill includes template files in `assets/` directory:

- `base.gitignore` - Core security, workspace, IDE, system, and build patterns
- `python.gitignore` - Python-specific patterns
- `javascript.gitignore` - JavaScript/TypeScript/Node patterns
- `go.gitignore` - Go-specific patterns
- `rust.gitignore` - Rust-specific patterns
- `ruby.gitignore` - Ruby-specific patterns
- `java.gitignore` - Java-specific patterns

Read these files as needed during the workflow to assemble the complete .gitignore content.
