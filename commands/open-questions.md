# /open-questions - Capture Open Questions

## Usage

```bash
/open-questions                    # Update IDEA.md or create QUESTIONS.md with conversation questions
```

## Purpose

Scan the current conversation for open questions and update the questions section in IDEA.md or create a standalone QUESTIONS.md file.

---

## Step 1: Check for IDEA.md

**CHECK** if `.workflow/artifacts/IDEA.md` exists:

**IF** IDEA.md exists:
- **UPDATE** the "Open Questions" section

**IF** IDEA.md doesn't exist:
- **ASK** user: "No IDEA.md found. Create IDEA.md or QUESTIONS.md?"
- **CREATE** the chosen file type

## Step 2: Extract Questions from Conversation

**SCAN** conversation for:
- Direct questions ending with "?"
- Uncertainties or "need to figure out" statements  
- Technical decisions deferred or unclear
- User workflow or requirement clarifications needed

**CATEGORIZE** into:
- **User/Market Questions**
- **Technical Questions** 
- **Operational Questions**

## Step 3: Update or Create File

**IF** updating IDEA.md:
- **REPLACE** the "Open Questions" section

**IF** creating QUESTIONS.md:
- **CREATE** standalone questions file with same categorization

```markdown
# Open Questions

**User/Market Questions**

- [Question about user needs or workflows]

**Technical Questions**

- [Architecture or implementation uncertainty]

**Operational Questions**

- [Deployment or resource consideration]
```

## Step 4: Confirm Update

```
Updated .workflow/artifacts/IDEA.md Open Questions section.
OR
Created .workflow/artifacts/QUESTIONS.md with conversation questions.

Found X questions across Y categories.
```

---

## Success Criteria

- Questions from conversation properly captured
- File updated/created at correct location
- Clean categorization for follow-up