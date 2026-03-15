# Routing Guide
*Document type: Domain | Owner: Orchestrator | Tier: 2*
*Status: Active | Last updated: 15 March 2026 | Version: 1.0*
*Linked agents: All*
*Linked documents: project-index.md, session-protocol.md, orchestrator/skills.md, discover/skills.md, define/skills.md, design/skills.md, deliver/skills.md*

---

## Purpose

This is the decision engine for every session. Load it immediately after `project-index.md`. It classifies any natural-language prompt into a task type, identifies the correct agent, and specifies which documents to load — in order — before executing.

---

## 1. Task Taxonomy

| Task Type | Intent Signals | Agent | Docs to Load (in order) |
|---|---|---|---|
| **Project status & orientation** | "where are we", "what phase", "project status", "catch me up", "next phase", "plan transition", "open questions", "blockers" | Orchestrator | project-index.md → phase-plan.md → open-questions.md |
| **Decision logging** | "log this decision", "record that we decided", "note this", "conflict between", "we can't agree on" | Orchestrator | project-index.md → decision-log.md → conflict-register.md |
| **Stakeholder mapping** | "stakeholders", "who is involved", "map the team", "who needs to sign off" | Discover | project-index.md → discover/skills.md → stakeholder-map.md |
| **Current process documentation** | "current process", "as-is", "how it works today", "existing workflow" | Discover | project-index.md → discover/skills.md → process-map-current.md |
| **Research & assumptions** | "synthesise research", "key insights", "what did we learn", "assumption", "we're assuming", "user journey", "what does [user] go through" | Discover | project-index.md → discover/skills.md → research-synthesis.md → assumption-register.md → user-journey-map.md |
| **Persona & problem definition** | "persona", "who is our user", "problem statement", "frame the problem", "HMW", "pain points", "success metrics" | Define | project-index.md → define/skills.md → personas.md → problem-statements.md → research-synthesis.md |
| **Component selection** | "which component", "what component for", "what should I use for", "component for" | Design | project-index.md → design/skills.md → component-library-reference.md |
| **Wireframing & flows** | "wireframe", "design the", "layout for", "user flow", "steps to", "how does a user [action]", "IA", "iterate on design", "refine" | Design | project-index.md → design/skills.md → component-library-reference.md → problem-statements.md → personas.md → wireframes.md → user-flows.md |
| **Feasibility assessment** | "feasibility", "is this possible", "can we build", "technical constraints" | Design | project-index.md → design/skills.md → feasibility-notes.md → wireframes.md |
| **User stories & acceptance criteria** | "user stories", "write stories for", "acceptance criteria", "AC for", "definition of done", "requirements for" | Deliver | project-index.md → deliver/skills.md → user-stories.md → acceptance-criteria.md → wireframes.md → personas.md |
| **State matrix** | "state matrix", "UI states", "all states of", "component states", "interaction states" | Deliver | project-index.md → deliver/skills.md → state-matrix.md → wireframes.md → feasibility-notes.md |
| **UAT & handoff** | "UAT", "user acceptance", "test plan", "handoff doc", "developer spec", "build spec", "post-launch", "live issues" | Deliver | project-index.md → deliver/skills.md → uat-plan.md → uat-findings.md → user-stories.md → acceptance-criteria.md → handoff-docs/ |

---

## 2. Session Activation Sequence

Follow these steps at the start of every session, in order:

1. Load `tier-1-active/project-index.md` — read snapshot, confirm active phase and open decisions
2. Load `orchestrator/routing-guide.md` (this file) — activates routing capability
3. Classify the user's first prompt against the Task Taxonomy above
4. Resolve confidence level:
   - **HIGH** (clear match): proceed to step 5
   - **LOW** (ambiguous): apply Disambiguation Protocol (section 3) before loading any docs
5. Load the docs listed for that task type, in the order specified
6. Load the matched agent's `skills.md` to adopt that persona
7. Announce activated state using this exact format:

```
[Agent name] active.
Loaded: [list of loaded docs]
Task: [task restated in agent's framing]
Ready.
```

8. Execute the task

**Example announce state:**
```
Design agent active.
Loaded: project-index.md, routing-guide.md, design/skills.md, component-library-reference.md,
        problem-statements.md, personas.md, wireframes.md
Task: Wireframe the [feature] — [component library] components, both edit and review states.
Ready.
```

---

## 3. Disambiguation Protocol

When the intent is unclear or matches more than one agent, apply these rules in priority order:

| Rule | Condition | Action |
|---|---|---|
| **1. Phase-first** | Active phase in project-index clearly maps to one agent | Prefer that agent — do not override without strong signal |
| **2. Explicit override** | User names an agent ("as design agent...", "from a deliver perspective", "@design") | Route there immediately, skip other rules |
| **3. Scope test** | "design X" vs "what problem does X solve" vs "who uses X" | "design X" → Design; problem framing → Define; user research → Discover |
| **4. Ask one question** | Still ambiguous after rules 1–3 | Ask: "Are you asking me to [option A — Agent X] or [option B — Agent Y]?" Do not load any Tier 2 docs until resolved |

**Rule 4 cap:** If after one clarifying exchange the intent is still unclear, default to Orchestrator and present the options as a structured list.

---

## 4. Handoff Protocol (switching agents mid-session)

When a task requires switching agent mid-session:

1. Complete or explicitly pause the current agent's task
2. Run the outgoing agent's Handoff Checklist (in their `skills.md`)
3. Save output to the appropriate Tier 2 document; update the document header (status, date, version)
4. Confirm with user and announce:
   ```
   Handing off from [Agent A] to [Agent B].
   [Agent A] output saved to [filename].
   ```
5. Unload [Agent A]'s skill context
6. Load [Agent B]'s `skills.md` + relevant docs per Task Taxonomy
7. Announce [Agent B] active state (format in section 2)

---

## 5. Escalation Rules

Trigger: an agent needs a document that is `Not started` (empty template, no content).

| Requesting Agent | Missing Doc | Upstream Agent | Required Action |
|---|---|---|---|
| Design | `personas.md` | Define | Pause Design task. Announce gap. Offer: "Switch to Define to create personas, then return to Design?" Wait for confirmation. |
| Design | `problem-statements.md` | Define | Same as above. |
| Design | `research-synthesis.md` | Discover | Pause. Ask: "Do you want to populate research synthesis first, or should I proceed with assumptions noted in feasibility-notes.md?" |
| Define | `research-synthesis.md` | Discover | Pause. Offer: "Switch to Discover to run research synthesis first?" Wait for confirmation. |
| Deliver | `wireframes.md` | Design | Pause. Offer: "Switch to Design to create a wireframe stub first?" Wait for confirmation. |
| Any | `project-index.md` | Orchestrator | CRITICAL — halt immediately. Do not proceed without project-index.md. Request it from the user. |

**Escalation cap:** Maximum one upstream escalation per session before surfacing to the user for direction. Never chain escalations silently (e.g. Design → Define → Discover) without user confirmation at each step.

**Proceeding with missing context:** If the user confirms proceeding without an upstream doc, note the assumption explicitly in `feasibility-notes.md` (Design) or the relevant document header before continuing.

---

*End of Routing Guide v1.0*
