# Break iteration features into concrete implementable tasks

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
- READ .workflow/artifacts/ITERATION.md for all features
- EXTRACT each numbered "task" (these are actually features)
- IDENTIFY embedded standards and tech patterns
- NOTE success criteria for each feature
- UNDERSTAND the iteration's working software goal

VERIFICATION: State each feature found and confirm they need decomposition
```

**CHECKPOINT 2: Codebase Analysis**

```
REQUIRED: Explore codebase to understand existing patterns:
- SCAN project structure and file organization
- READ key files to understand conventions
- IDENTIFY reusable components and utilities
- MAP similar features already implemented
- NOTE testing patterns and approaches

CONSIDER: What patterns already exist that tasks should follow?
VERIFICATION: List discovered patterns tasks must follow
```

### PHASE 2: DECOMPOSITION VALIDATION (MANDATORY)

**CHECKPOINT 3: Task Decomposition Rules**

```
REQUIRED: Every task MUST pass ALL validation gates:

SCOPE VALIDATION:
- Modifies 1-2 files maximum? (new file + test counts as 2)
- Implements exactly ONE thing? (one endpoint/component/function)
- Results in less than 100 lines of code?
- Can be completed in one focused session?

DELIVERABLE VALIDATION:
- Has ONE concrete deliverable?
- Can be demoed with ONE command?
- Produces something independently verifiable?
- Doesn't require reading other tasks to understand?

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

1. ANALYZE feature scope and deliverables
2. IDENTIFY smallest valuable piece
3. BREAK into concrete file modifications
4. CREATE numbered tasks following X.Y pattern
5. VALIDATE each task against gates
6. ORDER by dependency

CRITICAL QUESTION: Is this really ONE thing or am I bundling?

CRITICAL: DO NOT create separate test tasks!
- Every task automatically gets tests via agent workflow
- Focus on features/functionality only
- Testing is built into every task implementation

EXAMPLE BREAKDOWN:
Feature: "Frontend: Audio Manager with Per-Room Ambience"
BAD TASKS:
  2.1: Implement audio manager ❌ (too big)
  2.5: Write tests for audio manager ❌ (tests are automatic)

GOOD TASKS:
  2.1: Create useAudioManager hook with play() method
  2.2: Add stop() method to useAudioManager
  2.3: Add single Audio instance management
  2.4: Connect WebSocket room-change events
  2.5: Add room-to-sound mapping logic

VERIFICATION: Each feature becomes 5-15 specific tasks (NO test tasks)
```

### PHASE 4: MANDATORY INTERVIEW FOR SCOPE CLARIFICATION

**🛑 DO NOT PROCEED PAST THIS STEP WITHOUT ANSWERS**
**🛑 CONDUCT ACTUAL INTERVIEW - ASK QUESTIONS ONE AT A TIME**
**🛑 BUILD ON ANSWERS - DON'T JUST DUMP ALL QUESTIONS**

**CHECKPOINT 6: Feature Scope Interview**

```
REQUIRED: Interview to clarify feature scope and priorities:

ASK INTELLIGENT QUESTIONS about the features based on analysis:
- Which features are highest priority?
- Any features that should be simplified for this iteration?
- Technical constraints or requirements not mentioned?
- Existing code/systems that must be preserved?
- Any features that could be postponed?

EXAMPLE QUESTIONS (based on actual features found):
- "The audio manager feature seems large - should we include ALL audio types this iteration or start with just ambient?"
- "Should the volume persistence use localStorage or do you need a backend solution?"
- "Any specific browser compatibility requirements for the audio features?"
- "Which feature should be implemented first for maximum user value?"

DO NOT ASK ABOUT:
- How to break down tasks (that's your job)
- Technical implementation details (you decide)
- Task ordering (you determine dependencies)

VERIFICATION: Get scope clarification before decomposing
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

TEMPLATE LOCATION: .workflow/templates/TASKS_TEMPLATE.md
- USE template structure exactly
- POPULATE all fields for each task
- ENSURE every task has complete information

TASK ENTRY REQUIREMENTS:
- Status: Always starts as "📋 Not Started"
- Files: Exact file paths (no wildcards)
- Deliverable: One sentence describing what gets built
- Demo: Actual command that proves it works
- Dependencies: List task numbers or "None"
- Notes: Implementation hints without over-specifying

EXAMPLE TASK ENTRY:
### 2.3: Connect room change events to audio manager
- **Status:** 📋 Not Started
- **Files:** `src/hooks/useAudioManager.ts`
- **Deliverable:** Audio manager stops current sound and plays new room's ambient when player moves
- **Demo:** `npm test -- useAudioManager.test.ts -t "changes audio on room transition"`
- **Dependencies:** 2.1, 2.2
- **Notes:** Subscribe to WebSocket 'game_update' event, check if room changed, call stop() then play(newRoomSound)

LOCATION: Create in .workflow/artifacts/
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
