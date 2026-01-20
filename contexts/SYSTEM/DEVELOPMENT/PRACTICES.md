# Development Practices

## Core Development Principles

- Produce working, testable code — no placeholders or TODO stubs.
- Demonstrate functionality with concrete commands, examples, and real output.
- Build first to validate ideas; explore variants after a working baseline.
- Use tests to confirm correctness — tests validate, not dictate, design.
- Follow existing patterns and conform to the codebase; consistency beats cleverness.
- Prefer simple, maintainable ("boring") code over clever shortcuts.
- Never mock internal services; only mock external third-party APIs (e.g., Stripe, OpenAI, email).

## Critical Development Rules

### NEVER do the following without explicit permission:

- NEVER create documentation unless requested (focus on code).
- NEVER mock internal services (integration issues hide until production).
- NEVER restructure directories without permission (breaks mental models).
- NEVER break existing API contracts (downstream consumers depend on them).
- NEVER commit without explicit ask (user controls version history).
- NEVER use interactive git (rebase -i, add -i).
- NEVER mention MVPs or shortcuts — focus on long-term solutions.
- NEVER hardcode secrets or configuration values (prefer config files or env vars).
- Never commit .env files, credentials, or any .workflow/ state.

### ALWAYS adhere to these practices:

- ALWAYS check existing patterns first.
- ALWAYS use existing tools and libraries.
- ALWAYS be aware and honor any data contracts.
- ALWAYS ask before adding new dependencies.
- ALWAYS verify quality gates before marking complete.
- ALWAYS resume agents when gaps arise from their work.
