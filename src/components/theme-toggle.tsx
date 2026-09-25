"use client";

import { useSyncExternalStore } from "react";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { useThemeSelection } from "@/components/theme/theme-context";
import { Button } from "@/components/ui/button";
import { getThemeConfig } from "@/lib/theme/config";

export function ThemeToggle() {
  const { resolvedTheme } = useTheme();
  const { setChoice } = useThemeSelection();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) {
    return <Button variant="outline" size="icon" aria-label="Toggle theme" />;
  }

  const dark = resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => {
        const next = dark ? "light" : "dark";
        const allowed = getThemeConfig().colorMode.options;
        if ((allowed as readonly string[]).includes(next)) {
          setChoice("colorMode", next);
        }
      }}
    >
      {dark ? <Moon /> : <Sun />}
    </Button>
  );
}
