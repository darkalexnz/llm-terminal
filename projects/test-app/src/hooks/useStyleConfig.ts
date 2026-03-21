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
