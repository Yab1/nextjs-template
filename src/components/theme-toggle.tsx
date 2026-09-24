"use client";

import { useSyncExternalStore } from "react";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
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
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      {dark ? <Moon /> : <Sun />}
    </Button>
  );
}
