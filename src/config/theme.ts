type Choice<T extends string> = {
  enabled: boolean;
  options: readonly T[];
  default: T;
};

function choice<T extends string>(
  options: readonly T[],
  fallback: T,
  enabled = true
): Choice<T> {
  return { enabled, options, default: fallback };
}

/**
 * Allowed theme controls. Delete an option to hide it.
 * Sidebar example: options: ["top", "bottom"] allows only those two.
 * Later, getThemeConfig() can return this same shape from the API.
 */
export const themeConfig = {
  panel: true,
  preset: choice(["default", "blue", "green"] as const, "default"),
  font: choice(["geist", "inter"] as const, "geist"),
  colorMode: choice(["light", "dark", "system"] as const, "system"),
  radius: choice(["none", "sm", "md", "lg"] as const, "md"),
  contentLayout: choice(["compact", "full"] as const, "full"),
  scale: choice(["sm", "md", "lg"] as const, "md"),
  sidebar: choice(["left", "right", "top", "bottom"] as const, "left"),
  sidebarStyle: choice(["flush", "inset", "floating"] as const, "flush"),
  shadow: choice(["none", "sm", "md"] as const, "sm"),
  density: choice(["compact", "comfortable"] as const, "comfortable"),
  contrast: choice(["default", "high"] as const, "default"),
};

export type ThemeConfig = typeof themeConfig;
export type ThemeKey = Exclude<keyof ThemeConfig, "panel">;
export type ThemeSelection = {
  [Key in ThemeKey]: ThemeConfig[Key]["default"];
};
