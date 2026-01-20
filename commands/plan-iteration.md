---
allowed-tools: Read, Write, Edit, Bash, Task, AskUserQuestion
description: Collaborative iteration planning through investigation
---

@../resources/command-rules.md

# Iteration Planning

You are helping plan an iteration by investigating the codebase, presenting findings, and capturing decisions — not prescribing solutions.

## Instrumentation

**Start event:**
```bash
argus-send --source momentum --type command --session-id {SESSION_ID} --status pending \
  --message "Starting /plan-iteration" \
  --data '{"command_name": "plan-iteration"}'
```

**End event (after Phase 10):**
```bash
argus-send --source momentum --type command --session-id {SESSION_ID} --status success \
  --message "Completed /plan-iteration" \
  --data '{"command_name": "plan-iteration", "features": {count}, "iteration": "{name}"}'
```

If command fails, use `--status failure` with error details.

## Core Principles

- **Interview first**: No artifacts until user approves
- **Investigate, don't assume**: Find what exists before designing
- **Capture decisions**: User decides, you document
- **Embed standards**: Paste actual patterns, not file references
- **No test tasks**: Test-runner writes tests after build-task
- **Preserve context**: Decomposer needs rich ITERATION.md to work from

---

## Phase 1: Foundation Loading

**Goal**: Load all context needed for planning

**Actions**:
1. READ foundation files:
   - `{PROJECT_ROOT}/.workflow/artifacts/IDEA.md`
   - `{PROJECT_ROOT}/.workflow/artifacts/PROJECT_SUMMARY.md` (if exists)
   - `{WORKFLOW_PROJECTS}/{PROJECT_NAME}/later.md` (if exists)

2. SCAN `{PROJECT_ROOT}/.workflow/archives/` for completed iterations

3. IF later.md exists:
   - PRESENT items grouped by type (bugs, todos, ideas)
   - ASK which items to include
   - WAIT for selection

4. IF no later.md:
   - ASK "What features should we build in this iteration?"
   - WAIT for response

**STOP**: Have user's feature selection before proceeding

---

## Phase 1.5: Recent Iteration Learnings

**Goal**: Learn from past iterations to avoid repeating mistakes

**Actions**:
IF completed iterations exist in archives:
1. READ last 2-3 `ITERATION_*_SUMMARY.md` files from `{PROJECT_ROOT}/.workflow/archives/iteration-*/`
2. EXTRACT insights:
   - Task insights: patterns established, friction encountered
   - Discovery insights: bugs, performance learnings, tech debt
   - Architecture evolution: how structure changed

3. PRESENT learnings:
   ```
   From recent iterations:
   - PATTERNS TO REUSE: [established patterns]
   - AVOID: [friction points, bug patterns]
   - ARCHITECTURE: [decisions to maintain]
   ```

**Verification**: Learnings captured and ready to apply

---

## Phase 2: Standards Loading

**Goal**: Load and embed tech stack standards

**Actions**:
1. DETECT technologies from IDEA.md (languages, frameworks, databases)
2. READ standards from `~/.claudex/standards/claudex-{tech}.md` for each
3. EXTRACT and note:
   - Package management patterns
   - Project structure requirements
   - Testing patterns
   - Quality gates

**Verification**: List every standards file read with key patterns extracted

---

## Phase 3: Complexity Triage

**Goal**: Classify each feature by implementation complexity

**Actions**:
1. CLASSIFY each selected feature:
   - **SIMPLE**: Clear fix, small change, obvious implementation
   - **PATTERN**: Follows existing pattern in codebase
   - **COMPLEX**: Needs architecture decision, multiple valid approaches

2. PRESENT classification:
   ```
   SIMPLE: [list — will include with minimal detail]
   PATTERN: [list — will find example files to follow]
   COMPLEX: [list — will investigate via agents]
   ```

3. ASK "Does this classification look right?"

**STOP**: Get user agreement on classification

---

## Phase 4: Investigation

**Goal**: Investigate complex items and find patterns — this is where context gets built

**Actions**:

FOR COMPLEX items (run concurrently):
1. LAUNCH architecture-analyst agents with specific prompts:
   ```
   "Investigate architectural options for [feature].

   Context: [user's description of what they want]
   Codebase: [relevant existing patterns you've seen]

   Investigate:
   - Existing patterns that could apply
   - 2-3 viable structural approaches
   - Integration points with current system
   - File organization and boundaries
   - Data flow considerations

   Present options with trade-offs and effort estimates."
   ```

2. For each agent response:
   - GENERATE 4-char ID (e.g., 7a3f)
   - SAVE to `{PROJECT_ROOT}/.workflow/artifacts/subagents/ARCHITECTURE-{ID}.md`
   - NOTE which feature the analysis was for

3. READ saved artifacts to incorporate findings

FOR PATTERN items (run concurrently):
1. LAUNCH Explore agents:
   ```
   "Find implementations similar to [feature description].
   Return: specific file paths, key patterns, integration points."
   ```
2. NOTE specific files and patterns to follow

FOR SIMPLE items:
- No investigation needed — handle during implementation

**Verification**: All investigations complete, findings documented

---

## Phase 5: Present Findings

**Goal**: Present complete investigation and get design decisions

**Actions**:
1. PRESENT all findings organized by complexity:

   **SIMPLE TASKS** ([count]):
   - [Task]: One-line description

   **PATTERN TASKS** ([count]):
   - [Task]: Follows `[specific file path]`
     - Integration: [where it connects]

   **COMPLEX TASKS** ([count]):
   For each, present agent findings:
   ```
   [Feature Name]:

   Current State: [what exists]

   Option A: [name]
   - Approach: [2-3 sentences]
   - Pros: [key benefits]
   - Cons: [key drawbacks]
   - Effort: Low/Medium/High

   Option B: [name]
   - Approach: [2-3 sentences]
   - Pros: [key benefits]
   - Cons: [key drawbacks]
   - Effort: Low/Medium/High

   Recommendation: [which option and why]
   ```

2. ASK for decisions:
   ```
   For complex items, specify your preferred approach:
   - [Feature 1]: A/B/C?
   - [Feature 2]: A/B/C?
   ```

3. WAIT for all decisions

**STOP**: Have explicit decision for every complex item

---

## Phase 6: Invariant Analysis

**Goal**: Identify what must be preserved and what could break

**Actions**:
1. IDENTIFY system invariants (must NEVER break):
   - Data integrity: What data loss is unacceptable?
   - User trust: What would make users lose faith?
   - Core functionality: What must always work?

2. IDENTIFY behavioral bounds (acceptable variance):
   - Performance: Response time thresholds
   - Accuracy: Acceptable error rates

3. ASSESS risk:
   - **HIGH RISK**: Could ruin user's day (data loss, security, core workflow)
   - **LOW RISK**: Cosmetic, has workarounds

4. ANTICIPATE expected failures:
   - Network issues, race conditions, external service failures
   - How each should be handled

**Verification**: Clear understanding of what can't break

---

## Phase 7: Approval Checkpoint

**Goal**: Get explicit approval before generating artifacts

**Present**:
```
INVESTIGATION COMPLETE - READY TO PLAN

Features: [X] total
- Simple: [count] (minimal detail)
- Pattern: [count] (with file references)
- Complex: [count] (with chosen approaches)

Design Decisions:
- [Feature]: Option [A/B/C] — [brief description]
- [Feature]: Option [A/B/C] — [brief description]

Invariants Identified:
- Must preserve: [critical properties]
- High risk: [what could break]

Standards Loaded:
- [list files read]

Ready to generate ITERATION.md with these decisions?
```

**DO NOT PROCEED WITHOUT EXPLICIT "YES"**

---

## Phase 7.5: Assumption Validation

**Goal**: Verify referenced code/paths actually exist before finalizing

**Actions**:
FOR EACH task that references existing code:
1. VERIFY methods/classes exist:
   - LAUNCH quick Explore agent: "Confirm [method/class] exists in codebase"
2. VERIFY file paths:
   - RUN `ls` to confirm paths
3. VERIFY integration points:
   - READ actual files to confirm structure

IF assumptions don't match reality:
- REVISE task description
- MARK code as "to be created" vs "to be modified"

**Verification**: All referenced code/paths confirmed or marked as new

---

## Phase 8: Generate ITERATION.md

**Goal**: Create iteration file rich enough for decomposer to work from

**Actions**:
1. READ `{PROJECT_ROOT}/.workflow/templates/ITERATION_TEMPLATE.md`

2. POPULATE sections with investigation findings:
   - Working Software Goal (from user's feature selection)
   - Context From Previous Iterations (from Phase 1)
   - Tech Stack (PASTE actual patterns from standards files)
   - Integration Architecture (from investigation)
   - Invariant Analysis (from Phase 6)
   - Tasks (from Phases 4-5 decisions)

3. EMBED tech standards — paste actual patterns:
   ```
   ### Python
   From ~/.claudex/standards/claudex-python.md:
   - **Package Management**: uv exclusively
   - **Project Structure**: src/ layout
   - **Testing**: pytest with real services
   [paste actual patterns, not just references]
   ```

**Task Format Requirements**:
- NO detailed implementation code
- NO assumed class structures
- NO tasks for writing tests — test-runner handles this
- NO test files in Key files (test_*.py, *_test.ts, *.test.ts)
- YES design decisions with rationale
- YES investigation context (what exists, patterns found)
- YES test considerations (invariants, risk areas)

**Task Template**:
```
### N. [Feature Name] 📋 Planned

**Type**: Implementation Task / Design Task / Research Spike
**Depends on**: None / Task X
**Estimated time**: N hours

**What to build**: [Clear user-facing outcome]

**Design Decision**: [Approach chosen — e.g., "JWT parallel to existing session auth"]
**Investigation Context**: [Key findings — e.g., "Current auth in middleware/auth.go, uses 24hr tokens"]
**Pattern Reference**: [For pattern items: specific file to follow]

**Key files**: [Source files only — no test files]

**Integration Requirements**:
- Receives: [What this component needs]
- Produces: [What this component outputs]
- Depends on: [What must exist first]

**Success criteria**: [How to verify — user action or API call]
**Success verification**: [EXACT curl/CLI command that proves success criteria met]
```

**Task Types**:
- **Implementation Task**: Produces SHIPPABLE CODE
- **Design Task**: Produces ARTIFACTS (explorations/, mockups)
- **Research Spike**: Produces WORKING CODE to prove feasibility

4. UPDATE `{PROJECT_ROOT}/.workflow/artifacts/IDEA.md` with feature status (🔄 In Progress)
5. RUN /update-project-summary

---

## Phase 8.5: Reconciliation Check

**Goal**: Verify iteration faithfully represents decisions — nothing lost, nothing added

**Actions**:
1. COMPARE generated ITERATION.md against all sources:
   - Exploration documents in context
   - User decisions from Phases 3-7
   - Investigation findings from Phase 4

2. CHECK for fidelity issues:

   **Nothing Lost**:
   - Did any specific detail from sources fail to make it in?
   - Were concrete values (sizes, counts, paths) preserved?
   - Did quality criteria get flattened to vague language?

   **Nothing Added**:
   - Did anything appear that wasn't discussed or approved?
   - Are there assumptions that weren't validated?

   **Specificity Preserved**:
   - Concrete values (sizes, counts, paths) preserved, not generalized
   - Content sources named explicitly, not "as discussed"
   - Success criteria verify correctness, not just existence

3. IF fidelity issues found:
   - PRESENT specific discrepancies to user
   - ASK: "Should I revise the iteration to address these?"
   - REVISE if user approves

**Verification**: Iteration faithfully represents all decisions with full specificity

---

## Phase 9: Test Infrastructure (First Iteration Only)

**Goal**: Setup testing documentation

**Actions**:
IF first iteration (no completed iterations in archives):
1. CHECK if `{PROJECT_ROOT}/.workflow/artifacts/TESTING.md` exists
2. IF no → RUN /setup-testing

---

## Phase 10: Completion

**Present**:
```
ITERATION PLANNED

✅ Features selected and triaged
✅ Complex items investigated via agents
✅ Design decisions captured from user
✅ Assumptions validated against codebase
✅ Invariants and risks identified
✅ Standards embedded (not referenced)
✅ Tasks ready for decomposition

Decisions are YOUR decisions, not my assumptions.

Ready for: /decompose-iteration
```

---

## Error Handling

- **Agent investigation vague**: Send more specific prompts with context
- **User unsure of decision**: Present clearer trade-offs, make recommendation
- **Complexity unclear**: Default to COMPLEX, investigate
- **Pattern not found**: Treat as COMPLEX, needs design decision
- **Standards missing**: Note gap and warn user
- **Assumption validation fails**: Revise tasks, mark as "to be created"
