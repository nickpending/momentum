# Lore MVP Event System Design
Date: 2025-01-25
Participants: Rudy, Claude

## Core Concept
Lore is an event-driven knowledge fabric that captures, indexes, and surfaces everything you create, learn, and discover. It acts as the central intelligence consuming events from your tools and making your entire workflow ecosystem aware of patterns, preferences, and past solutions.

## Key Insights

### 1. Event-Driven Architecture
- Tools write events to Lore's log (not analyze afterwards)
- Each tool decides what's meaningful to capture
- Simple append-only JSONL format
- No complex schemas or universal formats needed

### 2. XDG-Compliant Storage
```
$XDG_DATA_HOME/lore/log.jsonl    # Permanent knowledge log
$XDG_CACHE_HOME/lore/indices/    # Generated indices (rebuildable)
$XDG_CONFIG_HOME/lore/config      # Future configuration
```

### 3. Rich Event Captures
Not just "task complete" but meaningful data:
- Problem solved and how
- Patterns discovered
- Decisions made and why
- Code snippets that worked
- Searchable keywords

## Event Types and Data

### exploration_saved
Captures insights from exploration sessions:
- Topic explored
- Key insights discovered
- Decisions made
- Technologies discussed
- Path to full exploration

### task_planned
Records planning decisions:
- Task name and approach
- Key decisions with rationale
- Identified risks
- Dependencies needed
- Technical choices made

### task_completed
Captures implementation learnings:
- Problem that was solved
- Solution pattern and code
- Discoveries during implementation
- Deviations from plan
- Reusable patterns identified

### iteration_planned
Strategic planning context:
- Iteration goals
- Overall approach
- Success criteria
- Technical focus area

### iteration_completed
Synthesis of iteration learnings:
- What was delivered
- Patterns established
- Problems solved with outcomes
- Architecture evolution
- Technical debt resolved

## Data Flow

1. **Capture**: Momentum commands append rich events to log
2. **Process**: Scripts build indices from event stream (offline)
3. **Surface**: Tools read indices on startup for context
4. **Search**: Simple grep/jq queries find past knowledge

## Implementation Strategy

### MVP Phase 1
1. Add Lore capture prompts to momentum commands
2. Create simple JSONL append mechanism
3. Build basic indexing script (jq-based)
4. Add context loading to momentum startup

### MVP Phase 2
1. Pattern detection across events
2. Active project tracking
3. Knowledge graph building
4. Smart context injection

## Key Decisions

1. **JSONL over complex formats** - Simple, streamable, works with standard tools
2. **Rich captures over simple logs** - Capture context, not just events
3. **Tool-specific data** - Each tool writes what it knows best
4. **Offline processing** - Don't waste Claude tokens on log processing
5. **Filesystem as API** - Files are the interface, no complex protocols

## Technical Details

### JSONL Structure
```json
{
  "timestamp": "ISO 8601",
  "event": "event_type",
  "project": "current_project",
  "data": {
    // Event-specific rich data
  }
}
```

### Indexing Examples
```bash
# Active projects
jq -r '.project' log.jsonl | sort | uniq -c

# Find patterns
jq -r 'select(.data.reusable_pattern) | .data.reusable_pattern' log.jsonl

# Search solutions
jq -r 'select(.data.problem_solved | contains("Redis"))' log.jsonl
```

## Philosophy Notes

- "Be strategic about MCP usage - avoid creating chatter between tools"
- "Start with JSONL for MVP - it's what observability tools use"
- "The file IS the API - no complex processing needed"
- "Ship first, optimize later"
- "Tools emit events, Lore indexes, patterns emerge"

## Next Steps

1. Update momentum commands with Lore capture prompts
2. Create indexing script
3. Test with real momentum workflow
4. Build pattern detection
5. Add context surfacing

## Open Questions

- How often to run indexing? (cron vs manual)
- Should indices be versioned in git?
- How to handle event replay/recovery?
- Best way to surface relevant context?

## Why This Approach

- **Simple**: Append to file, read from file
- **Flexible**: Each tool writes what matters
- **Searchable**: Everything has keywords
- **Evolutionary**: Can add complexity later
- **Standard**: Uses tools everyone has (jq, grep)
- **Token-efficient**: No LLM processing of logs