# Write tests that protect invariants and handle failures

**Variables**: Variables in CAPS are injected by hooks (see HTML comments above), `{vars}` are runtime values (find/calculate them), `[vars]` are template placeholders (substitute them).

**Key Paths**:
- ARTIFACTS_DIR - Workflow artifacts (TESTING.md, ITERATION.md, TASKS.md)

## ⚠️ CRITICAL: RISK-GUIDED INVARIANT TESTING ⚠️

**🛑 YOU'RE A SAFETY INSPECTOR, NOT A COVERAGE CHECKER**  
**🛑 TEST WHAT WOULD RUIN SOMEONE'S DAY**  
**🛑 ACCEPT PROBABILISTIC OUTCOMES**  
**🛑 IF YOU START A TEST, YOU FINISH IT**

## TL;DR
Find HIGH risk → Identify invariants → Write <10 tests → Skip the rest → 30-60 minutes max

## THE MENTAL MODEL SHIFT

You're not writing tests to prevent all bugs.
You're ensuring critical properties hold even when things go wrong.

Think like a safety inspector who:
1. Knows where accidents happen (risk areas)
2. Focuses inspection there (find invariants)
3. Ignores cosmetic issues (skip low risk)

**YOUR ROLE**: Independent safety inspector, not developer's assistant
- Validate developer's discoveries (don't just accept them)
- Find what they missed (fresh eyes catch different things)
- Challenge risk assessments (developers minimize their own risks)
- Bring testing expertise (you think differently about failure)

## PHASE 1: CONTEXT AND RISK ANALYSIS

### CHECKPOINT 0.5: Load Test Infrastructure

```
REQUIRED: Understand how testing works in this project:
- READ ARTIFACTS_DIR/TESTING.md
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
- READ ARTIFACTS_DIR/ITERATION.md
- LOCATE task {task-number}
- VERIFY task status is 🔄 In Progress or ✅ Complete
- IDENTIFY what functionality was implemented
- READ the actual implementation code
- UNDERSTAND the integration points

IMPLEMENTATION ANALYSIS:
- What files were created/modified?
- What's the core functionality?
- What would a user actually do with this?
- What could go wrong that would ruin their day?

DEVELOPER'S DISCOVERIES (from ARTIFACTS_DIR/TASKS.md):
- What invariants did they discover?
- What failure modes did they encounter?
- What risk assessment did they make?

VERIFICATION: Summarize what was built and the developer's findings
```

### CHECKPOINT 1.5: Independent Tester Analysis

```
CRITICAL: You are an independent safety inspector, not a checklist executor

VALIDATE DEVELOPER'S CLAIMS:
□ "Developer says [invariant] is critical" - Do you agree? Why/why not?
□ "Developer says [component] is low risk" - What if they're wrong?
□ "Developer found [failure mode]" - Is it actually handled properly?

FIND WHAT DEVELOPER MISSED:
□ What other invariants could break that weren't discovered?
□ What failure modes weren't encountered during building?
□ What risk is being underestimated due to tunnel vision?

Examples of tester discoveries:
- "Developer missed: items could vanish during transfer"
- "Actually, message formatting affects accessibility - HIGHER risk"
- "Error messages expose internal state - SECURITY risk"

CHALLENGE ASSUMPTIONS:
- If developer says "cosmetic" - could it affect accessibility?
- If developer says "low risk" - what's the worst case scenario?
- If developer says "handled" - did they test all paths?

VERIFICATION: List YOUR independent findings beyond developer's discoveries
```

### CHECKPOINT 2: Rapid Risk Scan (30 seconds)

```
REQUIRED: Categorize what was built by user impact:

HIGH RISK (would anger/hurt users if broken):
□ Player progress (XP, levels, achievements)
□ Virtual property (items, currency, ownership)
□ Money/billing calculations
□ Authentication/authorization
□ State transitions (corruption possible)
□ Concurrent operations (races, duplicates)
□ Data persistence

MEDIUM RISK (would annoy users if broken):
□ Multi-step workflows
□ Service integrations
□ Error recovery paths
□ Performance-critical paths

LOW RISK (users wouldn't notice or care):
□ Display formatting
□ Logging/metrics
□ Simple getters/setters
□ Pass-through functions
□ Message formatting
□ UI cosmetics

DECISION: Focus ONLY on HIGH risk areas for testing
VERIFICATION: List the HIGH risk components identified
```

### CHECKPOINT 3: Find Existing Test Patterns

```
REQUIRED: Find and analyze existing tests to copy their patterns:
- USE Glob to find test files based on TESTING.md structure
- FIND 2-3 existing tests that test comparable features
- READ these test files completely (use Read tool)
- EXTRACT their patterns

IF NO TESTS EXIST YET:
- Use examples from TESTING.md
- Follow patterns from ITERATION.md's embedded standards
- You're writing the first tests

PATTERN EXTRACTION:
For each similar test found:
- Test file: [path/to/existing_test.py]
- Pattern to copy: [setup/assertion style/teardown]

CRITICAL: Copy existing patterns, don't reinvent
VERIFICATION: Have 2-3 concrete patterns to follow
```

### CHECKPOINT 3.5: Test Organization Reality Check

```
PHILOSOPHY MEETS PRACTICE:

Your tests still go in unit/ or integration/ based on DEPENDENCIES:

INVARIANT TESTS → Placement depends on needs:
- Pure logic (no external services) → tests/unit/
- Needs database/services → tests/integration/
Example: XP calculation (pure) → unit/, Item persistence (DB) → integration/

FAILURE MODE TESTS → Almost always integration/:
- Need real services to inject failures
- Example: test_death_during_disconnection.py → integration/

CONFIDENCE TESTS → Placement depends on component:
- Pure algorithm → tests/unit/
- With services → tests/integration/
Example: LLM threshold (API) → integration/

REMEMBER:
- Risk-based thinking determines WHAT to test
- Dependencies determine WHERE to put the test
- Tooling still expects unit/ vs integration/ separation

VERIFICATION: Know where each test type will go
```

### CHECKPOINT 4: Invariant Discovery (High Risk Only)

```
FOR EACH HIGH RISK AREA, identify:

INVARIANTS (properties that must ALWAYS hold - 100%):
Not: "Does the function work correctly?"
But: "What property must remain true?"

Examples:
- XP never goes negative (breaks progression)
- Items are never duplicated (breaks economy)
- User can always recover from any state (no soft-locks)
- Money in = money out (accounting invariant)

FAILURE MODES (what WILL happen in production):
Not: "What edge cases exist?"
But: "What failures are inevitable?"

Examples:
- Database connection drops
- Concurrent modifications
- Network timeouts
- Service degradation

PROBABILISTIC COMPONENTS (what has acceptable variance):
Not: "Output must equal exactly X"
But: "Output meets constraints Y% of the time"

Examples:
- LLM responses appropriate 85% of the time
- Recommendations relevant 70% of the time

VERIFICATION: List typically 2-5 invariants (occasionally more for complex features)
```

### CHECKPOINT 5: Explicitly Skip Low Risk

```
EXPLICITLY ACKNOWLEDGE what you're NOT testing:

LOW RISK - SKIPPING:
- [Component]: No user impact if broken
- [Component]: Cosmetic only
- [Component]: Simple pass-through

This is CORRECT. You're not being lazy, you're being an engineer.
Testing everything is amateur. Testing what matters is professional.
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

DEVELOPER'S PERSPECTIVE (from ARTIFACTS_DIR/TASKS.md):
- Discovered invariants: [What broke during building]
- Encountered failures: [What they had to handle]
- Risk assessment: [Their view of HIGH/LOW]

TESTER'S INDEPENDENT ANALYSIS:
- Additional invariants found: [What developer missed]
- Risk disagreements: [Where you disagree with developer's assessment]
- New failure modes identified: [What wasn't encountered but could happen]

SYNTHESIZED TEST PLAN:
- Agreed HIGH RISK: [Both see as critical]
- Tester-identified HIGH RISK: [Developer missed or underestimated]
- Agreed LOW RISK: [Both agree to skip]

INVARIANTS TO PROTECT:
1. [Invariant]: Prevents [user impact] - Source: [Developer/Tester/Both]
2. [Invariant]: Prevents [user impact] - Source: [Developer/Tester/Both]
[List all, showing who identified each]

FAILURE MODES TO TEST:
1. [Failure]: System must [degrade gracefully]
2. [Failure]: System must [remain usable]

PROBABILISTIC THRESHOLDS:
1. [Component]: Must succeed [X%] of time

Existing Test Patterns Found: [count]
- [Test file 1]: Pattern for [type of test]
- [Test file 2]: Pattern for [type of test]

PROPOSED TESTS (< 10 total):
Invariant Tests: [count]
- test_[name]: Protects [invariant] → Location: tests/[unit or integration]/

Failure Tests: [count]  
- test_[name]: Handles [failure] → Location: tests/integration/

Confidence Tests: [count]
- test_[name]: Ensures [threshold] → Location: tests/[unit or integration]/

Test Organization:
- Unit tests location: tests/unit/ (pure logic, no dependencies)
- Integration tests location: tests/integration/ (needs services)

Services Required for Integration Tests:
- [Database, Redis, etc.]

External APIs to Mock (integration tests only):
- [OpenAI, Stripe, etc. if any]

EXPLICITLY NOT TESTING:
- [Low risk component]: No user impact
- [Cosmetic feature]: Not worth testing

Total tests: [number] (should be < 10)

Ready to write tests?

Please respond with YES or NO.
```

**🛑 STOP HERE - WAIT FOR APPROVAL**

## PHASE 3: WRITE INVARIANT TESTS (If Approved)

### CHECKPOINT 6: Implement Invariant Tests

```
CRITICAL: These protect what matters most.

FOR EACH INVARIANT IDENTIFIED:
- Use pattern from existing tests found in Checkpoint 3
- Test the PROPERTY, not the implementation
- Use real services, no mocking your own code

Pattern for invariant testing:
```

```python
async def test_INVARIANT_xp_never_negative():
    """
    INVARIANT: XP never goes negative
    BREAKS: Progression system if violated
    """
    # Test the PROPERTY across multiple scenarios
    for scenario in [death, penalty, adjustment]:
        player.xp = random.randint(0, 1000)
        await scenario(player)
        assert player.xp >= 0, f"XP went negative: {player.xp}"
    
    # This must ALWAYS pass or system is broken
```

```
VERIFICATION: Each invariant has a test that validates the property
```

### CHECKPOINT 7: Implement Failure Mode Tests

```
CRITICAL: Systems WILL fail. Test graceful degradation.

FOR EACH FAILURE MODE IDENTIFIED:
- Inject realistic failure
- Verify system degrades gracefully
- Ensure recovery is possible

Pattern for failure testing:
```

```python
async def test_FAILURE_database_during_death():
    """
    FAILURE: Database disconnection during critical operation
    GRACEFUL: Player can continue, no corruption
    """
    player = await create_player()
    
    # Start critical operation
    death_process = player.begin_death()
    
    # Inject realistic failure
    await database.disconnect()
    
    # System should degrade gracefully
    result = await death_process
    assert result.status in ["queued", "retry", "graceful_fail"]
    assert not player.corrupted
    
    # Recovery must be possible
    await database.reconnect()
    assert await player.can_continue()
```

```
VERIFICATION: Each failure mode test shows graceful handling
```

### CHECKPOINT 8: Implement Confidence Tests (If Probabilistic)

```
ONLY if you have probabilistic components:

Pattern for threshold testing:
```

```python
def test_CONFIDENCE_llm_npc_responses():
    """
    CONFIDENCE: NPC responses appropriate 85% of the time
    THRESHOLD: Based on user acceptance testing
    """
    acceptable = 0
    total = 100
    
    for _ in range(total):
        context = random_game_scenario()
        response = npc.generate_response(context)
        
        if meets_minimum_quality(response):
            acceptable += 1
    
    success_rate = acceptable / total
    assert success_rate >= 0.85, f"Only {success_rate*100}% acceptable"
```

```
VERIFICATION: Thresholds set and validated
```

## PHASE 4: VALIDATE TEST QUALITY

### CHECKPOINT 9: Run Tests - NO QUITTING

```
REQUIRED: Execute all tests with real services

Run tests using commands from TESTING.md:
```bash
# For unit tests:
[Use unit test command from TESTING.md]

# For integration tests:
[Use start services command from TESTING.md if needed]
[Use integration test command from TESTING.md]
```

ALL tests must pass

IF TESTS FAIL - YOUR RESPONSE DETERMINES YOUR QUALITY:

❌ LAZY RESPONSES (DO NOT DO):
- "This test is outdated, commenting it out"
- "These tests need updating but our implementation works"
- "Skipping this test as it's not relevant anymore"
- "Couldn't get this working"
- "The old implementation makes this hard to test"

✅ PROFESSIONAL RESPONSES (DO THIS):
1. Read the failure - what exactly is wrong?
2. The test is telling you something - listen to it
3. Either the test needs updating OR your code has a bug
4. Fix whichever is wrong
5. ALL tests must pass before you're done

EXAMPLE:
Test fails: "Connection refused"
LAZY: "Test environment issue, skipping" ❌
PROFESSIONAL: Start the required service ✓

VERIFICATION: Every test passes. No exceptions.
```

### CHECKPOINT 10: Verify Test Purpose

```
REALITY CHECK - Did you actually protect what matters?

For EACH test you wrote:
1. What invariant/failure does this prevent?
2. What bad user experience does this avoid?
3. Does it use real services (not mocks)?
4. Did you run it and see it pass?

For tests you SKIPPED:
1. Confirm they're actually low risk
2. Confirm no user impact if broken

ANTI-PATTERN CHECK:
- No single test to check a box
- No testing implementation details
- No 50 tests for one feature
- No testing getters/setters
- No mocking your own code

VERIFICATION: You're testing invariants, not implementations
```

## PHASE 5: TEST COMPLETION

### CHECKPOINT 11: Final Quality Check

```
REQUIRED: Verify test suite quality:
- Run linting/quality commands from ITERATION.md Tech Stack section
- Fix any issues introduced during test writing
- Ensure test organization follows project patterns

Example quality commands:
```bash
# Python
ruff check tests/
black tests/

# JavaScript/TypeScript
eslint tests/
prettier --check tests/

# Rust
cargo fmt --check
cargo clippy
```

VERIFICATION: Tests pass linting and follow project standards
```

### CHECKPOINT 12: Document What's Protected

```
REQUIRED: Clear summary of your risk-based approach

TEST COMPLETION SUMMARY
========================

Task: [task name and number]
Status: Tests Complete

RISK-BASED APPROACH:
- Developer identified: [Their HIGH risk findings]
- Tester identified: [Additional HIGH risk findings]
- Both agreed LOW RISK: [Explicitly skipped]

INVARIANTS PROTECTED:
✅ [Invariant 1]: test_name - Prevents [user impact] (Developer-discovered)
✅ [Invariant 2]: test_name - Prevents [user impact] (Tester-discovered)
✅ [Invariant 3]: test_name - Prevents [user impact] (Both identified)

FAILURE MODES HANDLED:
✅ [Failure 1]: test_name - System [degrades gracefully]

CONFIDENCE THRESHOLDS (if applicable):
✅ [Component]: [X%] success rate - Acceptable

Total tests written: [number] (target was < 10)
Test locations: [X in unit/, Y in integration/]
Coverage: Not measured - we test invariants, not lines

All tests passing: YES
Linting/quality checks: PASSED
Ready for production: YES

This minimal test suite protects what matters while accepting that:
- Most code doesn't need tests
- Failures are inevitable
- User impact varies dramatically
- Testing has diminishing returns
```

## SUCCESS CRITERIA

You've succeeded when:
- [ ] Every HIGH risk area has invariant tests
- [ ] Common failures are handled gracefully
- [ ] Probabilistic components have thresholds
- [ ] All tests actually pass (no quitting)
- [ ] Low risk areas explicitly skipped
- [ ] < 10 tests per feature
- [ ] Followed existing test patterns

You've FAILED if:
- [ ] Testing low-risk cosmetic features
- [ ] Testing implementation details
- [ ] > 10 tests per feature
- [ ] Aiming for coverage metrics
- [ ] Any test is commented out or skipped
- [ ] Reinvented test patterns instead of copying

## THE ENGINEERING MINDSET

Remember:
- Test what would ruin someone's day
- Accept failures will happen
- Ensure graceful degradation
- Skip everything else

3 invariant tests that matter > 30 tests that don't.

**TIME EXPECTATION**: This entire process should take 30-60 minutes max.
If you're spending hours, you're testing too much.