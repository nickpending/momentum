# /plan-task $TASK_NUMBER Command - V5 Group-First Development

## ⚠️ CRITICAL: GROUP RELATED TASKS FIRST ⚠️

**🛑 CHECK FOR TASK GROUPING BEFORE ANYTHING ELSE**  
**🛑 BUILD WORKING SOFTWARE FIRST**  
**🛑 DEMO-DRIVEN DEVELOPMENT**  
**🛑 ONE SMOKE TEST THAT PROVES IT WORKS**  
**🛑 EMBEDDED STANDARDS MUST BE APPLIED**

## CORE PRINCIPLES (APPLY THROUGHOUT)

### Build-First Development
- Implementation before tests
- Focus on working demos
- Demo commands serve as manual smoke tests
- Real integration throughout

### Evidence Collection
- ACTUAL WORKING COMMANDS REQUIRED - NO CLAIMS
- REAL INTEGRATION PROOF REQUIRED
- STANDARDS COMPLIANCE EXAMPLES REQUIRED
- ONE SMOKE TEST THAT PROVES IT WORKS

### Composition-First Enforcement
- Does this task do exactly ONE thing?
- Will it produce working, demoable software?
- Is the success criteria simple and clear?

### YAGNI Validation
- Are we adding any unnecessary complexity?
- Is every line of code needed for THIS task?
- Are we abstracting before we need to?
- Can we ship this and iterate later?

## MANDATORY EXECUTION SEQUENCE - NO BYPASSING

### PHASE 0: PREPARATION & GROUPING

**⚠️ CRITICAL: THINK BEFORE DOING ⚠️**
- READ EVERYTHING 3 TIMES BEFORE DOING ANYTHING
- WHEN YOU MAKE A PLAN - REVIEW IT INTERNALLY FIRST TO CHECK FOR OMISSIONS, OVERSIGHTS AND MISTAKES

**CHECKPOINT 0: MANDATORY GROUPING DECISION (ABSOLUTELY FIRST)**

```
⚠️ STOP - GROUPING ANALYSIS REQUIRED BEFORE READING TASK DETAILS ⚠️

MANDATORY FIRST STEP - DO NOT SKIP:

1. IDENTIFY the feature number for task $TASK_NUMBER
2. READ ALL TASKS in that feature (scan titles and deliverables only)
3. COUNT: "I scanned ___ tasks in Feature X"

GROUPING DECISION GATE:
Ask: "Would a user care if I completed ONLY task $TASK_NUMBER?"

□ NO - Tasks must be grouped for meaningful delivery
  → List all related tasks that should be grouped
  → Example: "Tasks 3.3-3.9 all update commands for case-insensitive lookup"
  
□ YES - Task has standalone value  
  → Explain why this task alone provides value
  → Example: "Task 1.1 alone makes disconnect messages work"

COMPLETION QUALITY ASSESSMENT:
🏆 GOLD: Group tasks that ship working, demoable software
🥈 SILVER: Partially working features with real functionality
🥉 BRONZE: Empty structures/imports/setup (AVOID - not real completions)

⚠️ TYPE YOUR DECISION ⚠️
"GROUPING DECISION: [SINGLE TASK $TASK_NUMBER / GROUP TASKS X.Y-X.Z]"
"RATIONALE: [Why this grouping makes sense for users]"

DO NOT PROCEED WITHOUT EXPLICIT GROUPING DECISION
```

### PHASE 1: CONTEXT LOADING (AFTER GROUPING)

**CHECKPOINT 1: Load Task(s) Context Based on Grouping Decision**

```
NOW load detailed context for your grouped tasks:

IF SINGLE TASK:
- READ detailed requirements for task $TASK_NUMBER in TASKS.md
- EXTRACT deliverables, demo commands, dependencies
- VERIFY dependencies are met

IF GROUPED TASKS:
- READ detailed requirements for ALL grouped tasks
- IDENTIFY common patterns across the tasks
- EXTRACT all deliverables and demo commands
- VERIFY all dependencies are met
- NOTE which files will be touched multiple times

ALSO REQUIRED:
- READ .workflow/artifacts/ITERATION.md (embedded standards)
- READ .workflow/artifacts/APP_CONTEXT.md (integration patterns)
- REVIEW existing codebase for similar patterns

SYSTEM INTEGRATION CONTEXT:
- What existing services/components does this task need to integrate with?
- What APIs/interfaces are available from previous tasks?
- What services need to be running for this task to work end-to-end?
- How does this task fit into the overall system architecture?

VERIFICATION: State task description, integration requirements, and embedded standards that apply
```

**CHECKPOINT 2: Task Value Validation**

```
⚠️ FINAL REALITY CHECK ⚠️
If you're about to implement:
- An empty folder structure
- An import that imports nothing
- A class with no methods
- Setup with no functionality
→ STOP. Group with related tasks for REAL value.

Based on your grouping decision, validate value:

FOR SINGLE TASK:
- Does this task ALONE provide demoable value?
- Can users see real benefit from just this task?
- Is the demo meaningful without other tasks?

FOR GROUPED TASKS:
- Do these tasks together form a complete feature?
- Is this the minimal set for meaningful delivery?
- Would splitting them create confusion?

INTEGRATION VALIDATION:
- Does this task properly integrate with existing components?
- Are we building interfaces that work with existing system?
- Do we need to modify existing components for this integration?
- Will this task require multiple services running for testing?

SIMPLICITY ENFORCEMENT:
- What's the SIMPLEST approach that works?
- Are we building only what's needed NOW?
- Can we demo this without other tasks?
- Is this the most elegant solution?

FAILURE MODE: If task is too complex or integration unclear, STOP and clarify architecture
VERIFICATION: Confirm task follows composition-first principles and integration requirements
```

### PHASE 2: IMPLEMENTATION PLANNING

**CHECKPOINT 3: Architectural Complexity Assessment**

```
COMPLEXITY INDICATORS:
□ Single file change → NO subagents
□ Adding field/column → NO subagents
□ Following existing pattern → NO subagents
□ New feature/system → CONSIDER subagents
□ Multiple component integration → CONSIDER subagents
□ Cross-cutting changes → YES subagents

SUBAGENT DECISION:
- Simple implementation tasks: Skip analysis, implement directly
- Complex features: Use architecture-analyst for structure
- Technical unknowns: Use implementation-analyst for approach
- Major systems: Use both agents in parallel

Check for Existing Subagent Artifacts:
- SCAN .workflow/artifacts/ directory for relevant artifacts
- READ any existing ARCHITECTURE.md, IMPLEMENTATION.md, or task-specific files
- INCORPORATE existing insights before deciding if new analysis needed

IF subagents needed:
  PARALLEL EXECUTION:
  - Task(subagent_type="architecture-analyst", 
        prompt="Analyze task(s) X.Y-X.Z from TASKS.md...")
  - Task(subagent_type="implementation-analyst",
        prompt="Create technical plan for task(s) X.Y-X.Z...")
  
  AFTER COMPLETION:
  - READ .workflow/artifacts/ARCHITECTURE.md for structural guidance
  - READ .workflow/artifacts/IMPLEMENTATION.md for technical approach
  - INCORPORATE insights into implementation plan

DECISION: [Use subagents / Skip subagents] because [specific reasoning]
```

**CHECKPOINT 4: Standards Application Check**

```
REQUIRED: From embedded standards in ITERATION.md, identify:
- Language patterns required for this task
- Framework patterns required for this task  
- Security patterns required for this task
- Performance patterns required for this task
- Quality gates that must be met

VERIFICATION GATE: List specific patterns from embedded standards that apply to this task
FAILURE MODE: If patterns unclear, re-read ITERATION.md standards section
```

**CHECKPOINT 5: Implementation Strategy**

```
REQUIRED: Define implementation approach:

FOR SINGLE TASK:
- What's the SIMPLEST implementation that works?
- What files need to be created/modified?
- What's the core functionality flow?

FOR GROUPED TASKS:
- What's the common pattern across all tasks?
- What's the most efficient order of implementation?
- Can we create a helper function used by all?
- What files are touched by multiple tasks?

RESEARCH SPIKE HANDLING:
- If research spike: Time-box to 1-2 hours MAX
- Goal: Working code that validates approach
- Throwaway code is acceptable
- Focus on answering the technical question

INTEGRATION POINTS:
- How will this integrate with existing system?
- What errors/edge cases matter for THIS iteration?
- What services need to be running?
- What existing APIs will be used?

SIMPLICITY VALIDATION:
- Is this the most straightforward approach?
- Are we building only what's needed NOW?
- Can we avoid complex abstractions?
- Are we focusing on demo-able functionality?

VERIFICATION: Define minimal implementation path to working software
```

**CHECKPOINT 6: Success Criteria Definition**

```
REQUIRED: Define what "done" looks like:

FOR SINGLE TASK:
- What ONE command proves this task works?
- What integration points must function?
- What's the minimal demo scenario?

FOR GROUPED TASKS:
- KEY commands that prove the feature works
- Can test individual pieces AND the whole
- All integration points verified

SUCCESS DEMONSTRATION:
- Exact curl/CLI command that shows it working
- Expected output/response
- Integration verification steps
- One smoke test that will prove completion

DEMO SCENARIOS:
- Exact commands to run
- Expected outputs
- What to check in database/logs
- User-visible improvements

VERIFICATION GATE: Have concrete success criteria before starting
FAILURE MODE: If success criteria vague, clarify with concrete examples
```

### PHASE 2.5: MANDATORY APPROVAL

**⚠️ PLANNING COMPLETE - NO IMPLEMENTATION YET ⚠️**

```
MANDATORY PLANNING SUMMARY:
=====================================
TASK PLANNING COMPLETE - NO IMPLEMENTATION STARTED
=====================================

GROUPING DECISION: [SINGLE TASK X.Y / GROUP TASKS X.Y-X.Z]
Tasks: [List all tasks being implemented]
Rationale: [Why these tasks are grouped/not grouped]

Type: [Implementation/Research Spike/Integration/Wiring]
Complexity: [Simple/Medium/Complex]
Subagent Analysis: [Used/Skipped - with reasoning]

Approach: [Implementation strategy]
Common Patterns: [For grouped tasks - shared patterns]
Integration: [How this connects to existing system components]

Success Criteria: [Specific demonstration requirements]
Standards Applied: [Embedded patterns to be used]
Services Required: [What existing services need to be running]

Key Insights (if subagents used):
- Architecture: [key decisions from .workflow/artifacts/ARCHITECTURE.md]
- Implementation: [key approaches from .workflow/artifacts/IMPLEMENTATION.md]

Ready to begin implementation?

Please respond with YES or NO.
```

**🛑 STOP HERE - WAIT FOR APPROVAL**

### PHASE 3: IMPLEMENTATION EXECUTION (BUILD FIRST)

**CHECKPOINT 7: Build Core Functionality**

```
REQUIRED: Implement the feature:

FOR SINGLE TASK:
- Create/modify files per plan
- Apply embedded standards patterns
- Focus on core functionality first
- Use real services/databases from start
- Handle essential errors only

FOR GROUPED TASKS:
- Implement common patterns first
- Build each task incrementally  
- Test as you go
- Reuse code across tasks
- Touch each file minimally

WHILE BUILDING:
- Can I run this and see it work?
- Am I following the embedded standards?
- Is this the simplest approach?
- Will this integrate properly?

VERIFICATION: Show files created and basic functionality working
```

**CHECKPOINT 8: Integration Implementation**

```
REQUIRED: Connect to existing system:
- Wire up to existing APIs/services
- Ensure data flows correctly
- Test with actual running services
- Verify doesn't break existing features

FOR GROUPED TASKS:
- Test each individual task works
- Test they work together coherently
- Verify no regressions
- Check all integration points

INTEGRATION CHECKLIST:
- Start required services (docker-compose up)
- Test actual service communication
- Verify data persistence works
- Check existing features still function

VERIFICATION: Show integration working with live system
```

**CHECKPOINT 9: Demo Preparation**

```
REQUIRED: Prepare working demonstration:

FOR SINGLE TASK:
- Document exact commands to run
- Capture expected output
- Show integration points working

FOR GROUPED TASKS:
- Demo that shows the complete feature
- Individual demos for each task if needed
- Highlight the coherent improvement

DEMO MUST SHOW:
- Core functionality works
- Integration successful
- Real services being used
- Task objective achieved
- Standards compliance

VERIFICATION: Can execute demo commands successfully
```

**CHECKPOINT 10: Standards Compliance Check**

```
REQUIRED: Verify standards applied:
- Security patterns implemented correctly
- Performance patterns appropriate
- Error handling follows standards
- Code quality meets requirements
- Run linting/quality commands from ITERATION.md Tech Stack section
- Fix any linting/formatting issues before proceeding

SIMPLICITY CHECK:
- Standards applied minimally?
- No over-engineering?
- Error handling appropriate for scope?
- Code clear and maintainable?
- All quality checks passing?

VERIFICATION: Linting passes, point to specific examples of standards compliance
```

### PHASE 4: EVIDENCE COLLECTION

**CHECKPOINT 11: System Integration Proof**

```
REQUIRED: Demonstrate actual system integration:

- START all required services
- EXECUTE end-to-end workflow
- SHOW integration with existing features
- VERIFY system stability maintained

FOR GROUPED TASKS:
- SHOW all tasks working together
- VERIFY consistent behavior across all tasks
- DEMONSTRATE complete feature functionality

LIVE SYSTEM TESTING:
- Real HTTP requests to running services
- Actual database operations
- WebSocket connections if applicable
- Complete user workflows

VERIFICATION GATE: Prove integration with running system
FAILURE MODE: If integration fails, fix before claiming complete
```

**CHECKPOINT 12: Implementation Summary**

```
REQUIRED: Summarize implementation completion:

IMPLEMENTATION COMPLETE:
✅ [Single task / Grouped tasks X.Y-X.Z] implemented
✅ Working software built and demonstrated
✅ Demo commands verified (manual smoke tests pass)
✅ Integration with existing system confirmed
✅ Standards compliance applied

FOR GROUPED TASKS:
✅ All X tasks completed as a coherent unit
✅ Common patterns properly applied
✅ No inconsistencies between tasks

READY FOR NEXT PHASE:
📋 /plan-test [task numbers] (if automated tests needed)
📋 /complete-task [task numbers] (to finalize and mark complete)

VERIFICATION: Implementation phase complete, ready for testing/completion
```

## CRITICAL GATES & ENFORCEMENT

### Standards Compliance Gates
- Embedded patterns must be applied
- Security, performance basics required
- No outdated practices
- Simplest implementation that meets standards

### Integration Requirements
- Use real services from start
- Test with live system
- Verify end-to-end workflows
- No mocking internal components

### Context Overflow Protection
- Auto-save state if context exceeds 80% using /save-state
- State saved to .workflow/state/task-N-timestamp.md
- Continue with /restore-state when context restored
- Minimal state capture for resumption

## FAILURE MODES & RECOVERY

**If implementation blocked:** Simplify approach, focus on core  
**If integration fails:** Check services running, verify APIs  
**If standards missed:** Refactor minimally to comply  
**If demo doesn't work:** Fix functionality - demo commands are your smoke tests  
**If context overflows:** Save state and continue with restored context

## SUCCESS CRITERIA

Implementation phase completed when:
- [ ] Grouping decision made FIRST with clear rationale
- [ ] All related tasks completed together (if grouped)
- [ ] Core functionality works and can be demoed
- [ ] Integration with existing system verified
- [ ] Demo commands serve as working smoke tests
- [ ] Standards applied appropriately
- [ ] Implementation summary provided
- [ ] Clear next steps identified (/plan-test or /complete-task)
- [ ] YAGNI principle maintained throughout