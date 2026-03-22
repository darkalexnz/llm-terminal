# test-app

A chat interface prototype built for exploring LLM UI design. Lives at `projects/test-app/` within the `llm-playground` workspace.

## What this is

A Next.js app with two floating, draggable panels:

1. **Chat modal** — mock LLM chat with typing indicator and random responses
2. **Style Dev Panel** — live style editor that writes CSS custom property overrides to `:root` and persists them to localStorage

The style panel is a design tool, not a debug tool — it's always visible and intended to grow alongside the app as new styling dimensions are needed.

## Stack

- Next.js 16, App Router, TypeScript
- Tailwind CSS v4
- shadcn/ui v4 (Button, Input, Avatar, ScrollArea)

## Run locally

```bash
cd projects/test-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

### Style system

All visual styling is controlled via CSS custom properties on `:root`. The Style Dev Panel writes overrides via a `<style id="style-config">` tag — no component code changes needed to add a new control.

New CSS variables belong in `src/app/globals.css` inside the `:root` and `.dark` blocks with sensible defaults. The app works without the panel active.

**localStorage keys:**
- `style-config` — `{ "--css-var": "value", ... }` flat map
- `style-config-dark` — `"true"` | `"false"`

### Key files

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Chat UI + root layout. Renders both the chat modal and `<StyleDevPanel />` |
| `src/app/globals.css` | CSS variable defaults (shadcn tokens + chat layout vars) |
| `src/hooks/useDraggable.ts` | Shared drag hook used by both floating panels |
| `src/hooks/useStyleConfig.ts` | localStorage read/write + CSS var injection. Exports: `config`, `isDark`, `set`, `reset`, `resetAll`, `toggleDark` |
| `src/components/StyleDevPanel.tsx` | The style panel UI — Colors, Typography, Shape, Spacing sections |
| `src/components/ui/` | shadcn/ui components (don't edit directly) |

### Chat layout CSS variables

These are set in `globals.css` and controlled by the Style Dev Panel:

| Variable | Default | Controls |
|----------|---------|---------|
| `--chat-panel-width` | `400px` | Chat modal width |
| `--chat-panel-height` | `500px` | Chat modal height |
| `--chat-bubble-max-width` | `75%` | Max width of message bubbles |
| `--chat-message-gap` | `16px` | Gap between messages |
| `--font-size-base` | `14px` | Base font size (applied to `body`) |

### Adding a new style control

1. Add a CSS variable default to `:root` (and `.dark`) in `globals.css`
2. Add a `SliderRow`, `ColorRow`, or other control in `StyleDevPanel.tsx` calling `set("--your-var", value)`
3. Use `var(--your-var)` wherever the variable should apply in component code

## Docs

- Spec: `docs/superpowers/specs/2026-03-21-style-dev-panel-design.md`
- Plan: `docs/superpowers/plans/2026-03-21-style-dev-panel.md`
