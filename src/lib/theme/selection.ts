import type { ThemeKey, ThemeSelection } from "@/config/theme";
import { getThemeConfig } from "@/lib/theme/config";

export const THEME_COOKIE = "app-theme";

export function defaultTheme(): ThemeSelection {
  const config = getThemeConfig();
  return {
    preset: config.preset.default,
    font: config.font.default,
    colorMode: config.colorMode.default,
    radius: config.radius.default,
    contentLayout: config.contentLayout.default,
    scale: config.scale.default,
    sidebar: config.sidebar.default,
    sidebarStyle: config.sidebarStyle.default,
    shadow: config.shadow.default,
    density: config.density.default,
    contrast: config.contrast.default,
  };
}

export function resolveTheme(raw: string | undefined): ThemeSelection {
  const config = getThemeConfig();
  const defaults = defaultTheme();
  if (!raw) {
    return defaults;
  }

  let parsed: Partial<ThemeSelection>;
  try {
    parsed = JSON.parse(raw) as Partial<ThemeSelection>;
  } catch {
    return defaults;
  }

  const selection = { ...defaults };
  (Object.keys(defaults) as ThemeKey[]).forEach((key) => {
    const control = config[key];
    const value = parsed[key];
    if (!control.enabled) {
      return;
    }
    if (
      typeof value === "string" &&
      (control.options as readonly string[]).includes(value)
    ) {
      (selection as Record<ThemeKey, string>)[key] = value;
    }
  });

  return selection;
}

export function themeCookieValue(selection: ThemeSelection) {
  return `${THEME_COOKIE}=${encodeURIComponent(JSON.stringify(selection))}; Path=/; Max-Age=31536000; SameSite=Lax`;
}
