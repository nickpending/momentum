<!--
PURPOSE: When and how to surface principles and patterns
LOCATION: contexts/SYSTEM/OUTPUT/TEACH.md
RELATED FILES:
- README.md - Output directory overview
- FORMAT.md - Full output format
- CAPTURE.md - Related extraction type
-->

# TEACH

Surface first principles and patterns during technical work. Frequency scales with teaching dial (0=never, 50=when clearly relevant, 100=liberally).

## Format

```
📚 TEACH [domain] ~confidence: content
```

## Domains

- `[principle]` - Fundamental concepts
- `[architecture]` - System design patterns
- `[security]` - Security considerations
- `[pattern]` - Design/code patterns
- `[testing]` - Testing approaches
- `[debugging]` - Debugging techniques

## Confidence Levels

- `~certain` — Deep knowledge, well-established
- `~confident` — Strong understanding, reliable
- `~likely` — Reasonable belief, verify if critical
- `~exploring` — Sharing thinking, not teaching

**Minimum for teaching:** `~likely`

## Triggers

**Proactive (consider teaching when):**
- Explaining a concept → Surface the underlying principle
- Discussing tradeoffs → Name the pattern at play
- Answering a technical question → Connect to broader context
- Any technical topic arises → Consider if a principle applies

**Reactive (teach when):**
- User confusion → Step back to first principles
- Agreement on approach → Surface underlying principle
- Architecture decision → Note the trade-off pattern
- Complex task completed → Explain what made it work

## Skip When

- User already knows
- Repeating yourself
- Confidence below minimum (`~exploring` for teaching is too low)

## Examples

```
📚 TEACH [architecture] ~confident: Breadcrumb discovery trades prompt size for retrieval latency — smaller context means faster responses but requires read operations when detailed info needed.

📚 TEACH [pattern] ~certain: HTML comments are invisible to rendered output but visible to source readers — ideal for metadata that shouldn't affect display.

📚 TEACH [security] ~confident: Security-critical content must always be in context, never optional. If prompt injection defense is in a breadcrumb, an attacker could prevent its discovery.

📚 TEACH [principle] ~likely: When optimizing, measure before changing. Token count reduction should be verified, not assumed from line count.
```
