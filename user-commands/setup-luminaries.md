# Luminary Project Setup - Generate Expert Guidance System

## Environment Context

**NOTE**: Workflow environment variables are already loaded:
- `$WORKFLOW_PROJECTS` - Obsidian projects directory 
- `$WORKFLOW_HOME` - Workflow system location
- These are available for direct use in file paths

**Variables**: `$VARS` are environment variables (expand them), `{vars}` are runtime values (find/calculate them), `[vars]` are template placeholders (substitute them).

## ⚠️ CRITICAL: AUTOMATIC LUMINARY SETUP ⚠️

**🛑 SETUP SEQUENCE - EXECUTE AUTOMATICALLY**

### PHASE 1: LUMINARY DETECTION

**CHECKPOINT 1: Check for Existing Luminaries**

```
REQUIRED: Check for {project-root}/.workflow/artifacts/LUMINARIES.md

IF LUMINARIES.md EXISTS:
- READ luminaries configuration
- PROCEED to Phase 3 (Roundtable Generation)

IF LUMINARIES.md MISSING:
- PROCEED to Phase 2 (Luminary Generation)
```

### PHASE 2: LUMINARY GENERATION (IF NEEDED)

**CHECKPOINT 2: Generate Project Luminaries**

```
IF LUMINARIES.md missing:

CONTEXT ENGINEER STEP:
You are a Context Engineer who matches projects to relevant luminaries to create cognitive interrupts that prevent bad patterns.

READ IDEA.md to extract project information:
1. What are you building? → Extract from Vision/Problem sections
2. What's your tech stack? → Extract from Tech Stack section or constraints
3. What scale? → Extract from context (personal project, startup, production)
4. What's the architecture? → Extract from Solution/Architecture sections

Generate LUMINARIES.md using the extracted information and format below.

## Luminary Knowledge Base (USE ONLY THESE)

### Data/Storage
- **Simon Willison**: Built Datasette, sqlite-utils, LLM CLI. Expert in SQLite, data journalism, LLM tools
- **Antirez**: Built Redis. Expert in in-memory stores, simple data structures, server architecture
- **Ben Johnson**: Built BoltDB, Litestream. Expert in embedded databases, SQLite replication
- **Michael Stonebraker**: Built Postgres, Ingres. Expert in ACID, relational databases

### Go/Simplicity
- **Rob Pike**: Created Go, Plan 9, UTF-8. Expert in Go, simplicity, concurrency
- **Ken Thompson**: Created Unix, B language. Expert in systems programming, simplicity
- **Brian Kernighan**: Wrote Unix books, AWK. Expert in clear code, debugging

### Python/Services  
- **Kenneth Reitz**: Built Requests, Python-guide. Expert in Python APIs, developer experience
- **David Beazley**: Python educator, GIL expert. Expert in Python internals, generators
- **Armin Ronacher**: Built Flask, Jinja2. Expert in Python web, API design

### CLI/TUI
- **Mitchell Hashimoto**: Built Vagrant, Terraform. Expert in CLI tools, distributed systems
- **Jessie Frazelle**: Built container tools. Expert in systems tools, developer experience
- **TJ Holowaychuk**: Built Commander.js, Express. Expert in CLI design, Node.js

### Web/REST
- **Roy Fielding**: Created REST. Expert in API architecture, HTTP, hypermedia
- **DHH**: Built Rails, Basecamp. Expert in web frameworks, productivity, conventions
- **Tom Preston-Werner**: Built GitHub, Jekyll. Expert in Git workflows, simple protocols

### Frontend/UI
- **Dan Abramov**: Built Redux, React DevTools. Expert in React, state management
- **Rich Harris**: Built Svelte. Expert in compilers, performance, simplicity
- **Evan You**: Built Vue. Expert in progressive frameworks, developer experience
- **Bret Victor**: Built reactive visualizations. Expert in immediate feedback, rethinking programming

### Performance
- **John Carmack**: Built Doom, Quake. Expert in graphics, optimization, measurement
- **Casey Muratori**: Built Handmade Hero. Expert in performance, data-oriented design
- **Mike Acton**: Led Insomniac engine team. Expert in data transformation, cache

### Games/Multiplayer
- **Richard Bartle**: Created MUDs. Expert in virtual worlds, player psychology
- **John Carmack**: Built Quake networking. Expert in client prediction, networking

### Infrastructure
- **Kelsey Hightower**: Kubernetes contributor. Expert in containers, cloud, operations
- **Solomon Hykes**: Built Docker. Expert in containers, developer workflows

### Content/Publishing
- **Aaron Swartz**: Created RSS, web.py, Reddit co-founder. Expert in content syndication, open data
- **Matt Mullenweg**: Built WordPress. Expert in content management, publishing systems

## Domain Mapping Rules

- SQLite → Simon Willison
- Go code → Rob Pike
- Python service → Antirez (architecture) or Reitz (APIs)
- CLI/TUI → Mitchell Hashimoto
- REST API → Roy Fielding (but NOT for real-time systems)
- Real-time multiplayer → John Carmack (networking)
- Game networking → John Carmack
- Performance → John Carmack (measure) or Casey Muratori (data-oriented)
- Games/MUD → Richard Bartle (design) + John Carmack (if networking)
- React → Dan Abramov
- RSS/Content → Aaron Swartz or Matt Mullenweg
- Daemon/Client architecture → Antirez (daemons) + relevant client expert
- Simple > Complex → Pike or Thompson

## MANDATORY INTERRUPT FORMAT

ALL interrupts MUST follow these EXACT patterns:
- "What would [Name] do here?"
- "What would [Name] think of this?"
- "How would [Name] approach this?"
- "Would [Name] approve of this?"

FORBIDDEN INTERRUPT PATTERNS:
- "What would X do with this [specific thing]?" ❌
- "How would X handle this [specific problem]?" ❌
- "What would X think of this [specific aspect]?" ❌

If you write ANY interrupt that includes specific project details after "this", you are VIOLATING the rules.

EXAMPLES:
✅ CORRECT: "What would Pike think of this?"
❌ WRONG: "What would Pike think of this abstraction?"

✅ CORRECT: "How would Carmack approach this?"
❌ WRONG: "How would Carmack handle this real-time sync?"

✅ CORRECT: "What would Bartle do here?"
❌ WRONG: "What would Bartle think of this player interaction?"

Generate LUMINARIES.md in {project-root}/.workflow/artifacts/ with this EXACT format:

# LUMINARIES.md

## Project Context
- Type: [user's answer to question 1]
- Core Challenge: [infer the main technical challenge from their description and architecture]
- Scale: [user's answer to question 3]

## Primary Luminaries (invoke frequently)
- **[Name]** ([what they built]) - For [specific aspect]
- **[Name]** ([what they built]) - For [specific aspect]
- **[Name]** ([what they built]) - For [specific aspect]

## Domain Specialists (invoke for specific issues)
- **[Name]** ([what they built]) - For [specific aspect]
- **[Name]** ([what they built]) - For [specific aspect]

## Cognitive Interrupts
- [Domain] questions → "[MUST use mandatory format above]"
- [Domain] getting complex → "[MUST use mandatory format above]"
- [Domain] design → "[MUST use mandatory format above]"
- [Architecture] patterns → "[MUST use mandatory format above]"
- [Domain] decisions → "[MUST use mandatory format above]"

## Anti-Patterns to Interrupt
- Overengineering → Invoke Pike
- Premature optimization → Invoke [Name] ("[their actual principle]")
- Complex [thing] → Invoke [Name] ("[their actual principle]")

RULES:
1. Pick 3 primary luminaries based on tech stack, architecture, and core challenge
2. Pick 1-2 domain specialists for secondary concerns
3. Keep interrupts OPEN-ENDED using the mandatory format
4. Only use luminaries from the knowledge base above
5. Match based on what they ACTUALLY built
6. Anti-patterns should reference real principles they're known for

Generate LUMINARIES.md from the extracted IDEA.md information following the mandatory interrupt patterns.

VERIFICATION: Confirm LUMINARIES.md created in {project-root}/.workflow/artifacts/
```

### PHASE 3: ROUNDTABLE SUBAGENT GENERATION

**CHECKPOINT 3: Create Custom Roundtable Subagent**

```
REQUIRED: Generate custom ROUNDTABLE.md subagent using luminaries

PROCESS:
1. READ {project-root}/.workflow/artifacts/LUMINARIES.md
2. EXTRACT primary luminaries (name, what they built, expertise)
3. EXTRACT project context (type, core challenge, scale)
4. READ {project-root}/.workflow/templates/ROUNDTABLE_TEMPLATE.md
5. SUBSTITUTE luminaries and project data into template
6. WRITE to {project-root}/.claude/agents/roundtable.md

TEMPLATE SUBSTITUTION:
- [PROJECT_TYPE] → Project Context Type
- [CORE_CHALLENGE] → Core Challenge
- [SCALE] → Project Scale
- [LUMINARY_1] → Primary Luminary 1 name
- [LUMINARY_1_BUILT] → What they built
- [LUMINARY_1_EXPERTISE] → Their expertise area
- [LUMINARY_2] → Primary Luminary 2 name
- [LUMINARY_2_BUILT] → What they built
- [LUMINARY_2_EXPERTISE] → Their expertise area
- [LUMINARY_3] → Primary Luminary 3 name
- [LUMINARY_3_BUILT] → What they built
- [LUMINARY_3_EXPERTISE] → Their expertise area
```

### PHASE 4: COMPLETION VERIFICATION

**CHECKPOINT 4: Verify Setup Complete**

```
VERIFICATION GATE: Confirm both files exist:
- {project-root}/.workflow/artifacts/LUMINARIES.md ✅
- {project-root}/.claude/agents/roundtable.md ✅

OUTPUT:
=====================================
LUMINARY SETUP COMPLETE
=====================================

✅ Project luminaries identified and configured
✅ Custom roundtable subagent generated
✅ Ready for expert-guided development

Primary Luminaries: [List from LUMINARIES.md]

Setup complete. Momentum mode ready with expert guidance.
```

## ENFORCEMENT MECHANISMS

### Setup Automation
- Runs when called by momentum or manually
- No manual steps required
- Generates project-specific expert guidance

### Template Integrity
- All substitutions must be exact matches
- Missing luminaries data = setup failure
- Custom subagent must be valid momentum format

### Expert Authenticity
- Only reference actual luminary experience
- No fabricated expertise or quotes
- Scale-appropriate guidance (personal vs production)