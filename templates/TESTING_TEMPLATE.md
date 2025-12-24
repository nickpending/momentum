# Testing Infrastructure

## Testing Philosophy

<!-- FIXED: Do not modify this section -->

- Test invariants that would ruin user's day if broken
- <10 tests per feature maximum
- Integration tests with real services (90%)
- Unit tests only for pure algorithms (10%)
- Mock ONLY external APIs (OpenAI, Stripe, email)
- Skip low-risk cosmetic features

---

## Test Runner

**Framework**: [TEST_FRAMEWORK]
**Command**: `[TEST_COMMAND]`
**Config File**: [CONFIG_FILE]

## Installation

### Test Dependencies
```bash
[INSTALL_COMMAND]
```

### Directory Structure
```
[TEST_STRUCTURE]
```

## Running Tests

### All Tests
```bash
[RUN_ALL_COMMAND]
```

### Unit Tests Only
```bash
[RUN_UNIT_COMMAND]
```

### Integration Tests Only  
```bash
[RUN_INTEGRATION_COMMAND]
```

### With Coverage
```bash
[RUN_COVERAGE_COMMAND]
```

### Watch Mode
```bash
[RUN_WATCH_COMMAND]
```

## Test Environment

### Required Services
- **Database**: [DATABASE_TYPE_OR_NONE]
- **Cache**: [CACHE_TYPE_OR_NONE]  
- **Queue**: [QUEUE_TYPE_OR_NONE]
- **Other**: [OTHER_SERVICES_OR_NONE]

### Starting Services
```bash
[START_SERVICES_COMMAND_OR_NONE]
```

### Environment Variables
```bash
[TEST_ENV_VARS]
```

### Test Database Setup
```bash
[TEST_DB_SETUP_COMMAND]
```

## Test Patterns

### Unit Test Pattern
```[LANGUAGE]
[UNIT_TEST_EXAMPLE]
```

### Integration Test Pattern
```[LANGUAGE]
[INTEGRATION_TEST_EXAMPLE]
```

### Test Utilities/Helpers
```[LANGUAGE]
[TEST_HELPER_EXAMPLE]
```

## Debugging Tests

### Run Single Test
```bash
[RUN_SINGLE_TEST_COMMAND]
```

### Debug Mode
```bash
[DEBUG_TEST_COMMAND]
```

---

## Fixtures & Helpers

<!-- LEARNABLE: Agents update this section -->

[TEST_FIXTURES_AND_HELPERS]

---

## Learned Patterns

<!-- LEARNABLE: Agents append discoveries here -->

[LEARNED_PATTERNS]

---

## Common Issues

<!-- LEARNABLE: Agents update this section -->

- [COMMON_ISSUE_1]
- [COMMON_ISSUE_2]
- [COMMON_ISSUE_3]
