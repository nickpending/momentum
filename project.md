# Project Mode

Write working code, never placeholders or TODO stubs. Demonstrate it works with real commands and output. Mock only external APIs (Stripe, OpenAI) — use real internal services.

---

## 6. Development Rules

Build first, test after — tests prove it works, not TDD. Check if existing libraries handle it before building. Follow established codebase patterns. Boring code wins.

---


## 7. Commit Messages

Format: `type(scope): description`. Types: feat, fix, refactor, test, docs, chore. Under 72 characters. Describe what the commit does, not what you did.

---

## 8. Security

Never commit secrets, credentials, .env files, or .workflow/ state. Never hardcode secrets — use environment variables. Never log sensitive data.

---


## 9. Code & Dependencies

Follow project's existing patterns, linting, and formatting. Ask before adding new dependencies.

---

## 10. Constraints

**Never:**
- Create docs unless explicitly requested
- Mock internal services
- Restructure directories without permission
- Change CI/CD without approval
- Break existing API contracts
- Add emojis unless requested
- Use interactive git (rebase -i, add -i)

**Always:**
- Specialized tools over bash for file ops
- Parallel tool calls when independent
- Check existing patterns first
- Verify quality gates before marking complete
- Preserve working directory (avoid cd)

---

## 11. Quick Commands

| Command | Action |
|---------|--------|
| **qcheck** | Skeptical senior engineer review |
| **qtest** | Write ONE integration test |
| **qcom** | Stage all, commit conventional |
| **qpush** | Push to origin |
| **qfix** | Debug and fix error |
| **qsum** | Summarize recent commits |
| **qback** | Add to project backlog |
| **qsweep** | Check what needs attention |
| **qnext** | What's next based on current work |
| **qux** | List test scenarios by priority |
| **qenv** | Check env vars vs .env.example |
| **qwhy** | Explain why command failed |
| **qalt** | Suggest alternative approach |
| **qsensible** | Align goal, approach, problem, solution |
| **qwtf** | What's making this harder |
| **qexplain** | Problem, solution, breakage, assumptions |
| **qpropagate** | Update tasks based on discovery |
| **qlum** | Quick luminary sanity check |
| **qwwld** | What would luminaries do |
| **qlazy** | Anti-laziness enforcement |
| **qnoquit** | Force completion of analysis |

---

## 12. Startup Behavior

On "ready" with PROJECT_STATE metadata:

| State | Response |
|-------|----------|
| **workspace** | "Workspace mode — full capabilities, no project constraints." |
| **new** | "No project vision for {project}." Offer ideation. |
| **vision** | "Switched to {project}." Suggest `/plan-iteration` |
| **planned** | "Switched to {project}." Suggest `/decompose-iteration` |
| **active** | Report iteration status, suggest `/load-app-context` |

Don't start work unprompted. Wait for direction.

---

## 13. Project Context

**Key locations:**
- `${PROJECT_ROOT}/.workflow/artifacts/` — TASKS.md, PROJECT_SUMMARY.md, ITERATION.md
- `${PROJECT_ROOT}/.workflow/state/` — Saved development state
- `${WORKFLOW_PROJECTS}/{project}/later.md` — Backlog items
- `${WORKFLOW_PROJECTS}/{project}/explorations/` — Exploration documents

Commands handle mechanics. You handle mindset and execution.
