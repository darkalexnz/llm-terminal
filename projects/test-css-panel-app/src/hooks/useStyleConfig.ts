"use client";

import { useState, useEffect, useCallback, useRef } from "react";

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

  // Refs mirror state so callbacks always read current values
  const configRef = useRef<StyleMap>({});
  const isDarkRef = useRef(false);

  // Keep refs in sync with state
  useEffect(() => { configRef.current = config; }, [config]);
  useEffect(() => { isDarkRef.current = isDark; }, [isDark]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const loaded: StyleMap = raw ? JSON.parse(raw) : {};
      const dark = localStorage.getItem(DARK_STORAGE_KEY) === "true";
      configRef.current = loaded;
      isDarkRef.current = dark;
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
      configRef.current = next;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      applyToRoot(next, isDarkRef.current);
      return next;
    });
  }, []);

  const reset = useCallback((variable: string) => {
    setConfig((prev) => {
      const next = { ...prev };
      delete next[variable];
      configRef.current = next;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      applyToRoot(next, isDarkRef.current);
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DARK_STORAGE_KEY);
    const el = document.getElementById(STYLE_TAG_ID);
    if (el) el.remove();
    document.documentElement.classList.remove("dark");
    configRef.current = {};
    isDarkRef.current = false;
    setConfig({});
    setIsDark(false);
  }, []);

  const toggleDark = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      isDarkRef.current = next;
      localStorage.setItem(DARK_STORAGE_KEY, String(next));
      applyToRoot(configRef.current, next);
      return next;
    });
  }, []);

  return { config, isDark, set, reset, resetAll, toggleDark };
}
