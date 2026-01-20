# Commits

## Format

```
type(scope): description
```

## Rules

- Under 72 characters
- Describe what the commit does, not what you did
- Use imperative mood: "Add feature" not "Added feature"

## Types

| Type | Purpose |
|------|---------|
| **feat** | New feature |
| **fix** | Bug fix |
| **refactor** | Code change that neither fixes nor adds |
| **test** | Adding or updating tests |
| **docs** | Documentation only |
| **chore** | Maintenance, dependencies, config |

## Examples

```
feat(hooks): add CAPTURE reminder to post-tool-use hook
fix(auth): handle expired tokens gracefully
refactor(prompts): extract output format to separate file
test(api): add integration tests for webhook endpoint
docs(readme): update installation instructions
chore(deps): bump @voidwire/lore to 1.2.0
```

## Scope

Use the component or area being changed:
- `hooks`, `prompts`, `commands`, `skills`
- `auth`, `api`, `db`, `ui`
- Feature name or module name
