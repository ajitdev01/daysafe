import { describe, expect, it } from "vitest";
import { addMonths } from "../src";

describe("addMonths", () => {
  it("adds months without changing the day when day exists in target month", () => {
    expect(addMonths("2026-01-15", 1)).toBe("2026-02-15");
    expect(addMonths("2026-01-15", 3)).toBe("2026-04-15");
    expect(addMonths("2026-01-15", 0)).toBe("2026-01-15");
  });

  it("clamps to end of month when target month has fewer days (common year)", () => {
    expect(addMonths("2026-01-31", 1)).toBe("2026-02-28");
    expect(addMonths("2026-03-31", 1)).toBe("2026-04-30");
    expect(addMonths("2026-05-31", 1)).toBe("2026-06-30");
    expect(addMonths("2026-08-31", 1)).toBe("2026-09-30");
    expect(addMonths("2026-10-31", 1)).toBe("2026-11-30");
  });

  it("clamps to February 29 in leap years", () => {
    expect(addMonths("2024-01-31", 1)).toBe("2024-02-29");
    expect(addMonths("2024-03-31", -1)).toBe("2024-02-29");
  });

  it("handles negative month additions (subtraction)", () => {
    expect(addMonths("2026-03-31", -1)).toBe("2026-02-28");
    expect(addMonths("2026-05-31", -1)).toBe("2026-04-30");
    expect(addMonths("2026-02-15", -3)).toBe("2025-11-15");
  });

  it("handles multi-year month spans and rollovers", () => {
    expect(addMonths("2026-11-15", 3)).toBe("2027-02-15");
    expect(addMonths("2026-01-15", 24)).toBe("2028-01-15");
    expect(addMonths("2026-01-15", -24)).toBe("2024-01-15");
  });

  it("throws RangeError if target year falls outside 0001-9999", () => {
    expect(() => addMonths("0001-01-01", -1)).toThrow(RangeError);
    expect(() => addMonths("9999-12-01", 1)).toThrow(RangeError);
  });

  it("throws TypeError for invalid input", () => {
    expect(() => addMonths("invalid", 1)).toThrow(TypeError);
    expect(() => addMonths("2026-02-30", 1)).toThrow(TypeError);
    expect(() => addMonths("2026-01-15", 1.5)).toThrow(TypeError);
    expect(() => addMonths("2026-01-15", Number.NaN)).toThrow(TypeError);
  });
});

