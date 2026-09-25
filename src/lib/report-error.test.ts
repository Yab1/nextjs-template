import { describe, expect, it, vi } from "vitest";

import { reportError } from "@/lib/report-error";

describe("reportError", () => {
  it("logs the message and context", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    reportError(new Error("boom"), { path: "/dashboard" });

    const entry = spy.mock.calls[0]?.[0] as {
      message: string;
      path: string;
    };
    expect(entry.message).toBe("boom");
    expect(entry.path).toBe("/dashboard");

    spy.mockRestore();
  });
});
