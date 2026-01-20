<!--
PURPOSE: Reference documentation for lore CLI - knowledge fabric search
LOCATION: contexts/SYSTEM/TOOLS/LORE.md
RELATED FILES:
- README.md - Tools directory overview
- PRISMIS.md - Related knowledge tool
- ../DEVELOPMENT/RESOURCES.md - Resource discovery patterns
-->

# Lore

Query indexed knowledge across development history. Two search modes with different purposes.

## Overview

Lore provides semantic and text search across your personal knowledge fabric: development projects, tasks, events, blogs, commits, and personal data. Use it to find past work, understand context, and discover related patterns.

## When to Use

Trigger phrases:
- "use lore", "query lore", "search lore"
- "lore projects", "lore commits", "lore events", "lore blog posts"
- "search past work", "find project history"
- "what have I done with X"
- "find related projects"

## Common Operations

### Choosing Search Mode

**Semantic (default)** — meaning-based retrieval:
- Exploratory questions: "what have I done with kubernetes?"
- Conceptual queries: "authentication patterns", "error handling approaches"
- Finding related work when you don't know exact terms

**FTS5 (`--exact`)** — literal text matching:
- Specific code: function names, class names, variable names
- Exact phrases the user quotes
- Error messages, log patterns

**Decision rule:** Is the query about *meaning* or about *literal text*? Meaning → semantic. Literal → `--exact`.

### Search Commands

```bash
lore search "authentication patterns"      # semantic
lore search --exact "def process_data"     # FTS5 literal
lore search commits "refactor auth"        # semantic, specific source
lore search --sources                      # list sources with counts
```

### Passthrough Sources

```bash
lore search prismis "security patterns"    # prismis daemon
lore search atuin "docker build"           # shell history
```

### Other Operations

```bash
lore list development                      # domain entries
lore list --domains                        # available domains
lore capture knowledge --context=X --text="Y" --type=learning
lore capture teaching --domain=X --confidence=Y --text="Z"
lore-graph ask "what technologies does lore use?"
lore-graph related-to <project>            # projects sharing tech
```

## Examples

```bash
# Find authentication-related work
lore search "authentication patterns"

# Find exact function name
lore search --exact "processWebhook"

# Find commits about refactoring
lore search commits "refactor"

# Find projects using a technology
lore-graph related-to momentum

# Capture a learning
lore capture knowledge --context="momentum" --text="PAI breadcrumb pattern uses HTML comment headers" --type=learning
```
