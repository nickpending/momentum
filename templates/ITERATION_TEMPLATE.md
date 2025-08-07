# Iteration {N}: {Clear Outcome Description}

## Working Software Goal

{1-2 sentences: What users can DO after this iteration that they couldn't before}

## Context From Previous Iterations

- **Built**: {What's already working in the system}
- **Current State**: {Key services, APIs, data structures that exist}
- **Infrastructure**: {Docker services, databases, deployment setup}
- **Now Building**: {How this iteration extends the system}

## Tech Stack & Embedded Standards

{Paste the ACTUAL standards loaded during interview - not generic descriptions}

### Python Backend (FastAPI)

- **Async patterns**: Use `async def` for all endpoints, AsyncSession for DB
- **Testing**: pytest with real PostgreSQL, mock only external APIs
- **Actual DB session pattern**:
    
    ```python
    async with get_db() as session:    result = await session.execute(query)
    ```
    

## Integration Architecture

### How This Iteration Connects

- **Existing Services**: {What APIs/services this iteration uses}
- **New Integration Points**: {What new interfaces this creates}
- **Data Flow**: {How data moves through new and existing components}
- **Service Dependencies**: {What needs to be running for this to work}

## Tasks

### 1. {Specific Component/Feature Name} 📋 Planned

**Type**: Implementation Task / Research Spike / Integration Task / Wiring Task **Depends on**: None / Task N **Estimated time**: N hours

**What to build**: {1-2 sentences of WHAT, not why}

**Key files**:

```
path/to/specific/file.py - {what this file does}
path/to/another/file.ts - {what this file does}
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

- Receives: {exact message/API format from existing system}
- Sends: {exact format this component outputs}
- Database: {specific tables/queries needed}

**One smoke test**:

```python
async def test_{feature}_actually_works():
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

### 2. {Next Specific Component} 📋 Planned

**Type**: Implementation Task / Research Spike / Integration Task / Wiring Task **Depends on**: Task 1 **Estimated time**: N hours

**What to build**: {Clear description}

**Key files**:

```
path/to/file.py - {purpose}
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

- Receives: {exact format}
- Sends: {exact format}
- Database: {specific needs}

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

### 3. {Another Component} 📋 Planned

{Continue with same structure for all tasks}

## Task Type Definitions

- **Implementation Task**: Known approach, clear requirements, produces working feature
- **Research Spike**: Time-boxed exploration (1-2 hours max), produces working code to validate approach, throwaway code acceptable
- **Integration Task**: Connects new components to existing system, ensures end-to-end workflows
- **Wiring Task**: Configuration, service orchestration, deployment setup

## Progress Tracking

- [ ] Task 1: {Name} - 📋 Planned
- [ ] Task 2: {Name} - 📋 Planned
- [ ] Task 3: {Name} - 📋 Planned
- [ ] Task N: {Name} - 📋 Planned

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

- **Assumption 1**: {Specific thing we think users want - will be proven/disproven}
- **Assumption 2**: {Technical approach we think will work - will be validated}

## Not In This Iteration (Scope Control)

- {Feature X} - Waiting for user feedback on current approach
- {Feature Y} - Depends on validating assumption above
- {Complex Feature Z} - Keeping iteration focused

---

## Template Instructions (Delete when using)

This template emphasizes:

1. **Concrete over abstract** - Actual code, real data structures
2. **Interview preservation** - Capture specific discoveries
3. **Testable outcomes** - Exact commands and expected results
4. **Scope control** - What's NOT included is as important as what is
5. **Real integration tests** - One smoke test per task, no mock theater

Each task should be specific enough that an LLM can implement without guessing.