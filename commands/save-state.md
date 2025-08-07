# Capture discoveries, decisions, and progress for resumption

## Usage

```bash
/save-state                    # Save current context
/save-state "switching focus"  # Save with reason
```

## ⚠️ CRITICAL: CAPTURE CONVERSATION ESSENCE ⚠️

**🛑 PRESERVE KEY DECISIONS AND DISCOVERIES**  
**🛑 MAINTAIN THREAD OF CONVERSATION**  
**🛑 ENABLE SEAMLESS RESUMPTION**  
**🛑 ADAPT TO CONTEXT TYPE**

## Comprehensive State Structure

```markdown
# State - {timestamp}

## Context
**Task**: {Task N: name if in a task, or "Exploration" / "Discussion" / etc}
**Command**: {active command if any: /plan-task, /plan-test, etc}
**What**: {one-line summary of current work}
**Where**: {current phase/progress/location in process}

## Discoveries & Findings
### Technical Discoveries
- {unexpected behavior found}
- {integration requirement discovered}
- {constraint identified}
- {pattern that works}
- {API quirk found}

### User Clarifications
- {requirement clarified}
- {constraint confirmed}
- {preference stated}

### Breakthroughs
- {"aha" moment that unlocked progress}
- {solution to blocker}
- {simpler approach discovered}

## Decisions Made
- **Decision**: {what was decided}
  **Rationale**: {why this choice over alternatives}
  **Impact**: {what this affects}

- **Decision**: {another decision}
  **Rationale**: {reasoning behind it}
  **Impact**: {consequences}

## Open Questions (Critical to Resolve)
### Blocking Questions
- {question preventing progress}
- {uncertainty about approach}

### Research Needed
- {thing to investigate}
- {assumption to validate}

### Design Questions
- {architectural uncertainty}
- {integration approach question}

## What's Working
### Completed & Verified
- {component built and tested}
- {feature working correctly}

### Code/Patterns That Work
```{language}
# This solved {problem}
{actual code that works}
```

### Confirmed Approaches
- {approach that's proven successful}
- {pattern to reuse}

## Next Actions
- [ ] {immediate next step}
- [ ] {following action}
- [ ] {subsequent task}

## Files Touched
- {path/to/file.py} - {what was done/changed}
- {path/to/test.py} - {status: complete/in-progress/started}
- {path/to/config.json} - {what was modified}

## Blockers
- {what's preventing progress}
- {what's needed to unblock}
```

## Additional Guidance

- If testing: Include test patterns that work, bugs found, coverage areas
- If planning: Include scope decisions, architecture choices, task breakdowns  
- If exploring: Include experiments tried, promising directions
- If stuck: Include what's been attempted, error messages, hypotheses


## State File Naming

```
.workflow/state/
├── task-N-{timestamp}.md    # When working on a specific task
└── state-{timestamp}.md     # General exploration/discussion
```

Where timestamp is `YYYYMMDD-HHMM`

## Success Criteria

Good state capture enables:

- [ ] Clear understanding of conversation flow
- [ ] Decisions preserved with reasoning
- [ ] Specific next actions identified
- [ ] Technical discoveries documented
- [ ] Easy to resume from any point

## Example Output

````markdown
# State - 2025-01-15-1430

## Context
**Command**: /plan-task 3
**What**: Building WebSocket authentication middleware
**Where**: Implementation phase - core auth working, adding token refresh

## Key Conversation Points
- Discovered frontend expects token in cookie, not header
- User clarified 15-min token expiry is firm requirement
- Breakthrough: can reuse existing session middleware
- Integration point: must emit 'auth' event on connection
- Decided against localStorage due to XSS concerns

## Decisions Made
- **Decision**: Use cookie-based tokens instead of headers
  **Rationale**: Frontend WebSocket client can't set custom headers
  
- **Decision**: Implement token refresh on reconnect
  **Rationale**: Better UX than forcing re-login every 15 min

## Open Questions
- Should refresh tokens be stored in Redis or database?
- How to handle multiple device sessions?
- Rate limiting strategy for refresh endpoint?

## Next Actions
- [ ] Modify auth middleware to check cookies
- [ ] Add refresh token generation to login
- [ ] Create /auth/refresh endpoint
- [ ] Test with frontend WebSocket client

## Files Touched
- auth_service.py - JWT generation complete
- middleware/auth.py - In progress: adding cookie support (line 45)
- api/auth.py - Login endpoint done
- tests/test_auth.py - Basic tests written

## Blockers
- Need to understand frontend's reconnection strategy
- Unsure about security implications of cookie-based tokens

## Development Progress

**Task**: Task 3: WebSocket Authentication

**Built So Far**:
- JWT token generation in auth_service.py
- Basic auth middleware checking headers
- Login endpoint returning tokens

**Currently Building**:
- Cookie-based token validation
- Working in middleware/auth.py line 45

**Working Code**:
```python
# This handles both header and cookie tokens
def extract_token(request):
    if auth_header := request.headers.get('Authorization'):
        return auth_header.replace('Bearer ', '')
    return request.cookies.get('auth_token')
````

**Technical Discoveries**:

- Frontend sets 'auth_token' cookie name
- WebSocket expects 'auth' event after connection
- Session middleware must run before auth middleware