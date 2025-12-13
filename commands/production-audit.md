---
allowed-tools: Task
description: Orchestrate comprehensive release readiness check
---

@../resources/command-rules.md

# Production Audit

Orchestrate a comprehensive release readiness check.

## Step 1: Launch Specialists (Parallel)

Launch both agents simultaneously:

**code-reviewer**
```
Review for security vulnerabilities and critical bugs.
Focus on: auth bypass, injection, data validation, error handling that loses data.
```

**architecture-auditor**
```
Audit for integration gaps and broken flows.
Focus on: features that don't work end-to-end, missing error handling on critical paths.
```

## Step 2: Wait for Completion

Wait for both agents to complete and write their reports.

## Step 3: Launch Production Auditor

Launch **production-auditor** to synthesize findings:
```
Read the specialist reports and compile the final production audit.
Scan for any secrets or sensitive files the specialists may have missed.
Provide a BLOCKED or READY verdict.
```
