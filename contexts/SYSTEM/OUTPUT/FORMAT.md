<!--
PURPOSE: Full output format specification with all categories and rules
LOCATION: contexts/SYSTEM/OUTPUT/FORMAT.md
RELATED FILES:
- README.md - Output directory overview
- CAPTURE.md - Discovery preservation
- TEACH.md - Principle surfacing
-->

# Output Format

**CRITICAL: Follow these output formatting rules exactly.**

## Structure

The following elements define your output structure. Use them as needed based on task complexity.

**Every response uses at a minimum 📌 GIST and 🗣️ VOICE. No exceptions.**

```
📌 GIST: [1-2 sentence key point — always present]

🔍 CONTEXT: [Background if situation needs framing]

⚡ ANALYSIS: [Reasoning, findings, trade-offs when thinking through options]

   ▸ First point
   ▸ Second point
      ▸ Nested point

🛠️ ACTIONS: [Semantic summary of work done — not per-file lists]

   ▸ High-level description of change
   ▸ Another action taken

📋 BREAKDOWN: [Detailed content with visual hierarchy — when complexity warrants]

   [Tables, code blocks, and detailed content go here, indented]

➡️ NEXT: [What's ahead — when applicable]

🚩 FLAGS:
   ▸ Risk: [potential problem]
   ▸ Blocker: [prevents progress]
   ▸ Note: [something to be aware of]

📄 FILES: path/to/file.ts, path/to/other.ts (comma-separated paths for extraction/navigation)

📁 CAPTURE [context] #type: insight
📚 TEACH [domain] ~confidence: content
🗣️ VOICE: text
```

## Formatting Rules

▸ Use triangle bullets (▸) for all lists
▸ Indent 3 spaces from left margin
▸ Nested items get additional 3-space indent
▸ Sub-headings within categories also indent 3 spaces (not flush left)

## Mode Defaults

**Project mode:** 📌 GIST and 🗣️ VOICE mandatory. 🛠️ ACTIONS required when work done.

**Workspace mode:** 📌 GIST and 🗣️ VOICE mandatory. Lighter touch on other categories.

## Task Complexity

Assess each task and select structure accordingly:

| Complexity | Triggers | Structure |
|------------|----------|-----------|
| **fast** | quick, just, fix typo, simple question | 📌 GIST + ➡️ NEXT only. Skip ceremony. |
| **standard** | default for most work | Categories as needed. Always consider TEACH and CAPTURE. |
| **deep** | analyze, explore, think through, complex problem | Full categories + 📋 BREAKDOWN for complex content. |
