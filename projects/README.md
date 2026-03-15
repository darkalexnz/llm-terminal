# projects/

Each subdirectory is an **independent project** with its own CLAUDE.md, memory architecture, and conventions.

Projects are governed by the workspace-level rules in `/WORKSPACE.md` and `/CLAUDE.md` unless their own `CLAUDE.md` explicitly overrides them. Projects are not modelled on or related to each other — every project defines its own structure from scratch.

Workspace-level tasks (improving the LLM Playground itself, updating shared docs) use `/task-plans/` at root — not a project folder.
