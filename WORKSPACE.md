# WORKSPACE.md

Shared context for all LLM sessions in the **LLM Playground** workspace. Loaded by `CLAUDE.md` and `GEMINI.md`.

## Workspace Mission

The **LLM Playground** is a high-performance environment for multi-LLM integration, project creation, and task orchestration across design, development, and planning.

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

**TL;DR — create `task-plans/plan-[task-name].md` first. Always. No output before the plan file exists and the user has reviewed it.**

Plan files live at the **workspace root** in `task-plans/` — never inside a project subdirectory. Research and planning go in the same file.

---

### Phase 1 — Research

1. Explore thoroughly — read files, don't skim
2. Write findings into the **Research** section of `task-plans/plan-[task-name].md`
3. **Stop. Surface to the user:**

   > Research complete — see `task-plans/plan-[task-name].md`.
   > - Anything missing or misunderstood? *(annotate the file or reply here)*
   > - Constraints I should know? *(short or detailed — both fine)*
   > - Ready to proceed to planning? *(yes / or notes first)*

4. Wait for response before continuing.

---

### Phase 2 — Plan

1. Append a **Plan** section to the same file — rationale, file paths, steps, trade-offs, and a task checklist
2. **Stop. Surface to the user:**

   > Plan added to `task-plans/plan-[task-name].md`.
   > - Steps to change or cut? *(annotate the file or note here)*
   > - Constraints I've missed?
   > - Approved? *(yes / or changes needed — I'll revise before starting)*

3. Revise based on feedback. Repeat until explicitly approved.
4. Do not implement without approval.

---

### Phase 3 — Implement

Triggered by explicit user approval only.

1. Execute the full approved plan — no mid-task confirmations
2. Mark tasks complete in the checklist as you go
3. If blocked, **stop and surface options** — do not patch around the problem
4. If direction proves wrong: revert and re-scope, do not patch incrementally

---
*WORKSPACE.md v1.2*
