# Add discovered tasks to current iteration during implementation

**Variables**: Variables in CAPS are injected by hooks (see HTML comments above), `{vars}` are runtime values (find/calculate them), `[vars]` are template placeholders (substitute them).

**Key Paths**:
- ARTIFACTS_DIR - Workflow artifacts (TASKS.md)

## ⚠️ CRITICAL: DISCOVERED TASKS NEED FULL CONTEXT ⚠️

**🛑 INTERVIEW FIRST - NO TASKS UNTIL CONTEXT GATHERED**  
**🛑 THESE TASKS WON'T EXIST ANYWHERE ELSE**  
**🛑 CAPTURE WHY THIS EMERGED NOW**  
**🛑 MAINTAIN SAME QUALITY AS PLANNED TASKS**

## Context

This command handles the reality of software development - you discover problems during implementation that need immediate attention:
- Architecture audit reveals dead code or bad patterns
- Implementation uncovers technical debt that blocks progress  
- Testing reveals design flaws that need refactoring
- Performance issues emerge that can't wait

These can't wait for the next iteration but weren't part of the original plan.

## MANDATORY EXECUTION SEQUENCE

### PHASE 1: CONTEXT LOADING (REQUIRED)

**CHECKPOINT 1: Load Current State**

```
REQUIRED: Understand current iteration and task status:
- READ ARTIFACTS_DIR/TASKS.md
- IDENTIFY current task statuses (what's in progress, complete)
- CHECK if "Discovered Tasks" section exists
- DETERMINE next available prefix (D, R, F, T, etc.)
- UNDERSTAND iteration goals from ITERATION.md

DISCOVERED TASK PREFIXES:
- D[n]: Discovery/debt tasks (dead code, tech debt)
- R[n]: Refactoring tasks (extract, reorganize)
- F[n]: Fix tasks (bugs found during implementation)
- T[n]: Technical improvement tasks (performance, security)

VERIFICATION: Current state loaded, next prefix identified
```

**CHECKPOINT 2: Understand the Discovery**

```
REQUIRED: What triggered this task addition?
- Architecture audit finding?
- Implementation blocker?
- Test failure revealing design issue?
- Performance problem?
- Security vulnerability?
- Code smell that's too bad to ignore?

CAPTURE THE TRIGGER:
- Source: [audit/implementation/testing/review]
- Severity: [blocks progress/degrades quality/future risk]
- Scope: [single file/component/cross-cutting]

VERIFICATION: Clear understanding of why this task emerged NOW
```

### PHASE 2: DISCOVERY INTERVIEW (REQUIRED)

**⚠️ CRITICAL: INTERVIEW FIRST - NO TASKS UNTIL APPROVED ⚠️**

**CHECKPOINT 3: Context Gathering Interview**

```
REQUIRED: Interview to understand the discovered issue fully:

PRESENT YOUR UNDERSTANDING:
"I see you've discovered [issue] while [doing what].
This appears to be [type of problem] affecting [scope]."

GATHER CRITICAL CONTEXT:

Discovery Questions:
- "What exactly did you discover and how?"
- "Why does this need to be fixed in this iteration?"
- "What's the impact if we don't fix it now?"
- "How does this relate to current tasks?"

Technical Questions:
- "What files/components are affected?"
- "What's the root cause of this issue?"
- "What patterns should we follow for the fix?"
- "Are there similar issues elsewhere?"

Scope Questions:
- "Is this a single fix or needs decomposition?"
- "What's the minimal fix vs ideal fix?"
- "What could break if we change this?"
- "What tests would prove it's fixed?"

CAPTURE DURING INTERVIEW:
## Discovery Context
- Found while: [specific task or activity]
- Root cause: [technical explanation]
- Impact: [what breaks or degrades]
- Scope: [files and components affected]
- Fix approach: [proposed solution]
- Validation: [how to verify the fix]

VERIFICATION: Full context captured, approach validated
```

**CHECKPOINT 4: Task Decomposition (if needed)**

```
IF issue requires multiple tasks:

DECOMPOSITION QUESTIONS:
- "What's the logical breakdown of this work?"
- "What order do these changes need to happen?"
- "Which parts are risky vs straightforward?"
- "Can any parts be deferred?"

APPLY SAME RULES AS REGULAR TASKS:
- 1-2 files per task maximum
- Single deliverable per task
- < 100 lines per task
- Clear demo command

EXAMPLE DECOMPOSITION:
Issue: "Component X has duplicated logic across 5 files"
Tasks:
- R1.1: Extract shared logic to utility function
- R1.2: Update ComponentA to use utility
- R1.3: Update ComponentB to use utility
- R1.4: Remove old duplicate code
- R1.5: Update tests for new structure

VERIFICATION: If multi-task, properly decomposed
```

### PHASE 3: MANDATORY APPROVAL

**⚠️ CRITICAL: INTERVIEW COMPLETE - NO TASKS UNTIL APPROVED ⚠️**

```
MANDATORY SUMMARY:
=====================================
DISCOVERED TASK ANALYSIS COMPLETE
=====================================

Discovery Type: [Audit/Implementation/Testing finding]
Severity: [Blocks progress/Quality issue/Future risk]

CONTEXT CAPTURED:
- Found while: [activity]
- Root cause: [explanation]
- Impact if not fixed: [consequences]
- Proposed approach: [solution]

TASK BREAKDOWN:
[IF SINGLE TASK]
- Single task: [description]
- Files affected: [list]
- Validation: [demo command]

[IF MULTIPLE TASKS]
Total tasks: [N]
- [Prefix]1.1: [description] (X files, ~Y lines)
- [Prefix]1.2: [description] (X files, ~Y lines)
- [Prefix]1.3: [description] (X files, ~Y lines)

Risk Assessment:
- HIGH RISK: [components if any]
- LOW RISK: [components if any]

Invariants to preserve:
- [Any invariants this might affect]

Ready to add to TASKS.md?

Please respond with YES or NO.
```

**🛑 STOP HERE - WAIT FOR APPROVAL**

### PHASE 4: TASK ADDITION (AFTER APPROVAL)

**CHECKPOINT 5: Update TASKS.md**

```
REQUIRED: Add discovered tasks to TASKS.md:

1. LOCATE or CREATE "Discovered Tasks" section after planned tasks
2. ADD new subsection for this discovery
3. USE next available prefix (D, R, F, T)
4. MAINTAIN full task structure
5. INCLUDE discovery context

SECTION STRUCTURE:
## Discovered Tasks (Added During Implementation)

### [Prefix]1: [Clear description of what's being fixed/refactored]

**Discovery Context:**
- **Found while:** [Working on task X.Y / Running audit / Testing]
- **Root cause:** [Technical explanation of the problem]
- **Impact:** [What breaks or degrades without this fix]
- **Why now:** [Why this can't wait for next iteration]

#### [Prefix]1.1: [Specific task name]

- **Status:** 📋 Not Started
- **Files:** `[exact file paths]`
- **Architecture Context:**
  - Patterns: [Existing patterns to follow]
  - State: [What state changes]
  - Data: [Data implications]
  - Integration: [How this affects other components]
  - Constraints: [Performance, security requirements]
- **Error Scenarios:** [What could go wrong]
- **Deliverable:** [What this produces]
- **Demo:** `[command to verify]`
- **Dependencies:** [Other tasks this depends on]
- **Validation:** [How to verify this works]
- **Notes:** [Implementation guidance]

**Discovered During Implementation:**
- **Invariants (from iteration planning):**
  - [Any relevant invariants from original planning]
- **Additional Invariants (found during building):**
  - [New invariants discovered with this issue]
- **Risk Assessment:**
  - HIGH: [If applicable]
  - LOW: [If applicable]

[Continue with Prefix1.2, Prefix1.3 if multi-task]

VERIFICATION: Tasks added with full context
```

**CHECKPOINT 6: Update Task Tracking**

```
REQUIRED: Update overview sections:

1. UPDATE "Task Completion Tracking" section
2. ADD discovered tasks to tracking list
3. UPDATE total task count
4. MAINTAIN proper status tracking

TRACKING UPDATE:
### Discovered Tasks
- [ ] D1.1 - Not started  
- [ ] D1.2 - Not started
- [ ] R1.1 - Not started

VERIFICATION: Tracking sections updated
```

### PHASE 5: COMPLETION

**CHECKPOINT 7: Final Summary**

```
TASK ADDITION COMPLETE
=====================

Added: [N] discovered tasks
Type: [Discovery/Refactor/Fix/Technical]
Prefix used: [D1/R1/F1/T1]

TASKS ADDED:
- [Prefix]1.1: [description]
- [Prefix]1.2: [description]
[etc.]

Discovery documented: YES
Full context captured: YES
Same quality as planned tasks: YES

Next step: /plan-task [Prefix]1.1

These tasks can now be:
- Implemented with /plan-task
- Tested with /plan-test
- Completed with /complete-task

Just like any other task in the iteration.
```

## ENFORCEMENT MECHANISMS

### Context Capture Requirements
- Must document WHY task emerged
- Must explain impact of not doing it
- Must show relationship to current work
- Must include validation criteria

### Task Quality Requirements  
- Same decomposition rules as planned tasks
- Same architecture context requirements
- Same demo/validation requirements
- Same risk assessment needs

### Anti-Patterns to Avoid
- No vague "cleanup" tasks
- No bundling multiple issues
- No tasks without clear demos
- No context-free additions

## SUCCESS CRITERIA

Addition succeeds when:
- [ ] Discovery context fully documented
- [ ] Tasks properly decomposed
- [ ] Same quality bar as planned tasks
- [ ] Integrated into TASKS.md tracking
- [ ] Ready for systematic execution
- [ ] Maintains iteration coherence

## FAILURE MODES & RECOVERY

**If issue too vague:** Conduct deeper interview
**If scope too large:** Decompose further or defer parts
**If no clear demo:** Task is too abstract
**If affects too many files:** Find the core fix first
**If not actually urgent:** Use qback for later.md instead