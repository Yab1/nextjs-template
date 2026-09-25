"use client";

import { createContext, useContext, useState } from "react";

import { useTheme } from "next-themes";

import type { ThemeKey, ThemeSelection } from "@/config/theme";
import { getThemeConfig } from "@/lib/theme/config";
import { defaultTheme, themeCookieValue } from "@/lib/theme/selection";

const ThemeContext = createContext<{
  selection: ThemeSelection;
  setChoice: (key: ThemeKey, value: string) => void;
  reset: () => void;
} | null>(null);

function applyTheme(selection: ThemeSelection) {
  const root = document.documentElement;
  root.dataset.preset = selection.preset;
  root.dataset.font = selection.font;
  root.dataset.radius = selection.radius;
  root.dataset.scale = selection.scale;
  root.dataset.content = selection.contentLayout;
  root.dataset.sidebar = selection.sidebar;
  root.dataset.sidebarStyle = selection.sidebarStyle;
  root.dataset.shadow = selection.shadow;
  root.dataset.density = selection.density;
  root.dataset.contrast = selection.contrast;
  document.cookie = themeCookieValue(selection);
}

export function ThemeState({
  initial,
  children,
}: {
  initial: ThemeSelection;
  children: React.ReactNode;
}) {
  const [selection, setSelection] = useState(initial);
  const { setTheme } = useTheme();

  function setChoice(key: ThemeKey, value: string) {
    const control = getThemeConfig()[key];
    if (
      !control.enabled ||
      !(control.options as readonly string[]).includes(value)
    ) {
      return;
    }

    const next = { ...selection, [key]: value } as ThemeSelection;
    setSelection(next);
    applyTheme(next);
    if (key === "colorMode") {
      setTheme(value);
    }
  }

  function reset() {
    const next = defaultTheme();
    setSelection(next);
    applyTheme(next);
    setTheme(next.colorMode);
  }

  return (
    <ThemeContext.Provider value={{ selection, setChoice, reset }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeSelection() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeSelection must be used inside ThemeState");
  }
  return context;
}
