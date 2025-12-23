---
allowed-tools: Read, Grep, Glob, Edit, Write, MultiEdit, Bash, Task, AskUserQuestion
description: Create implementation plan with linting and quality checks
argument-hint: task-number
---

@../resources/command-rules.md

# Create implementation plan with linting and quality checks

Build working, demoable software. Apply embedded standards. Use real services from start.

## Execution Requirements

**YOU MUST execute these steps sequentially.**

Each step builds on previous steps. Do not skip ahead or produce final summary without completing all steps.

**Core Principles:**
- Group tasks when single task has no standalone value
- Build-first development - no tests during implementation
- Real services from start - never mock internal code
- Use Explore subagent for code discovery (not manual Glob/Grep)
- Apply embedded standards from ITERATION.md
- Demo commands prove functionality works

## Step 1: Load Context

**REQUIRED ACTIONS:**

1. EXTRACT from ARTIFACTS_DIR/TASKS.md (already loaded by /load-app-context):
   - Task {TASK_NUMBER} details, feature number
   - Task type (Implementation/Design/Research)
   - Deliverables, demo commands, dependencies
   - Embedded standards that apply (from ITERATION.md Tech Stack section)
   - Integration requirements with existing system

2. SCAN all tasks in the same feature (titles and deliverables only)

3. VERIFY dependencies are met

**VERIFICATION:**
Context loaded, task type identified, feature tasks scanned.

**STOP before Step 2.**

## Step 2: Task Grouping Decision

**REQUIRED ACTIONS:**

1. ASK: "Would a user care if I completed ONLY task {TASK_NUMBER}?"

2. DECIDE grouping:
   - **NO** → Group related tasks for meaningful delivery
   - **YES** → Task has standalone value, proceed alone

3. STATE decision:
   ```
   GROUPING: [SINGLE {TASK_NUMBER} / GROUP X.Y-X.Z]
   RATIONALE: [Why this grouping provides user value]
   ```

4. AVOID empty structures, imports with no usage, setup without functionality - group with related work instead

**VERIFICATION:**
Grouping decision made with clear rationale.

**STOP before Step 3.**

## Step 3: Route by Task Type

**REQUIRED ACTIONS:**

**IF Design task:**
1. Use exploration skill
2. Skill handles all design workflow
3. STOP (different workflow)

**IF Research spike:**
1. PRESENT spike plan:
   ```
   RESEARCH SPIKE READY

   Question: [What needs validation]
   Time-box: 1-2 hours
   Prototype path: spikes/{name}/
   Approach: [How you'll validate]

   Ready to build prototype? (YES/NO)
   ```
2. WAIT for approval
3. STOP (different workflow)

**IF Implementation task:**
1. UNDERSTAND codebase:
   - USE Task tool with Explore subagent (specify thoroughness: quick/medium/very thorough)
   - READ actual implementation files you'll work with
   - READ similar patterns in codebase
   - LIST specific files read and key learnings
2. Continue to Step 4

**VERIFICATION:**
Task routed to appropriate workflow.

**STOP before Step 4.**

## Step 4: Create Implementation Plan

**REQUIRED ACTIONS:**

1. ASSESS architectural complexity:
   - Simple (single file, adding fields, following existing patterns) → NO subagents
   - Complex (new components, database/API changes, technical unknowns) → USE subagents

2. CHECK ARTIFACTS_DIR for existing analysis before launching new subagents

3. **IF subagents needed:**
   - LAUNCH in parallel with Task tool (architecture-analyst and/or implementation-analyst)
   - GENERATE 4-char random ID
   - SAVE to ARTIFACTS_DIR/subagents/ARCHITECTURE-{ID}.md or IMPLEMENTATION-{ID}.md
   - READ and INCORPORATE insights

4. DEFINE approach:
   - Simplest implementation that works
   - Files to create/modify
   - Integration points with existing system
   - Common patterns (if grouped tasks)
   - Implementation order

5. IDENTIFY initial risks (will be validated against actual discoveries in Step 7):
   - HIGH RISK: Could impact user data, state, money, etc.
   - LOW RISK: Cosmetic, minor issues
   - Document to guide careful implementation

6. DEFINE success criteria:
   - One command that proves it works
   - Expected output
   - Integration verification steps

**VERIFICATION:**
Plan defined with approach, risks identified, success criteria clear. See [Planning Success Criteria](#planning-success-criteria).

**STOP before Step 5.**

## Step 5: Present Plan and Wait for Approval

**REQUIRED ACTIONS:**

1. PRESENT implementation plan:
   ```
   IMPLEMENTATION PLANNING COMPLETE - NO CODE WRITTEN YET

   GROUPING: [decision with rationale]
   Type: [Implementation/Integration/Wiring]
   Complexity: [Simple/Medium/Complex]
   Subagents: [Used/Skipped - reasoning]

   Approach: [implementation strategy]
   Integration: [how it connects to existing system]
   Standards: [embedded patterns to apply]

   Initial Risks:
   - HIGH: [components that could impact users]
   - LOW: [cosmetic/minor areas]

   Success: [demo command and expected output]

   Ready to begin? (YES/NO)
   ```

2. WAIT for user response

3. **IF NO:**
   - ASK what needs adjustment
   - REVISE plan
   - RE-PRESENT
   - WAIT again

4. **IF YES:**
   - Proceed to Step 6

**VERIFICATION:**
User approved implementation plan.

**STOP before Step 6.**

## Step 6: Build Implementation

**REQUIRED ACTIONS:**

1. CREATE/MODIFY files per plan:
   - Apply embedded standards patterns
   - Focus on core functionality first
   - Use real services/databases from start
   - Handle essential errors only

2. INTEGRATE with existing system:
   - Wire to existing APIs/services
   - VERIFY with running services (docker-compose up if needed)
   - CHECK existing features still work
   - PROVE end-to-end workflows

3. PREPARE demo:
   - Document exact commands to run
   - Capture expected output
   - Show integration working

4. VERIFY quality:
   - RUN linting/formatting from ITERATION.md tech stack
   - FIX issues before proceeding
   - VERIFY standards compliance

**VERIFICATION:**
Working software built, integrated, demoed, quality checks passing.

**STOP before Step 7.**

## Step 7: Document Discoveries

**REQUIRED ACTIONS:**

1. COMPARE initial risk assessment (Step 4) to actual findings:

   **CONFIRMED RISKS** (guessed right):
   - [Component] - Was HIGH risk, confirmed by [what happened]
   - [Component] - Was LOW risk, stayed simple

   **UPGRADED RISKS** (more dangerous than expected):
   - [Component] - Thought LOW, actually HIGH because [discovery]
   - Example: "Message formatting" - Broke screen readers (accessibility)

   **DOWNGRADED RISKS** (simpler than expected):
   - [Component] - Thought HIGH, actually simple because [reason]

   **NEW DISCOVERIES** (didn't anticipate):
   - [Component] - Discovered [new risk/invariant] during building
   - Example: "Corpse creation" - Must be atomic or items duplicate

2. IDENTIFY invariants discovered (system properties that must ALWAYS hold):

   **State invariants** - Object state constraints:
   - [Property] must be [condition] at all times
   - Example: "User.balance >= 0" - Negative balance broke payment flow

   **Data invariants** - Field validation rules:
   - [Field] must satisfy [constraint]
   - Example: "Order.items.length > 0" - Empty orders crashed checkout

   **Relationship invariants** - Cross-object dependencies:
   - When [A] then [B] must be true
   - Example: "Session.user exists when Session.authenticated" - Null user broke auth check

   Document what broke/almost broke and why the invariant matters

3. DOCUMENT failure modes encountered:
   - [Failure]: System must [handle gracefully]
   - Example: "DB disconnect during save" - Must queue or retry cleanly

4. UPDATE ARTIFACTS_DIR/TASKS.md discoveries section ONLY (not task status):
   - Use Edit tool
   - Update ONLY "Discovered During Implementation" section
   - Add: Additional invariants, Failure modes, Risk assessment validation
   - DO NOT change task status (remains "🔄 In Progress")
   - DO NOT mark complete (use /complete-task for that)

5. SUMMARIZE:
   ```
   IMPLEMENTATION COMPLETE - TASK STILL IN PROGRESS

   ✅ [Single/Grouped] tasks implemented
   ✅ Working software demonstrated
   ✅ Integration verified
   ✅ Standards applied
   ✅ Discoveries documented in TASKS.md

   Task status: 🔄 In Progress
   Next: Use /complete-task to mark complete
   ```

**VERIFICATION:**
Discoveries documented, task remains in progress state. See [Implementation Success Criteria](#implementation-success-criteria).

**Implementation workflow complete.**

## Error Handling

**If blocked:**
- Simplify approach, break down into smaller steps
- Check dependencies met

**If integration fails:**
- Check services running (docker-compose up)
- Verify connection strings and APIs
- Review existing integration patterns

**If standards missed:**
- Refactor minimally to comply
- Check ITERATION.md for patterns

**If demo broken:**
- Fix before proceeding
- Verify with real services
- Don't claim complete until demo works

## Success Criteria

### Planning Success Criteria

Planning phase complete when:

- [ ] Context loaded from TASKS.md
- [ ] Task type identified
- [ ] Feature tasks scanned
- [ ] Grouping decision made with clear rationale
- [ ] Codebase explored via Explore subagent
- [ ] Similar patterns identified and understood
- [ ] Architectural complexity assessed
- [ ] Subagent analysis completed (if needed)
- [ ] Implementation approach defined
- [ ] Initial risk assessment documented
- [ ] Demo success criteria identified
- [ ] Plan presented and user approved

### Implementation Success Criteria

Implementation phase complete when:

- [ ] Files created/modified per plan
- [ ] Embedded standards applied correctly
- [ ] Real services used (no mocking internal code)
- [ ] Integration with existing system verified
- [ ] Demo commands work as expected
- [ ] Linting/formatting checks passing
- [ ] Risk assessment validated against discoveries
- [ ] Invariants documented with examples
- [ ] Failure modes documented with examples
- [ ] TASKS.md updated with discoveries only
- [ ] Task status remains 🔄 In Progress (not marked complete)
