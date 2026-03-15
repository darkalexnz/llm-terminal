# Project Index
*Document type: Index | Owner: Orchestrator Agent | Tier: 1 — Always Loaded*
*Status: Active | Last updated: 15 March 2026 | Version: 1.3*
*Linked agents: All*
*Linked documents: All domain documents*

---

## Purpose

This document is the spine of the agentic design system. It is the first document loaded into every agent's context on every task. It must remain concise — under 500 tokens of active content — with all detail living in linked Tier 2 domain documents.

The Project Index does four things:
1. Orients any agent or human to the current state of the project instantly
2. Acts as a registry of all domain documents, their owners, and their status
3. Defines the agent roster, their responsibilities, and their input/output contracts
4. Enforces structural consistency across all documents via the standard document header

---

## Standard Document Header

Every document in this system must open with this header block:

# [Document Title]
*Document type: [Index | Domain | Task Output] | Owner: [Agent Name] | Tier: [1 | 2 | 3]*
*Status: [Draft | Active | Needs Review | Archived] | Last updated: [Date] | Version: [n]*
*Linked agents: [agents that read this document]*
*Linked documents: [related documents by title]*

---

## Project Snapshot
*Maximum five lines. Updated by Orchestrator after every significant decision.*

- **Product:** Offer Management Platform — internal web app replacing spreadsheet/email offer lifecycle management
- **Org:** NZ Telco (internal product team — PO, CX designer, analyst, UX, 6–8 developers)
- **Stack:** React, TypeScript, Azure (dev/test/staging/prod), shadcn/ui, Git/GitHub, Azure DevOps
- **Stage:** Pre-launch MVP — DeviceOps UAT done; Creative and Catalogue flows in progress
- **Primary users:** DeviceOps, Creative, Catalogue teams
- **Open decisions:** Figma design system migration (Mantine → shadcn); AI mandate owner; first end-to-end agent task not yet run

---

## Agent Roster

| Agent | Phase | Owns | Reads | Skills |
|---|---|---|---|---|
| Orchestrator | All | project-index.md, decision-log.md, open-questions.md, conflict-register.md, phase-plan.md, routing-guide.md, session-protocol.md, skills.md | All documents | [skills.md](tier-2-domain/orchestrator/skills.md) |
| Discover | Discover | assumption-register.md, stakeholder-map.md, process-map-current.md, user-journey-map.md, research-synthesis.md, skills.md | project-index.md, routing-guide.md | [skills.md](tier-2-domain/discover/skills.md) |
| Define | Define | personas.md, affinity-map.md, pain-point-matrix.md, problem-statements.md, success-metrics.md, experience-principles.md, skills.md | project-index.md, routing-guide.md, research-synthesis.md | [skills.md](tier-2-domain/define/skills.md) |
| Design | Develop | wireframes.md, user-flows.md, information-architecture.md, component-library-reference.md, feasibility-notes.md, iteration-log.md, prototype-log.md, skills.md | project-index.md, routing-guide.md, problem-statements.md, personas.md, component-library-reference.md | [skills.md](tier-2-domain/design/skills.md) |
| Deliver | Deliver | state-matrix.md, user-stories.md, acceptance-criteria.md, handoff-docs/, uat-plan.md, uat-findings.md, post-launch-log.md, skills.md | project-index.md, routing-guide.md, wireframes.md, feasibility-notes.md, personas.md | [skills.md](tier-2-domain/deliver/skills.md) |

---

## Domain Document Registry

| Document | Owner | Tier | Status |
|---|---|---|---|
| `project-index.md` | Orchestrator | 1 | Active |
| `routing-guide.md` | Orchestrator | 2 | Active |
| `session-protocol.md` | Orchestrator | 2 | Active |
| `phase-plan.md` | Orchestrator | 2 | On demand |
| `decision-log.md` | Orchestrator | 2 | On demand |
| `open-questions.md` | Orchestrator | 2 | On demand |
| `conflict-register.md` | Orchestrator | 2 | On demand |
| `skills.md` | Orchestrator | 2 | Active |
| `assumption-register.md` | Discover | 2 | On demand |
| `stakeholder-map.md` | Discover | 2 | On demand |
| `process-map-current.md` | Discover | 2 | On demand |
| `user-journey-map.md` | Discover | 2 | On demand |
| `research-synthesis.md` | Discover | 2 | On demand |
| `skills.md` | Discover | 2 | Active |
| `personas.md` | Define | 2 | On demand |
| `affinity-map.md` | Define | 2 | On demand |
| `pain-point-matrix.md` | Define | 2 | On demand |
| `problem-statements.md` | Define | 2 | On demand |
| `success-metrics.md` | Define | 2 | On demand |
| `experience-principles.md` | Define | 2 | On demand |
| `skills.md` | Define | 2 | Active |
| `information-architecture.md` | Design | 2 | On demand |
| `user-flows.md` | Design | 2 | On demand |
| `wireframes.md` | Design | 2 | On demand |
| `component-library-reference.md` | Design | 2 | Active |
| `feasibility-notes.md` | Design | 2 | On demand |
| `iteration-log.md` | Design | 2 | On demand |
| `prototype-log.md` | Design | 2 | On demand |
| `skills.md` | Design | 2 | Active |
| `state-matrix.md` | Deliver | 2 | On demand |
| `user-stories.md` | Deliver | 2 | On demand |
| `acceptance-criteria.md` | Deliver | 2 | On demand |
| `handoff-docs/` | Deliver | 2 | On demand |
| `uat-plan.md` | Deliver | 2 | On demand |
| `uat-findings.md` | Deliver | 2 | On demand |
| `post-launch-log.md` | Deliver | 2 | On demand |
| `skills.md` | Deliver | 2 | Active |

---

## Document Location Guide

- `/foundation/`: Core project context (`context.md`) and design vocabulary reference.
- `/tier-1-active/`: Always-loaded project index (this document).
- `/tier-2-domain/{agent}/`: Domain documents owned by each agent — created on first use.
- `/tier-3-work/`: Ephemeral task outputs and working files.
- `/archive/`: Historical documents and completed phases.

---

*End of Project Index v1.3*
*Next update triggered by: first domain document populated with project content*