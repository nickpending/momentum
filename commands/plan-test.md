# Write focused tests that prove functionality works

**Variables**: `$VARS` are environment variables (expand them), `{vars}` are runtime values (find/calculate them), `[vars]` are template placeholders (substitute them).

**Key Paths**:
- `{project-root}` - Current project directory (find by locating .workflow/ directory)
- `$WORKFLOW_PROJECTS` - Obsidian projects directory (from environment)
- `$WORKFLOW_DEV` - Development projects root (from environment)

## ⚠️ CRITICAL: TEST EXISTING CODE ONLY ⚠️

**🛑 CODE ALREADY EXISTS - WRITE TESTS FOR WHAT'S BUILT**  
**🛑 UNIT TEST LOGIC, INTEGRATION TEST FEATURES**  
**🛑 USE REAL SERVICES FOR INTEGRATION TESTS**  
**🛑 PROVE THE FEATURE ACTUALLY WORKS**

## YOUR JOB: PROVE THIS ACTUALLY WORKS

You're not writing tests to check a box.
You're proving the feature works so it can be shipped to production.

If you find yourself:
- Commenting out tests → You're hiding broken code
- Writing one test and calling it done → You haven't proven anything
- Saying "needs updating" without doing it → You're leaving broken code
- Skipping a failing test → You're shipping bugs

Ask yourself: **Would this survive in production?**
If not, you're not done.

## Testing Philosophy: Unit Test Logic, Integration Test Features

### Unit Tests (for logic with multiple paths)

- Business rules and calculations
- Data parsing/transformation
- Validation logic
- Error handling branches
- Complex algorithms
- **Key:** No external dependencies, tests pure logic

### Integration Tests (for features and flows)

- API endpoints
- Database operations
- User workflows
- Service interactions
- System behavior
- **Key:** Uses real services, tests actual integration

### The Litmus Test

Before writing a test, ask:

1. Does this logic have multiple paths/outcomes? → Unit test
2. Does this touch external resources? → Integration test
3. Would I need to mock my own code? → Integration test
4. Is this a simple pass-through? → Skip it

## Test Organization (Language Agnostic)

### Separate by Type

- **Unit tests**: Tests for pure logic, no external dependencies
- **Integration tests**: Tests with databases, APIs, real services

### Why Separate

- Different setup requirements (integration needs services running)
- Different execution time (units: ms, integration: seconds)
- Different CI/CD strategies (run units always, integration strategically)
- Clear mental model (logic vs features)

### Common Patterns

1. **Directory separation**: `unit/` vs `integration/` folders
2. **Naming conventions**: `*_unit.*` vs `*_integration.*`
3. **Build tags/markers**: Language-specific ways to mark test types
4. **Configuration**: Different test configs for different types

### Execution Strategy

- Unit tests: Run on every save/commit
- Integration tests: Run before merge/deploy
- Keep them separate for speed and clarity

## ⚠️ CRITICAL: FORBIDDEN PATTERNS ⚠️

**❌ NEVER Mock (in integration tests):**

- Your own repositories/services
- Your own database layer
- Internal API calls between your services
- WebSocket connections to your system
- File I/O for your config/data

**✅ ONLY Mock (in integration tests):**

- External APIs (OpenAI, Stripe, weather services)
- Destructive operations (sending emails, charging cards)
- Time-dependent behavior (datetime.now for expiry)
- Non-deterministic external behavior

## PHASE 1: CONTEXT AND CODE ANALYSIS

### CHECKPOINT 0.5: Load Test Infrastructure

```
REQUIRED: Understand how testing works in this project:
- READ {project-root}/.workflow/artifacts/TESTING.md
- EXTRACT test runner command and framework
- NOTE directory structure for tests
- UNDERSTAND environment requirements

IF TESTING.md MISSING:
- Check package.json, pyproject.toml, go.mod for test scripts
- Look for existing test files to understand patterns
- Warn user that TESTING.md is missing

VERIFICATION: You know how to run tests for this project
```

### CHECKPOINT 1: Load Task and Implementation Context

```
REQUIRED: Understand what was built:
- READ {project-root}/.workflow/artifacts/ITERATION.md
- LOCATE task $TASK_NUMBER
- VERIFY task status is 🔄 In Progress or ✅ Complete
- IDENTIFY what functionality was implemented
- READ the actual implementation code
- UNDERSTAND the integration points

IMPLEMENTATION ANALYSIS:
- What files were created/modified?
- What's the core functionality?
- What business logic exists?
- What services does it interact with?
- What would a user actually do with this?

VERIFICATION: Summarize what needs unit vs integration tests
```

### CHECKPOINT 2: Find Existing Test Patterns

```
REQUIRED: Find and analyze existing tests to copy their patterns:
- USE Glob to find test files based on TESTING.md structure
- FIND 2-3 existing tests that test comparable features
- READ these test files completely (use Read tool)
- EXTRACT their setup/teardown patterns
- NOTE their assertion styles and approaches

IF NO TESTS EXIST YET:
- Use examples from TESTING.md
- Follow patterns from ITERATION.md's embedded standards
- You're writing the first tests

PATTERN EXTRACTION:
For each similar test found:
- Test file: [path/to/existing_test.py]
- What it tests: [similar functionality]
- Setup pattern: [how it prepares test data/environment]
- Assertion style: [how it validates results]
- Teardown approach: [how it cleans up]

CRITICAL: Copy existing patterns, don't reinvent test infrastructure
VERIFICATION: Have 2-3 concrete existing tests to model new tests after
```

### CHECKPOINT 3: Identify Test Requirements

```
REQUIRED: Determine test strategy based on existing patterns:

FOR UNIT TESTS:
- What functions have complex logic?
- What validation needs testing?
- What calculations/transformations exist?
- What error paths need coverage?

FOR INTEGRATION TESTS:
- What's the primary user flow?
- What services need to integrate?
- What data should persist?
- What's the happy path scenario?

TEST SCOPE DEFINITION:
- Unit: Logic branches, calculations, validations
- Integration: Complete workflows, data persistence

VERIFICATION: List specific unit and integration tests needed
```

## PHASE 2: MANDATORY APPROVAL

### ⚠️ CRITICAL: TEST PLANNING COMPLETE - NO TESTS UNTIL APPROVED ⚠️

```
MANDATORY PLANNING SUMMARY:
=====================================
TEST PLANNING COMPLETE - NO TESTS WRITTEN
=====================================

Task: [task name and number]
Implementation Summary: [what was built]

Existing Test Patterns Found: [count]
- [Test file 1]: [pattern to copy for unit tests]
- [Test file 2]: [pattern to copy for integration tests]

Proposed Unit Tests: [count]
- [Test 1]: [what it tests] (modeled after [existing test])
- [Test 2]: [what it tests] (modeled after [existing test])

Proposed Integration Tests: [count]
- [Test 1]: [complete user flow] (modeled after [existing test])
- [Test 2]: [integration points] (modeled after [existing test])

Test Organization:
- Unit tests location: tests/unit/
- Integration tests location: tests/integration/

Services Required for Integration Tests:
- [Database, Redis, etc.]

External APIs to Mock:
- [OpenAI, Stripe, etc. if any]

Ready to write tests?

Please respond with YES or NO.
```

**🛑 STOP HERE - WAIT FOR APPROVAL**

## PHASE 3: WRITE UNIT TESTS (If Applicable and Approved)

### CHECKPOINT 4: Identify Unit-Testable Logic

```
REQUIRED: Find pure logic to unit test:

GOOD CANDIDATES:
- Calculation functions with multiple cases
- Data transformation/parsing logic
- Validation functions with rules
- Business logic with conditions
- Utility functions with edge cases

CRITICAL: Reference patterns found in CHECKPOINT 2 for test structure
VERIFICATION: List functions that genuinely need unit tests
```

Example of unit-testable function:

```python
# This needs unit tests (multiple paths)
def calculate_shipping(weight, distance, express=False):
    base = weight * 0.5
    if distance > 500:
        base *= 1.5
    if express:
        base *= 2
    return min(base, 100)  # cap at $100
```

Example of non-unit-testable function:

```python
# This doesn't need unit tests (simple pass-through)
def get_user(db, user_id):
    return db.query(User).filter_by(id=user_id).first()
```

```
VERIFICATION: List functions that genuinely need unit tests
```

### CHECKPOINT 5: Write Focused Unit Tests

```
REQUIRED: Copy existing unit test pattern and adapt for new logic:
```

Example - copying existing test pattern:

```python
# EXISTING TEST (found in CHECKPOINT 2):
def test_user_validation_cases():
    assert validate_user({"name": "John", "age": 25}) == True
    
# NEW TEST (copying structure):
def test_shipping_calculation_cases():
    # Copy same assertion style from existing test
    assert calculate_shipping(10, 100) == 5.0
    assert calculate_shipping(10, 600) == 7.5
    assert calculate_shipping(10, 100, express=True) == 10.0
```

```
REQUIREMENTS:
- Copy setup/teardown from existing test pattern
- Use same assertion style as existing tests
- No mocks or external dependencies
- Test edge cases and boundaries
- Fast execution (milliseconds)
- Clear test names explaining scenario

VERIFICATION: Unit tests follow existing patterns AND cover logic paths
```

## PHASE 4: WRITE INTEGRATION TESTS

### CHECKPOINT 6: Prepare Real Services

```
REQUIRED: Set up actual test environment:
- Identify required services (database, cache, etc.)
- Use test database with real schema
- Start actual services needed
- Use real configuration

REAL SERVICE CHECKLIST:
- Database: Use test instance, real tables
- APIs: Your services run actual endpoints
- WebSocket: Real connections, not mocks
- File system: Real temp directories

ONLY MOCK (for integration tests):
- External API calls (OpenAI, etc.)
- Email/SMS sending
- Payment processing
- External webhooks

VERIFICATION: List real services that tests will use
```

### CHECKPOINT 7: Write Integration Test for User Flow

```
REQUIRED: Test complete feature with real services:
```

Integration test pattern example:

```python
async def test_user_can_purchase_item():
    """Test complete purchase flow with real services."""
    
    # SETUP - Create test data in real database
    async with get_test_db() as db:
        user = await create_test_user(db)
        product = await create_test_product(db, price=50.0)
    
    # EXECUTE - Real API calls
    response = await client.post(
        "/api/purchase",
        json={"product_id": product.id, "quantity": 2},
        headers={"Authorization": f"Bearer {user.token}"}
    )
    
    # VERIFY - Response correct
    assert response.status_code == 201
    assert response.json()["total"] == 100.0
    
    # INTEGRATION - Check database state
    async with get_test_db() as db:
        order = await db.execute(
            select(Order).where(Order.user_id == user.id)
        )
        order_obj = order.scalar_one()
        assert order_obj.status == "completed"
        assert order_obj.total == 100.0
```

```
REQUIREMENTS:
- Test complete user workflow
- Use real database/services
- Verify data persistence
- Check integration points

VERIFICATION: Integration test proves feature works
```

### CHECKPOINT 8: Mock ONLY External Services

```
IF EXTERNAL APIS INVOLVED:
```

External API mock pattern:

```python
@patch('openai.ChatCompletion.create')
async def test_chat_with_ai_integration(mock_openai):
    # Mock ONLY the external API
    mock_openai.return_value = {
        "choices": [{"message": {"content": "AI response"}}]
    }
    
    # Everything else uses real services
    async with get_test_db() as db:
        user = await create_test_user(db)
    
    response = await client.post(
        "/api/chat",
        json={"message": "Hello"},
        headers={"Authorization": f"Bearer {user.token}"}
    )
    
    # Verify integration worked
    assert response.json()["reply"] == "AI response"
    
    # Check conversation saved to database
    async with get_test_db() as db:
        convo = await db.execute(
            select(Conversation).where(Conversation.user_id == user.id)
        )
        assert convo.scalar_one().last_message == "Hello"
```

```
VERIFICATION: External APIs mocked minimally
```

## PHASE 5: VALIDATE TEST QUALITY

### CHECKPOINT 9: Run Tests with Real Services

```
REQUIRED: Execute both test types:
```

Run unit tests:

```bash
# Use command from TESTING.md for unit tests
[Run unit test command from TESTING.md]
# Should complete in seconds
# No external service calls in output
```

Run integration tests:

```bash
# Start services if needed (from TESTING.md)
[Start services command from TESTING.md if applicable]

# Use command from TESTING.md for integration tests
[Run integration test command from TESTING.md]
# Should see real service interactions
# Should see data persistence
```

```
IF TESTS FAIL - YOUR RESPONSE DETERMINES YOUR QUALITY:

❌ LAZY RESPONSES (DO NOT DO):
- "This test is outdated, commenting it out"
- "These tests need updating but our implementation works"
- "Skipping this test as it's not relevant anymore"
- "The test assumptions changed, removing it"

✅ PROFESSIONAL RESPONSES (DO THIS):
1. Read the failure - what exactly is wrong?
2. The test is telling you something - listen to it
3. Either the test needs updating OR your code has a bug
4. Fix whichever is wrong
5. ALL tests must pass before you're done

EXAMPLE:
Test expects: RSSFetcher() with defaults
Test fails: RSSFetcher missing required argument 'url'
LAZY: Comment out the test ❌
PROFESSIONAL: Update test to RSSFetcher("http://test.com") ✓

VERIFICATION: Both test types pass appropriately
```

### CHECKPOINT 10: Verify Tests Actually Test

```
REQUIRED: Confirm tests prove functionality:

COVERAGE REALITY CHECK:
- Did you write ONE test and declare victory? → Not enough
- Are you testing just the happy path? → Add edge cases
- Did you skip error scenarios? → Add them
- Count your test cases - is this really production-ready?

QUALITY CHECKS:
- Do unit tests catch logic errors?
- Do integration tests use real services?
- Would tests catch real bugs?
- Are tests maintainable?

ANTI-PATTERN CHECK:
- No testing of mocks
- No artificial test conditions
- No test-only code paths
- No overly complex setup
- No single token test to check a box

VERIFICATION: Tests provide real production-level confidence
```

### CHECKPOINT 11: Document Test Purpose

```
REQUIRED: Add clear documentation:
```

Documentation pattern:

```python
def test_discount_calculation():
    """
    Test discount calculation handles all customer types
    and purchase thresholds correctly.
    """

async def test_purchase_flow():
    """
    Test complete purchase workflow:
    - User adds item to cart
    - Applies discount
    - Completes payment
    - Order saved to database
    """
```

```
VERIFICATION: Test purpose is clear
```

## PHASE 6: TEST COMPLETION

### CHECKPOINT 12: Final Quality Check and Update Task Status

```
REQUIRED: Verify code still meets standards after test additions:
- Run linting/quality commands from ITERATION.md Tech Stack section
- Fix any issues introduced during test writing
- Ensure all quality checks pass

REQUIRED: Mark testing complete:
- Note unit tests added (if applicable)
- Note integration tests added
- Confirm all tests pass
- Confirm linting still passes
- Ready for /complete-task if implementation done

TASK UPDATE:
- Test evidence: pytest output
- Coverage: Logic tested with units, features with integration
- All tests passing with real services
- Code quality maintained after test additions

VERIFICATION: Task has appropriate test coverage AND maintains quality standards
```

## SUCCESS CRITERIA

Tests properly written when:

- [ ] Complex logic has unit tests
- [ ] User features have integration tests
- [ ] Integration tests use real services
- [ ] Only external APIs mocked
- [ ] Tests organized by type
- [ ] All tests pass
- [ ] Tests would catch real bugs

## COMMON PATTERNS

### Unit Test Pattern

```python
def test_business_logic():
    # Test pure logic, no dependencies
    result = calculate_complex_thing(input_data)
    assert result.value == expected
    assert result.status == "valid"
```

### Integration Test Pattern

```python
async def test_feature_flow():
    # Setup with real database
    async with get_test_db() as db:
        test_data = await create_test_data(db)
    
    # Execute with real API
    response = await client.post("/api/endpoint", json=data)
    
    # Verify response AND database state
    assert response.status_code == 200
    assert await verify_db_updated()
```

### WebSocket Integration Pattern

```python
async def test_websocket_flow():
    # Real WebSocket connection
    async with client.websocket_connect("/ws") as ws:
        # Send real message
        await ws.send_json({"action": "subscribe"})
        
        # Verify real response
        response = await ws.receive_json()
        assert response["status"] == "subscribed"
```

## FAILURE MODES & RECOVERY

**If unsure unit vs integration:** Default to integration  
**If test needs many mocks:** Make it an integration test  
**If test is slow:** Check if it should be a unit test  
**If test is flaky:** Fix the race condition, don't add mocks  
**If test setup complex:** Simplify or create test helpers

## CONTEXT MANAGEMENT

**If context getting large:**

- Focus on one test type at a time
- Use /save-state between unit and integration tests
- Complete unit tests, save, then integration tests

**State should capture:**

- Which tests completed
- Any decisions about test approach
- What still needs testing