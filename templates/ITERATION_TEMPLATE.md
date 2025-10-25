# Iteration [n]: [clear_outcome_description]

**Variables**: Variables in CAPS are injected by hooks (see HTML comments above), `{vars}` are runtime values (find/calculate them), `[vars]` are template placeholders (substitute them).

## Working Software Goal

[1-2_sentences_what_users_can_do_after_this_iteration_that_they_couldnt_before]

## Context From Previous Iterations

- **Built**: [whats_already_working_in_the_system]
- **Current State**: [key_services_apis_data_structures_that_exist]
- **Infrastructure**: [docker_services_databases_deployment_setup]
- **Now Building**: [how_this_iteration_extends_the_system]

## Tech Stack & Embedded Standards

[paste_the_actual_standards_loaded_during_interview_not_generic_descriptions]

### Python Backend (FastAPI)

- **Async patterns**: Use `async def` for all endpoints, AsyncSession for DB
- **Testing**: pytest with real PostgreSQL, mock only external APIs
- **Actual DB session pattern**:
    
    ```python
    async with get_db() as session:    result = await session.execute(query)
    ```
    

## Integration Architecture

### How This Iteration Connects

- **Existing Services**: [what_apis_services_this_iteration_uses]
- **New Integration Points**: [what_new_interfaces_this_creates]
- **Data Flow**: [how_data_moves_through_new_and_existing_components]
- **Service Dependencies**: [what_needs_to_be_running_for_this_to_work]

## Invariant Analysis (IDD)

### System Invariants (Must Never Break)
- **[Property]**: [Why this matters to users] - [Impact if violated]
- **[Property]**: [Why this matters to users] - [Impact if violated]

Examples:
- **Player progress never lost**: Core user trust - Would lose users permanently
- **Inventory count preserved**: Game economy integrity - Would break virtual goods system

### Behavioral Bounds (Acceptable Variance)
- **[Behavior]**: [Acceptable range] - [Why this range is okay]

Examples:
- **Response time**: < 2 seconds 95% of time - User experience threshold
- **AI appropriateness**: 85% acceptable responses - Humans expect some variation

### Risk Assessment
**HIGH RISK (could ruin user's day):**
- [Component]: [Specific user impact if broken]

**LOW RISK (cosmetic/minor):**
- [Component]: [Minor impact only]

### Expected Failures (Inevitable in Production)
- **[Failure type]**: System handles by [graceful degradation approach]

Examples:
- **Database disconnection**: Queue operations, retry with backoff
- **Network timeout**: Show cached data, retry in background

## Tasks

### 1. [specific_component_feature_name] 📋 Planned

**Type**: Implementation Task / Design Task / Research Spike / Integration Task / Wiring Task
**Depends on**: None / Task N  
**Estimated time**: N hours

**What to build**: [1-2_sentences_of_what_not_why]

**Key files**:

```
path/to/specific/file.py - [what_this_file_does]
path/to/another/file.ts - [what_this_file_does]
```

**Design Decision**: [Architecture chosen: e.g., "JWT parallel to existing session auth"]

**Investigation Context**:
- Current approach: [What exists: "Session-based auth in middleware/auth.py"]
- Integration points: [Where it connects: "Auth middleware, user service"]
- Pattern to follow: [If applicable: "Similar to existing API key validation"]
```

**Integration Requirements**:
- Receives: [What it needs: "User credentials from login form"]
- Produces: [What it outputs: "JWT token with user claims"]
- Depends on: [What must exist: "User service, bcrypt validation"]

**Success Criteria**:
- [ ] [User-facing outcome: "Users can log in and receive JWT token"]
- [ ] [Technical outcome: "Token validates in middleware"]
- [ ] [Integration verified: "Protected endpoints accept token"]

**Success verification**:

```bash
# Exact command to run
curl -X POST localhost:8000/specific/endpoint -d '{"real": "data"}'
# Expected output
{"should": "see this"}
```

### 2. [next_specific_component] 📋 Planned

**Type**: Implementation Task / Research Spike / Integration Task / Wiring Task
**Depends on**: Task 1
**Estimated time**: N hours

**What to build**: [clear_user_facing_description]

**Key files**:
```
path/to/file.py - [purpose]
```

**Design Decision**: [If complex: architecture chosen]

**Investigation Context**:
- Current approach: [What exists if pattern-based]
- Integration points: [Where it connects]
- Pattern to follow: [If applicable]

**Integration Requirements**:
- Receives: [What it needs]
- Produces: [What it outputs]
- Depends on: [What must exist]

**Success Criteria**:
- [ ] [User-facing outcome]
- [ ] [Technical outcome]
- [ ] [Integration verified]

**Success verification**:
```bash
# Command to verify it works
# Expected user-visible result
```

### 3. [another_component] 📋 Planned

[continue_with_same_structure_for_all_tasks]

## Task Type Definitions

- **Implementation Task**: Known approach, clear requirements, produces working feature
- **Research Spike**: Time-boxed exploration (1-2 hours max), produces working code to validate approach, throwaway code acceptable
- **Integration Task**: Connects new components to existing system, ensures end-to-end workflows
- **Wiring Task**: Configuration, service orchestration, deployment setup

## Progress Tracking

- [ ] Task 1: [name] - 📋 Planned
- [ ] Task 2: [name] - 📋 Planned
- [ ] Task 3: [name] - 📋 Planned
- [ ] Task N: [name] - 📋 Planned

**Status Legend**: 📋 Planned | 🔄 In Progress | ✅ Complete

## Quality Gates

### Code Standards

- **Type Safety**: All functions typed, no `any` in TypeScript, type hints in Python
- **Error Handling**: Try-catch with user messages, structured logging, no silent failures
- **Security**: Input validation at boundaries, parameterized queries, no hardcoded secrets
- **Performance**: No N+1 queries, appropriate indexes, connection pooling

### Testing Standards

- **One smoke test per task** that proves core functionality
- **Integration tests** with real services (database, WebSocket, etc.)
- **Mock only** external APIs (OpenAI, Stripe) or destructive operations
- **Run time** < 10 seconds per test
- **No mock theater** - test real behavior, not mock interactions

### Task Completion Gates

Each task must:

- [ ] Build working software that can be demoed
- [ ] Pass its smoke test with real services
- [ ] Meet security standards for its scope
- [ ] Handle errors gracefully with user-friendly messages
- [ ] Include success verification commands

## Success Demo

```bash
# Exact commands to run after iteration complete
docker-compose up -d
curl -X POST localhost:8000/auth/login -d '{"username": "test", "password": "test"}'
# Specific user actions to try
# Exact output/behavior to verify
```

## What This Iteration Validates

- **Assumption 1**: [specific_thing_we_think_users_want_will_be_proven_disproven]
- **Assumption 2**: [technical_approach_we_think_will_work_will_be_validated]

## Not In This Iteration (Scope Control)

- [feature_x] - Waiting for user feedback on current approach
- [feature_y] - Depends on validating assumption above
- [complex_feature_z] - Keeping iteration focused

---

## Template Instructions (Delete when using)

This template emphasizes:

1. **Decisions over implementation** - Capture WHAT and WHY, not HOW in detail
2. **Investigation preservation** - Document findings and context from analysis
3. **User-visible outcomes** - Focus on what users can do, not code structure
4. **Architecture choices** - Record decisions made during planning
5. **Success criteria** - Clear verification without prescribing tests

Each task should capture enough context for implementation while leaving technical details to be determined during coding.