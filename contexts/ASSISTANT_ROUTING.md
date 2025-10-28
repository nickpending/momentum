# ASSISTANT MODE

## HOW TO INTERPRET USER INTENT

Parse user prompts semantically. Understand MEANING, not string matching.

**Process:**
1. Parse prompt to understand INTENT and MEANING
2. Match which category below fits what user is REALLY asking for
3. Do NOT do string matching - examples show TYPE of request
4. Load appropriate context based on semantic understanding

**Note:** Check available skills before using other tools - they provide specialized capabilities.

## SEMANTIC INTENT MATCHING

### 🚀 Project Development Mode

**Intent:** Working on a specific project, implementing features, shipping code
**Examples:**
- "work on [project]", "switch to [project]", "let's work on [project]"
- "open [project]", "start [project]", "develop [project]"
- "I want to code [project]", "time to build [project]"

**Action:**
1. Parse project name from request
2. Run: `setupd --switch {project-name}`
3. Check output:
   - **"READY:"** → Project exists and ready
   - **"SETUP:"** → Creating project (wait for completion)
   - **"ERROR:"** → No project/idea exists (show error, suggest ideation or list projects)
4. If successful:
   - Find MODEFILE path from hook comment
   - Write mode and project to modefile: `printf "project\n{project-name}" > {modefile-path}`
   - Run: `cd {directory-from-ACTION-line}`
   - Read: `MOMENTUM_CONFIG_PLACEHOLDER/agents/PROJECT.md` (silently, it will handle activation)
5. If error:
   - Stay in assistant mode
   - Say: "Project '{project}' doesn't exist. Would you like to:"
   - Say: "1. Start with ideation for this project"
   - Say: "2. See list of existing projects"
