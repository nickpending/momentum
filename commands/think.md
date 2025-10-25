# Force deep analysis when claiming premature completion

**Variables**: Variables in CAPS are injected by hooks (see HTML comments above), `{vars}` are runtime values (find/calculate them), `[vars]` are template placeholders (substitute them).

**Key Paths**:
- None - Invokes thinking, no file access
- WORKFLOW_PROJECTS - Obsidian projects directory (injected)
- WORKFLOW_DEV - Development projects root (injected)

## ⚠️ STOP. YOU'RE NOT DONE. THINK. ⚠️

You're trying to mark things complete that aren't actually complete.

## MANDATORY REALITY CHECK

**THINK** through what you're actually claiming:

### 1. "Good enough" is NOT complete

You're saying things like:
- "The core functionality works"
- "The main feature is there"
- "It mostly works"
- "The error doesn't affect functionality"
- "This can ship as-is"

**THINK:** Would you deploy this to production right now? Really?

### 2. Errors are NEVER "just cosmetic"

That error you're dismissing? It means something:
- Terminal errors = broken cleanup
- Warning messages = incomplete implementation
- Failed assertions = logic problems
- Type errors = contract violations

**THINK:** What is that error actually telling you?

### 3. Bulk completion is LAZY

"Tasks 2.3-2.8 were included in 2.2" - Really? Prove it:
- Show task 2.3's specific demo working
- Show task 2.4's specific demo working
- Show each individual task's success criteria met

**THINK:** Can you actually demo each task individually?

## THE HARD QUESTIONS

**THINK** deeply and answer honestly:

1. What specifically are you avoiding fixing?
2. Can you run the exact demo command from TASKS.md?
3. Does it produce the exact expected output?
4. Are there ANY errors in the console?
5. Would a user consider this actually complete?

## COMPLETION REALITY CHECK

**REAL** completion means:
- ✅ Zero errors (not even "cosmetic" ones)
- ✅ Demo command runs exactly as specified
- ✅ Output matches expected results
- ✅ No warnings, no exceptions, no issues
- ✅ Each task proven individually

**FAKE** completion looks like:
- ❌ "Core functionality works" (but errors exist)
- ❌ "Implemented as part of another task" (without proof)
- ❌ "Good enough for now" (it's not)
- ❌ "The error doesn't matter" (it does)
- ❌ "This can ship" (with known issues)

## YOUR ACTUAL OPTIONS

After **THINKING** through the above:

1. **FIX IT PROPERLY**
   - Debug the actual error
   - Implement the missing piece
   - Make it actually work

2. **OR ADMIT IT'S NOT DONE**
   - Mark task as in-progress
   - Use /save-state if context is low
   - Come back when you can complete it properly

But you CANNOT mark it complete when it's not.

## THE TEST

Before marking ANYTHING complete, you must be able to say:

"I ran the exact demo command from the task definition, it produced the exact expected output, with zero errors or warnings, and I can prove each task works individually."

If you can't say that, you're not done. THINK about why you're trying to pretend otherwise.