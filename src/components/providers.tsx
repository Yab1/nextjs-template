"use client";

import { useState } from "react";

import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

import { ThemeState } from "@/components/theme/theme-context";
import { ThemeCustomizer } from "@/components/theme/theme-customizer";
import type { ThemeSelection } from "@/config/theme";
import { createQueryClient } from "@/lib/query-client";
import { getThemeConfig } from "@/lib/theme/config";

export function Providers({
  theme,
  children,
}: {
  theme: ThemeSelection;
  children: React.ReactNode;
}) {
  const [queryClient] = useState(createQueryClient);
  const colorModes = getThemeConfig().colorMode.options;

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={theme.colorMode}
      enableSystem={colorModes.includes("system")}
      disableTransitionOnChange
    >
      <ThemeState initial={theme}>
        <QueryClientProvider client={queryClient}>
          <div className="theme-frame min-h-screen">{children}</div>
          <ThemeCustomizer />
          <Toaster richColors closeButton />
        </QueryClientProvider>
      </ThemeState>
    </ThemeProvider>
  );
}
