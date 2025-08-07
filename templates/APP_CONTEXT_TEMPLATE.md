# {PROJECT_NAME} - Claude Code Integration Guide

## CRITICAL: This document is for Claude Code, not humans

**Purpose**: Enable Claude Code to integrate with existing system correctly  
**Focus**: Patterns, constraints, and anti-patterns for development

## Project Overview

**Type**: {APPLICATION_TYPE}  
**Tech Stack**: {TECH_STACK_WITH_VERSIONS}  
**Architecture**: {ARCHITECTURE_PATTERN}  
**Primary Function**: {CORE_PURPOSE_ONE_LINE}

## Integration Constraints

### File Modification Patterns

**ALWAYS modify these file types:**

- `{FILE_PATTERN}` - {PURPOSE_AND_PATTERN}
- `{FILE_PATTERN}` - {PURPOSE_AND_PATTERN}

**NEVER modify these files:**

- `{PROTECTED_FILE_PATTERN}` - {REASON_AND_ALTERNATIVE}
- `{PROTECTED_FILE_PATTERN}` - {REASON_AND_ALTERNATIVE}

### Code Integration Patterns

#### Database Access

```{LANGUAGE}
# CORRECT: Use existing session pattern
{DATABASE_PATTERN_EXAMPLE}

# WRONG: {ANTI_PATTERN_EXAMPLE}
```

#### API Route Integration

```{LANGUAGE}
# CORRECT: Follow existing route pattern
{API_ROUTE_PATTERN}

# WRONG: {API_ANTI_PATTERN}
```

#### Error Handling

```{LANGUAGE}
# CORRECT: Use project's error handling
{ERROR_HANDLING_PATTERN}

# WRONG: {ERROR_ANTI_PATTERN}
```

## Architecture Constraints

### Design Principles (from embedded context)

{EMBEDDED_DESIGN_PRINCIPLES}

### Integration Requirements

- **Component Connection**: {COMPONENT_CONNECTION_PATTERN}
- **Data Flow**: {DATA_FLOW_PATTERNS}
- **Authentication**: {AUTH_INTEGRATION_PATTERN}
- **Validation**: {INPUT_VALIDATION_PATTERN}

### Performance Constraints

- **Database**: {DATABASE_PERFORMANCE_PATTERNS}
- **Caching**: {CACHING_STRATEGY}
- **Async Patterns**: {ASYNC_USAGE_PATTERNS}

## Development Patterns

### Testing Integration

```{LANGUAGE}
# CORRECT: Follow existing test patterns
{TEST_PATTERN_EXAMPLE}
```

**Test Database:**

- **Use**: {TEST_DATABASE_PATTERN}
- **Don't**: {TEST_ANTI_PATTERN}

### Configuration Integration

```{LANGUAGE}
# CORRECT: Use existing config pattern
{CONFIG_PATTERN_EXAMPLE}

# WRONG: {CONFIG_ANTI_PATTERN}
```

**Secrets Management:**

- **Correct Pattern**: {SECRETS_PATTERN}
- **Never**: {SECRETS_ANTI_PATTERN}

## Security Constraints

### Authentication Integration

**Pattern**: {AUTH_PATTERN}

```{LANGUAGE}
# CORRECT: Use existing auth decorator/dependency
{AUTH_PATTERN_EXAMPLE}
```

### Input Validation

**Pattern**: {VALIDATION_PATTERN}

```{LANGUAGE}
# CORRECT: Use existing validation
{VALIDATION_PATTERN_EXAMPLE}
```

### Authorization

**Pattern**: {AUTHORIZATION_PATTERN}

```{LANGUAGE}
# CORRECT: Use existing authorization
{AUTHORIZATION_PATTERN_EXAMPLE}
```

## Deployment Integration

### Container Integration

**Docker Pattern**: {DOCKER_PATTERN} **Environment**: {DEPLOYMENT_ENVIRONMENT}

### Database Migrations

**Pattern**: {MIGRATION_PATTERN}

```bash
# CORRECT: Use existing migration commands
{MIGRATION_COMMAND}
```

## Anti-Patterns (NEVER DO THESE)

### Code Anti-Patterns

- **Don't**: {CODE_ANTI_PATTERN_1}
- **Don't**: {CODE_ANTI_PATTERN_2}
- **Don't**: {CODE_ANTI_PATTERN_3}

### Integration Anti-Patterns

- **Don't**: Create new database connections directly
- **Don't**: Bypass existing authentication mechanisms
- **Don't**: Use different error handling patterns
- **Don't**: Create new configuration loading mechanisms

### Testing Anti-Patterns

- **Don't**: {TESTING_ANTI_PATTERN_1}
- **Don't**: {TESTING_ANTI_PATTERN_2}
- **Don't**: {TESTING_ANTI_PATTERN_3}

## Quick Integration Checklist

When adding new functionality:

- [ ] Follow existing file organization patterns
- [ ] Use established database access patterns
- [ ] Integrate with existing authentication/authorization
- [ ] Apply consistent error handling
- [ ] Add tests following existing patterns
- [ ] Use project's configuration management
- [ ] Follow established API response formats
- [ ] Apply existing validation patterns

## Tech Stack Specifics

### {PRIMARY_FRAMEWORK} Patterns

{FRAMEWORK_SPECIFIC_INTEGRATION_PATTERNS}

### {DATABASE_SYSTEM} Patterns

{DATABASE_SPECIFIC_PATTERNS}

### {ADDITIONAL_TECH} Patterns

{ADDITIONAL_TECH_PATTERNS}

## Emergency Integration Rules

**If unsure about integration:**

1. **Look for existing similar functionality** and copy the pattern
2. **Ask user** for clarification on integration approach
3. **Default to simplest integration** that follows existing patterns
4. **Never break existing functionality** for new features

## Context for Complex Integration

### {COMPLEX_FEATURE_AREA}

**Background**: {WHY_THIS_EXISTS} **Pattern**: {HOW_TO_INTEGRATE} **Constraints**: {WHAT_NOT_TO_DO}

### {ANOTHER_COMPLEX_AREA}

**Background**: {BACKGROUND_CONTEXT} **Pattern**: {INTEGRATION_APPROACH} **Constraints**: {CONSTRAINTS_AND_LIMITS}

---

**Generated**: {TIMESTAMP} **Based on**: ITERATION.md patterns + codebase analysis **Purpose**: Enable Claude Code to integrate correctly with existing system