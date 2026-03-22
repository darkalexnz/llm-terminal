# Style Dev Panel — Design Spec

## Overview

A floating, draggable dev panel for live-editing the chat app's visual styling. Changes apply instantly via CSS custom property overrides and persist to localStorage. The panel is a design tool that will grow as the app grows — new controls are added alongside new features.

## Architecture

**CSS Custom Properties approach.** The panel writes overrides to `:root` via an injected `<style>` tag. shadcn/ui is already built on CSS variables (`--background`, `--primary`, `--radius`, etc.), so all components respond without any prop-drilling or context wiring.

localStorage stores a flat `{ [cssVar]: value }` map. On mount, `useStyleConfig` reads this map and reapplies overrides to `:root`.

Adding a new control in future = adding one new CSS variable override. No component code changes required.

## Components

### `useStyleConfig` hook (`src/hooks/useStyleConfig.ts`)

- Initialises from localStorage on mount
- Applies overrides to `:root` via a single `<style id="style-config">` tag
- Exposes `set(variable, value)`, `reset(variable)`, `resetAll()`, and the current config map
- Serialises to localStorage on every change

### `StyleDevPanel` (`src/components/StyleDevPanel.tsx`)

- Floating draggable window (reuses the existing `useDraggable` hook from `page.tsx`)
- Fixed initial position: bottom-left corner
- Minimise button collapses to a small badge; badge click restores
- Consumes `useStyleConfig`

**Sections (in order):**

| Section | Controls | CSS Variables |
|---|---|---|
| Colors | Background, Primary, Muted — native `<input type="color">` + hex label. Writes hex values to `:root`; this intentionally deviates from the default oklch token format. | `--background`, `--primary`, `--muted` |
| Typography | Font size slider (10–20px), Font family dropdown with actual CSS font stacks: Geist Sans → `"__Geist_*, sans-serif"`, Inter → `"Inter, sans-serif"`, System UI → `"system-ui, sans-serif"` | `--font-size-base` (new), `--font-sans` |
| Shape | Border radius slider (0–2rem) | `--radius` |
| Spacing | Message gap slider (8–32px), Panel width slider (300–600px), Panel height slider (400–700px), Bubble max-width slider (50–90%) | `--chat-message-gap` (new), `--chat-panel-width` (new), `--chat-panel-height` (new), `--chat-bubble-max-width` (new) |
| Dark / Light | Toggle switch | Calls `document.documentElement.classList.toggle('dark')` directly — no changes to `layout.tsx` |

Sections are separated by dividers. The panel scrolls if content overflows.

**Header:** drag handle, settings cog icon, "Style" label, dark mode toggle pill, Reset button, minimise button.

## Persistence

- localStorage key: `style-config`
- Format: `{ "--primary": "#3b82f6", "--radius": "1rem", ... }`
- Dark mode stored separately as `style-config-dark` (boolean)
- `resetAll()` clears both keys and removes the override style tag

## File Structure

```
src/
  hooks/                    ← new directory
    useDraggable.ts         ← extracted from page.tsx
    useStyleConfig.ts       ← new
  components/
    StyleDevPanel.tsx       ← new
  app/
    page.tsx                ← add <StyleDevPanel />, import useDraggable from hooks/
    layout.tsx              ← no changes needed
```

`useDraggable` is extracted from `page.tsx` into `src/hooks/useDraggable.ts` so both the chat modal and the style panel can share it.

## Constraints

- Dev-only feel but no environment gate — always visible (this is a design tool, not a debug tool)
- No external dependencies beyond what's already installed
- Panel must not interfere with chat modal drag behaviour
- CSS variable names added by the panel (`--font-size-base`, `--chat-*`) must be applied in `globals.css` with their default values so the app works without the panel
- Default values: `--chat-panel-width: 400px`, `--chat-panel-height: 500px`, `--chat-bubble-max-width: 75%`, `--chat-message-gap: 16px`
