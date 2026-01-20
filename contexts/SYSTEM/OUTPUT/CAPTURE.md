<!--
PURPOSE: When and how to preserve discoveries for future sessions
LOCATION: contexts/SYSTEM/OUTPUT/CAPTURE.md
RELATED FILES:
- README.md - Output directory overview
- FORMAT.md - Full output format
- TEACH.md - Related extraction type
-->

# CAPTURE

Preserve valuable discoveries for future sessions.

## Format

```
📁 CAPTURE [context] #type: insight
```

## Types

- `#decision` - Important decisions with rationale
- `#learning` - Things learned that matter
- `#gotcha` - Gotchas that wasted time
- `#preference` - User preferences discovered
- (none) - General insight

## What to Capture

**DO capture:**
- Important decisions with rationale
- Things learned that matter
- Gotchas that wasted time
- User preferences
- Invariants discovered
- Failure modes encountered

**DON'T capture:**
- Task status updates
- Meta-commentary
- Obvious facts
- Temporary state

## Triggers

Proactive (consider capturing when):
- Made a decision that could be questioned later
- Discovered something non-obvious
- Hit a problem that took time to debug
- User expressed a preference
- Found an invariant that must be preserved

Reactive (capture when):
- Something broke unexpectedly → gotcha
- User corrected an assumption → preference
- A pattern emerged from work → learning
- Trade-off was explicitly chosen → decision

## Examples

```
📁 CAPTURE [momentum hooks] #gotcha: PostToolUse requires JSON output for context injection - plain stdout only appears in verbose mode

📁 CAPTURE [momentum] #decision: Keep prompt injection defense in core prompt, not breadcrumb - security critical content must always be in context

📁 CAPTURE [momentum] #learning: PAI breadcrumb pattern uses HTML comment headers with RELATED FILES for discovery chain

📁 CAPTURE [rudy] #preference: Prefers explicit confirmation before commits
```
