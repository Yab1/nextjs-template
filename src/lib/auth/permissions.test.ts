import { describe, expect, it } from "vitest";

import { hasPermission } from "@/lib/auth/permissions";

describe("hasPermission", () => {
  it("lets a user open the dashboard and blocks admin", () => {
    expect(hasPermission(["user"], "dashboard:view")).toBe(true);
    expect(hasPermission(["user"], "admin:view")).toBe(false);
  });

  it("lets an admin open both", () => {
    expect(hasPermission(["admin"], "dashboard:view")).toBe(true);
    expect(hasPermission(["admin"], "admin:view")).toBe(true);
  });

  it("denies a missing role list", () => {
    expect(hasPermission(undefined, "dashboard:view")).toBe(false);
  });
});
