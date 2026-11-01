import { describe, expect, it } from "vitest";
import { compareDates } from "../src";

describe("compareDates", () => {
  it("returns -1 when date A is earlier than date B", () => {
    expect(compareDates("2026-11-01", "2026-11-05")).toBe(-1);
    expect(compareDates("2025-12-31", "2026-01-01")).toBe(-1);
    expect(compareDates("0001-01-01", "9999-12-31")).toBe(-1);
  });

  it("returns 1 when date A is later than date B", () => {
    expect(compareDates("2026-11-05", "2026-11-01")).toBe(1);
    expect(compareDates("2026-01-01", "2025-12-31")).toBe(1);
  });

  it("returns 0 when date A is equal to date B", () => {
    expect(compareDates("2026-11-01", "2026-11-01")).toBe(0);
    expect(compareDates("2024-02-29", "2024-02-29")).toBe(0);
  });

  it("works reliably with Array.prototype.sort", () => {
    const dates = ["2026-12-31", "2024-02-29", "2026-01-01", "2025-06-15"];
    const sorted = [...dates].sort(compareDates);
    expect(sorted).toEqual(["2024-02-29", "2025-06-15", "2026-01-01", "2026-12-31"]);
  });

  it("throws TypeError if any date is invalid", () => {
    expect(() => compareDates("invalid", "2026-11-01")).toThrow(TypeError);
    expect(() => compareDates("2026-11-01", "2026-02-30")).toThrow(TypeError);
  });
});

