# Iteration [n]: [clear_outcome_description]

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

## Tasks

### 1. [specific_component_feature_name] 📋 Planned

**Type**: Implementation Task / Research Spike / Integration Task / Wiring Task **Depends on**: None / Task N **Estimated time**: N hours

**What to build**: [1-2_sentences_of_what_not_why]

**Key files**:

```
path/to/specific/file.py - [what_this_file_does]
path/to/another/file.ts - [what_this_file_does]
```

**Core functionality**:

```python
# ACTUAL code structure discovered in interview
class SpecificThing:
    async def concrete_method(self, real_param: dict) -> ActualReturn:
        # Core logic described in interview
```

**Data structures** (from interview):

```json
{
  "actual": "example",
  "from": "interview",
  "with": ["real", "structure"]
}
```

**Integration points**:

- Receives: [exact_message_api_format_from_existing_system]
- Sends: [exact_format_this_component_outputs]
- Database: [specific_tables_queries_needed]

**One smoke test**:

```python
async def test_[feature]_actually_works():
    # Real integration test pattern
    # Uses actual services, not mocks
    # Tests the ONE thing that proves this task succeeded
```

**Success verification**:

```bash
# Exact command to run
curl -X POST localhost:8000/specific/endpoint -d '{"real": "data"}'
# Expected output
{"should": "see this"}
```

### 2. [next_specific_component] 📋 Planned

**Type**: Implementation Task / Research Spike / Integration Task / Wiring Task **Depends on**: Task 1 **Estimated time**: N hours

**What to build**: [clear_description]

**Key files**:

```
path/to/file.py - [purpose]
```

**Core functionality**:

```python
# Actual code structure from interview
```

**Data structures** (from interview):

```json
{
  "real": "examples"
}
```

**Integration points**:

- Receives: [exact_format]
- Sends: [exact_format]
- Database: [specific_needs]

**One smoke test**:

```python
async def test_feature_works():
    # Real test that proves this works
```

**Success verification**:

```bash
# Command to verify
# Expected result
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

1. **Concrete over abstract** - Actual code, real data structures
2. **Interview preservation** - Capture specific discoveries
3. **Testable outcomes** - Exact commands and expected results
4. **Scope control** - What's NOT included is as important as what is
5. **Real integration tests** - One smoke test per task, no mock theater

Each task should be specific enough that an LLM can implement without guessing.