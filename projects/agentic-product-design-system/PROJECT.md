# PROJECT.md

Shared mandates for all LLM sessions within the **Agentic Product Design System**. Loaded by `CLAUDE.md` and `GEMINI.md`. Takes absolute precedence over workspace-level defaults.

## Tiered Memory Architecture

| Tier | Location | When to load |
|---|---|---|
| 1 | `tier-1-active/project-index.md` | Every session — read first to establish project state |
| 2 | `tier-2-domain/{agent}/` | On-demand when relevant to the current task |
| 3 | `tier-3-work/` | Ephemeral — archive or delete after task completion |

Do not load Tier 2 documents speculatively.

## Agent-Based Ownership

- Every document has an owner agent: Orchestrator, Discover, Define, Design, or Deliver
- Do not modify a Tier 2 document unless acting as its specified owner
- Only the **Orchestrator** may update `project-index.md` and `decision-log.md`
- Full agent roster and document registry: `tier-1-active/project-index.md`

## Standard Document Header

Every `.md` file in this system must open with:

```
# [Document Title]
*Document type: [Index | Domain | Task Output] | Owner: [Agent Name] | Tier: [1 | 2 | 3]*
*Status: [Draft | Active | Needs Review | Archived] | Last updated: [Date] | Version: [n]*
*Linked agents: [agents that read this document]*
*Linked documents: [related documents by title]*
```

## Design Vocabulary

- Use only component names defined in `tier-2-domain/design/component-library-reference.md`
- Prefer Markdown-native formats (tables, nested lists, structured code blocks); use Mermaid only when conditional logic genuinely benefits from rendered output and the target tool supports it

## Context Efficiency

- Keep `project-index.md` under 500 tokens — move historical detail to `/archive/` or specific Tier 2 logs
- Load only the Tier 2 documents directly relevant to the current task

## Agent Model

Role-switching within a single LLM session — agents are not separate processes. To switch: load the target agent's `skills.md` + the docs listed in `routing-guide.md` for that task type, then announce loaded state before executing.

## Session Start

Begin every session by loading in this order:
1. `tier-1-active/project-index.md`
2. `tier-2-domain/orchestrator/routing-guide.md`
3. `tier-2-domain/orchestrator/session-protocol.md`

Do not load any Tier 2 domain documents before classifying the user's first prompt.

## Tier 3 Policy

See `orchestrator/session-protocol.md` section 5 for the full policy.
- **File-based:** task outputs that span sessions or inform a future Tier 2 document
- **Chat-only (discard):** scratchpads superseded by a Tier 2 update
- **Archive:** completed sprint or phase deliverables → `archive/[YYYY-MM-DD]-[label]/`

---
*PROJECT.md v1.0*
