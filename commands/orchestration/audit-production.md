---
allowed-tools: Read, Bash, Task
description: Orchestrate production readiness audit via subagents
---

@../../resources/command-rules.md

# Audit Production (Orchestrated)

Spawn specialist agents in parallel, then synthesize findings into release verdict.

## Step 1: Context

EXTRACT from session:
- PROJECT_ROOT
- Current branch/commit

RUN `git log --oneline -5` to confirm what's being audited.

## Step 2: Spawn Specialists (Parallel)

SPAWN both agents IN PARALLEL:

**code-reviewer:**
```
FIRST: Read {PROJECT_ROOT}/.workflow/resources/agent-rules.md — this defines your output format.

Review the current codebase for production readiness:
- PROJECT_ROOT: {value}
- Focus: security vulnerabilities, critical bugs, error handling issues

Review scope: `git diff HEAD~10..HEAD` (recent changes)

Write report per agent-rules.md format.
```

**architecture-auditor:**
```
FIRST: Read {PROJECT_ROOT}/.workflow/resources/agent-rules.md — this defines your output format.

Audit architecture for drift and integration issues:
- PROJECT_ROOT: {value}
- Compare what was built vs what was planned in ITERATION.md

Focus on:
- Dead code, partial implementations
- Integration gaps (built but not wired up)
- Pattern violations

Write report per agent-rules.md format.
```

STORE both agent_ids for potential resume.

WAIT for both to complete.

## Step 3: Spawn Production Auditor

After specialists complete, SPAWN production-auditor:

```
FIRST: Read {PROJECT_ROOT}/.workflow/resources/agent-rules.md — this defines your output format.

Synthesize release readiness verdict:
- PROJECT_ROOT: {value}

Process:
1. Read specialist reports from {PROJECT_ROOT}/.workflow/agents/reports/
   - code_review-*.md (most recent)
   - architecture_audit-*.md (most recent)
2. Perform your own direct scans for secrets/credentials
3. Synthesize all findings into BLOCKED or READY verdict

Write report per agent-rules.md format.
```

STORE agent_id.

## Step 4: Read Final Report

READ the production-auditor's report from REPORT path.

## Step 5: Verify

CHECK the verdict:
- Is it clearly BLOCKED or READY?
- Are P0 issues listed with evidence?
- Are specialist findings incorporated?

IF verdict unclear or incomplete:
- RESUME production-auditor with: "Continue your operator log. Clarify verdict and ensure all specialist findings are addressed."

## Step 6: Present

PRESENT verdict to user:

```
PRODUCTION AUDIT COMPLETE
=========================

Verdict: {BLOCKED/READY}

Specialists Run:
- Code Review: {status}
- Architecture Audit: {status}

{If BLOCKED}
P0 Blockers:
- {issue 1 with location}
- {issue 2 with location}

{If READY}
No blockers found. P1/P2 issues noted for follow-up.

Reports:
- {PROJECT_ROOT}/.workflow/agents/reports/{code-review-report}
- {PROJECT_ROOT}/.workflow/agents/reports/{architecture-audit-report}
- {PROJECT_ROOT}/.workflow/agents/reports/{production-audit-report}
```

IF BLOCKED, list specific actions required before release.
