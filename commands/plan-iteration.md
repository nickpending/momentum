# Interview-based iteration planning with embedded standards

## Environment Context

**NOTE**: Workflow environment variables are already loaded:
- `$WORKFLOW_PROJECTS` - Obsidian projects directory 
- `$WORKFLOW_HOME` - Workflow system location
- These are available for direct use in file paths

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

## ⚠️ CRITICAL: RESEARCH SPIKE REQUIREMENTS ⚠️

**🛑 RESEARCH SPIKES MUST PRODUCE WORKING CODE:**

- Time-boxed exploration (1-2 hours max)
- Concrete working code artifact (not just documentation)
- Throwaway code is acceptable for learning
- Must test actual integration/approach through building
- Decision criteria based on what actually works in practice

## ⚠️ CRITICAL: THINK ⚠️

### PHASE 0: PREPARATION

- READ EVERYTHING 3 TIMES BEFORE DOING ANYTHING
- WHEN YOU MAKE A PLAN - REVIEW IT INTERNALLY FIRST TO CHECK FOR OMISSIONS, OVERSIGHTS AND MISTAKES
- ENSURE YOU CAPTURE ALL TECHNOLOGY MENTIONED IN IDEA.md - REVIEW IT 3 TIMES

## MANDATORY EXECUTION SEQUENCE - NO SKIPPING

### PHASE 1: FOUNDATION LOADING (REQUIRED)

**CHECKPOINT 1: Load All Foundation Context**

```
REQUIRED: Read and acknowledge ALL foundation files:
- .workflow/resources/DESIGN_PRINCIPLES.md
- .workflow/resources/IMPLEMENTATION_GUIDELINES.md
- .workflow/artifacts/IDEA.md (Core vision, problem, solution, and features)
- .workflow/artifacts/APP_CONTEXT.md (if exists) - Current system understanding
- .workflow/artifacts/QUESTIONS.md (if exists) - Open questions to address
- $WORKFLOW_PROJECTS/[projectname]/later.md (if exists) - Later items to consider
- $WORKFLOW_PROJECTS/[projectname]/designs/ (if exists) - Design artifacts and decisions
- CLAUDE.md (if exists) - Development context and patterns

VERIFICATION: State "Foundation context loaded" and summarize the composition-first approach
```

**CHECKPOINT 1.5: Analyze and Recommend Later Items (if exists)**

```
IF later.md exists:
- READ all later items
- ANALYZE relevance to current iteration goals from IDEA.md
- IDENTIFY critical bugs that should be fixed
- SPOT todos that align with features being built
- NOTE aging items (>30 days old) that might need attention

PROACTIVE RECOMMENDATION:
"Based on later.md and our iteration goals, I recommend including:

CRITICAL BUGS (should fix):
- bug:: [Description] - captured [X days ago]
  Why: [Blocks feature Y / Affects user experience]

ALIGNED TODOS (natural fit):  
- todo:: [Description] - captured [date]
  Why: [Relates to feature we're building / Quick win]

WORTH CONSIDERING:
- idea:: [Description] - captured [date]
  Why: [Could enhance what we're building]

AGING ITEMS (need attention):
- [Type]:: [Description] - captured [60+ days ago]
  Why: [Has been waiting too long]

Should we include these in the iteration?"

VERIFICATION: Provide smart recommendations based on later.md analysis
```

**CHECKPOINT 2: System State Analysis**

```
REQUIRED: Analyze current system architecture and existing components:
- SCAN .workflow/archives/ directory for completed iterations
- IDENTIFY what services/APIs/components exist from previous work
- ASSESS current system architecture and data flows
- ANALYZE existing interfaces and integration points
- UNDERSTAND what infrastructure is already running

SYSTEM INTEGRATION ANALYSIS:
- What services were built in previous iterations?
- What APIs/endpoints are available for integration?
- What databases/storage systems exist?
- What configuration/deployment infrastructure exists?
- How do existing components communicate with each other?

VERIFICATION: Map existing system components and their integration points
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
- ~/.claudex/standards/claudex-python.md (if Python detected)
- [Continue for ALL detected technologies]

NOTE: IT *REALLY* is ~/.claudex/standards/ and NOT ~/.workflow/standards/

VERIFICATION GATE: You MUST list:
1. Every standards file path read
2. Key patterns from each standard
3. Version requirements from each standard
4. Quality gates from each standard

FAILURE MODE: If you cannot list specific patterns from each standard, you MUST re-read the files
```

### PHASE 2: SCOPE INTERVIEW (REQUIRED)

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

**CHECKPOINT 6: Integration Architecture Interview**

```
REQUIRED: Understand how new iteration integrates with existing system:

CONCRETE DISCOVERY QUESTIONS:
- "What exact APIs/endpoints will this connect to?"
- "Show me the WebSocket message format this will receive"
- "What database tables/queries does this need?"
- "What's the exact curl command to test this?"

CAPTURE DURING INTERVIEW:
## Interview Discoveries - Integration
- Existing endpoints: {exact paths and methods}
- Message formats: {real JSON examples}
- Database needs: {specific tables and queries}
- Test commands: {exact curl/requests}

VERIFICATION: Document all integration points with concrete examples
```

**CHECKPOINT 6: Feature Implementation Interview**

```
REQUIRED: Extract concrete implementation details:

CONCRETE DISCOVERY QUESTIONS:
- "What specific user action triggers this feature?"
- "What exact data do we receive/send?" (get JSON examples)
- "Show me what success looks like" (get exact output)
- "What's the simplest implementation that works?"
- "What's the ONE test that proves this works?"

CAPTURE DURING INTERVIEW:
## Interview Discoveries - Implementation
- User triggers: {exact button clicks/commands}
- Data structures: {real JSON/models from discussion}
- Success criteria: {exact expected output}
- Core logic: {pseudocode or approach}
- Test scenario: {the one integration test that matters}

VERIFICATION: Have concrete examples for every feature
```

**CHECKPOINT 7: Task Decomposition Interview**

```
REQUIRED: Break features into <4 hour concrete tasks:

TASK DISCOVERY QUESTIONS:
- "What's the first working piece we can ship?"
- "What files need to be created/modified?"
- "Are there any unknowns requiring research spikes?"
- "What's the critical path of dependencies?"

TASK TYPE IDENTIFICATION:
- Implementation tasks: Known approach, clear patterns
- Research spikes: Time-boxed exploration (1-2 hours max)
- Integration tasks: Connect components to existing system
- Wiring tasks: Configuration and orchestration

VERIFICATION: Each task has single responsibility and clear deliverable
```

### PHASE 3: MANDATORY INTERVIEW COMPLETION

**⚠️ CRITICAL: INTERVIEW FIRST - NO ARTIFACTS UNTIL APPROVED ⚠️**

```
MANDATORY CLOSING STATEMENT:
=====================================
INTERVIEW COMPLETE - NO ARTIFACTS GENERATED
=====================================

Tech Stack Detected: [list with versions]
Standards Loaded:
- Python: [specific patterns loaded]
- React: [specific patterns loaded]
- [etc for each tech]

System Integration Mapped:
- Existing APIs: [list]
- Database tables: [list]
- Message formats: [list]

Interview Discoveries Captured:
- User workflows: [key insights]
- Data structures: [key formats]
- Integration points: [key connections]
- Test scenarios: [key validations]

Selected from later.md: [count] items
- Bugs to fix: [count]
- Todos to implement: [count]
- Ideas to explore: [count]

Proposed Tasks: [count] tasks
- Implementation: [count]
- Research Spikes: [count]
- Integration: [count]
- Wiring: [count]

Ready to generate ITERATION.md with embedded context?

Please respond with YES or NO.
```

**🛑 STOP HERE - WAIT FOR APPROVAL**

### PHASE 4: ITERATION GENERATION (AFTER APPROVAL)

**CHECKPOINT 8: Move Selected Items to active.md**

```
IF items were selected from later.md:

MOVE TO ACTIVE:
1. READ $WORKFLOW_PROJECTS/[projectname]/active.md (create if not exists)
2. ADD selected items to appropriate section:
   - Critical bugs → Today section
   - Iteration tasks → This Week section
3. FORMAT as checkboxes with promoted date:
   - [ ] {Description} id::{id} captured::{original_date} promoted::{today}
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

**CHECKPOINT 9: Update Feature Status in IDEA.md**

```
REQUIRED: Update IDEA.md with iteration progress:
- DETERMINE next iteration number from .workflow/archives/
- MARK selected features as 🔄 In Progress (iteration-N)
- UPDATE .workflow/artifacts/IDEA.md with new feature statuses

VERIFICATION: Confirm feature status updates applied
```

**CHECKPOINT 10: Generate ITERATION.md Using Template**

```
REQUIRED: Create ITERATION.md preserving ALL interview discoveries:
- LOAD .workflow/templates/ITERATION_TEMPLATE.md
- POPULATE with concrete details from interview discoveries
- EMBED all loaded tech standards directly
- PRESERVE exact data structures, commands, examples
- CREATE tasks with specific implementation details

MANDATORY SECTIONS TO POPULATE:
1. Working Software Goal (what users can DO)
2. Context from Previous Iterations (built, current, infrastructure)
3. Tech Stack & Embedded Standards (paste actual patterns)
4. Integration Architecture (exact APIs and data flows)
5. Tasks with ALL interview details preserved
6. Quality Gates (from standards)
7. Success Demo (exact commands)

VERIFICATION: Every interview discovery appears in final ITERATION.md
```

**CHECKPOINT 11: Task Construction with Interview Details**

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

**CHECKPOINT 12: Embed Standards in Context**

```
REQUIRED: Paste actual standards patterns in Tech Stack section:

## Tech Stack & Embedded Standards

### Python Backend (FastAPI)
[PASTE actual patterns from ~/.claudex/standards/python/modern-python.md]
- **Package Management**: Use `uv` exclusively (NOT pip)
- **Async patterns**: All endpoints use `async def`
- **Testing**: pytest with real PostgreSQL
[etc - actual content from standards file]

### React Frontend
[PASTE actual patterns from ~/.claudex/standards/react/modern-react.md]
[etc for each technology]

VERIFICATION: Standards are embedded, not referenced
```

**CHECKPOINT 13: Final Validation**

```
VERIFICATION GATE: Before finalizing ITERATION.md, confirm:
- [ ] All interview discoveries preserved in tasks
- [ ] Standards embedded with specific patterns
- [ ] Each task has concrete implementation details
- [ ] Integration points include exact formats
- [ ] One smoke test per task defined
- [ ] Success commands are exact (not generic)
- [ ] Task types and dependencies clear
- [ ] Time estimates realistic (<4 hours)

FAILURE MODE: If missing interview details or using generic descriptions, REGENERATE
```

### PHASE 5: COMPLETION STATEMENT

```
=====================================
ITERATION PLANNED WITH INTERVIEW GOLD PRESERVED
=====================================

✅ [X] concrete tasks with implementation details
✅ [Y] interview discoveries preserved  
✅ [Z] standards embedded with patterns
✅ One smoke test per task
✅ Exact success verification commands
✅ All integration points mapped
✅ Selected items moved to active.md

No generic descriptions - everything concrete from interview.

Ready for implementation with /plan-task 1

```

## ENFORCEMENT MECHANISMS

### Interview Preservation Gates

- Must capture concrete examples during interview
- Must preserve exact data formats and commands
- Must include real code snippets discussed
- No generic task descriptions allowed

### Standards Compliance Gates

- Must load ALL detected tech standards
- Must quote specific patterns from each
- Must embed standards in ITERATION.md
- No external references

### Task Quality Gates

- Each task must have single responsibility
- Must include exact implementation details
- Must have one concrete smoke test
- Must be completable in <4 hours

## FAILURE MODES & RECOVERY

**If interview too vague:** Ask more concrete questions  
**If standards not loaded:** STOP and read required files  
**If tasks generic:** Re-read interview discoveries and add specifics  
**If no concrete examples:** Request exact commands/data from user
**If later.md not found:** Continue without backlog items
**If active.md not found:** Create it when moving items from later.md