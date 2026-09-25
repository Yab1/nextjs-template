"use client";

import { useState } from "react";

import { useThemeSelection } from "@/components/theme/theme-context";
import { Button } from "@/components/ui/button";
import type { ThemeKey } from "@/config/theme";
import { getThemeConfig } from "@/lib/theme/config";

const labels: Record<ThemeKey, string> = {
  preset: "Theme preset",
  font: "Font",
  colorMode: "Color mode",
  radius: "Radius",
  contentLayout: "Content layout",
  scale: "Scale",
  sidebar: "Sidebar",
  sidebarStyle: "Sidebar style",
  shadow: "Shadow",
  density: "Density",
  contrast: "Contrast",
};

export function ThemeCustomizer() {
  const config = getThemeConfig();
  const { selection, setChoice, reset } = useThemeSelection();
  const [open, setOpen] = useState(false);

  if (!config.panel) {
    return null;
  }

  const keys = (Object.keys(labels) as ThemeKey[]).filter(
    (key) => config[key].enabled && config[key].options.length > 0
  );

  return (
    <div className="fixed right-4 bottom-4 z-40">
      {open ? (
        <section className="border-border bg-background mb-3 w-72 rounded-[var(--radius)] border p-4 shadow-[var(--shadow)]">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Theme</h2>
            <Button variant="ghost" onClick={reset}>
              Reset
            </Button>
          </div>
          <div className="flex flex-col gap-3">
            {keys.map((key) => (
              <label key={key} className="flex flex-col gap-1 text-sm">
                {labels[key]}
                <select
                  className="border-border bg-background h-9 rounded-[var(--radius)] border px-2"
                  value={selection[key]}
                  onChange={(event) => setChoice(key, event.target.value)}
                >
                  {config[key].options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </section>
      ) : null}
      <Button onClick={() => setOpen((value) => !value)}>Theme</Button>
    </div>
  );
}
