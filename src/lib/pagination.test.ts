import { describe, expect, it } from "vitest";

import { pageCount, toRange } from "@/lib/pagination";

describe("pagination", () => {
  it("turns a page into a limit and offset", () => {
    expect(toRange({ page: 3, pageSize: 20 })).toEqual({
      limit: 20,
      offset: 40,
    });
  });

  it("keeps page and size at least 1", () => {
    expect(toRange({ page: 0, pageSize: 0 })).toEqual({
      limit: 1,
      offset: 0,
    });
  });

  it("counts pages from the total", () => {
    expect(pageCount(0, 20)).toBe(1);
    expect(pageCount(21, 20)).toBe(2);
    expect(pageCount(10, 0)).toBe(1);
  });
});
