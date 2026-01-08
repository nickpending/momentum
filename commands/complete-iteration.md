---
allowed-tools: Read, Write, Edit, Bash, Glob
description: Synthesize iteration learnings, update statuses, and archive
---

@../resources/command-rules.md

# Synthesize iteration learnings, update statuses, and archive

## ⚠️ CRITICAL: ITERATION CLOSURE AND KNOWLEDGE SYNTHESIS

**REQUIRED:**
- Verify all tasks complete before archival
- Synthesize knowledge from completed tasks
- Preserve context for future iterations
- Clean handoff to next iteration planning

**NEVER:**
- Archive with incomplete critical tasks
- Skip knowledge synthesis
- Delete artifacts without archiving

## Core Instructions

### PHASE 1: ITERATION VALIDATION (REQUIRED)

**CHECKPOINT 1: Task Completion Verification**

```
REQUIRED: Verify iteration is ready for completion:
- READ `{PROJECT_ROOT}/.workflow/artifacts/ITERATION.md`
- COUNT total tasks vs completed tasks (✅ Complete)
- IDENTIFY any remaining 📋 Planned or 🔄 In Progress tasks
- VERIFY iteration success criteria were met

COMPLETION VALIDATION:
- Are all critical tasks marked ✅ Complete?
- Was working software delivered as planned?
- Do completed tasks enable meaningful system demonstration?
- Were iteration goals achieved?

VERIFICATION: Confirm iteration scope completed and success criteria met
FAILURE MODE: If critical tasks incomplete, suggest completion before archival
```

### PHASE 2: KNOWLEDGE SYNTHESIS (REQUIRED)

**CHECKPOINT 2: Systematic Task-Level Extraction**

```
REQUIRED: Extract structured insights from completed tasks:
- SCAN all ✅ Complete tasks in ITERATION.md
- FOR EACH TASK extract:
  - Implementation decisions made and why
  - Architectural patterns established or followed
  - Blockers encountered and how solved
  - Performance/integration insights discovered
  - What worked well vs what caused friction

STRUCTURED EXTRACTION:
## Task-Level Insights (Internal - Don't Write Yet)

### Implementation Decisions
- Task X.Y: [Decision Made] → [Reasoning] → [Outcome]
- Task X.Z: [Decision Made] → [Reasoning] → [Outcome]

### Architectural Patterns
- Established: [Pattern Name] used in tasks X.Y, X.Z
- Modified: [Existing Pattern] adapted for [Reason] in task X.Y
- Avoided: [Anti-pattern] after discovering [Issue] in task X.Y

### Development Friction
- Blockers: [Issue] in task X.Y solved by [Solution]
- Smooth: [What worked easily] in tasks X.Y, X.Z
- Unexpected: [Surprise finding] during task X.Y implementation

VERIFICATION: Systematic extraction completed for all tasks
```

**CHECKPOINT 3: Systematic Discovery-Level Extraction**

```
REQUIRED: Extract structured insights from discovery files:
- READ all files in `{PROJECT_ROOT}/.workflow/discoveries/`
- FOR EACH DISCOVERY extract:
  - Bug patterns found and root causes
  - Performance insights and optimizations applied
  - Integration learnings and solutions
  - Technical debt identified and addressed
  - Unexpected system behaviors discovered

STRUCTURED EXTRACTION:
## Discovery-Level Insights (Internal - Don't Write Yet)

### Bug Patterns
- [Pattern Name]: Found in [Context] → Root cause: [Cause] → Fixed by: [Solution]
- [Pattern Name]: Found in [Context] → Root cause: [Cause] → Fixed by: [Solution]

### Performance Learnings
- [Insight]: [Measurement/Observation] → [Optimization Applied] → [Result]
- [Bottleneck]: [Where Found] → [Solution] → [Improvement]

### Integration Insights
- [Component A + B]: [Challenge] → [Solution] → [Pattern Established]
- [External Service]: [Behavior Discovered] → [Adaptation Made]

### Technical Debt
- Identified: [Debt Item] → [Impact] → [Mitigation Strategy]
- Resolved: [Previous Debt] → [Solution Applied] → [Benefit Gained]

VERIFICATION: Systematic extraction completed for all discoveries
```

**CHECKPOINT 4: Unified Synthesis into Single Summary**

```
REQUIRED: Synthesize all extracted insights into comprehensive iteration summary:

SYNTHESIS PROCESS:
- COMBINE task-level and discovery-level insights
- IDENTIFY cross-cutting patterns and themes
- DETERMINE what should inform future iterations
- RECOGNIZE architectural evolution and system changes
- ASSESS overall iteration effectiveness

CREATE SUMMARY FILE:
- DETERMINE iteration number from `{PROJECT_ROOT}/.workflow/archives/` directory
- WRITE to `{PROJECT_ROOT}/.workflow/archives/ITERATION_{N}_SUMMARY.md`

COMPREHENSIVE SUMMARY STRUCTURE:
=====================================
ITERATION N SUMMARY
=====================================

**Delivered**: [working software and key capabilities shipped]

**Task Insights**:
- Implementation Decisions: [key decisions that shaped the code]
- Patterns Established: [reusable patterns created for future use]
- Development Friction: [what slowed us down and how we solved it]

**Discovery Insights**:
- Bug Patterns: [systematic issues found and patterns to avoid]
- Performance Learnings: [optimizations discovered and applied]
- Integration Insights: [how components connect and what we learned]
- Technical Debt: [debt identified, resolved, and mitigation strategies]

**Architecture Evolution**: [how the system structure and patterns changed]

**Cross-Cutting Themes**: [patterns that emerged across multiple tasks/discoveries]

**Next**: [logical next steps enabled by this iteration's foundations]

**Methodology Learnings**: [what worked/didn't work in our development approach]

VERIFICATION: Single comprehensive summary created with structured insights from both tasks and discoveries
```

**CHECKPOINT 4.5: Update Project Expertise**

```
Run /update-expertise
```

### PHASE 3: ARCHIVAL AND CLEANUP (REQUIRED)

**CHECKPOINT 5: Iteration Archival**

```
REQUIRED: Archive completed iteration properly:
- CREATE `{PROJECT_ROOT}/.workflow/archives/iteration-N/` directory
- COPY ITERATION.md to `archives/iteration-N/`
- COPY TASKS.md to `archives/iteration-N/`
- MOVE `ITERATION_{N}_SUMMARY.md` to `archives/iteration-N/`
- MOVE `{PROJECT_ROOT}/.workflow/discoveries/*` to `archives/iteration-N/discoveries/`
- PRESERVE any critical artifacts or documentation

ARCHIVAL STRUCTURE:
`{PROJECT_ROOT}/.workflow/archives/iteration-N/`
├── ITERATION.md (completed with all task details)
├── TASKS.md (completed tasks)
├── ITERATION_{N}_SUMMARY.md (synthesized insights and lessons)
└── discoveries/ (raw discovery files from this iteration)

VERIFICATION: Iteration properly archived with summary and discoveries
```

**CHECKPOINT 6: Move Completed Items to completed.md**

```
REQUIRED: Move active items to completed tracking:
- READ `{WORKFLOW_PROJECTS}/{PROJECT_NAME}/active.md`
- READ `{WORKFLOW_PROJECTS}/{PROJECT_NAME}/completed.md` (create if not exists)
- MOVE all checked items from active.md to completed.md
- FORMAT with completion timestamp

COMPLETED.MD FORMAT:
# Completed

## YYYY-MM (current month)
### YYYY-MM-DD (today)
- Task description id::xxxxx captured:: original_date completed:: YYYY-MM-DD HH:MM
- Bug fix id::yyyyy captured:: original_date completed:: YYYY-MM-DD HH:MM

TRACKING:
- Group by month, then date
- Newest dates at top within month
- Include original captured:: date and completed:: timestamp
- Preserve id:: for tracking

VERIFICATION: All completed items moved from active.md to completed.md
```

**CHECKPOINT 7: Workspace Preparation**

```
REQUIRED: Prepare clean workspace for next iteration:

ARTIFACTS CLEANUP (`{PROJECT_ROOT}/.workflow/artifacts/`):
- REMOVE iteration-specific files:
  - ITERATION.md (now archived)
  - TASKS.md (now archived)
  - Any subagent artifacts (ARCHITECTURE-*.md, IMPLEMENTATION-*.md, etc.)
- PRESERVE project-level files:
  - IDEA.md (project vision)
  - PROJECT_SUMMARY.md (lightweight project context)
  - Any other project-wide documentation

STATE CLEANUP (`{PROJECT_ROOT}/.workflow/state/`):
- REMOVE all saved state files (task-*.md, etc.)
- These are iteration-specific and no longer needed

CLEANUP COMMANDS:
- `rm ${PROJECT_ROOT}/.workflow/artifacts/ITERATION.md`
- `rm ${PROJECT_ROOT}/.workflow/artifacts/TASKS.md`
- `rm ${PROJECT_ROOT}/.workflow/artifacts/subagents/*.md` (if directory exists)
- `rm ${PROJECT_ROOT}/.workflow/state/*.md` (if any exist)

VERIFICATION: Only IDEA.md and PROJECT_SUMMARY.md remain in artifacts
```

**CHECKPOINT 8: Update Project Summary**

```
REQUIRED: Run /update-project-summary to refresh PROJECT_SUMMARY.md after archival
```

### PHASE 4: TRANSITION GUIDANCE (REQUIRED)

**CHECKPOINT 9: Next Iteration Preparation**

Provide transition guidance using standard output format:

   ▸ Overall project progress toward goals
   ▸ Key capabilities now available as foundation
   ▸ Recommended focus for next iteration
   ▸ Opportunities for improvement or expansion

Suggest `/plan-iteration` to begin next iteration planning.


## Error Handling

**If tasks incomplete:**
- Recommend completing critical tasks before archival
- List specific incomplete tasks
- Don't proceed with archival

**If success criteria unmet:**
- Identify gaps and suggest resolution
- Review iteration goals
- Provide corrective steps

**If knowledge synthesis insufficient:**
- Request more detailed task documentation
- Review discovery files for missing insights
- Gather additional context before archival

**If archival fails:**
- Ensure proper directory structure and permissions
- Check disk space availability
- Verify write access to archives directory

## Success Criteria

Iteration properly completed when:

- [ ] All critical tasks verified as ✅ Complete
- [ ] Iteration success criteria demonstrably met
- [ ] Task-level decisions and lessons synthesized
- [ ] Comprehensive iteration summary generated
- [ ] Iteration properly archived for future reference
- [ ] Clean workspace prepared for next iteration
- [ ] Clear guidance provided for next iteration planning

## Notes

**Completion Validation:**
- No archival without verifying iteration scope completion
- Success criteria must be demonstrably met
- Critical tasks must be marked complete with evidence

**Knowledge Preservation:**
- Task-level insights must be synthesized comprehensively
- Lessons learned captured for future iteration planning
- Architectural decisions documented for consistency

**Clean Transitions:**
- Workspace prepared for fresh iteration start
- Archive maintains complete context for future reference
- Clear guidance provided for next iteration focus