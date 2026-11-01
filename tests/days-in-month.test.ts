import { describe, expect, it } from "vitest";
import { getDaysInMonth } from "../src";

describe("getDaysInMonth", () => {
  it("returns 31 days for 31-day months", () => {
    const thirtyOneDayMonths = [1, 3, 5, 7, 8, 10, 12];
    for (const month of thirtyOneDayMonths) {
      expect(getDaysInMonth(2026, month)).toBe(31);
    }
  });

  it("returns 30 days for 30-day months", () => {
    const thirtyDayMonths = [4, 6, 9, 11];
    for (const month of thirtyDayMonths) {
      expect(getDaysInMonth(2026, month)).toBe(30);
    }
  });

  it("returns 29 days for February in a leap year", () => {
    expect(getDaysInMonth(2024, 2)).toBe(29);
    expect(getDaysInMonth(2000, 2)).toBe(29);
    expect(getDaysInMonth(2028, 2)).toBe(29);
  });

  it("returns 28 days for February in common years and non-leap century years", () => {
    expect(getDaysInMonth(2023, 2)).toBe(28);
    expect(getDaysInMonth(2026, 2)).toBe(28);
    expect(getDaysInMonth(1900, 2)).toBe(28);
    expect(getDaysInMonth(2100, 2)).toBe(28);
  });

  it("throws RangeError for months outside 1-12", () => {
    expect(() => getDaysInMonth(2026, 0)).toThrow(RangeError);
    expect(() => getDaysInMonth(2026, 13)).toThrow(RangeError);
    expect(() => getDaysInMonth(2026, -1)).toThrow(RangeError);
  });

  it("throws RangeError for years outside 1-9999", () => {
    expect(() => getDaysInMonth(0, 1)).toThrow(RangeError);
    expect(() => getDaysInMonth(10000, 1)).toThrow(RangeError);
    expect(() => getDaysInMonth(-100, 1)).toThrow(RangeError);
  });

  it("throws TypeError for non-integer inputs", () => {
    expect(() => getDaysInMonth(2026.5, 2)).toThrow(TypeError);
    expect(() => getDaysInMonth(2026, 2.5)).toThrow(TypeError);
    expect(() => getDaysInMonth(Number.NaN, 2)).toThrow(TypeError);
  });
});

