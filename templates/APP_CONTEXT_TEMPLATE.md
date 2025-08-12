# [projectname] - Claude Code Integration Guide

## CRITICAL: This document is for Claude Code, not humans

**Purpose**: Enable Claude Code to integrate with existing system correctly  
**Focus**: Patterns, constraints, and anti-patterns for development

## Project Overview

**Type**: [application_type]  
**Tech Stack**: [tech_stack_with_versions]  
**Architecture**: [architecture_pattern]  
**Primary Function**: [core_purpose_one_line]

## Integration Constraints

### File Modification Patterns

**ALWAYS modify these file types:**

- `[file_pattern]` - [purpose_and_pattern]
- `[file_pattern]` - [purpose_and_pattern]

**NEVER modify these files:**

- `[protected_file_pattern]` - [reason_and_alternative]
- `[protected_file_pattern]` - [reason_and_alternative]

### Code Integration Patterns

#### Database Access

```[language]
# CORRECT: Use existing session pattern
[database_pattern_example]

# WRONG: [anti_pattern_example]
```

#### API Route Integration

```[language]
# CORRECT: Follow existing route pattern
[api_route_pattern]

# WRONG: [api_anti_pattern]
```

#### Error Handling

```[language]
# CORRECT: Use project's error handling
[error_handling_pattern]

# WRONG: [error_anti_pattern]
```

## Architecture Constraints

### Design Principles (from embedded context)

[embedded_design_principles]

### Integration Requirements

- **Component Connection**: [component_connection_pattern]
- **Data Flow**: [data_flow_patterns]
- **Authentication**: [auth_integration_pattern]
- **Validation**: [input_validation_pattern]

### Performance Constraints

- **Database**: [database_performance_patterns]
- **Caching**: [caching_strategy]
- **Async Patterns**: [async_usage_patterns]

## Development Patterns

### Testing Integration

```[language]
# CORRECT: Follow existing test patterns
[test_pattern_example]
```

**Test Database:**

- **Use**: [test_database_pattern]
- **Don't**: [test_anti_pattern]

### Configuration Integration

```[language]
# CORRECT: Use existing config pattern
[config_pattern_example]

# WRONG: [config_anti_pattern]
```

**Secrets Management:**

- **Correct Pattern**: [secrets_pattern]
- **Never**: [secrets_anti_pattern]

## Security Constraints

### Authentication Integration

**Pattern**: [auth_pattern]

```[language]
# CORRECT: Use existing auth decorator/dependency
[auth_pattern_example]
```

### Input Validation

**Pattern**: [validation_pattern]

```[language]
# CORRECT: Use existing validation
[validation_pattern_example]
```

### Authorization

**Pattern**: [authorization_pattern]

```[language]
# CORRECT: Use existing authorization
[authorization_pattern_example]
```

## Deployment Integration

### Container Integration

**Docker Pattern**: [docker_pattern] **Environment**: [deployment_environment]

### Database Migrations

**Pattern**: [migration_pattern]

```bash
# CORRECT: Use existing migration commands
[migration_command]
```

## Anti-Patterns (NEVER DO THESE)

### Code Anti-Patterns

- **Don't**: [code_anti_pattern_1]
- **Don't**: [code_anti_pattern_2]
- **Don't**: [code_anti_pattern_3]

### Integration Anti-Patterns

- **Don't**: Create new database connections directly
- **Don't**: Bypass existing authentication mechanisms
- **Don't**: Use different error handling patterns
- **Don't**: Create new configuration loading mechanisms

### Testing Anti-Patterns

- **Don't**: [testing_anti_pattern_1]
- **Don't**: [testing_anti_pattern_2]
- **Don't**: [testing_anti_pattern_3]

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

### [primary_framework] Patterns

[framework_specific_integration_patterns]

### [database_system] Patterns

[database_specific_patterns]

### [additional_tech] Patterns

[additional_tech_patterns]

## Emergency Integration Rules

**If unsure about integration:**

1. **Look for existing similar functionality** and copy the pattern
2. **Ask user** for clarification on integration approach
3. **Default to simplest integration** that follows existing patterns
4. **Never break existing functionality** for new features

## Context for Complex Integration

### [complex_feature_area]

**Background**: [why_this_exists] **Pattern**: [how_to_integrate] **Constraints**: [what_not_to_do]

### [another_complex_area]

**Background**: [background_context] **Pattern**: [integration_approach] **Constraints**: [constraints_and_limits]

---

**Generated**: [timestamp] **Based on**: ITERATION.md patterns + codebase analysis **Purpose**: Enable Claude Code to integrate correctly with existing system