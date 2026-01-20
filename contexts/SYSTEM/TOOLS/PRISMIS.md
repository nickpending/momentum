# Prismis

Query and access your Prismis content database for research and reference.

## Overview

Prismis stores and indexes saved articles with semantic search. Use it to find relevant articles, filter by source or priority, track reading statistics, and retrieve full content for research.

## When to Use

Trigger phrases:
- "use prismis", "query prismis", "search prismis"
- "prismis articles", "prismis stats", "prismis unread"
- "prismis sources", "saved articles"
- "find articles about X"
- "what have I saved about X"

## Common Operations

**IMPORTANT:** Use `prismis-cli --help` and `prismis-cli [command] --help` for exact syntax. All commands support `--json` output.

### Search

Use `--compact` first, then get articles of interest:

```bash
prismis-cli search "topic" --compact --json
prismis-cli search "topic" -s Anthropic --compact --json   # filter by source
prismis-cli get <id> --raw                                 # article content
prismis-cli get <id> --json                                # full analysis
```

### List Entries

```bash
prismis-cli list --limit 25 --json
prismis-cli list -s Anthropic --since-hours 168 --json     # source + time filter
prismis-cli list --priority high --unread --json
```

### Parse with jq

```bash
prismis-cli search "topic" --compact --json | jq '.[].title'
prismis-cli search "topic" --compact --json | jq '.[] | {id, title, source_name}'
```

### Statistics and Export

```bash
prismis-cli statistics --json
prismis-cli export --format json
```

## Examples

```bash
# Find articles about Claude
prismis-cli search "Claude API" --compact --json

# Get unread high-priority articles
prismis-cli list --priority high --unread --json

# Get full content of specific article
prismis-cli get abc123 --raw

# Recent Anthropic articles
prismis-cli list -s Anthropic --since-hours 48 --json
```
