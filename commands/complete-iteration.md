# Synthesize iteration learnings, update statuses, and archive

**Variables**: `$VARS` are environment variables (expand them), `{vars}` are runtime values (find/calculate them), `[vars]` are template placeholders (substitute them).

**Key Paths**:
- `{project-root}` - Current project directory (find by locating .workflow/ directory)
- `$WORKFLOW_PROJECTS` - Obsidian projects directory (from environment)
- `$WORKFLOW_DEV` - Development projects root (from environment)

## ⚠️ CRITICAL: ITERATION CLOSURE AND KNOWLEDGE SYNTHESIS ⚠️

**🛑 VERIFY ALL TASKS COMPLETE BEFORE ARCHIVAL** **🛑 SYNTHESIZE KNOWLEDGE FROM COMPLETED TASKS** **🛑 PRESERVE CONTEXT FOR FUTURE ITERATIONS** **🛑 CLEAN HANDOFF TO NEXT ITERATION PLANNING**

## ITERATION COMPLETION SEQUENCE

### PHASE 1: ITERATION VALIDATION (REQUIRED)

**CHECKPOINT 1: Task Completion Verification**

```
REQUIRED: Verify iteration is ready for completion:
- READ {project-root}/.workflow/artifacts/ITERATION.md
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

**CHECKPOINT 2: Synthesize and Create Iteration Summary**

```
REQUIRED: Read everything and create comprehensive iteration summary:

READ AND SYNTHESIZE:
- SCAN all ✅ Complete tasks in ITERATION.md 
  - EXTRACT key decisions documented in each task
  - COLLECT lessons learned from individual task implementations
  - IDENTIFY architectural patterns established across tasks
- READ all files in {project-root}/.workflow/discoveries/
  - EXTRACT bug fixes, technical insights, architectural findings
  - NOTE patterns and solutions discovered during development
  - IDENTIFY key learnings that weren't captured in tasks

SYNTHESIS FOCUS:
- What technical decisions shaped this iteration?
- What lessons emerged that should inform future work?
- What patterns or components were established for reuse?
- What bugs/issues were discovered and fixed?
- What worked well vs what could be improved?

CREATE SUMMARY FILE:
- DETERMINE iteration number from {project-root}/.workflow/archives/ directory  
- WRITE to {project-root}/.workflow/archives/ITERATION_{N}_SUMMARY.md

SUMMARY CONTENT:
=====================================
ITERATION N SUMMARY  
=====================================

**Delivered**: [working software and key capabilities shipped]
**Architecture**: [major technical decisions and patterns established]
**Lessons**: [key insights from tasks and discoveries that should inform future iterations]
**Reusable**: [components, patterns, or approaches ready for reuse]
**Next**: [logical next steps or iteration focus areas]

VERIFICATION: Single summary file created with insights from both tasks and discoveries
```

### PHASE 3: ARCHIVAL AND CLEANUP (REQUIRED)

**CHECKPOINT 4: Iteration Archival**

```
REQUIRED: Archive completed iteration properly:
- CREATE {project-root}/.workflow/archives/iteration-N/ directory
- COPY ITERATION.md to archives/iteration-N/
- COPY TASKS.md to archives/iteration-N/
- MOVE ITERATION_{N}_SUMMARY.md to archives/iteration-N/
- MOVE {project-root}/.workflow/discoveries/* to archives/iteration-N/discoveries/
- PRESERVE any critical artifacts or documentation

ARCHIVAL STRUCTURE:
{project-root}/.workflow/archives/iteration-N/
├── ITERATION.md (completed with all task details)
├── TASKS.md (completed tasks)
├── ITERATION_{N}_SUMMARY.md (synthesized insights and lessons)
└── discoveries/ (raw discovery files from this iteration)

VERIFICATION: Iteration properly archived with summary and discoveries
```

**CHECKPOINT 5: Move Completed Items to completed.md**

```
REQUIRED: Move active items to completed tracking:
- READ $WORKFLOW_PROJECTS/{projectname}/active.md
- READ $WORKFLOW_PROJECTS/{projectname}/completed.md (create if not exists)
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

**CHECKPOINT 6: Workspace Preparation**

```
REQUIRED: Prepare clean workspace for next iteration:

ARTIFACTS CLEANUP ({project-root}/.workflow/artifacts/):
- REMOVE iteration-specific files:
  - ITERATION.md (now archived)
  - TASKS.md (now archived)
  - Any subagent artifacts (ARCHITECTURE-*.md, IMPLEMENTATION-*.md, etc.)
- PRESERVE project-level files:
  - IDEA.md (project vision)
  - APP_CONTEXT.md (if exists - project patterns)
  - Any other project-wide documentation

STATE CLEANUP ({project-root}/.workflow/state/):
- REMOVE all saved state files (task-*.md, etc.)
- These are iteration-specific and no longer needed

CLEANUP COMMANDS:
- rm {project-root}/.workflow/artifacts/ITERATION.md
- rm {project-root}/.workflow/artifacts/TASKS.md
- rm {project-root}/.workflow/artifacts/subagents/*.md (if directory exists)
- rm {project-root}/.workflow/state/*.md (if any exist)

VERIFICATION: Only IDEA.md and APP_CONTEXT.md remain in artifacts
```

### PHASE 4: TRANSITION GUIDANCE (REQUIRED)

**CHECKPOINT 7: Next Iteration Preparation**

```
REQUIRED: Provide clear guidance for next iteration:
- ASSESS overall project progress toward goals
- RECOMMEND focus areas for next iteration based on lessons learned
- SUGGEST logical feature progression from completed work
- ADVISE on architecture evolution opportunities

TRANSITION GUIDANCE:
=====================================
ITERATION N COMPLETED ✅
=====================================

Progress: [X iterations complete, Y% toward project goals]
Foundation: [key capabilities now available for building upon]
Recommendations: [suggested focus for next iteration]
Opportunities: [areas for improvement or expansion]

Ready for /plan-iteration to begin next iteration planning.
```

## ENFORCEMENT MECHANISMS

### Completion Validation

- No archival without verifying iteration scope completion
- Success criteria must be demonstrably met
- Critical tasks must be marked complete with evidence

### Knowledge Preservation

- Task-level insights must be synthesized comprehensively
- Lessons learned captured for future iteration planning
- Architectural decisions documented for consistency

### Clean Transitions

- Workspace prepared for fresh iteration start
- Archive maintains complete context for future reference
- Clear guidance provided for next iteration focus

## FAILURE MODES & RECOVERY

**If tasks incomplete:** Recommend completing critical tasks before archival **If success criteria unmet:** Identify gaps and suggest resolution **If knowledge synthesis insufficient:** Request more detailed task documentation **If archival fails:** Ensure proper directory structure and permissions

## SUCCESS CRITERIA

Iteration properly completed when:

- [ ] All critical tasks verified as ✅ Complete
- [ ] Iteration success criteria demonstrably met
- [ ] Task-level decisions and lessons synthesized
- [ ] Comprehensive iteration summary generated
- [ ] Iteration properly archived for future reference
- [ ] Clean workspace prepared for next iteration
- [ ] Clear guidance provided for next iteration planning