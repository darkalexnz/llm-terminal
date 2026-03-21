# Style Dev Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a floating draggable Style Dev Panel that live-edits CSS custom properties (colors, typography, shape, spacing, dark mode) and persists changes to localStorage.

**Architecture:** The panel writes overrides to a `<style id="style-config">` tag on `:root`. shadcn/ui is already built on CSS variables, so all components respond instantly with no prop-drilling. `useStyleConfig` manages the localStorage-backed state; `StyleDevPanel` is the UI. `useDraggable` is extracted from `page.tsx` into a shared hook.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS v4, shadcn/ui v4, localStorage

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/app/globals.css` | Modify | Add default values for new CSS vars |
| `src/hooks/useDraggable.ts` | Create | Extracted drag logic (shared by chat modal + style panel) |
| `src/hooks/useStyleConfig.ts` | Create | localStorage read/write + CSS var injection into `:root` |
| `src/components/StyleDevPanel.tsx` | Create | Floating panel UI — all sections, drag, minimise |
| `src/app/page.tsx` | Modify | Import `useDraggable` from hooks/, add `<StyleDevPanel />`, wire chat vars |

---

### Task 1: Add CSS variable defaults to globals.css

The chat modal currently hardcodes `w-[400px]` and `h-[500px]` in Tailwind classes. We need CSS variables the panel can control. Add them to `globals.css` so the app works without the panel active.

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add new variables to the `:root` block in globals.css**

Add inside the existing `:root { ... }` block (around line 51), after `--radius`:

```css
/* Chat layout — controlled by Style Dev Panel */
--chat-panel-width: 400px;
--chat-panel-height: 500px;
--chat-bubble-max-width: 75%;
--chat-message-gap: 16px;
--font-size-base: 14px;
```

- [ ] **Step 2: Also add matching defaults in the `.dark` block**

Add inside `.dark { ... }` — same variables, same default values (they're layout vars, not color vars, so dark mode doesn't change them):

```css
--chat-panel-width: 400px;
--chat-panel-height: 500px;
--chat-bubble-max-width: 75%;
--chat-message-gap: 16px;
--font-size-base: 14px;
```

- [ ] **Step 3: Wire `--font-size-base` into the `@layer base` block**

Add inside the existing `@layer base { ... }` block (around line 120) so the variable actually affects rendered text:

```css
body {
  @apply bg-background text-foreground;
  font-size: var(--font-size-base);
}
```

(Replace the existing `body { @apply bg-background text-foreground; }` line — just add `font-size` to it.)

- [ ] **Step 4: Verify the dev server still compiles**

```bash
cd projects/test-app && npm run dev
```
Expected: compiles with no errors, app looks unchanged at localhost:3000.

- [ ] **Step 5: Commit**

```bash
git add projects/test-app/src/app/globals.css
git commit -m "feat: add css variable defaults for style panel"
```

---

### Task 2: Extract useDraggable into a shared hook

`useDraggable` is currently defined inline in `page.tsx`. Both the chat modal and the incoming style panel need it, so extract it first.

**Files:**
- Create: `src/hooks/useDraggable.ts`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create `src/hooks/useDraggable.ts`**

```typescript
import { useState, useRef, useCallback } from "react";

export function useDraggable(initialX: number, initialY: number) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const dragState = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      e.preventDefault();
      dragState.current = {
        startX: e.clientX,
        startY: e.clientY,
        origX: position.x,
        origY: position.y,
      };

      const onMouseMove = (ev: MouseEvent) => {
        if (!dragState.current) return;
        setPosition({
          x: dragState.current.origX + (ev.clientX - dragState.current.startX),
          y: dragState.current.origY + (ev.clientY - dragState.current.startY),
        });
      };

      const onMouseUp = () => {
        dragState.current = null;
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [position.x, position.y]
  );

  return { position, onMouseDown };
}
```

- [ ] **Step 2: Update `page.tsx` to import from the hook**

Remove the inline `useDraggable` function definition from `page.tsx` (lines 31–67) and add this import at the top:

```typescript
import { useDraggable } from "@/hooks/useDraggable";
```

Also remove `useCallback` from the React import if it's no longer used elsewhere in `page.tsx` (check first — if `page.tsx` uses `useCallback` for anything else, leave it).

- [ ] **Step 3: Verify in browser**

Reload localhost:3000 — chat modal should still drag correctly.

- [ ] **Step 4: Commit**

```bash
git add projects/test-app/src/hooks/useDraggable.ts projects/test-app/src/app/page.tsx
git commit -m "refactor: extract useDraggable into shared hook"
```

---

### Task 3: Build useStyleConfig hook

This hook owns all style state: reads from localStorage on mount, injects overrides into `:root`, and writes back on every change.

**Files:**
- Create: `src/hooks/useStyleConfig.ts`

- [ ] **Step 1: Create `src/hooks/useStyleConfig.ts`**

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "style-config";
const DARK_STORAGE_KEY = "style-config-dark";
const STYLE_TAG_ID = "style-config";

type StyleMap = Record<string, string>;

function applyToRoot(config: StyleMap, isDark: boolean) {
  let el = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement("style");
    el.id = STYLE_TAG_ID;
    document.head.appendChild(el);
  }

  const declarations = Object.entries(config)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n");

  el.textContent = `:root {\n${declarations}\n}`;

  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function useStyleConfig() {
  const [config, setConfig] = useState<StyleMap>({});
  const [isDark, setIsDark] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const loaded: StyleMap = raw ? JSON.parse(raw) : {};
      const dark = localStorage.getItem(DARK_STORAGE_KEY) === "true";
      setConfig(loaded);
      setIsDark(dark);
      applyToRoot(loaded, dark);
    } catch {
      // ignore malformed localStorage
    }
  }, []);

  const set = useCallback((variable: string, value: string) => {
    setConfig((prev) => {
      const next = { ...prev, [variable]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      applyToRoot(next, isDark);
      return next;
    });
  }, [isDark]);

  const reset = useCallback((variable: string) => {
    setConfig((prev) => {
      const next = { ...prev };
      delete next[variable];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      applyToRoot(next, isDark);
      return next;
    });
  }, [isDark]);

  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DARK_STORAGE_KEY);
    const el = document.getElementById(STYLE_TAG_ID);
    if (el) el.remove();
    document.documentElement.classList.remove("dark");
    setConfig({});
    setIsDark(false);
  }, []);

  const toggleDark = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem(DARK_STORAGE_KEY, String(next));
      applyToRoot(config, next);
      return next;
    });
  }, [config]);

  return { config, isDark, set, reset, resetAll, toggleDark };
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd projects/test-app && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add projects/test-app/src/hooks/useStyleConfig.ts
git commit -m "feat: add useStyleConfig hook with localStorage persistence"
```

---

### Task 4: Build StyleDevPanel component

The full floating panel UI. Draggable via `useDraggable`, minimisable, with all five sections.

**Files:**
- Create: `src/components/StyleDevPanel.tsx`

- [ ] **Step 1: Create `src/components/StyleDevPanel.tsx`**

```typescript
"use client";

import { useState } from "react";
import { useDraggable } from "@/hooks/useDraggable";
import { useStyleConfig } from "@/hooks/useStyleConfig";
import { cn } from "@/lib/utils";

const FONT_OPTIONS = [
  { label: "Geist Sans", value: "var(--font-geist-sans), sans-serif" },
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "System UI", value: "system-ui, sans-serif" },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
      {children}
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-border" />;
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-[11px] text-foreground">{label}</span>
        <span className="text-[10px] text-muted-foreground font-mono">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 accent-foreground cursor-pointer"
      />
    </div>
  );
}

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value.startsWith("#") ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="w-5 h-5 rounded cursor-pointer border border-border bg-transparent p-0"
        />
        <span className="text-[10px] text-muted-foreground font-mono w-14">
          {value}
        </span>
      </div>
    </div>
  );
}

export function StyleDevPanel() {
  const [isOpen, setIsOpen] = useState(true);
  // Static initial position — avoids SSR window access
  const { position, onMouseDown } = useDraggable(16, 500);
  const { config, isDark, set, resetAll, toggleDark } = useStyleConfig();

  const get = (variable: string, fallback: string) =>
    config[variable] ?? fallback;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 bg-foreground text-background text-[10px] font-semibold px-3 py-1.5 rounded-full shadow-lg hover:opacity-80 transition-opacity"
        style={{ zIndex: 100 }}
      >
        ⚙ Style
      </button>
    );
  }

  return (
    <div
      className="fixed flex flex-col w-[260px] rounded-xl border bg-background shadow-2xl overflow-hidden"
      style={{ left: position.x, top: position.y, zIndex: 100 }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between border-b px-3 py-2 cursor-grab active:cursor-grabbing select-none shrink-0 bg-muted/40"
        onMouseDown={onMouseDown}
      >
        <div className="flex items-center gap-1.5">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
            <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
          </svg>
          <span className="text-[11px] font-semibold">Style</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleDark}
            className={cn(
              "text-[9px] font-semibold px-2 py-0.5 rounded-full border transition-colors",
              isDark
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-foreground border-border"
            )}
          >
            {isDark ? "Dark" : "Light"}
          </button>
          <button
            onClick={resetAll}
            className="text-[9px] text-muted-foreground hover:text-foreground transition-colors px-1"
          >
            Reset
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:text-foreground transition-colors leading-none px-1 text-sm"
          >
            —
          </button>
        </div>
      </header>

      {/* Scrollable content */}
      <div className="flex flex-col gap-3.5 p-3 overflow-y-auto max-h-[460px]">

        {/* Colors */}
        <div>
          <SectionLabel>Colors</SectionLabel>
          <div className="flex flex-col gap-2">
            <ColorRow
              label="Background"
              value={get("--background", "#ffffff")}
              onChange={(v) => set("--background", v)}
            />
            <ColorRow
              label="Primary"
              value={get("--primary", "#18181b")}
              onChange={(v) => set("--primary", v)}
            />
            <ColorRow
              label="Muted"
              value={get("--muted", "#f4f4f5")}
              onChange={(v) => set("--muted", v)}
            />
          </div>
        </div>

        <Divider />

        {/* Typography */}
        <div>
          <SectionLabel>Typography</SectionLabel>
          <div className="flex flex-col gap-3">
            <SliderRow
              label="Font size"
              value={parseInt(get("--font-size-base", "14"))}
              min={10}
              max={20}
              step={1}
              unit="px"
              onChange={(v) => set("--font-size-base", `${v}px`)}
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-foreground">Font family</span>
              <select
                value={get("--font-sans", FONT_OPTIONS[0].value)}
                onChange={(e) => set("--font-sans", e.target.value)}
                className="text-[10px] border border-border rounded-md px-1.5 py-0.5 bg-background text-foreground"
              >
                {FONT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <Divider />

        {/* Shape */}
        <div>
          <SectionLabel>Shape</SectionLabel>
          <SliderRow
            label="Border radius"
            value={parseFloat(get("--radius", "0.625"))}
            min={0}
            max={2}
            step={0.05}
            unit="rem"
            onChange={(v) => set("--radius", `${v}rem`)}
          />
        </div>

        <Divider />

        {/* Spacing */}
        <div>
          <SectionLabel>Spacing</SectionLabel>
          <div className="flex flex-col gap-3">
            <SliderRow
              label="Message gap"
              value={parseInt(get("--chat-message-gap", "16"))}
              min={8}
              max={32}
              step={2}
              unit="px"
              onChange={(v) => set("--chat-message-gap", `${v}px`)}
            />
            <SliderRow
              label="Panel width"
              value={parseInt(get("--chat-panel-width", "400"))}
              min={300}
              max={600}
              step={10}
              unit="px"
              onChange={(v) => set("--chat-panel-width", `${v}px`)}
            />
            <SliderRow
              label="Panel height"
              value={parseInt(get("--chat-panel-height", "500"))}
              min={400}
              max={700}
              step={10}
              unit="px"
              onChange={(v) => set("--chat-panel-height", `${v}px`)}
            />
            <SliderRow
              label="Bubble max-width"
              value={parseInt(get("--chat-bubble-max-width", "75"))}
              min={50}
              max={90}
              step={5}
              unit="%"
              onChange={(v) => set("--chat-bubble-max-width", `${v}%`)}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd projects/test-app && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add projects/test-app/src/components/StyleDevPanel.tsx
git commit -m "feat: add StyleDevPanel component"
```

---

### Task 5: Wire StyleDevPanel into the page + use CSS vars in chat modal

Connect the panel to the page, and update the chat modal to read its dimensions from CSS variables so the style panel controls actually affect it.

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add StyleDevPanel import to page.tsx**

Add at the top of `page.tsx` with the other imports:

```typescript
import { StyleDevPanel } from "@/components/StyleDevPanel";
```

- [ ] **Step 2: Update the chat modal div to use CSS variables**

Find the chat modal div (currently `className="fixed flex flex-col w-[400px] h-[500px] ..."`) and replace the hardcoded width/height with CSS variable references via inline style:

```tsx
<div
  className="fixed flex flex-col rounded-xl border bg-background shadow-2xl overflow-hidden"
  style={{
    left: position.x,
    top: position.y,
    zIndex: 50,
    width: "var(--chat-panel-width)",
    height: "var(--chat-panel-height)",
  }}
>
```

- [ ] **Step 3: Update message gap and bubble max-width in the messages list**

Find the messages container div (`className="px-4 py-4 space-y-4"`) and update the gap to use the CSS variable:

```tsx
<div className="px-4 py-4" style={{ display: "flex", flexDirection: "column", gap: "var(--chat-message-gap)" }}>
```

For bubble max-width: each message renders as a flex row (`flex gap-2.5`) containing an Avatar and a bubble div. The bubble div is the *inner* coloured div (the one with `rounded-2xl`, background class, and text content) — **not** the outer alignment wrapper. Apply `maxWidth` to that inner div and remove the `max-w-[75%]` Tailwind class from it:

```tsx
<div
  className={cn(
    "rounded-2xl px-3 py-2 text-sm leading-relaxed",
    message.role === "user"
      ? "bg-primary text-primary-foreground"
      : "bg-muted"
  )}
  style={{ maxWidth: "var(--chat-bubble-max-width)" }}
>
```

- [ ] **Step 4: Add `<StyleDevPanel />` to the JSX**

In the return statement of `ChatPage`, add inside the outer div, alongside the chat modal:

```tsx
<StyleDevPanel />
```

- [ ] **Step 5: Verify in browser**

Reload localhost:3000. Both the chat modal and the style panel should be visible and draggable independently. Opening the style panel and adjusting sliders/colors should update the chat in real time. Reload the page — changes should persist.

- [ ] **Step 6: Verify TypeScript compiles clean**

```bash
cd projects/test-app && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add projects/test-app/src/app/page.tsx
git commit -m "feat: wire StyleDevPanel into chat page"
```

---

### Task 6: Push to GitHub

- [ ] **Push all commits**

```bash
git push origin main
```
