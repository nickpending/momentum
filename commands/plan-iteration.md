# Collaborative iteration planning through investigation

## Purpose

Plan iterations by investigating the codebase, presenting findings as options, and collaborating on design decisions - not prescribing solutions.

## Environment Context

**Variables**: `$VARS` are environment variables (expand them), `{vars}` are runtime values (find/calculate them), `[vars]` are template placeholders (substitute them).

**Key Paths**:
- `$WORKFLOW_PROJECTS` - Obsidian projects directory (environment variable)
- `$WORKFLOW_DEV` - Development projects root (environment variable)
- `{project-root}` - Current project directory (find by locating .workflow/ directory)

## ⚠️ CRITICAL: INTERVIEW FIRST - NO ARTIFACTS UNTIL APPROVED ⚠️

**🛑 STOP AFTER INTERVIEW. DO NOT GENERATE ARTIFACTS.**
**🛑 ASK QUESTIONS ONE AT A TIME - BUILD ON ANSWERS**
**🛑 ALWAYS END WITH: "Ready to generate ITERATION.md with embedded context?"**
**🛑 WAIT FOR EXPLICIT APPROVAL BEFORE CREATING ITERATION.MD**

## ⚠️ CRITICAL: STANDARDS MUST BE LOADED AND EMBEDDED ⚠️

**🛑 NO ITERATION.MD WITHOUT STANDARDS VERIFICATION**
**🛑 LIST EVERY STANDARDS FILE PATH READ**
**🛑 QUOTE SPECIFIC PATTERNS FROM EACH STANDARD**
**🛑 EMBED ALL CONTEXT - NO EXTERNAL REFERENCES**

## ⚠️ CRITICAL: PRESERVE INTERVIEW GOLD ⚠️

**🛑 CAPTURE CONCRETE DETAILS DISCOVERED IN INTERVIEW**
**🛑 NO GENERIC TASK DESCRIPTIONS**
**🛑 ACTUAL CODE EXAMPLES AND DATA STRUCTURES**
**🛑 ONE SMOKE TEST PER TASK - NO TDD THEATER**

## ⚠️ CRITICAL: COLLABORATIVE APPROACH ⚠️

**🛑 INVESTIGATE, DON'T ASSUME**
**🛑 PRESENT FINDINGS AS OPTIONS**
**🛑 CAPTURE DECISIONS, DON'T MAKE THEM**
**🛑 USE AGENTS FOR COMPLEX INVESTIGATION**

## Core Principles

### Investigation Over Assumption
- Find what exists before designing what should exist
- Run ALL investigations concurrently for speed
- Present complete findings for informed decisions

### Progressive Investigation Depth
- Complex features: Full architectural analysis via agents
- Pattern features: Find examples and integration points
- Simple features: Minimal investigation, obvious approach

### Collaborative Decision-Making
- Present ALL findings at once (simple, pattern, complex)
- Complex items include multiple architectural options
- User reviews everything and makes informed decisions
- Capture decisions explicitly for ITERATION.md

## Task Complexity Classification

### SIMPLE Tasks
- Clear bug fixes
- Small UI changes
- Documentation updates
- Version bumps
**Approach**: Include with minimal detail, handle during implementation

### PATTERN Tasks
- New endpoint matching existing ones
- Another form/component like existing
- Similar feature in different area
**Approach**: Find one good example, note pattern to follow

### COMPLEX Tasks
- Architectural decisions
- New subsystems
- Integration changes
- Cross-cutting concerns
**Approach**: Investigate via agents, present findings, get decisions

## ⚠️ CRITICAL: THINK BEFORE ACTING ⚠️

- READ all context files thoroughly
- CLASSIFY tasks by complexity accurately
- INVESTIGATE complex items properly
- ASK for decisions, don't make them

## MANDATORY EXECUTION SEQUENCE - NO SKIPPING

## MANDATORY EXECUTION SEQUENCE - NO SKIPPING

### PHASE 1: FOUNDATION LOADING (REQUIRED)

**CHECKPOINT 1: Load All Foundation Context**

```
REQUIRED: Read and acknowledge ALL foundation files:
- {project-root}/.workflow/resources/DESIGN_PRINCIPLES.md
- {project-root}/.workflow/resources/IMPLEMENTATION_GUIDELINES.md
- {project-root}/.workflow/artifacts/IDEA.md (Core vision, problem, solution, and features)
- {project-root}/.workflow/artifacts/APP_CONTEXT.md (if exists) - Current system understanding
- $WORKFLOW_PROJECTS/{projectname}/later.md (if exists) - Later items to consider

VERIFICATION: State "Foundation context loaded" and summarize the composition-first approach
```

**CHECKPOINT 1.5: Review Later Items and Gather Goals**

```
IF later.md exists:
- READ all later items
- PRESENT to user in simple format

SIMPLE PRESENTATION:
"Found [N] items in later.md:

RECENT BUGS (last 30 days):
- bug:: [Description] (captured [date])

OLDER BUGS (30+ days):
- bug:: [Description] (captured [date])

RECENT IDEAS/TODOS:
- todo:: [Description] (captured [date])
- idea:: [Description] (captured [date])

AGING ITEMS (60+ days):
- [type]:: [Description] (captured [date])

Which of these interest you for this iteration?"

ELSE:
- ASK: "What features should we build in this iteration?"

WAIT FOR USER SELECTION/INPUT - capture selected items

VERIFICATION: User selects which later items to include
```

**CHECKPOINT 2: System State Analysis**

```
REQUIRED: Analyze current system for context:
- SCAN {project-root}/.workflow/archives/ for completed iterations
- IDENTIFY existing services/APIs/components
- NOTE current architecture and data flows
- UNDERSTAND existing integration points

FOCUS: Just gather context, don't design yet
VERIFICATION: Have map of what exists
```

**CHECKPOINT 2.5: Review Recent Iteration Learnings**

```
REQUIRED: Learn from recent iteration summaries:
- READ the last 2-3 ITERATION_{N}_SUMMARY.md files from {project-root}/.workflow/archives/iteration-*/
- EXTRACT insights from actual summary structure:
  - Task Insights: Implementation decisions, patterns established, development friction
  - Discovery Insights: Bug patterns, performance learnings, integration insights, technical debt
  - Cross-Cutting Themes: Patterns that emerged across multiple areas
  - Methodology Learnings: What worked/didn't work in development approach
  - Architecture Evolution: How system structure and patterns changed

APPLY LEARNINGS:
"Based on recent iterations:
- ESTABLISHED PATTERNS: [From Task Insights - patterns to reuse]
- AVOID: [From Discovery Insights - bug patterns and friction to prevent]
- PERFORMANCE: [From Discovery Insights - optimizations discovered]
- ARCHITECTURE: [From Architecture Evolution - decisions to maintain]
- PROCESS: [From Methodology Learnings - workflow improvements to apply]"

VERIFICATION: Recent learnings captured from actual summary structure and ready to apply
```

**CHECKPOINT 3: Tech Stack Detection**

```
REQUIRED: Analyze IDEA.md and detect ALL technologies mentioned
- Scan for: languages, frameworks, databases, deployment tools
- List EVERY technology found
- Identify primary stack (e.g., "Python web API with PostgreSQL")

!!CRITICAL!!
- READ IDEA.md INTERNALLY 10 times to identify technologies you may have missed!
- DO NOT GREP!!

VERIFICATION: List all detected technologies explicitly
```

**CHECKPOINT 4: Standards Loading (MANDATORY)**

```
REQUIRED: For EACH detected technology, read corresponding standards:
- Check ~/.claudex/standards/ directory for claudex-{technology}.md files
- Pattern: claudex-python.md, claudex-golang.md, claudex-react.md, etc.
- Read ALL relevant standards for technologies detected in the project

NOTE: IT *REALLY* is ~/.claudex/standards/ and NOT ~/.workflow/standards/

VERIFICATION GATE: You MUST list:
1. Every standards file path read
2. Key patterns from each standard
3. Version requirements from each standard
4. Quality gates from each standard

FAILURE MODE: If you cannot list specific patterns from each standard, you MUST re-read the files
```

**CHECKPOINT 5: Complexity Triage and Investigation**

```
CLASSIFY all items by complexity:
  SIMPLE: Clear fixes, small changes, obvious implementation
  PATTERN: Follows existing pattern in codebase
  COMPLEX: Multiple valid approaches, architectural decisions needed

FOR COMPLEX items (run concurrently):
  LAUNCH architecture-analyst agents IN PARALLEL:
    Task with architecture-analyst:
      "Investigate architectural options for [specific feature].

       Context: [Brief description of what user wants]

       Focus on:
       - Finding existing patterns in codebase
       - Identifying 2-3 viable structural approaches
       - Integration points with current system
       - File organization and boundaries

       Present architectural options with trade-offs."

  COLLECT all agent responses as they complete
  READ generated artifacts from {project-root}/.workflow/artifacts/subagents/

FOR PATTERN items (run concurrently):
  FIND examples IN PARALLEL:
    - Grep for similar features
    - Read relevant implementations
    - Note patterns to follow
    - Identify integration points

FOR SIMPLE items:
  NOTE for minimal detail in iteration

VERIFICATION: All investigations complete before proceeding
```

## Task Type Determination

After investigation, determine the appropriate task type for each item:

### Implementation Tasks (Ship Working Code)
- **When**: You know HOW to build it
- **Output**: Working, integrated feature
- **Completion**: Code ships and users can use it
- **Structure**: Include code examples, integration points, tests

### Design Tasks (Create Artifacts)
- **When**: Need to figure out UI/UX, architecture, data models DURING iteration
- **Output**: Design document in `.workflow/artifacts/designs/task-N.md`
- **Completion**: Artifact created that guides implementation
- **Structure**: Goals, constraints, explorations, decisions, mockups/diagrams
- **Examples**: UI mockups, API design, data model, system architecture

### Research Spikes (Test Feasibility)
- **When**: Need to prove something CAN work before committing
- **Output**: Working prototype code (throwaway acceptable)
- **Completion**: Question answered with working code proof
- **Structure**: Hypothesis, test approach, working code, findings
- **Examples**: "Can we integrate Stripe?", "Will WebSockets scale?", "Does this library work?"

**CRITICAL**:
- Design Tasks produce ARTIFACTS not CODE
- Research Spikes produce CODE not JUST DOCUMENTATION
- Implementation Tasks produce SHIPPABLE CODE not PROTOTYPES

**CHECKPOINT 2.5: Review Recent Iteration Learnings**

```
REQUIRED: Learn from recent iteration summaries:
- READ the last 2-3 ITERATION_{N}_SUMMARY.md files from {project-root}/.workflow/archives/iteration-*/
- EXTRACT insights from actual summary structure:
  - Task Insights: Implementation decisions, patterns established, development friction
  - Discovery Insights: Bug patterns, performance learnings, integration insights, technical debt
  - Cross-Cutting Themes: Patterns that emerged across multiple areas
  - Methodology Learnings: What worked/didn't work in development approach
  - Architecture Evolution: How system structure and patterns changed

APPLY LEARNINGS:
"Based on recent iterations:
- ESTABLISHED PATTERNS: [From Task Insights - patterns to reuse]
- AVOID: [From Discovery Insights - bug patterns and friction to prevent]
- PERFORMANCE: [From Discovery Insights - optimizations discovered]
- ARCHITECTURE: [From Architecture Evolution - decisions to maintain]
- PROCESS: [From Methodology Learnings - workflow improvements to apply]"

VERIFICATION: Recent learnings captured from actual summary structure and ready to apply
```

**CHECKPOINT 3: Tech Stack Detection**

```
REQUIRED: Analyze IDEA.md and detect ALL technologies mentioned
- Scan for: languages, frameworks, databases, deployment tools
- List EVERY technology found
- Identify primary stack (e.g., "Python web API with PostgreSQL")

!!CRITICAL!! 
- READ IDEA.md INTERNALLY 10 times to identify technologies you may have missed!
- DO NOT GREP!!

VERIFICATION: List all detected technologies explicitly
```

**CHECKPOINT 4: Standards Loading (MANDATORY)**

```
REQUIRED: For EACH detected technology, read corresponding standards:
- Check ~/.claudex/standards/ directory for claudex-{technology}.md files
- Pattern: claudex-python.md, claudex-golang.md, claudex-react.md, etc.
- Read ALL relevant standards for technologies detected in the project

NOTE: IT *REALLY* is ~/.claudex/standards/ and NOT ~/.workflow/standards/

VERIFICATION GATE: You MUST list:
1. Every standards file path read
2. Key patterns from each standard
3. Version requirements from each standard
4. Quality gates from each standard

FAILURE MODE: If you cannot list specific patterns from each standard, you MUST re-read the files
```

### PHASE 2: COLLABORATIVE DESIGN (REQUIRED)

**CHECKPOINT 5: Later Items Integration (if user accepted recommendations)**

```
IF user accepted later items:

INTEGRATE INTO ITERATION PLANNING:
- Priority bugs become high-priority tasks
- Selected todos merge with feature implementation
- Ideas become enhancements or stretch goals
- Track which iteration tasks address later items

TRACKING FORMAT:
## Later Items in This Iteration
- bug:: [Description] → Will be fixed in Task #X
- todo:: [Description] → Addressed by Task #Y
- idea:: [Description] → Enhancement in Task #Z (if time permits)

VERIFICATION: Map each selected later item to specific iteration task
```

**CHECKPOINT 1.6: Complexity Triage**

```
REQUIRED: Classify each selected item by complexity:

FOR each item:
  CLASSIFY as:
    SIMPLE: Clear fix, small change, documentation
    PATTERN: Follows existing pattern in codebase
    COMPLEX: Needs architecture decision, new subsystem, integration

PRESENT:
"Planning to implement:
- [SIMPLE] Fix typo in README
- [PATTERN] Add delete endpoint matching existing CRUD
- [COMPLEX] Implement OAuth authentication system

Does this classification look right?"

VERIFICATION: User agrees with complexity assessment
```

**CHECKPOINT 2: Investigation Phase**

```
REQUIRED: Analyze the architecture AND invariants BEFORE the interview:

ARCHITECTURAL ANALYSIS:
1. STUDY existing codebase patterns and structures
2. IDENTIFY where this iteration fits architecturally
3. DETERMINE data flows and state management approach
4. UNDERSTAND integration points and boundaries
5. RECOGNIZE potential architectural challenges

INVARIANT SKETCHING (NEW):
6. IDENTIFY what properties this feature must preserve
7. SKETCH system invariants (what must NEVER break)
8. IDENTIFY behavioral bounds (acceptable variance)
9. MAP risk areas by user impact
10. ANTICIPATE inevitable failure modes

DOCUMENT YOUR ANALYSIS:
## Architectural Understanding
- Patterns discovered: [what you found in codebase]
- Proposed structure: [where this iteration fits]
- Integration points: [how components will connect]
- Data flow: [how information moves through system]
- Potential issues: [architectural challenges identified]

## Invariant Sketch (NEW)
- System invariants: [properties that must always hold]
- Behavioral bounds: [acceptable variance ranges]
- High risk areas: [could ruin user's day]
- Low risk areas: [cosmetic/minor impact]
- Expected failures: [what will inevitably happen]

PREPARE FOCUSED QUESTIONS:
Based on your analysis, prepare ONLY essential questions for interview:
- Architectural decisions that need validation
- Integration points that are unclear
- Conflicts between possible approaches
- Invariant validation questions

VERIFICATION: You have a proposed architecture AND invariant sketch ready BEFORE interviewing
```

**CHECKPOINT 6: Present Complete Investigation Findings**

```
PRESENT comprehensive findings organized by complexity:

"I've analyzed all [N] features for this iteration:

SIMPLE TASKS ([count]):
- [Task]: [One-line description]
- [Task]: [One-line description]
These have obvious implementations and will be handled straightforwardly.

PATTERN-BASED TASKS ([count]):
- [Task]: Follows [existing file/pattern]
  - Current example: [specific file reference]
  - Integration: [where it connects]
- [Task]: Matches [pattern]
  - Current example: [specific file reference]
  - Integration: [where it connects]

COMPLEX TASKS ([count]) - Architectural analysis completed:

[For each COMPLEX item, present agent findings concisely:]

1. [Feature Name] - ARCHITECTURAL OPTIONS:

   Current State: [Brief description of what exists]

   Option A: [Approach name]
   - Approach: [2-3 sentence description]
   - Pros: [Key benefits]
   - Cons: [Key drawbacks]
   - Effort: [Low/Medium/High]

   Option B: [Approach name]
   - Approach: [2-3 sentence description]
   - Pros: [Key benefits]
   - Cons: [Key drawbacks]
   - Effort: [Low/Medium/High]

   Option C: [If applicable]
   - Approach: [2-3 sentence description]
   - Pros: [Key benefits]
   - Cons: [Key drawbacks]
   - Effort: [Low/Medium/High]

   Recommendation: [Agent's recommendation with brief rationale]

[Repeat for each complex item]

DESIGN DECISIONS NEEDED:
For the complex items above, please specify your preferred approach:
- [Feature 1]: Which option (A/B/C)?
- [Feature 2]: Which option (A/B/C)?
- [etc.]

Any additional constraints or preferences I should know about?"

WAIT for user decisions on all complex items
CAPTURE all decisions explicitly

NOTE: User may request additional analysis at this point via natural language
(e.g., "Actually, let's analyze the caching approach too")
If so, pause and wait for that analysis to complete before continuing

VERIFICATION: Have explicit approach decisions for all complex items
```

**CHECKPOINT 4: Invariant Analysis**

```
REQUIRED: Identify what must be preserved and what could break:

SYSTEM INVARIANTS (properties that must NEVER break):
  ASK: "What properties must this feature preserve?"
  - Data integrity: What data loss is unacceptable?
  - User trust: What would make users lose faith?
  - Core functionality: What must always work?

BEHAVIORAL BOUNDS (acceptable variance):
  ASK: "What variation is acceptable?"
  - Performance: Response time thresholds
  - Accuracy: Acceptable error rates
  - Availability: Uptime requirements

RISK ASSESSMENT:
  HIGH RISK (could ruin user's day):
    - What failures would be catastrophic?
    - What would cause data loss?
    - What breaks core workflows?

  LOW RISK (cosmetic/minor):
    - What's just annoying?
    - What has workarounds?

EXPECTED FAILURES:
  ASK: "What will inevitably go wrong?"
  - Network issues
  - Race conditions
  - External service failures

CAPTURE all for embedding in ITERATION.md
VERIFICATION: Clear understanding of what can't break
```

### PHASE 3: ITERATION APPROVAL

**⚠️ CRITICAL: INTERVIEW FIRST - NO ARTIFACTS UNTIL APPROVED ⚠️**

```
APPROVAL CHECKPOINT:
=====================================
INVESTIGATION COMPLETE - READY TO PLAN
=====================================

All [N] features investigated and classified:
- Simple: [count] tasks with obvious implementation
- Pattern: [count] tasks following existing patterns
- Complex: [count] tasks with architectural options analyzed

Your Design Decisions:
[For each complex item:]
- [Feature]: Option [A/B/C] - [Brief description of chosen approach]

Pattern Confirmations:
[For each pattern item:]
- [Feature]: Following [specific file/pattern]

Invariants Identified:
- Must preserve: [critical properties]
- High risk areas: [what could break]
- Acceptable variance: [what's flexible]

Tech Stack & Standards:
- Technologies: [list detected]
- Standards loaded: [claudex files read and embedded]

Ready to generate ITERATION.md with these decisions?

Please respond with YES or NO.
```

**🛑 STOP HERE - WAIT FOR APPROVAL**

### PHASE 4: ITERATION GENERATION (AFTER APPROVAL)

**CHECKPOINT 5: Move Selected Items to active.md**

```
IF items were selected from later.md:

MOVE TO ACTIVE:
1. READ $WORKFLOW_PROJECTS/{projectname}/active.md (create if not exists)
2. ADD selected items to appropriate section:
   - Critical bugs → Today section
   - Iteration tasks → This Week section
3. FORMAT as checkboxes with promoted date:
   - [ ] [description] id::[id] captured::[original_date] promoted::[today]
4. REMOVE moved items from later.md

ACTIVE.MD FORMAT:
# Active

## Today
- [ ] Critical bug fix id::abc123 captured:: 2024-12-15 promoted:: 2025-01-11
- [ ] High priority task id::def456 captured:: 2025-01-05 promoted:: 2025-01-11

## This Week  
- [ ] Feature implementation id::ghi789 captured:: 2024-11-20 promoted:: 2025-01-11
- [ ] Research spike id::jkl012 captured:: 2025-01-08 promoted:: 2025-01-11

VERIFICATION: Confirm items moved to active.md and removed from later.md
```

**CHECKPOINT 6: Update Feature Status in IDEA.md**

```
REQUIRED: Update IDEA.md with iteration progress:
- DETERMINE next iteration number from {project-root}/.workflow/archives/
- MARK selected features as 🔄 In Progress (iteration-N)
- UPDATE {project-root}/.workflow/artifacts/IDEA.md with new feature statuses

VERIFICATION: Confirm feature status updates applied
```

**CHECKPOINT 7: Generate ITERATION.md**

```
REQUIRED: Create ITERATION.md with captured decisions:
- LOAD {project-root}/.workflow/templates/ITERATION_TEMPLATE.md
- POPULATE with investigation findings and decisions
- EMBED tech standards for reference
- INCLUDE invariant analysis

KEY DIFFERENCES from old approach:
- Tasks describe WHAT, not HOW in detail
- Include [DESIGN DECISION: approach] for complex items
- Reference patterns for pattern items
- Minimal detail for simple items
- NO detailed implementation code
- NO assumed class structures
- Capture investigation findings for reference

TASK FORMAT REQUIREMENTS:
- NO detailed implementation code in tasks
- NO assumed class structures or method signatures
- NO prescriptive "you will implement X like this"
- YES capture design decisions made
- YES reference investigation findings
- YES note patterns to follow

TASK TEMPLATE:
### N. [Feature Name] 📋 Planned

**Type**: Implementation Task / Design Task / Research Spike
**Depends on**: None / Task X
**Estimated time**: N hours

**What to build**: [Clear user-facing outcome, no implementation details]

[FOR IMPLEMENTATION TASKS]:
**Design Decision**: [Approach chosen during interview: JWT parallel to existing auth]
**Investigation Context**: [Key findings: current auth in middleware/auth.go, uses 24hr tokens]

[FOR DESIGN TASKS]:
**What to design**: [UI flow, architecture, data model, API spec]
**Constraints**: [Technical, business, user requirements]
**Output artifact**: `.workflow/artifacts/designs/task-N.md`

[FOR RESEARCH SPIKES]:
**Question to answer**: [Can we do X? Will Y scale? Does Z integrate?]
**Success criteria**: [Working prototype that proves feasibility]
**Time box**: [1-2 hours max]

[FOR PATTERN ITEMS]:
**Pattern Reference**: [Follow existing pattern from src/endpoints/users.go POST handler]

**Key files**: [General areas, not specific implementations]
**Success criteria**: [How to verify it works - user action or API call]

VERIFICATION: Tasks guide without prescribing implementation
```

**CHECKPOINT 8: Embed Standards and Context**

```
REQUIRED: Transform interview discoveries into concrete tasks:

FOR EACH TASK INCLUDE:
- Type, dependencies, time estimate
- Exact files to create/modify (from interview)
- Real code structure (from interview)
- Actual data examples (from interview)
- Specific integration points (from interview)
- One concrete smoke test (from interview)
- Exact success verification commands

EXAMPLE:
### 1. JWT Login Endpoint 📋 Planned

**Type**: Implementation Task
**Depends on**: None
**Estimated time**: 2 hours

**What to build**: POST /auth/login that returns JWT token

**Key files**:
- backend/api/auth.py - FastAPI login endpoint
- backend/services/auth_service.py - JWT generation

**Core functionality**:
[EXACT code structure from interview]

**Data structures** (from interview):
[EXACT JSON examples from interview]

**Integration points**:
- Database: users table with bcrypt passwords
- Returns: JWT token for Authorization header

**One smoke test**:
[EXACT test from interview discussion]

**Success verification**:
[EXACT curl command from interview]
```

```
REQUIRED: Paste actual standards patterns in Tech Stack section:

## Tech Stack & Embedded Standards

### [Technology]
[PASTE actual patterns from ~/.claudex/standards/claudex-{tech}.md]
- **Key Pattern**: [Specific requirement from standards]
- **Version**: [Required version]
- **Quality Gate**: [Testing/linting requirement]

VERIFICATION: Standards are embedded, not referenced

## Tech Stack & Embedded Standards

### Python Backend (if using Python)
[PASTE actual patterns from ~/.claudex/standards/claudex-python.md]
- **Package Management**: Use `uv` exclusively (NOT pip)
- **Async patterns**: All endpoints use `async def`
- **Testing**: pytest with real PostgreSQL
[etc - actual content from standards file]

### React Frontend (if using React)
[PASTE actual patterns from ~/.claudex/standards/claudex-react.md]
[etc for each technology detected]

VERIFICATION: Standards are embedded, not referenced
```

**CHECKPOINT 9: Final Validation**

```
VERIFICATION GATE: Before finalizing ITERATION.md:
- [ ] Design decisions captured, not assumed
- [ ] Complex items have investigation findings
- [ ] Pattern items reference real examples
- [ ] Simple items not over-specified
- [ ] Invariants documented
- [ ] Standards embedded for reference
- [ ] Tasks describe WHAT not HOW in detail

FAILURE MODE: If making assumptions instead of using findings, REVISE
```

### PHASE 5: COMPLETION STATEMENT

```
=====================================
ITERATION PLANNED COLLABORATIVELY
=====================================

✅ [X] features selected and triaged
✅ Complex items investigated via agents
✅ Design decisions captured from user
✅ Invariants and risks identified
✅ Standards embedded for reference
✅ Tasks ready for implementation

Designs are YOUR decisions, not my assumptions.

Ready for: /decompose-iteration
```

## ENFORCEMENT MECHANISMS

### Interview Preservation Gates

- Must capture concrete decisions from interview
- Must preserve investigation findings
- Must reference real patterns found
- No generic task descriptions allowed

### Standards Compliance Gates

- Must load ALL detected tech standards
- Must quote specific patterns from each
- Must embed standards in ITERATION.md
- No external references

### Task Quality Gates

- Each task has clear user outcome
- Design decisions captured, not prescribed
- No detailed implementation code
- No assumed class structures
- Pattern items reference real examples

## FAILURE MODES & RECOVERY

**If agent investigation vague:** Send more specific prompts
**If user unsure of decision:** Present clearer trade-offs
**If complexity unclear:** Default to COMPLEX and investigate
**If pattern not found:** Treat as COMPLEX, needs design
**If standards missing:** Note and continue (warn user)
**If later.md not found:** Ask for features directly