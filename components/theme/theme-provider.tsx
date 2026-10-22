"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_THEME,
  THEMES,
  THEME_STORAGE_KEY,
  isThemeId,
  type ThemeId,
} from "@/lib/themes";

interface ThemeContextValue {
  /** Active palette. */
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Paint the palette on <html> and keep the browser chrome in step. The inline
 * script in the root layout has already set `data-theme` before first paint;
 * this only has to reconcile the meta tag and later changes.
 */
function applyTheme(theme: ThemeId) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  const chrome = THEMES.find((entry) => entry.id === theme)?.chrome;
  if (!chrome) return;
  const meta = document.querySelector('meta[name="theme-color"]');
  meta?.setAttribute("content", chrome);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);

  useEffect(() => {
    const initial = document.documentElement.dataset.theme;
    if (isThemeId(initial)) {
      setThemeState(initial);
      applyTheme(initial);
    } else {
      let saved: string | null = null;
      try {
        saved = window.localStorage.getItem(THEME_STORAGE_KEY);
      } catch {
        // Storage can be blocked; the default palette still renders.
      }
      const next = isThemeId(saved) ? saved : DEFAULT_THEME;
      setThemeState(next);
      applyTheme(next);
    }

    function onStorage(event: StorageEvent) {
      if (event.key !== THEME_STORAGE_KEY) return;
      if (!isThemeId(event.newValue)) {
        setThemeState(DEFAULT_THEME);
        applyTheme(DEFAULT_THEME);
        return;
      }
      setThemeState(event.newValue);
      applyTheme(event.newValue);
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setTheme = useCallback((next: ThemeId) => {
    setThemeState(next);
    applyTheme(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // A blocked store only costs the preference, not the current view.
    }
  }, []);

  const value = useMemo<ThemeContextValue>(() => ({ theme, setTheme }), [theme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }
  return context;
}
