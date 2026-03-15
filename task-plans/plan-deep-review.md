# plan-deep-review.md

*Task: Deep review of llm-terminal workspace and agentic-product-design-system project*
*Phase: Research complete — awaiting user review before planning*

---

## Research

### Workspace root (llm-terminal/)

| File | Status | Notes |
|---|---|---|
| CLAUDE.md | Active | Thin wrapper — imports WORKSPACE.md via @, adds 3 Claude-specific rules |
| GEMINI.md | Active | Thin wrapper — references WORKSPACE.md, adds Gemini-specific tooling/comms rules |
| WORKSPACE.md | Active | Shared context: mission, user profile summary, multi-project rules, comms style, document standards, Task Execution Protocol (3-phase) |
| about-user.md | Active | Full user profile — canonical source for role, goals, tools, workflow |
| markdown-visuals.md | Active | Cross-tool wireframing reference — rendering compatibility, ASCII, shadcn naming, Mermaid guidance |
| task-plans/ | Empty | Directory exists (.gitkeep), no plans yet |

---

### Project: agentic-product-design-system

#### Architecture
- 5 agents: Orchestrator, Discover, Define, Design, Deliver
- 3-tier memory: Tier 1 (always-loaded), Tier 2 (on-demand), Tier 3 (ephemeral)
- Single LLM session — agents are role-switches, not separate processes
- Routing via routing-guide.md (27 task types → agent + doc loading list)

#### File status

| File | Substantive? | Notes |
|---|---|---|
| CLAUDE.md (project) | Yes | Tiered memory rules, agent ownership, standard header, session start protocol |
| GEMINI.md (project) | Yes | Near-identical to project CLAUDE.md — sync debt |
| README.md | Yes (redundant) | Duplicates project-index.md and CLAUDE.md in prose form |
| foundation/context.md | Yes | Project details: stack, team, workflow, real problems, agentic system overview |
| foundation/project-index-template.md | Template only | Redundant now that actual docs exist |
| foundation/skills-template.md | Template only | Redundant now that actual docs exist |
| tier-1-active/project-index.md | Partial | Structure complete; **Project Snapshot block is all placeholders — never filled in** |
| tier-2-domain/orchestrator/routing-guide.md | Yes | 27 task types, doc-loading table, disambiguation + escalation protocols |
| tier-2-domain/orchestrator/session-protocol.md | Yes | Cold start, warm start, role-switching, close housekeeping, Tier 3 policy |
| tier-2-domain/orchestrator/skills.md | Yes | Role, owned docs, activation conditions, output schema, handoff checklist |
| tier-2-domain/orchestrator/phase-plan.md | Empty stub | Template only |
| tier-2-domain/orchestrator/decision-log.md | Empty stub | Template only |
| tier-2-domain/orchestrator/open-questions.md | Empty stub | Template only |
| tier-2-domain/orchestrator/conflict-register.md | Empty stub | Template only |
| tier-2-domain/discover/skills.md | Yes | Role, activation, output schema, handoff checklist |
| tier-2-domain/discover/*.md (5 files) | Empty stubs | assumption-register, stakeholder-map, process-map-current, user-journey-map, research-synthesis |
| tier-2-domain/define/skills.md | Yes | Role, activation, output schema, handoff checklist |
| tier-2-domain/define/*.md (6 files) | Empty stubs | personas, affinity-map, pain-point-matrix, problem-statements, success-metrics, experience-principles |
| tier-2-domain/design/skills.md | Yes | Role, activation, output schema, handoff checklist |
| tier-2-domain/design/component-library-reference.md | Yes — substantive | 15 shadcn/ui components documented with props, variants, domain patterns |
| tier-2-domain/design/*.md (6 files) | Empty stubs | wireframes, user-flows, information-architecture, feasibility-notes, iteration-log, prototype-log |
| tier-2-domain/deliver/skills.md | Yes | Role, activation, output schema, handoff checklist |
| tier-2-domain/deliver/*.md (6 files) | Empty stubs | state-matrix, user-stories, acceptance-criteria, uat-plan, uat-findings, post-launch-log |
| tier-3-work/planning.md | Active (aging) | 38 setup tasks DONE, 8 TODO — was useful during build, now mostly history |
| tier-3-work/README.md | Yes | Tier 3 policy: keep / delete / archive rules |

**Total Tier 2 docs:** 31
**Substantive:** 9 (skills.md ×5, routing-guide, session-protocol, component-library-reference, project-index)
**Empty stubs:** 22

---

### Issues found

**Blocking**
- Project snapshot in project-index.md is entirely placeholder — no product name, stack, stage, or open decisions. Every agent loads this first; without it the system has no orientation.

**Duplication / sync debt**
- Project-level CLAUDE.md and GEMINI.md are near-identical (same problem fixed at workspace level in previous session)
- project-index.md standard header block appears in 3 places (root CLAUDE.md, project CLAUDE.md, project-index.md itself)
- routing-guide.md task taxonomy (27 types) overlaps significantly with activation conditions in each agent's skills.md
- README.md repeats folder structure and agent roster already in project-index.md and CLAUDE.md

**Noise / dead weight**
- 22 empty Tier 2 stub files
- foundation/project-index-template.md and skills-template.md (redundant now actual docs exist)
- tier-3-work/planning.md (setup log, value mostly exhausted)

**Over-engineering vs. current stage**
- Session start loads 3 documents before classifying the first prompt — disproportionate for simple tasks
- 27 task types in routing-guide; realistic near-term use is ~10–12

---

## Plan

*User annotations incorporated. CLAUDE.md and WORKSPACE.md updated to enforce protocol. Plan below.*

---

### Part A — Reimagine the `projects/` folder structure

**Goal:** Create a clear structural separation between two modes of work:
1. **Workspace-level work** — tasks that improve or operate on the LLM Terminal itself (e.g. today's review, updating WORKSPACE.md, creating skills)
2. **Project-level work** — tasks within a specific product project (e.g. wireframes, user stories, decisions for the Offer Management Platform)

**Current problem:** The boundary is implicit. `task-plans/` handles workspace tasks. Projects live in `projects/`. But there's no clear convention distinguishing what belongs where, and the `projects/` folder contains two empty placeholder directories that add noise.

**Proposed changes:**

- [ ] Delete `projects/pdr-writer/` and `projects/test-project/` — empty, add clutter, create false expectations - *Skip.* 
- [ ] Add a `README.md` to `projects/` that defines the convention:
  - This folder contains **product projects only** — each with its own CLAUDE.md, memory architecture, and agent system
  - Workspace-level tasks (improving the terminal itself, updating shared docs) use `task-plans/` at root — not a project folder
  - New projects get their own subdirectory following the `agentic-product-design-system` structure as the reference - *NO! This is the whole issue - each project should be it's own thing, not related to other projects but influenced by llm-terminal rules and procedures unless stated otherwise. THIS IS IMPORTANT*
- [ ] Add a `README.md` to `task-plans/` that defines its scope:
  - Workspace-level planning only — `plan-[task-name].md` per task
  - Not for project-specific task planning (that goes in the project's `tier-3-work/`)

---

### Part B — Reimagine `projects/agentic-product-design-system`

**Goal:** Leaner, cleaner, clearer. Remove scaffolding that hasn't earned its place. Reduce maintenance overhead.

**1. Fill the project snapshot (blocker — do this first)**
- [ ] Populate the Project Snapshot block in `tier-1-active/project-index.md`:
  - Product: Offer Management Platform
  - Org: NZ Telco (internal)
  - Stack: React, TypeScript, Azure, shadcn/ui, Git/GitHub, Azure DevOps
  - Stage: Pre-launch MVP — DeviceOps UAT done, Creative and Catalogue flows in progress
  - Primary users: DeviceOps, Creative, Catalogue teams
  - Open decisions: Design system migration status; AI mandate owner

**2. Delete 22 empty Tier 2 stub files**
- [ ] Remove all "Not started" domain docs — they add noise without value; the output schemas in each agent's skills.md already define the structure
- Orchestrator: `phase-plan.md`, `decision-log.md`, `open-questions.md`, `conflict-register.md`
- Discover: `assumption-register.md`, `stakeholder-map.md`, `process-map-current.md`, `user-journey-map.md`, `research-synthesis.md`
- Define: `personas.md`, `affinity-map.md`, `pain-point-matrix.md`, `problem-statements.md`, `success-metrics.md`, `experience-principles.md`
- Design: `wireframes.md`, `user-flows.md`, `information-architecture.md`, `feasibility-notes.md`, `iteration-log.md`, `prototype-log.md`
- Deliver: `state-matrix.md`, `user-stories.md`, `acceptance-criteria.md`, `uat-plan.md`, `uat-findings.md`, `post-launch-log.md`
- [ ] Update the domain document registry in `project-index.md` to reflect "created on first use" for all removed docs

**3. Merge project-level CLAUDE.md and GEMINI.md**
- [ ] Create `projects/agentic-product-design-system/PROJECT.md` with the shared content (tiered memory rules, agent ownership model, document header standard, session start order, Tier 3 policy)
- [ ] Reduce `CLAUDE.md` to: pointer to PROJECT.md + Claude-specific session behaviour
- [ ] Reduce `GEMINI.md` to: pointer to PROJECT.md + Gemini-specific notes

**4. Retire redundant files**
- [ ] Delete `foundation/project-index-template.md` — the actual `project-index.md` is the template now
- [ ] Delete `foundation/skills-template.md` — the actual `skills.md` files are the reference
- [ ] Delete `tier-3-work/planning.md` — setup log, value exhausted; migrate the 8 open TODO items into `project-index.md` open decisions before deleting
- [ ] Trim `README.md` to 3–4 lines: what this project is, start with `project-index.md`, see `CLAUDE.md` for session instructions

**5. Trim the routing-guide task taxonomy**
- [ ] Reduce from 27 task types to ~12 covering realistic near-term use:
  - Project status / orientation
  - Decision logging
  - Stakeholder mapping
  - Research synthesis
  - Persona development
  - Problem statement writing
  - Component query / UI pattern
  - Wireframing
  - User flow design
  - User story writing
  - Acceptance criteria
  - UAT planning
- [ ] Remove redundant activation descriptions that duplicate skills.md — keep the doc-loading column as the unique value

---

### Task checklist

- [x] A1: ~~Delete `projects/pdr-writer/` and `projects/test-project/`~~ — skipped per user
- [x] A2: Add `projects/README.md` — projects are independent, each governed by own CLAUDE.md + workspace rules
- [x] A3: Add `task-plans/README.md` defining scope of task-plans/
- [x] B1: Fill project snapshot in `project-index.md`
- [x] B2: Delete 22 empty Tier 2 stubs + update registry to "On demand"
- [x] B3: Create `PROJECT.md`, slim down `CLAUDE.md` + `GEMINI.md` at project level
- [x] B4: Delete 2 templates + planning.md + trimmed README to 4 lines
- [x] B5: Trim routing-guide taxonomy from 27 → 12 task types
