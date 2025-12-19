# Agent Rules

## Variables

Get from context:
- `{PROJECT_ROOT}` — Absolute path to project root
- `{task-number}` — Task being worked on

## Paths

**Always use full absolute paths.** Substitute `{PROJECT_ROOT}` with the actual value from context.

Key directories:
- Artifacts: `{PROJECT_ROOT}/.workflow/artifacts/`
- State: `{PROJECT_ROOT}/.workflow/state/`
- Reports: `{PROJECT_ROOT}/.workflow/agents/reports/`
- Operators: `{PROJECT_ROOT}/.workflow/agents/operators/`

Key files:
- `{PROJECT_ROOT}/.workflow/artifacts/TASKS.md` - Task definitions
- `{PROJECT_ROOT}/.workflow/artifacts/ITERATION.md` - Current iteration plan
- `{PROJECT_ROOT}/.workflow/artifacts/PROJECT_EXPERTISE.toml` - Codebase knowledge

## Operator Log

Create operator file at `{PROJECT_ROOT}/.workflow/agents/operators/{slug}.md`
- slug = 4-6 word lowercase hyphenated slug from task description

**This is a brief, append-only rolling log for human monitoring.**

Keep entries SHORT — one line per bullet. No structured sections, no code blocks, no detailed explanations. Detailed analysis belongs in the report, not here.

**Workflow:**
1. Read recent history from operator file (if exists) to understand context
2. Read expertise: `{PROJECT_ROOT}/.workflow/artifacts/PROJECT_EXPERTISE.toml`
3. Log 1-2 bullet plan before doing any work
4. After every meaningful step, APPEND a timestamped one-line update
5. Mark decisions with `**NOTE:**` on same line
6. End with `## Summary` (2-3 bullets max)

**Format:**
```
- [09:30] Read TASKS.md, found task 1.1 requirements
- [09:31] Read hook file, 123 lines
- [09:32] **NOTE:** Line 239 ref outdated, file is 123 lines post-refactor
- [09:35] Found injection pattern in SessionStart hook
- [09:40] User correction: memories should be per-turn not session
- [09:42] Revised approach: inject in UserPromptSubmit

## Summary
- Outcome: Plan created for memory injection
- Files: hooks/momentum-user-prompt-submit-hook.ts
- Next: Implement injection block
```

## Reports

Write final report to `{PROJECT_ROOT}/.workflow/agents/reports/`

**Naming**: `{domain}_{action}-{id}.md`
- domain = what you're analyzing (code, architecture, implementation, task)
- action = noun form of your role (review, analysis, audit, plan)
- id = generate 4 random alphanumeric characters

Examples: `code_review-a1b2.md`, `task_plan-x9y8.md`

**End with**:
```markdown
## Summary

[2-4 sentences: What was analyzed, key findings, outcome.]
```

## Final Response

Return to orchestrator:
```
REPORT: {full path to report file}
OPERATOR: {full path to operator file}
PLAN_FLAGS: {"needs_arch": bool, "needs_impl": bool, "complexity": "simple|medium|complex"}
```
