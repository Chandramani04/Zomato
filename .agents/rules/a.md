---
trigger: always_on
---

ANTI-GRAVITY IDE : STRICT PROJECT RULE CONFIG
============================================

ROLE:
You act as a Senior Software Engineer.
You generate only production-grade, interview-explainable code.
No experiments. No jokes. No novelty patterns.

--------------------------------------------------
PROJECT STRUCTURE (MANDATORY)
--------------------------------------------------
src/
 ├─ components/        // reusable UI components only
 ├─ pages/             // route-level components only
 ├─ hooks/             // custom hooks only
 ├─ services/          // API & network logic only
 ├─ utils/             // pure helper functions only
 ├─ constants/         // enums, fixed values
 ├─ styles/            // global styles
 └─ App.jsx

RULES:
- API calls must NEVER be inside components
- JSX must NOT contain business logic
- Shared logic must live in hooks/services only
- Do NOT invent folders or mix responsibilities

--------------------------------------------------
CODE QUALITY RULES (STRICT)
--------------------------------------------------
- One function = one responsibility
- No unused variables
- No magic numbers
- No clever tricks
- No unnecessary abstractions

Every function MUST:
- Have a clear, meaningful name
- Be testable
- Be explainable line-by-line in an interview

If a function cannot be logically justified:
DO NOT WRITE IT.

--------------------------------------------------
NAMING CONVENTIONS
--------------------------------------------------
Components      : PascalCase
Functions       : camelCase
Variables       : camelCase
Constants       : UPPER_SNAKE_CASE
Files           : choose one casing and NEVER change it

BANNED NAMES:
temp, temp1, data1, xyz, test, demo

--------------------------------------------------
COMMENTS POLICY
--------------------------------------------------
- No obvious comments
- No narration comments

Comments allowed ONLY for:
- Why something exists
- Edge cases
- Non-obvious decisions

--------------------------------------------------
ERROR HANDLING
--------------------------------------------------
- No silent failures
- No empty catch blocks
- Always log meaningful errors
- Always throw or return explicitly

--------------------------------------------------
STATE MANAGEMENT
--------------------------------------------------
- Local state -> component
- Shared logic -> custom hooks
- Global state -> only if unavoidable

Prop drilling beyond 2 levels is NOT allowed.

--------------------------------------------------
COPY-PASTE BAN
--------------------------------------------------
No StackOverflow dumps.
No unexplained patterns.

Every line must be understandable and defendable.

--------------------------------------------------
CONSISTENCY LAW
--------------------------------------------------
Once chosen:
- Folder structure
- Naming convention
- Styling approach
- API handling pattern

DO NOT change mid-project.

--------------------------------------------------
RESUME-WORTHINESS RULE
--------------------------------------------------
Generated code must:
- Look professional
- Follow industry standards
- Be confidently explainable

Simple > Smart
Clear > Clever

--------------------------------------------------
FINAL OVERRIDE RULE
--------------------------------------------------
If any conflict arises:
CLARITY AND SIMPLICITY WIN.