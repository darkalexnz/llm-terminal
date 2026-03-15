# WORKSPACE.md

Shared context for all LLM sessions in the **LLM Terminal** workspace. Loaded by `CLAUDE.md` and `GEMINI.md`.

## Workspace Mission

The **LLM Terminal** is a high-performance environment for multi-LLM integration, project creation, and task orchestration across design, development, and planning.

## User Profile

See `about-user.md` for full profile.

**Summary:** Senior UX Designer, sole designer at a New Zealand telco, supporting 8+ developers. Medium code literacy (React, TypeScript, HTML, CSS, JS, Python). Code is a communication and architecture tool, not a contribution medium. Treat as a senior peer — skip beginner-level explanations, default to high-signal architectural framing.

## Multi-Project Awareness

- This workspace contains multiple independent projects under `/projects/`
- Always verify which project a task belongs to before acting
- This is a multi-LLM environment (Claude Code + Gemini CLI); maintain continuity via machine-readable documents so context transfers cleanly between tools

## Communication Style

- Concise and direct — no filler, no trailing summaries
- Prefer structured Markdown artifacts over conversational prose
- Prefer Markdown-native formats (tables, nested lists, structured code blocks); use Mermaid only when rendered output genuinely improves comprehension and the target tool supports it
- Do not suggest changes, refactors, or improvements beyond what was explicitly asked

## Document Standards

- All `.md` files in active projects follow a standard header block — see project-level `CLAUDE.md` for the format
- Format choice should prioritise cross-tool readability (VS Code, ADO, browser)

## Task Execution Protocol

**Never produce deliverables until a written plan has been reviewed and approved by the user.**

Run all three phases in a single continuous session where possible.

---

### Phase 1 — Research

1. Explore the relevant codebase, documents, or context thoroughly — unhurried, in depth
2. Write findings to a persistent file: `tier-3-work/research-[task-name].md`
3. **Stop. Surface to the user:**

   > Research complete — see `research-[task-name].md`.
   > Before I plan, please confirm:
   > - Anything missing, misread, or misunderstood? *(annotate the file or reply here)*
   > - Any constraints or domain knowledge I should factor in? *(short note or detailed — both fine)*
   > - Ready to proceed to planning? *(yes / or notes first)*

4. Do not begin planning until the user responds.

---

### Phase 2 — Plan

1. Write a detailed plan to `tier-3-work/plan-[task-name].md` — include rationale, file paths, steps, trade-offs, and a **granular task checklist** at the end
2. **Stop. Surface to the user:**

   > Plan written — see `plan-[task-name].md`.
   > Please review and annotate directly in the file, or reply here:
   > - Steps to remove, reorder, or replace? *(mark in the file or list here)*
   > - Technical or domain constraints I've missed? *(e.g. "use X", "don't touch Y")*
   > - Scope to cut before we start? *(now is the time)*
   > - Approved to implement? *(yes / or list changes — I'll revise before starting)*

3. Revise the plan based on feedback. Repeat this cycle until the user explicitly approves.
4. Do not begin implementation without explicit approval.

---

### Phase 3 — Implement

Triggered only by explicit user approval of the plan.

1. Execute the full approved plan — do not pause mid-implementation for confirmation
2. Mark tasks complete in the plan document as you go
3. Run typechecks continuously where applicable
4. If something unexpected blocks progress, **stop and surface** — do not patch around it:

   > Blocked: [describe the issue].
   > Options:
   > - [Option A — brief description]
   > - [Option B — brief description]
   > - Revert to last clean state and re-scope
   > Which do you prefer? *(one word or a full note — both fine)*

5. If a direction proves wrong: revert and re-scope against the plan — do not patch incrementally

---

### Control levers throughout
- The plan document is the control surface — all decisions and overrides should be recorded there
- Cherry-pick from the plan, trim scope, and override technical choices using domain knowledge
- The user's annotations (short or long) take precedence over the LLM's assumptions at every phase

---
*WORKSPACE.md v1.1*
