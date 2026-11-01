import { describe, expect, it } from "vitest";
import { addDays } from "../src";

describe("addDays", () => {
  it("adds days within the same month", () => {
    expect(addDays("2026-11-02", 5)).toBe("2026-11-07");
    expect(addDays("2026-11-02", 0)).toBe("2026-11-02");
  });

  it("adds days across month boundaries", () => {
    expect(addDays("2026-11-28", 5)).toBe("2026-12-03");
    expect(addDays("2026-01-30", 3)).toBe("2026-02-02");
  });

  it("adds days across year boundaries", () => {
    expect(addDays("2026-12-30", 5)).toBe("2027-01-04");
  });

  it("correctly handles leap days", () => {
    expect(addDays("2024-02-28", 1)).toBe("2024-02-29");
    expect(addDays("2024-02-29", 1)).toBe("2024-03-01");
    expect(addDays("2023-02-28", 1)).toBe("2023-03-01");
  });

  it("correctly handles century rules for leap years", () => {
    // 2000 is a leap year
    expect(addDays("2000-02-28", 1)).toBe("2000-02-29");
    expect(addDays("2000-02-29", 1)).toBe("2000-03-01");
    // 1900 is NOT a leap year
    expect(addDays("1900-02-28", 1)).toBe("1900-03-01");
  });

  it("subtracts days with negative amounts", () => {
    expect(addDays("2026-11-02", -2)).toBe("2026-10-31");
    expect(addDays("2026-01-03", -5)).toBe("2025-12-29");
    expect(addDays("2024-03-01", -1)).toBe("2024-02-29");
    expect(addDays("2023-03-01", -1)).toBe("2023-02-28");
  });

  it("handles multi-year and century day additions", () => {
    // 365 days from non-leap 2025-01-01 is 2026-01-01
    expect(addDays("2025-01-01", 365)).toBe("2026-01-01");
    // 366 days from leap 2024-01-01 is 2025-01-01
    expect(addDays("2024-01-01", 366)).toBe("2025-01-01");
  });

  it("throws RangeError if result falls outside 0001-9999", () => {
    expect(() => addDays("0001-01-01", -1)).toThrow(RangeError);
    expect(() => addDays("9999-12-31", 1)).toThrow(RangeError);
  });

  it("throws TypeError for invalid date or amount inputs", () => {
    expect(() => addDays("invalid", 5)).toThrow(TypeError);
    expect(() => addDays("2026-02-30", 5)).toThrow(TypeError);
    expect(() => addDays("2026-11-02", 2.5)).toThrow(TypeError);
    expect(() => addDays("2026-11-02", Number.NaN)).toThrow(TypeError);
  });
});

