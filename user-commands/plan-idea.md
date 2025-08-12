# Plan and Structure Project Idea Through Interview

## Purpose
Transform exploratory thinking into a concrete project vision through structured interview, creating IDEA.md in the obsidian project space.

## Prerequisites
- Previous exploration with `/ideate` (optional but helpful)
- Ready to develop an idea into a project

## Environment Context

**NOTE**: Workflow environment variables are already loaded:
- `$WORKFLOW_PROJECTS` - Obsidian projects directory
- `$WORKFLOW_TEMPLATES` - Template files location
- Template location: `$WORKFLOW_TEMPLATES/IDEA_TEMPLATE.md`

## ⚠️ CRITICAL: INTERVIEW FIRST - NO DIRECTORIES UNTIL APPROVED ⚠️

**🛑 STOP. DO NOT CREATE DIRECTORIES OR FILES YET.**
**🛑 ANALYZE EXPLORATIONS AND CONDUCT INTERVIEW FIRST**
**🛑 ASK FOR APPROVAL BEFORE CREATING IDEA.md**

## PHASE 1: EXPLORATION ANALYSIS

### Load and Analyze Existing Explorations

```
CHECK: List directories in $WORKFLOW_PROJECTS/../explorations/
  
IF explorations exist:
  DISPLAY: "Recent explorations:
           • authentication-flow (2 days ago)
           • data-pipeline (4 days ago)
           • monitoring-ideas (7 days ago)
           
           Which?: "
        
  PARSE INPUT FLEXIBLY:
    - Number (1, 2, 3) → select by position
    - Partial match ("auth", "pipeline") → find matching exploration
    - Full name → exact match
    - "new" or unmatched → start fresh
    - Empty/return → select most recent
    
  IF exploration matched:
    READ: $WORKFLOW_PROJECTS/../explorations/[matched]/README.md
    ANALYZE: Content deeply to understand:
      - Core problems being explored
      - Technical approaches considered
      - Open questions raised
      - Connections and patterns identified
    
    GENERATE TARGETED QUESTIONS based on exploration:
      - Questions that dig into unknowns discovered
      - Questions that clarify tentative decisions
      - Questions that explore implications
      - Questions that solidify vague ideas
    
  IF no match or "new":
    PROCEED: Generate questions without exploration context

IF no explorations:
  PROCEED: Direct to interview with general questions
```

## PHASE 2: DYNAMIC INTERVIEW

### Project Naming

```
ASK: "What would you like to call this project?"

IF user unsure or asks for help:
  BASED ON EXPLORATION/DISCUSSION: 
  "Based on [specific aspect from exploration], some options:
  - [contextual-suggestion-1] - emphasizes [specific feature discussed]
  - [contextual-suggestion-2] - focuses on [problem being solved]
  - [contextual-suggestion-3] - highlights [architecture/approach]
  
  Which resonates, or something else?"

VALIDATE: lowercase with hyphens only
```

### Dynamic Interview Generation

```
BASED ON EXPLORATION CONTENT, GENERATE QUESTIONS THAT:

1. PROBE SPECIFIC UNKNOWNS from exploration
   Example: If exploration mentions "not sure about auth approach"
   ASK: "You mentioned uncertainty about authentication. 
        Are you leaning toward JWT, sessions, or OAuth? 
        What are the constraints?"

2. CLARIFY VAGUE CONCEPTS from exploration
   Example: If exploration says "some kind of data pipeline"
   ASK: "Tell me about this data pipeline - what's the source? 
        What transformations? Real-time or batch?"

3. SOLIDIFY TENTATIVE DECISIONS
   Example: If exploration considers "maybe Python or Node"
   ASK: "For the [specific use case mentioned], which language 
        fits better? What's driving that choice?"

4. EXPLORE IMPLICATIONS of ideas
   Example: If exploration mentions "distributed processing"
   ASK: "How distributed? Multiple machines? 
        What coordination is needed? 
        What happens when a node fails?"

5. EXTRACT CONCRETE DETAILS
   ASK: "Show me an example of [concept from exploration]"
   ASK: "What would the [data/API/config] look like?"
   ASK: "Walk me through a user doing [action mentioned]"

BUILD CONVERSATION NATURALLY:
- One question at a time
- Follow threads that emerge
- Dig deeper on technical details
- Capture specific examples and data structures
```

### Capture Discoveries During Interview

```
DOCUMENT AS YOU GO:
## Interview Discoveries
- Problem Details: [specific pain points revealed]
- Technical Decisions: [stack choices with reasoning]
- Data Examples: [actual JSON/schema discussed]
- User Workflows: [concrete steps described]
- Integration Points: [specific systems to connect]
- Constraints: [real limitations discovered]
- Scope Boundaries: [what's explicitly excluded]
```

### Interview Completion

```
SYNTHESIZE: "Based on our discussion:

**Vision**: [crisp summary from interview]
**Core Problem**: [specific problem with context]
**Solution Approach**: [technical approach discussed]
**Key Features**: 
  - [feature with specific detail]
  - [feature with implementation note]
**Technical Stack**: [if determined]
**Critical Unknowns**: [remaining questions]

Ready to create IDEA.md in $WORKFLOW_PROJECTS/[project-name]/?"

WAIT FOR: Explicit approval
```

## PHASE 3: CREATE PROJECT AND IDEA.md

### After Approval Only

```
1. CREATE: $WORKFLOW_PROJECTS/[project-name]/
   REPORT: "Created obsidian project: [project-name]"

2. READ: $WORKFLOW_TEMPLATES/IDEA_TEMPLATE.md
   
3. GENERATE: $WORKFLOW_PROJECTS/[project-name]/IDEA.md
   
   USE TEMPLATE STRUCTURE but EMBED CONCRETE DETAILS:
   - Problem section: Specific problems from interview
   - Solution section: Technical approach with examples
   - System Flow: Based on workflows discussed
   - Features: From interview, marked "📋 Planned"
   - MVP Definition: Explicit scope from discussion
   - Technical details: Real examples captured
   - Open Questions: Unknowns that emerged
   
4. IF exploration was source:
   NOTE in IDEA.md: "Evolved from exploration: [date]-[topic]"
   PRESERVE: Key insights from exploration
```

## PHASE 4: CONFIRM & GUIDE

### Review and Next Actions

```
REPORT: "Created IDEA.md in $WORKFLOW_PROJECTS/[project-name]/"

ASK: "Would you like to:
1. Set up development environment? (run: setupd [project-name])
2. Continue refining the idea?
3. Save for later?"

GUIDE based on choice:
- Option 1: "Run: setupd [project-name]
            Then: cd $WORKFLOW_DEV/[project-name]
            Then: /decompose-iteration to plan your first iteration"
- Option 2: Continue editing IDEA.md
- Option 3: "IDEA.md saved. Run setupd [project-name] when ready to start."
```

## Success Criteria

- Uses proper environment variables throughout
- Loads template from correct location
- Dynamic questions generated from exploration content
- Interview builds on exploration discoveries
- Concrete technical details captured
- Real examples and data structures documented
- Natural conversation flow
- IDEA.md contains interview gold, not generic text