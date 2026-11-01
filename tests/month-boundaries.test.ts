import { describe, expect, it } from "vitest";
import { endOfMonth, startOfMonth } from "../src";

describe("month-boundaries", () => {
  it("returns the first day of the month with startOfMonth", () => {
    expect(startOfMonth("2026-11-15")).toBe("2026-11-01");
    expect(startOfMonth("2026-11-01")).toBe("2026-11-01");
    expect(startOfMonth("2024-02-29")).toBe("2024-02-01");
    expect(startOfMonth("2025-12-31")).toBe("2025-12-01");
  });

  it("returns the last day of the month with endOfMonth for 30 and 31 day months", () => {
    expect(endOfMonth("2026-11-15")).toBe("2026-11-30");
    expect(endOfMonth("2026-01-05")).toBe("2026-01-31");
    expect(endOfMonth("2026-04-10")).toBe("2026-04-30");
    expect(endOfMonth("2026-07-20")).toBe("2026-07-31");
  });

  it("returns February 29 for leap years with endOfMonth", () => {
    expect(endOfMonth("2024-02-10")).toBe("2024-02-29");
    expect(endOfMonth("2000-02-01")).toBe("2000-02-29");
  });

  it("returns February 28 for non-leap years with endOfMonth", () => {
    expect(endOfMonth("2023-02-10")).toBe("2023-02-28");
    expect(endOfMonth("2026-02-15")).toBe("2026-02-28");
    expect(endOfMonth("1900-02-01")).toBe("1900-02-28");
  });

  it("throws TypeError for invalid dates", () => {
    expect(() => startOfMonth("invalid")).toThrow(TypeError);
    expect(() => endOfMonth("2026-02-30")).toThrow(TypeError);
  });
});

