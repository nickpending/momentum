# Break iteration features into concrete implementable tasks

**Variables**: Variables in CAPS are injected by hooks (see HTML comments above), `{vars}` are runtime values (find/calculate them), `[vars]` are template placeholders (substitute them).

**Key Paths**:
- `{project-root}` - Current project directory (find by locating .workflow/ directory)
- WORKFLOW_PROJECTS - Obsidian projects directory (injected)
- WORKFLOW_DEV - Development projects root (injected)

## ⚠️ CRITICAL: DECOMPOSE FEATURES INTO REAL TASKS ⚠️

**🛑 CREATE TASKS NOT MINI-FEATURES**
**🛑 1-2 FILES PER TASK MAXIMUM**
**🛑 EACH TASK = ONE DELIVERABLE**

## MANDATORY EXECUTION SEQUENCE

## ⚠️ CRITICAL: THINK ⚠️

### PHASE 0: PREPARATION

- READ EVERYTHING 3 TIMES BEFORE DOING ANYTHING
- THINK DEEPLY ABOUT WHAT MAKES A REAL TASK VS A FEATURE
- REVIEW DECOMPOSITION MENTALLY FOR MISSING PIECES

### PHASE 1: CONTEXT LOADING (REQUIRED)

**CHECKPOINT 1: Load Iteration Features**

```
REQUIRED: Load and analyze iteration context:
- READ {project-root}/.workflow/artifacts/ITERATION.md for all features
- EXTRACT each numbered "task" (these are actually features)
- IDENTIFY embedded standards and tech patterns
- NOTE success criteria for each feature
- UNDERSTAND the iteration's working software goal

VERIFICATION: State each feature found and confirm they need decomposition
```

**CHECKPOINT 2: Codebase Analysis**

```
REQUIRED: Explore codebase to understand existing patterns:
- USE Glob to scan project structure and file organization  
- READ 5-10 actual implementation files (not just configs)
- IDENTIFY reusable components and utilities in the code
- FIND similar features already implemented and read their code
- CHECK how existing features are structured and organized

CONSIDER: What patterns already exist that tasks should follow?
VERIFICATION: List discovered patterns tasks must follow
```

### PHASE 2: DECOMPOSITION VALIDATION (MANDATORY)

**CHECKPOINT 3: Task Decomposition Rules**

```
REQUIRED: Every task MUST pass ALL validation gates:

DELIVERABLE VALIDATION:
- Has ONE concrete deliverable?
- Can be demoed independently?
- Produces something independently verifiable?
- Doesn't require reading other tasks to understand?

SCOPE VALIDATION:
- Implements exactly ONE thing? (one endpoint/component/function)
- Can be completed in one focused session?
- Natural file boundaries (don't artificially split related changes)?

TASK TYPE VALIDATION:
- Implementation Tasks → decompose into code deliverables
- Design Tasks → keep as ONE task (produces complete artifact)
- Research Spikes → keep as ONE task (answers specific question)

NAMING VALIDATION:
- Uses pattern: "X.Y: [Action] [Target] [Purpose]"?
- Specifies exact files/functions/methods?
- Avoids vague words like "implement", "system", "feature"?
- NO SEPARATE TEST TASKS (testing is automatic)?

FAILURE MODE: If any validation fails, decompose further
VERIFICATION: Each task passes all gates before adding to list
```

**CHECKPOINT 4: Task Ordering Principles**

```
REQUIRED: Order tasks by dependency and logic:
1. Data models and types first
2. Backend/API before frontend
3. Core functionality before enhancements  
4. Foundation utilities before dependent features
5. Happy path before error handling
6. Basic implementation before optimizations

DEPENDENCY RULES:
- No task depends on more than 2 previous tasks
- No circular dependencies
- Clear parent-child relationships
- Later tasks build on earlier ones

VERIFICATION: Dependency graph is simple and linear
```

### PHASE 3: DECOMPOSITION EXECUTION

**CHECKPOINT 5: Feature-by-Feature Breakdown**

```
REQUIRED: For each feature in ITERATION.md:

1. ANALYZE feature scope and type (Design/Research/Implementation)
2. For Implementation: IDENTIFY smallest valuable pieces
3. For Implementation: BREAK into concrete file modifications
4. For Design/Research: Keep as SINGLE task
5. CREATE numbered tasks following X.Y pattern
6. VALIDATE each task against gates
7. ORDER by dependency

CRITICAL QUESTION: Is this really ONE thing or am I bundling?

CRITICAL: DO NOT create separate test tasks!
- Every task automatically gets tests via agent workflow
- Focus on features/functionality only
- Testing is built into every task implementation

EXAMPLE BREAKDOWNS BY TYPE:

Implementation Feature: "Frontend: Audio Manager with Per-Room Ambience"
→ DECOMPOSE into micro-tasks:
  2.1: Create useAudioManager hook with play() method
  2.2: Add stop() method to useAudioManager
  2.3: Add single Audio instance management
  2.4: Connect WebSocket room-change events
  2.5: Add room-to-sound mapping logic

Design Feature: "Design: Combat System UX Flow"
→ KEEP AS ONE TASK:
  3.1: Design combat system UX flow document

Research Feature: "Spike: Test WebRTC for real-time multiplayer"
→ KEEP AS ONE TASK:
  4.1: Research WebRTC multiplayer feasibility

VERIFICATION:
- Implementation features → 5-15 specific tasks
- Design features → 1 task producing artifact
- Research features → 1 task answering question
(NO separate test tasks)
```

**CHECKPOINT 5.5: Map Invariants to Tasks**

```
REQUIRED: Connect iteration-level invariants to specific tasks:

1. READ Invariant Analysis section from ITERATION.md
2. FOR EACH TASK identify which invariants it could affect
3. MAP system invariants, behavioral bounds, and risk areas to relevant tasks
4. PREPARE pre-populated invariant context for each task

MAPPING PROCESS:
- Which tasks modify data that invariants protect?
- Which tasks handle user-facing behaviors with bounds?
- Which tasks implement HIGH risk components?
- Which tasks are LOW risk and can skip most invariants?

EXAMPLE MAPPING:
From ITERATION.md invariants:
- "XP >= 0": Never goes negative
- "Player can always resume": No permanent failure states  
- "Audio transitions smoothly": < 500ms crossfade

Task Mapping:
- 1.2 (XP loss calculation): Gets "XP >= 0" invariant
- 1.3 (respawn endpoint): Gets "Player can always resume" invariant  
- 2.4 (audio transitions): Gets "Audio transitions smoothly" invariant
- 3.1 (UI styling): Gets no invariants (LOW risk)

VERIFICATION: Each HIGH risk task has relevant invariants mapped
```

### PHASE 4: MANDATORY INTERVIEW TO UNCOVER ASSUMPTIONS

**🛑 DO NOT PROCEED PAST THIS STEP WITHOUT ANSWERS**
**🛑 CONDUCT ACTUAL INTERVIEW - ASK QUESTIONS ONE AT A TIME**
**🛑 BUILD ON ANSWERS - DON'T JUST DUMP ALL QUESTIONS**

**CHECKPOINT 6: Assumption Discovery Interview**

```
REQUIRED: Interview to uncover hidden assumptions in the features:

ASK SPECIFIC QUESTIONS ABOUT THE ACTUAL FEATURES:
- Ambiguous behaviors that could go multiple ways
- Implicit requirements not spelled out
- Integration points that need clarification
- User-facing behaviors that aren't specified
- Data flow that's assumed but not stated

EXAMPLE QUESTIONS (must be specific to features found):
- "When you say 'automatic archival' - what triggers it? Task completion? Time? Manual command?"
- "For 'state persistence' - survive page refresh? Browser restart? Or just within session?"
- "The 'validation' feature - should it block or just warn? Who sees the warnings?"
- "When tasks are 'completed' - can they be uncompleted? What about dependencies?"
- "'Evidence-based completion' - what constitutes valid evidence? Tests passing? Manual verification?"

NEVER ASK ABOUT:
- Whether to do less (implement everything)
- Which parts to skip (skip nothing)
- Priority order (that's your job to figure out)
- Generic technical preferences

VERIFICATION: Questions must be specific to actual features, not generic
```

### PHASE 5: MANDATORY APPROVAL (REQUIRED)

**⚠️ CRITICAL: DECOMPOSITION COMPLETE - NO FILE GENERATION UNTIL APPROVED ⚠️**

```
MANDATORY DECOMPOSITION SUMMARY:
=====================================
TASK DECOMPOSITION COMPLETE - NO FILES CREATED
=====================================

Features Analyzed: [number]
Total Tasks Identified: [number]

DECOMPOSITION CHECK:
- Features in ITERATION.md: [N]
- Tasks created: [M]
- Multiplication factor: [M/N]x
- ✅ Each feature properly decomposed (not 1:1)

Sample Tasks:
- 1.1: [task description] (1 file, ~50 lines)
- 2.3: [task description] (2 files, ~80 lines)
- 3.5: [task description] (1 file, ~30 lines)

Task Size Distribution:
- Single file tasks: X
- Two file tasks: Y
- Average lines per task: Z

Quality Review: PASSED

Ready to generate TASKS.md?

Please respond with YES or NO.
```

**🛑 STOP HERE - WAIT FOR APPROVAL**

### PHASE 6: FILE GENERATION (AFTER APPROVAL)

**CHECKPOINT 7: Generate TASKS.md**

```
REQUIRED: Create TASKS.md in project root using template:

TEMPLATE LOCATION: {project-root}/.workflow/templates/TASKS_TEMPLATE.md
- USE template structure exactly
- POPULATE all fields for each task
- ENSURE every task has complete information

TASK ENTRY REQUIREMENTS:
- Status: Always starts as "📋 Not Started"
- Files: Exact file paths (no wildcards) for Implementation tasks
- Deliverable: One sentence describing what gets built/created
- Demo: Actual command that proves it works
- Dependencies: List task numbers or "None"
- Invariants: Pre-populate with mapped invariants from ITERATION.md
- Notes: Implementation hints without over-specifying

TASK TYPE HANDLING:
- Implementation Tasks: Use full template with files, architecture context
- Design Tasks: Mark as "Type: Design Task", output to designs/
- Research Spikes: Mark as "Type: Research Spike", focus on question to answer

LOCATION: Create in {project-root}/.workflow/artifacts/
VERIFICATION: TASKS.md follows template structure exactly
```

### PHASE 7: FINAL VALIDATION

**CHECKPOINT 8: Final Validation**

```
REQUIRED: Validate entire TASKS.md:

TASK QUALITY:
- [ ] Every task modifies 1-2 files max
- [ ] Every task has ONE deliverable
- [ ] Every task has a demo command
- [ ] No task exceeds 100 lines
- [ ] All tasks have concrete file/method names

DECOMPOSITION QUALITY:
- [ ] No "implement X system" tasks
- [ ] No bundled responsibilities
- [ ] Dependencies are minimal and clear
- [ ] Build order makes logical sense
- [ ] Junior dev could implement any task standalone

ANTI-PATTERN CHECK:
- [ ] No vague deliverables
- [ ] No hidden dependencies
- [ ] No scope creep
- [ ] No missing demo commands
- [ ] No abstract task names

FAILURE MODE: If validation fails, revise tasks
VERIFICATION: All checkboxes pass
```

**CHECKPOINT 9: Completion Report**

```
REQUIRED: Generate summary report:

DECOMPOSITION COMPLETE
====================
Features decomposed: X
Total tasks created: Y
Smallest task: X.Y (1 file, ~20 lines)
Largest task: X.Y (2 files, ~80 lines)

First implementable task: X.Y
Suggested task order: X.Y, X.Y, X.Y...

Ready for: /plan-task X.Y

VERIFICATION: TASKS.md exists and is complete
```

## ENFORCEMENT MECHANISMS

### Task Size Enforcement
- Reject any task touching 3+ files
- Split tasks over 100 lines
- Require specific file names
- Demand concrete demo commands
- Exclude test-only tasks (tests are automatic)

### Naming Enforcement  
- Pattern: "X.Y: [Verb] [Specific Target] [Purpose]"
- Ban vague verbs: implement, create system, build feature
- Require specific nouns: exact function/component names

### Dependency Enforcement
- Maximum 2 dependencies per task
- No forward dependencies
- Clear parent-child relationships
- Linear progression

## FAILURE MODES & RECOVERY

**If features too large to decompose:** Break feature itself into sub-features
**If task touches too many files:** Find the ONE core change
**If no clear demo command:** Task is too abstract
**If dependencies too complex:** Reorder or split tasks
**If naming too vague:** Add specific file/method names

## SUCCESS CRITERIA

Decomposition succeeds when:
- [ ] Every feature becomes 5-15 concrete tasks
- [ ] Each task is truly independent
- [ ] All tasks have working demo commands
- [ ] No task exceeds scope limits
- [ ] Build order is logical and clear
- [ ] TASKS.md is created successfully

---

**Remember: If you can't explain the task in one sentence with specific file names, it's too big.**
