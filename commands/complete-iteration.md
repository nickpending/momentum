# Synthesize iteration learnings, update statuses, and archive

## ⚠️ CRITICAL: ITERATION CLOSURE AND KNOWLEDGE SYNTHESIS ⚠️

**🛑 VERIFY ALL TASKS COMPLETE BEFORE ARCHIVAL** **🛑 SYNTHESIZE KNOWLEDGE FROM COMPLETED TASKS** **🛑 PRESERVE CONTEXT FOR FUTURE ITERATIONS** **🛑 CLEAN HANDOFF TO NEXT ITERATION PLANNING**

## ITERATION COMPLETION SEQUENCE

### PHASE 1: ITERATION VALIDATION (REQUIRED)

**CHECKPOINT 1: Task Completion Verification**

```
REQUIRED: Verify iteration is ready for completion:
- READ .workflow/artifacts/ITERATION.md
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

**CHECKPOINT 2: Extract Task-Level Insights**

```
REQUIRED: Synthesize decisions and lessons from all completed tasks:
- SCAN all ✅ Complete tasks in ITERATION.md
- EXTRACT key decisions documented in each task
- COLLECT lessons learned from individual task implementations
- IDENTIFY architectural patterns established across tasks

SYNTHESIS FOCUS:
- What technical decisions shaped this iteration?
- What lessons emerged that should inform future work?
- What patterns or components were established for reuse?
- What worked well vs what could be improved?

VERIFICATION: Comprehensive synthesis of task-level knowledge captured
```

**CHECKPOINT 3: Iteration Summary Generation**

```
REQUIRED: Create iteration summary with synthesized insights:
- SUMMARIZE what working software was delivered
- DOCUMENT key architectural decisions made
- CAPTURE lessons learned for future iterations
- IDENTIFY reusable patterns and components created

SUMMARY STRUCTURE:
=====================================
ITERATION N SUMMARY
=====================================

**Delivered**: [working software and key capabilities shipped]
**Architecture**: [major technical decisions and patterns established]
**Lessons**: [key insights that should inform future iterations]
**Reusable**: [components, patterns, or approaches ready for reuse]
**Next**: [logical next steps or iteration focus areas]

VERIFICATION: Clear, actionable summary ready for archival and future reference
```

### PHASE 3: ARCHIVAL AND CLEANUP (REQUIRED)

**CHECKPOINT 4: Iteration Archival**

```
REQUIRED: Archive completed iteration properly:
- CREATE .workflow/archives/iteration-N/ directory
- COPY ITERATION.md to archives with completion summary
- PRESERVE any critical artifacts or documentation
- MAINTAIN clean archive structure for future reference

ARCHIVAL STRUCTURE:
.workflow/archives/iteration-N/
├── ITERATION.md (completed with all task details)
├── SUMMARY.md (synthesized insights and lessons)
└── artifacts/ (any critical files or documentation)

VERIFICATION: Iteration properly archived and accessible for future reference
```

**CHECKPOINT 5: Workspace Preparation**

```
REQUIRED: Prepare clean workspace for next iteration:
- CLEAR any temporary state or work-in-progress artifacts
- RESET workspace for fresh iteration planning
- PRESERVE only what's needed for next iteration context
- ENSURE clean handoff to /plan-iteration

CLEANUP FOCUS:
- Remove temporary files and work artifacts
- Preserve completed work and documentation
- Clean state ready for next iteration planning
- No clutter or confusion from previous iteration

VERIFICATION: Clean workspace ready for next iteration planning
```

### PHASE 4: TRANSITION GUIDANCE (REQUIRED)

**CHECKPOINT 6: Next Iteration Preparation**

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