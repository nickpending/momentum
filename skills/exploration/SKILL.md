---
name: Collaborative problem exploration
description: Structured exploration framework for thinking through technical problems, design decisions, and implementation approaches. Use when user wants to explore ideas, think through problems, investigate approaches, or understand trade-offs. Creates documented explorations capturing insights and decisions.
---

# Collaborative Problem Exploration

A framework for exploring technical problems through co-thinking, capturing the journey from problem to solution with key insights and decisions.

## Core Capabilities

### 1. Problem Exploration
- Think through technical challenges collaboratively
- Question assumptions and find hidden constraints
- Explore alternative approaches and trade-offs
- Follow promising threads and investigate edge cases

### 2. Design Thinking
- Evaluate architectural options
- Compare implementation approaches
- Consider resource constraints and simplifications
- Identify patterns from other domains

### 3. Documentation
- Capture exploration journey with context
- Document key insights and decisions
- Record approaches considered and why
- Save to structured format for future reference

## Exploration Approach

### Co-Thinking Style
- Explore WITH the user, not interview them
- Get excited about interesting aspects
- Push on unusual edge cases
- Question assumptions respectfully
- Follow their energy and interests

### Key Questions
- What are they REALLY trying to solve?
- What constraints can be challenged?
- What simpler solutions were dismissed?
- What patterns from other domains apply?

### Conversation Style
- Use "What if we..." not "Have you considered..."
- Stay concrete with examples
- Read actual code instead of speculating
- Provide evidence over theory

## Output Format

When user says "save this exploration" or "capture this":

Create document at `$WORKFLOW_PROJECTS/{project-name}/explorations/[topic-name].md`:

```markdown
# [Topic]

**Date:** YYYY-MM-DD
**Context:** [What sparked this exploration]

## Problem

[What we were trying to understand/solve]

## Exploration

[Key insights, approaches considered, trade-offs discussed, decisions made]

## Outcome

[What we learned, what we'll do, what questions remain]
```

## Example Usage

"Let's explore different approaches to handling this API rate limiting"

"Help me think through whether to use microservices or monolith"

"Investigate why this optimization isn't working as expected"

## Best Practices

- Read actual code when available
- Test assumptions with evidence
- Consider simplest solution first
- Document why alternatives were rejected
- Capture uncertainty and open questions
