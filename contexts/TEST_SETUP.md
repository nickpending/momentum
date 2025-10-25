# Test Infrastructure Setup

**Variables**: Variables in CAPS are injected by hooks (see HTML comments above), `{vars}` are runtime values (find/calculate them), `[vars]` are template placeholders (substitute them).

**Key Paths**:
- ARTIFACTS_DIR - Workflow artifacts (ITERATION.md, TESTING.md)
- WORKFLOW_DIR - Workflow root (for templates/)
- `~/.claudex/standards/` - Claudex standards directory

## DETECT TECH STACK

**Primary Source:**
- READ ARTIFACTS_DIR/ITERATION.md
- EXTRACT from "Tech Stack & Embedded Standards" section
- NOTE all languages, frameworks, tools mentioned

**Secondary Sources (if ITERATION.md unclear):**
- Check for build files: package.json, pyproject.toml, go.mod, Cargo.toml
- Examine source file extensions as last resort

## LOAD TESTING PATTERNS

**From Claudex Standards (SELECTIVE EXTRACTION):**
- READ ~/.claudex/standards/claudex-{detected-language}.md if exists
- EXTRACT ONLY:
  - Test runner command (pytest, jest, go test, etc.)
  - Basic test file naming patterns
  - Directory conventions (tests/ or test/)
- IGNORE:
  - Unit test emphasis
  - Mock libraries (pytest-mock, unittest.mock)
  - Coverage requirements
  - TDD practices

**MOMENTUM TESTING PHILOSOPHY (OVERRIDES CLAUDEX):**
- RISK-BASED TESTING: Test what would ruin someone's day, skip the rest
- INVARIANT FOCUS: Test properties that must hold, not implementations
- INTEGRATION PRIMARY: 90% integration tests, minimal unit tests
- REAL SERVICES: Use actual databases, caches, queues
- MOCK SPARINGLY: Only external APIs (OpenAI, Stripe, email)
- <10 TESTS PER FEATURE: More than that is over-testing
- NO TEST THEATER: If it doesn't protect invariants, delete it

## CREATE TESTING.md

**Template:**
- LOAD WORKFLOW_DIR/templates/TESTING_TEMPLATE.md

**Populate with:**
- Detected tech stack and versions
- Test runner command ONLY (no mock libraries)
- Minimal test dependencies (framework + real service helpers)
- Directory structure appropriate for detected language
- Testing philosophy emphasis:
  ```
  ## Testing Philosophy
  - Test invariants that would ruin user's day if broken
  - <10 tests per feature maximum
  - Integration tests with real services (90%)
  - Unit tests only for pure algorithms (10%)
  - Mock ONLY external APIs
  - Skip low-risk cosmetic features
  ```
- Example focused on invariant testing, not unit testing

**Output:**
- WRITE to ARTIFACTS_DIR/TESTING.md

## COMPLETION

After creating TESTING.md:
- Say "✅ Test infrastructure configured for [detected stack]"
- Say "🎯 Task mode activated. Let's ship working software."
- Continue with original /plan-task command