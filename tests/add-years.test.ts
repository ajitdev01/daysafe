import { describe, expect, it } from "vitest";
import { addYears } from "../src";

describe("addYears", () => {
  it("adds years for standard non-leap days", () => {
    expect(addYears("2026-11-02", 2)).toBe("2028-11-02");
    expect(addYears("2026-11-02", -5)).toBe("2021-11-02");
    expect(addYears("2026-11-02", 0)).toBe("2026-11-02");
  });

  it("clamps February 29 to February 28 when target year is not a leap year", () => {
    expect(addYears("2024-02-29", 1)).toBe("2025-02-28");
    expect(addYears("2024-02-29", 2)).toBe("2026-02-28");
    expect(addYears("2024-02-29", 3)).toBe("2027-02-28");
    expect(addYears("2024-02-29", -1)).toBe("2023-02-28");
  });

  it("preserves February 29 when target year is also a leap year", () => {
    expect(addYears("2024-02-29", 4)).toBe("2028-02-29");
    expect(addYears("2024-02-29", -4)).toBe("2020-02-29");
    expect(addYears("2000-02-29", 400)).toBe("2400-02-29");
  });

  it("handles century rules when adding years to leap days", () => {
    // 1900 is not a leap year, 2000 is
    expect(addYears("2000-02-29", -100)).toBe("1900-02-28");
    expect(addYears("2000-02-29", 100)).toBe("2100-02-28");
  });

  it("throws RangeError if target year falls outside 0001-9999", () => {
    expect(() => addYears("0001-05-01", -1)).toThrow(RangeError);
    expect(() => addYears("9999-05-01", 1)).toThrow(RangeError);
  });

  it("throws TypeError for invalid date or amount inputs", () => {
    expect(() => addYears("invalid", 1)).toThrow(TypeError);
    expect(() => addYears("2026-02-30", 1)).toThrow(TypeError);
    expect(() => addYears("2026-11-02", 1.5)).toThrow(TypeError);
    expect(() => addYears("2026-11-02", Number.NaN)).toThrow(TypeError);
  });
});

