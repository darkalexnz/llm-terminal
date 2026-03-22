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
        className="fixed bottom-4 left-4 bg-foreground text-background text-[10px] font-semibold px-3 py-1.5 rounded-full shadow-lg hover:opacity-80 transition-opacity"
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
