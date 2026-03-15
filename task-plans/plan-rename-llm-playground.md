# Task Plan: Rename llm-terminal → llm-playground

*Task: Comprehensive rename of workspace from "llm-terminal" / "LLM Terminal" to "llm-playground" / "LLM Playground"*

---

## Research

### Scope of changes

**1. Directory rename**
- `/Users/abc/Desktop/llm-terminal` → `/Users/abc/Desktop/llm-playground`

**2. File content — path strings (`llm-terminal` → `llm-playground`)**

| File | Change |
|------|--------|
| `.claude/settings.local.json` | 3 hardcoded paths: lines 8, 10, 11, 12, 13 |

**3. File content — display name (`LLM Terminal` → `LLM Playground`)**

| File | Lines |
|------|-------|
| `CLAUDE.md` | 3 |
| `GEMINI.md` | 3 |
| `WORKSPACE.md` | 3, 7 |
| `projects/README.md` | ~7 |
| `task-plans/plan-deep-review.md` | 3, 10, 98, 109 |

**4. Git remote URL**
- `.git/config`: `https://github.com/darkalexnz/llm-terminal.git`
- Requires the GitHub repo to be renamed first at github.com/darkalexnz/llm-terminal → Settings → rename
- Then update local remote: `git remote set-url origin https://github.com/darkalexnz/llm-playground.git`

**5. Claude Code memory directory**
- Current: `/Users/abc/.claude/projects/-Users-abc-Desktop-LLM-Terminal/`
- After rename: Claude Code will look for `-Users-abc-Desktop-llm-playground/`
- Memory dir is currently empty — safe to rename

### What is NOT affected
- No `package.json`, `tsconfig.json`, `.env`, or other config files contain the name
- No code files reference the workspace name
- The git history is unaffected by a directory rename

---

## Plan

### Rationale
Do all file content edits first (while still in the original path), then rename the directory last — avoids path breakage mid-operation.

### Steps

- [x] 1. Update `CLAUDE.md` — "LLM Terminal" → "LLM Playground"
- [x] 2. Update `GEMINI.md` — "LLM Terminal" → "LLM Playground"
- [x] 3. Update `WORKSPACE.md` — both "LLM Terminal" occurrences
- [x] 4. Update `projects/README.md` — "LLM Terminal" → "LLM Playground"
- [x] 5. Update `task-plans/plan-deep-review.md` — all "llm-terminal" and "LLM Terminal" occurrences
- [x] 6. Update `.claude/settings.local.json` — all path references
- [x] 7. Rename directory: `mv /Users/abc/Desktop/llm-terminal /Users/abc/Desktop/llm-playground`
- [x] 8. Rename Claude memory dir: `-Users-abc-Desktop-LLM-Terminal` → `-Users-abc-Desktop-llm-playground`
- [ ] 9. Update git remote URL (requires GitHub repo rename first — user action)

### Trade-offs
- **Git remote**: GitHub repo rename is a user action outside the filesystem. We update the local remote URL as part of this task; user must rename the repo on GitHub separately beforehand (or after — GitHub redirects old URLs temporarily).
- **Memory dir**: Empty, so rename is zero-risk. If it weren't empty, a copy+verify approach would be safer.
- **Order**: File edits before directory rename avoids operating on a moved path mid-plan.
