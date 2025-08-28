# TASKS - Generated [DATE]

## Overview

**Iteration Goal:** [Brief description from ITERATION.md] **Total Features:** [X]  
**Total Tasks:** [Y] **Current Status:** [X/Y tasks complete]

## Task Completion Tracking

### Feature 1: [Feature Name]

- [ ] 1.1 - Not started
- [ ] 1.2 - Not started
- [ ] 1.3 - Not started

### Feature 2: [Feature Name]

- [ ] 2.1 - Not started
- [ ] 2.2 - Not started

## Detailed Task Breakdown

## Feature 1: [Full Feature Name from ITERATION.md]

### 1.1: [Specific Task Name]

- **Status:** 📋 Not Started
- **Files:** `[exact file paths to create/modify]`
- **Architecture Context:**
  - Patterns: [Existing patterns to follow, conventions to maintain]
  - State: [Where state lives, how it flows, what changes]
  - Data: [Schema, format, source of truth, validation rules]
  - Integration: [APIs used, services called, events handled]
  - Constraints: [Performance needs, security requirements, limits]
- **Error Scenarios:** [Specific failures to handle gracefully]
- **Deliverable:** [What this task produces - be specific]
- **Demo:** `[exact command to verify this works]`
- **Dependencies:** None OR [list task numbers like 1.2, 1.3]
- **Validation:** [How to verify this works correctly]
- **Notes:** [Any specific implementation notes]

**Discovered During Implementation:**
- **Invariants (from iteration planning):**
  - [Mapped invariants from ITERATION.md that this task could affect]
- **Additional Invariants (found during building):**
  - [None discovered yet]
- **Failure Modes:**
  - [None encountered yet]
- **Risk Assessment:**
  - HIGH: [If this task affects HIGH risk areas]
  - LOW: [If this task is LOW risk]

### 1.2: [Specific Task Name]

- **Status:** 📋 Not Started
- **Files:** `[exact file paths]`
- **Architecture Context:**
  - Patterns: [Existing patterns to follow, conventions to maintain]
  - State: [Where state lives, how it flows, what changes]
  - Data: [Schema, format, source of truth, validation rules]
  - Integration: [APIs used, services called, events handled]
  - Constraints: [Performance needs, security requirements, limits]
- **Error Scenarios:** [Specific failures to handle gracefully]
- **Deliverable:** [What this produces]
- **Demo:** `[verification command]`
- **Dependencies:** 1.1
- **Validation:** [How to verify this works correctly]
- **Notes:** [Any notes]

### 1.3: [Specific Task Name]

- **Status:** 📋 Not Started
- **Files:** `[exact file paths]`
- **Architecture Context:**
  - Patterns: [Existing patterns to follow, conventions to maintain]
  - State: [Where state lives, how it flows, what changes]
  - Data: [Schema, format, source of truth, validation rules]
  - Integration: [APIs used, services called, events handled]
  - Constraints: [Performance needs, security requirements, limits]
- **Error Scenarios:** [Specific failures to handle gracefully]
- **Deliverable:** [What this produces]
- **Demo:** `[verification command]`
- **Dependencies:** 1.1, 1.2
- **Validation:** [How to verify this works correctly]
- **Notes:** [Any notes]

## Feature 2: [Full Feature Name from ITERATION.md]

### 2.1: [Specific Task Name]

- **Status:** 📋 Not Started
- **Files:** `[exact file paths]`
- **Architecture Context:**
  - Patterns: [Existing patterns to follow, conventions to maintain]
  - State: [Where state lives, how it flows, what changes]
  - Data: [Schema, format, source of truth, validation rules]
  - Integration: [APIs used, services called, events handled]
  - Constraints: [Performance needs, security requirements, limits]
- **Error Scenarios:** [Specific failures to handle gracefully]
- **Deliverable:** [What this produces]
- **Demo:** `[verification command]`
- **Dependencies:** None
- **Validation:** [How to verify this works correctly]
- **Notes:** [Any notes]

### 2.2: [Specific Task Name]

- **Status:** 📋 Not Started
- **Files:** `[exact file paths]`
- **Architecture Context:**
  - Patterns: [Existing patterns to follow, conventions to maintain]
  - State: [Where state lives, how it flows, what changes]
  - Data: [Schema, format, source of truth, validation rules]
  - Integration: [APIs used, services called, events handled]
  - Constraints: [Performance needs, security requirements, limits]
- **Error Scenarios:** [Specific failures to handle gracefully]
- **Deliverable:** [What this produces]
- **Demo:** `[verification command]`
- **Dependencies:** 2.1
- **Validation:** [How to verify this works correctly]
- **Notes:** [Any notes]

## Implementation Order

Suggested sequence based on dependencies:

1. Start with: 1.1, 2.1 (no dependencies)
2. Then: 1.2 (depends on 1.1)
3. Then: 1.3 (depends on 1.1, 1.2), 2.2 (depends on 2.1)
4. Continue following dependency chain...

## Task Status Legend

- 📋 Not Started
- 🔄 In Progress
- ✅ Complete
- ❌ Blocked
- 🔍 In Review

## Discovered Tasks (Added During Implementation)

[This section is added when tasks are discovered during implementation using /add-task]

### [Prefix]1: [Description of discovered issue/refactor]

**Discovery Context:**
- **Found while:** [Working on task X.Y / Running audit / Testing]
- **Root cause:** [Technical explanation]
- **Impact:** [What breaks without this]
- **Why now:** [Why can't wait for next iteration]

#### [Prefix]1.1: [Specific task name]

- **Status:** 📋 Not Started
- **Files:** `[exact file paths]`
- **Architecture Context:**
  - Patterns: [Patterns to follow]
  - State: [State changes]
  - Data: [Data implications]
  - Integration: [Component effects]
  - Constraints: [Requirements]
- **Error Scenarios:** [Failure modes]
- **Deliverable:** [What this produces]
- **Demo:** `[verification command]`
- **Dependencies:** [Task dependencies]
- **Validation:** [How to verify]
- **Notes:** [Implementation notes]

**Discovered During Implementation:**
- **Invariants (from iteration planning):**
  - [Relevant invariants]
- **Additional Invariants (found during building):**
  - [New discoveries]
- **Risk Assessment:**
  - HIGH: [If applicable]
  - LOW: [If applicable]

## Notes

[Any general notes about the task breakdown, special considerations, or warnings]

### Example of Discovered During Implementation (filled in during /decompose-iteration and /plan-task):
```
**Discovered During Implementation:**
- **Invariants (from iteration planning):**
  - "XP >= 0": Prevents progression breaking (mapped during decompose)
  - "Items unique": Prevents economy break (mapped during decompose)
- **Additional Invariants (found during building):**
  - "Death animation completes": Found when incomplete animation broke UI state
  - "Respawn location valid": Found when invalid coords crashed client
- **Failure Modes:**
  - "DB disconnect during save": Must queue or retry cleanly, not lose data
  - "Concurrent deaths": Must handle atomically, prevent duplication
- **Risk Assessment:**
  - HIGH: Item duplication (breaks game economy), XP calculation (breaks progression)
  - LOW: Message formatting (just looks wrong), Animation timing (cosmetic)
```

---

Generated by /decompose-iteration from ITERATION.md