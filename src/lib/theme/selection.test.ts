import { describe, expect, it } from "vitest";

import { resolveTheme } from "@/lib/theme/selection";

describe("resolveTheme", () => {
  it("uses config defaults when the cookie is missing or junk", () => {
    expect(resolveTheme(undefined).sidebar).toBe("left");
    expect(resolveTheme("not-json").radius).toBe("md");
  });

  it("keeps a value that the config allows", () => {
    const theme = resolveTheme(
      JSON.stringify({ sidebar: "top", radius: "lg" })
    );

    expect(theme.sidebar).toBe("top");
    expect(theme.radius).toBe("lg");
  });

  it("drops a value that the config does not allow", () => {
    const theme = resolveTheme(
      JSON.stringify({ sidebar: "middle", radius: "xl" })
    );

    expect(theme.sidebar).toBe("left");
    expect(theme.radius).toBe("md");
  });
});
