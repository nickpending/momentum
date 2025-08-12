# Transform Exploration into Concrete Project Vision

## Environment Context

**NOTE**: Workflow environment variables are already loaded:
- `$WORKFLOW_PROJECTS` - Obsidian projects directory
- `$WORKFLOW_TEMPLATES` - Template files location
- Template location: `$WORKFLOW_TEMPLATES/IDEA_TEMPLATE.md`

## ⚠️ CRITICAL: INTERVIEW FIRST - NO ARTIFACTS UNTIL APPROVED ⚠️

**🛑 STOP AFTER INTERVIEW. DO NOT GENERATE ARTIFACTS.**
**🛑 ASK QUESTIONS ONE AT A TIME - BUILD ON ANSWERS**
**🛑 ALWAYS END WITH: "Ready to create IDEA.md in obsidian?"**
**🛑 WAIT FOR EXPLICIT APPROVAL BEFORE CREATING IDEA.md**

## ⚠️ CRITICAL: PRESERVE EXPLORATION INSIGHTS ⚠️

**🛑 CAPTURE CONCRETE DETAILS FROM EXPLORATION**
**🛑 NO GENERIC PROJECT DESCRIPTIONS**
**🛑 ACTUAL PROBLEMS AND USE CASES DISCUSSED**
**🛑 REAL EXAMPLES AND DATA STRUCTURES**

## ⚠️ CRITICAL: THINK ⚠️

### PHASE 0: PREPARATION

- READ EVERYTHING 3 TIMES BEFORE DOING ANYTHING
- WHEN YOU GENERATE QUESTIONS - REVIEW THEM INTERNALLY FOR DEPTH
- ENSURE YOU EXTRACT ALL INSIGHTS FROM EXPLORATION - REVIEW IT 3 TIMES

## MANDATORY EXECUTION SEQUENCE - NO SKIPPING

### PHASE 1: EXPLORATION LOADING (REQUIRED)

**CHECKPOINT 1: Scan Available Explorations**

```
REQUIRED: List and analyze exploration directories:
- LIST directories in $WORKFLOW_PROJECTS/../explorations/
- SORT by modification date (newest first)
- CALCULATE age of each exploration
- IDENTIFY potential matches for continuation

DISPLAY FORMAT:
"Recent explorations:
• [name] ([relative time])
• [name] ([relative time])
• [name] ([relative time])

Which?: "

PARSING REQUIREMENTS:
- Accept numbers (1, 2, 3)
- Accept partial matches ("auth", "pipe")
- Accept full names
- Accept "new" for fresh start

IF USER RESPONSE UNCLEAR OR EMPTY:
ASK: "Did you want to continue with [most recent exploration name] or start something new?"

VERIFICATION: Confirm exploration selection or fresh start
```

**CHECKPOINT 2: Deep Exploration Analysis (if selected)**

```
IF exploration selected:
  
REQUIRED: Read and analyze exploration deeply:
- READ: $WORKFLOW_PROJECTS/../explorations/[selected]/README.md
- EXTRACT: Every problem statement mentioned
- IDENTIFY: Technical approaches considered
- CAPTURE: Open questions and uncertainties
- NOTE: Specific examples or data structures discussed
- UNDERSTAND: The journey of thinking so far

ANALYSIS CHECKLIST:
□ What problems were being explored?
□ What solutions were considered?
□ What decisions were tentative?
□ What examples were given?
□ What constraints were mentioned?
□ What excited the user?
□ What concerned them?

VERIFICATION: Summarize key exploration themes before proceeding
```

### PHASE 2: DYNAMIC INTERVIEW GENERATION

**CHECKPOINT 3: Generate Targeted Questions**

```
BASED ON EXPLORATION, GENERATE QUESTIONS THAT:

1. RESOLVE UNCERTAINTIES
   - If exploration says "not sure about X"
   - Generate: "You mentioned uncertainty about X. What are the key factors driving this decision?"

2. CONCRETIZE VAGUE IDEAS
   - If exploration has "some kind of Y"
   - Generate: "Tell me more about this Y - what exactly needs to happen?"

3. EXTRACT SPECIFICATIONS
   - If exploration mentions "handle data"
   - Generate: "What does this data look like? Show me an example."

4. CLARIFY SCOPE
   - If exploration is broad
   - Generate: "What's the smallest version that would be useful?"

5. IDENTIFY CONSTRAINTS
   - Always ask: "What constraints do we need to work within?"

QUESTION QUALITY CHECK:
□ Questions target specific unknowns from exploration
□ Questions will yield concrete, not abstract answers
□ Questions build toward implementation clarity
□ Questions explore both problem and solution space

VERIFICATION: Have 5-8 targeted questions ready
```

### PHASE 3: CONDUCT INTERVIEW

**CHECKPOINT 4: Project Naming**

```
ASK: "What would you like to call this project?"

IF user needs help:
  BASED ON EXPLORATION CONTENT:
  "Based on [specific aspect from exploration], some options:
  - [contextual-name-1] - emphasizes [feature]
  - [contextual-name-2] - focuses on [problem]
  - [contextual-name-3] - describes [approach]
  
  Which resonates, or something else?"

VALIDATION:
- Lowercase letters, numbers, hyphens only
- No spaces or special characters
- Meaningful and memorable

VERIFICATION: Confirm valid project name
```

**CHECKPOINT 5: Problem Discovery Interview**

```
REQUIRED: Extract concrete problem details

ASK PROGRESSIVELY DEEPER (ONE AT A TIME):
START: "What specific problem does [project-name] solve?"
THEN BUILD: Based on answer, explore who/when/where
THEN DIG: Into current pain points
THEN VISION: What better looks like

CAPTURE FORMAT:
## Problem Discovery
- Core Problem: [specific, not generic]
- Who Has It: [concrete user description]
- Current Pain: [actual friction points]
- Better State: [measurable improvement]

VERIFICATION: Can explain problem to someone unfamiliar
```

**CHECKPOINT 6: Solution Architecture Interview**

```
REQUIRED: Understand technical approach

CONCRETE DISCOVERY QUESTIONS:
- "Walk me through how [project-name] will work"
- "What are the main components or modules?"
- "What data needs to be stored? Show me the structure"
- "What external systems will this connect to?"
- "What's the core algorithm or logic?"

CAPTURE FORMAT:
## Solution Architecture
- Core Mechanism: [how it actually works]
- Key Components: [specific modules]
- Data Structures: [actual schemas/examples]
- Integration Points: [external systems]
- Critical Logic: [algorithms/rules]

VERIFICATION: Have concrete technical approach
```

**CHECKPOINT 7: Feature Scoping Interview**

```
REQUIRED: Define concrete features

STRUCTURED QUESTIONING (BUILD ON ANSWERS):
START: "What are the absolute must-have features for v1?"
THEN: Based on MVP, explore v2 additions
THEN: Clarify boundaries - what's OUT
FINALLY: Identify success indicator feature

CAPTURE FORMAT:
## Feature Scope
- MVP Features: [minimum viable]
- Enhancement Features: [post-MVP]
- Future Ideas: [long-term vision]
- Out of Scope: [what we're NOT building]
- Success Indicator: [proof it works]

VERIFICATION: Clear line between MVP and future
```

**CHECKPOINT 8: Technical Decisions Interview**

```
REQUIRED: Clarify technical choices

DECISION QUESTIONS (ADAPT BASED ON PROJECT TYPE):
START: "Any language or framework preferences?"
IF RELEVANT: Deployment environment
IF APPLICABLE: Performance constraints
IF NEEDED: Security considerations
ALWAYS ASK: "What can we build on?"

CAPTURE FORMAT:
## Technical Decisions
- Tech Stack: [languages/frameworks]
- Deployment: [where/how it runs]
- Performance: [requirements if any]
- Security: [considerations]
- Dependencies: [what we'll build on]

VERIFICATION: Technical approach is feasible
```

### PHASE 4: INTERVIEW SYNTHESIS

**CHECKPOINT 9: Summarize Before Creation**

```
REQUIRED: Synthesize interview into clear vision

PRESENT SUMMARY:
"Based on our discussion, here's what I understand:

**Project**: [project-name]
**Core Problem**: [crisp problem statement]
**Solution**: [technical approach in one sentence]
**MVP Features**: 
  - [concrete feature 1]
  - [concrete feature 2]
  - [concrete feature 3]
**Tech Stack**: [if determined]
**Key Differentiator**: [what makes this unique]
**Success Looks Like**: [measurable outcome]

Ready to create IDEA.md in obsidian?"

WAIT FOR: Explicit approval
NO ARTIFACTS WITHOUT: "yes", "ready", "go ahead", "create it"
```

### PHASE 5: CREATE PROJECT ARTIFACTS

**CHECKPOINT 10: Create Project Structure**

```
ONLY AFTER EXPLICIT APPROVAL:

1. CREATE DIRECTORY:
   - mkdir -p $WORKFLOW_PROJECTS/[project-name]
   - VERIFY: Directory created successfully

2. LOAD TEMPLATE:
   - READ: $WORKFLOW_TEMPLATES/IDEA_TEMPLATE.md
   - UNDERSTAND: All sections and their purpose

3. GENERATE IDEA.md:
   - CREATE: $WORKFLOW_PROJECTS/[project-name]/IDEA.md
   - USE: Template structure
   - FILL: With interview discoveries
   - EMBED: Concrete examples from discussion
   - PRESERVE: Exploration insights if applicable

4. QUALITY CHECK:
   □ Problem section has specific examples
   □ Solution describes actual approach
   □ Features marked as "📋 Planned"
   □ MVP clearly defined
   □ Technical approach documented
   □ Open questions captured

VERIFICATION: IDEA.md contains interview gold, not boilerplate
```

**CHECKPOINT 11: Link to Exploration (if applicable)**

```
IF created from exploration:
  
ADD TO IDEA.md:
- Note at top: "Evolved from exploration: [date]-[topic]"
- Preserve key insights in relevant sections
- Maintain continuity of thinking

VERIFICATION: Evolution from exploration is traceable
```

### PHASE 6: GUIDE NEXT STEPS

**CHECKPOINT 12: Provide Clear Path Forward**

```
REQUIRED: Guide user to next action

REPORT:
"✅ Created IDEA.md in $WORKFLOW_PROJECTS/[project-name]/

Next steps:
1. Set up development environment:
   → Run: setupd [project-name]
   
2. Navigate to project:
   → Run: cd $WORKFLOW_DEV/[project-name]
   
3. Plan first iteration:
   → Run: /plan-iteration

Would you like to set up the development environment now?"

IF YES: Guide through setupd command
IF NO: Confirm IDEA.md saved for future
```

## SUCCESS CRITERIA

- Explorations properly loaded and analyzed
- Questions generated from exploration content, not generic
- Interview captures concrete details, not abstractions  
- IDEA.md contains specific examples and decisions
- Clear evolution from exploration to project
- User knows exact next steps

## FAILURE MODES TO AVOID

- Creating artifacts before approval
- Generic questions not based on exploration
- Vague problem or solution statements
- Missing technical decisions from interview
- Boilerplate IDEA.md without specifics
- Lost insights from exploration phase