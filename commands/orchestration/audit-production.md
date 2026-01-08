---
allowed-tools: Read, Bash, Task
description: Orchestrate production readiness audit via subagents
---

@../../resources/command-rules.md

# Audit Production (Orchestrated)

Spawn specialist agents in parallel, then synthesize findings into release verdict.

## Instrumentation

**Start event:**
```bash
argus-send --source momentum --type command --session-id {SESSION_ID} --status pending \
  --message "Starting /orchestration:audit-production" \
  --data '{"command_name": "orchestration:audit-production"}'
```

**End event (after Step 6):**
```bash
argus-send --source momentum --type command --session-id {SESSION_ID} --status success \
  --message "Completed /orchestration:audit-production" \
  --data '{"command_name": "orchestration:audit-production", "verdict": "{BLOCKED/READY}"}'
```

If command fails, use `--status failure` with error details.

## Step 1: Context

EXTRACT from session:
- PROJECT_ROOT
- Current branch/commit

RUN `git log --oneline -5` to confirm what's being audited.

## Step 2: Spawn Specialists (Parallel)

**Actions:**
1. Generate CORRELATION_IDs:
   - `audit-code-review-{8 random hex chars}`
   - `audit-architecture-{8 random hex chars}`
2. SPAWN both agents IN PARALLEL:

**code-reviewer:**
```
CORRELATION_ID: {generated code-review correlation_id}
SESSION_ID: {SESSION_ID from hook context}

FIRST: Read these files before starting:
1. {PROJECT_ROOT}/.workflow/resources/agent-philosophy.md — How to think
2. {PROJECT_ROOT}/.workflow/resources/agent-rules.md — Output format and instrumentation

Review the current codebase for production readiness:
- PROJECT_ROOT: {value}
- Focus: security vulnerabilities, critical bugs, error handling issues

Review scope: `git diff HEAD~10..HEAD` (recent changes)

Write report per agent-rules.md format.
```

**architecture-auditor:**
```
CORRELATION_ID: {generated architecture correlation_id}
SESSION_ID: {SESSION_ID from hook context}

FIRST: Read these files before starting:
1. {PROJECT_ROOT}/.workflow/resources/agent-philosophy.md — How to think
2. {PROJECT_ROOT}/.workflow/resources/agent-rules.md — Output format and instrumentation

Audit architecture for drift and integration issues:
- PROJECT_ROOT: {value}
- Compare what was built vs what was planned in ITERATION.md

Focus on:
- Dead code, partial implementations
- Integration gaps (built but not wired up)
- Pattern violations

Write report per agent-rules.md format.
```

3. STORE both agent_ids for potential resume.

WAIT for both to complete.

## Step 3: Spawn Production Auditor

**Actions:**
1. Generate CORRELATION_ID: `audit-production-{8 random hex chars}`
2. After specialists complete, SPAWN production-auditor:

```
CORRELATION_ID: {generated correlation_id}
SESSION_ID: {SESSION_ID from hook context}

FIRST: Read these files before starting:
1. {PROJECT_ROOT}/.workflow/resources/agent-philosophy.md — How to think
2. {PROJECT_ROOT}/.workflow/resources/agent-rules.md — Output format and instrumentation

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

Present verdict using standard output format:

   ▸ Verdict: BLOCKED or READY
   ▸ Specialists run and their status
   ▸ If BLOCKED: P0 blockers with locations
   ▸ If READY: note P1/P2 issues for follow-up
   ▸ Report paths in `.workflow/agents/reports/`

IF BLOCKED, list specific actions required before release.
