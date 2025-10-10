# Auto-Save Development State Before Compression

**Context**: Automatic state capture triggered by context compression for session SESSION_ID_PLACEHOLDER

**Compression Reason**: COMPRESSION_REASON_PLACEHOLDER

## ⚠️ CRITICAL: CAPTURE CONVERSATION ESSENCE ⚠️

**🛑 PRESERVE KEY DECISIONS AND DISCOVERIES**
**🛑 MAINTAIN THREAD OF CONVERSATION**
**🛑 ENABLE SEAMLESS RESUMPTION**
**🛑 ADAPT TO CONTEXT TYPE**

You MUST immediately save your current development state using the comprehensive structure below. This will preserve all progress and enable seamless resumption after compression.

## Save Location

Create this file: `PROJECT_ROOT_PLACEHOLDER/.workflow/state/TIMESTAMP_SHORT_PLACEHOLDER.md`

## Required State Structure

Use this EXACT structure:

```markdown
# State - TIMESTAMP_PLACEHOLDER

## Context
**Task**: [task_n_name_if_in_a_task_or_exploration_discussion_etc]
**Command**: [active_command_if_any_plan_task_plan_test_etc]
**What**: [one_line_summary_of_current_work]
**Where**: [current_phase_progress_location_in_process]

## Key Conversation Points

### Technical Discoveries
- [unexpected_behavior_found]
- [integration_requirement_discovered]
- [constraint_identified]
- [pattern_that_works]
- [api_quirk_found]

### User Clarifications
- [requirement_clarified]
- [constraint_confirmed]
- [preference_stated]

### Breakthroughs
- [aha_moment_that_unlocked_progress]
- [solution_to_blocker]
- [simpler_approach_discovered]

## Decisions Made

- **Decision**: [what_was_decided]
  **Rationale**: [why_this_choice_over_alternatives]
  **Impact**: [what_this_affects]

- **Decision**: [another_decision]
  **Rationale**: [reasoning_behind_it]
  **Impact**: [consequences]

## Open Questions (Critical to Resolve)

### Blocking Questions
- [question_preventing_progress]
- [uncertainty_about_approach]

### Research Needed
- [thing_to_investigate]
- [assumption_to_validate]

### Design Questions
- [architectural_uncertainty]
- [integration_approach_question]

## What's Working

### Completed & Verified
- [component_built_and_tested]
- [feature_working_correctly]

### Code/Patterns That Work
```[language]
# This solved [problem]
[actual_code_that_works]
```

### Confirmed Approaches
- [approach_thats_proven_successful]
- [pattern_to_reuse]

## Next Actions
- [ ] [immediate_next_step]
- [ ] [following_action]
- [ ] [subsequent_task]

## Files Touched
- [path/to/file.py] - [what_was_done_changed]
- [path/to/test.py] - [status_complete_in_progress_started]
- [path/to/config.json] - [what_was_modified]

## Blockers
- [whats_preventing_progress]
- [whats_needed_to_unblock]
```

## Additional Guidance

Based on your current context, include:

- **If testing**: Include test patterns that work, bugs found, coverage areas
- **If planning**: Include scope decisions, architecture choices, task breakdowns
- **If exploring**: Include experiments tried, promising directions
- **If stuck**: Include what's been attempted, error messages, hypotheses

## Success Criteria for State Capture

Your state capture MUST enable:

- [ ] Clear understanding of conversation flow
- [ ] Decisions preserved with reasoning
- [ ] Specific next actions identified
- [ ] Technical discoveries documented
- [ ] Easy to resume from any point

## Example Template Usage

Here's how to fill the template:

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
```

**Technical Discoveries**:
- Frontend sets 'auth_token' cookie name
- WebSocket expects 'auth' event after connection
- Session middleware must run before auth middleware
````

## Context-Specific Adaptations

### For Task Work
Include task number, current progress against task goals, blockers specific to task completion.

### For Exploration
Include ideas explored, promising directions, experiments tried, insights gained.

### For Planning
Include architectural decisions, scope choices, trade-offs considered, resource estimates.

### For Debugging
Include symptoms observed, hypotheses tested, solutions attempted, current theory.

### For Integration
Include dependencies discovered, interface contracts, timing requirements, error scenarios.

## Compression Context

- **Session**: SESSION_ID_PLACEHOLDER
- **Project**: PROJECT_NAME_PLACEHOLDER
- **Root**: PROJECT_ROOT_PLACEHOLDER
- **Reason**: COMPRESSION_REASON_PLACEHOLDER
- **Timestamp**: TIMESTAMP_PLACEHOLDER

## EXECUTE NOW

Create the state file immediately using the structure above. Capture all conversation context, decisions, progress, and next steps. This is critical for resuming work after compression.