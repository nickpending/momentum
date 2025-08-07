# Generate system integration context for LLM understanding

## Purpose

Generate `APP_CONTEXT.md` by populating the v3 template with project-specific integration patterns.

## ⚠️ CRITICAL: SMART POPULATION OF TEMPLATE ⚠️

**🛑 ANALYZE CODEBASE FOR ACTUAL PATTERNS**  
**🛑 EXTRACT REAL CODE EXAMPLES**  
**🛑 IDENTIFY ACTUAL ANTI-PATTERNS**

## ⚠️ CRITICAL: WRITE FOR CLAUDE CODE, NOT HUMANS ⚠️

**🛑 FOCUS ON LLM INTEGRATION PATTERNS**  
**🛑 NO HUMAN DOCUMENTATION FLUFF**  
**🛑 ACTIONABLE CONSTRAINTS AND EXAMPLES**

---

## Step 1: Load Context and Template

1. **READ** `.workflow/templates/APP_CONTEXT_TEMPLATE.md` - LLM-optimized template structure
2. **READ** `.workflow/artifacts/ITERATION.md` (if exists) - embedded patterns and standards
3. **READ** `.workflow/artifacts/IDEA.md` - project tech stack and purpose
4. **READ** existing `.workflow/artifacts/APP_CONTEXT.md` (if exists) - current context to update/replace

## Step 2: Analyze Codebase for Integration Patterns

### Database Pattern Analysis

**SCAN** for database usage patterns:

- **Connection management** - how database sessions/connections are created
- **Query patterns** - ORM usage, raw SQL, async/sync patterns
- **Transaction handling** - how transactions are managed
- **Migration patterns** - how schema changes are handled

**EXTRACT** actual code examples of correct patterns

### API Pattern Analysis

**SCAN** for API patterns:

- **Route definition** - how endpoints are structured and organized
- **Request/response handling** - validation, serialization patterns
- **Authentication** - how auth is integrated into endpoints
- **Error responses** - how errors are formatted and returned

**EXTRACT** actual working examples from codebase

### Configuration Pattern Analysis

**SCAN** for config patterns:

- **Environment variables** - how settings are loaded and accessed
- **Secrets management** - how sensitive data is handled
- **Config validation** - how configuration is validated at startup

**EXTRACT** real configuration examples

### Testing Pattern Analysis

**SCAN** for testing patterns:

- **Test structure** - how tests are organized and named
- **Database testing** - how database tests are set up and torn down
- **Fixtures/mocking** - what gets mocked vs real testing
- **API testing** - how endpoints are tested

**EXTRACT** actual test examples

## Step 3: Identify Anti-Patterns

### Code Anti-Pattern Detection

**ANALYZE** codebase for things that should NOT be copied:

- **Inconsistent patterns** - places where project deviates from its own standards
- **Legacy code** - older patterns that shouldn't be replicated
- **Performance issues** - inefficient patterns to avoid
- **Security issues** - potentially problematic patterns

### Integration Anti-Pattern Detection

**IDENTIFY** integration mistakes to avoid:

- **Direct database connections** instead of using established session management
- **Inconsistent authentication** patterns
- **Non-standard error handling**
- **Configuration anti-patterns**

## Step 4: Smart Template Population

### Basic Information

- `{PROJECT_NAME}` - Extract from package.json, pyproject.toml, or directory name
- `{APPLICATION_TYPE}` - Infer from codebase: web app, API, CLI tool, library, etc.
- `{TECH_STACK_WITH_VERSIONS}` - Detect from dependencies and imports
- `{CORE_PURPOSE_ONE_LINE}` - Extract from IDEA.md or README.md

### Pattern Examples Population

**POPULATE** template sections with real code:

- `{DATABASE_PATTERN_EXAMPLE}` - actual database access code from project
- `{API_ROUTE_PATTERN}` - real API route definition from codebase
- `{ERROR_HANDLING_PATTERN}` - actual error handling code
- `{TEST_PATTERN_EXAMPLE}` - real test code from project
- `{CONFIG_PATTERN_EXAMPLE}` - actual configuration access code

### Anti-Pattern Population

**POPULATE** anti-pattern sections:

- `{CODE_ANTI_PATTERN_1}` - actual problematic patterns found or to avoid
- `{TESTING_ANTI_PATTERN_1}` - testing approaches that break project standards
- `{CONFIG_ANTI_PATTERN}` - configuration approaches to avoid

### Embedded Context Integration

**IF** ITERATION.md exists:

- Extract and embed design principles
- Include tech stack standards and patterns
- Integrate security and quality requirements
- Apply testing and integration constraints

## Step 5: Tech Stack Specific Population

### Framework-Specific Patterns

**BASED ON** detected tech stack, populate:

- **FastAPI**: Dependency injection, async patterns, Pydantic models
- **Flask**: Application factory, blueprint patterns, context management
- **Django**: Model patterns, view patterns, middleware integration
- **React**: Component patterns, hook usage, state management
- **Express**: Route patterns, middleware, error handling

### Database-Specific Patterns

**BASED ON** detected database:

- **PostgreSQL**: Connection pooling, async queries, migration patterns
- **MongoDB**: Connection patterns, query patterns, schema validation
- **SQLite**: File handling, transaction patterns, testing setup

## Step 6: Generate APP_CONTEXT.md

### Create Populated Context File

1. **POPULATE** all template variables with actual project content
2. **ENSURE** all code examples are real and working
3. **VERIFY** anti-patterns are actually problematic for this project
4. **VALIDATE** that patterns match current codebase state

### Quality Validation

- **Code examples work** - can be copy-pasted and run
- **Patterns are consistent** - match project's actual conventions
- **Anti-patterns are real** - actually cause problems if followed
- **Integration guidance is specific** - not generic advice

## Step 7: Output Results

```
=====================================
APP_CONTEXT.md GENERATED - LLM OPTIMIZED
=====================================

✅ Project Type: {APPLICATION_TYPE}
✅ Tech Stack: {DETECTED_TECH_STACK}
✅ Integration Patterns: {PATTERN_COUNT} extracted from codebase
✅ Code Examples: {EXAMPLE_COUNT} real working examples
✅ Anti-Patterns: {ANTI_PATTERN_COUNT} problematic patterns identified
✅ Template Population: All variables populated with project-specific content

📁 Created: APP_CONTEXT.md
🎯 Optimized for: Claude Code integration decisions
🔍 Based on: Actual codebase analysis + embedded iteration context
⚠️  Anti-patterns: Real problematic patterns to avoid

Ready for Claude Code to use for intelligent integration.
```

---

## Error Handling

**IF** template not found:

- **CREATE** basic APP_CONTEXT.md structure from scratch
- **WARN** about missing template and suggest creating one

**IF** no clear patterns found:

- **ASK** user for examples of preferred patterns
- **CREATE** basic structure with placeholders for user to fill
- **SUGGEST** reviewing codebase for consistency

**IF** tech stack unclear:

- **ASK** user to clarify primary technologies
- **DEFAULT** to common patterns for detected languages/frameworks

**IF** existing APP_CONTEXT.md exists:

- **ASK** whether to update, replace, or merge content
- **PRESERVE** user-customized sections where possible

---

## Success Criteria

**Accurate Pattern Extraction:**

- Code examples work with actual project
- Integration patterns match current codebase conventions
- Anti-patterns are genuinely problematic for this project

**LLM Integration Value:**

- Claude Code can make good integration decisions without asking questions
- Common integration scenarios have clear, specific guidance
- Security and performance patterns are embedded and actionable

**Template Population Quality:**

- All variables replaced with meaningful, project-specific content
- No generic placeholders or boilerplate content remains
- Generated context reflects actual project state and patterns