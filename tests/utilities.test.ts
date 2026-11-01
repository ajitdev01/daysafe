import { describe, expect, it } from "vitest";
import {
  fromDateParts,
  isAfter,
  isBefore,
  isBetween,
  isSame,
  maxDate,
  minDate,
  toDateParts,
  todayUtc,
} from "../src";

describe("minDate and maxDate", () => {
  it("returns the earliest date with minDate", () => {
    expect(minDate("2026-11-05", "2026-11-02", "2026-11-08")).toBe("2026-11-02");
    expect(minDate("2024-02-29", "2024-03-01")).toBe("2024-02-29");
    expect(minDate("2026-01-01")).toBe("2026-01-01");
  });

  it("returns the latest date with maxDate", () => {
    expect(maxDate("2026-11-05", "2026-11-02", "2026-11-08")).toBe("2026-11-08");
    expect(maxDate("2024-02-29", "2024-03-01")).toBe("2024-03-01");
    expect(maxDate("2026-01-01")).toBe("2026-01-01");
  });

  it("throws TypeError if minDate or maxDate is called with no arguments", () => {
    expect(() => minDate()).toThrow(TypeError);
    expect(() => maxDate()).toThrow(TypeError);
  });

  it("throws TypeError if any argument in minDate or maxDate is invalid", () => {
    expect(() => minDate("2026-11-02", "invalid")).toThrow(TypeError);
    expect(() => maxDate("invalid", "2026-11-02")).toThrow(TypeError);
  });
});

describe("date-helpers (isBefore, isAfter, isSame, isBetween, toDateParts, fromDateParts, todayUtc)", () => {
  it("evaluates isBefore correctly", () => {
    expect(isBefore("2026-11-01", "2026-11-02")).toBe(true);
    expect(isBefore("2026-11-02", "2026-11-01")).toBe(false);
    expect(isBefore("2026-11-01", "2026-11-01")).toBe(false);
  });

  it("evaluates isAfter correctly", () => {
    expect(isAfter("2026-11-02", "2026-11-01")).toBe(true);
    expect(isAfter("2026-11-01", "2026-11-02")).toBe(false);
    expect(isAfter("2026-11-01", "2026-11-01")).toBe(false);
  });

  it("evaluates isSame correctly", () => {
    expect(isSame("2026-11-01", "2026-11-01")).toBe(true);
    expect(isSame("2026-11-01", "2026-11-02")).toBe(false);
  });

  it("evaluates isBetween with inclusive and exclusive bounds", () => {
    expect(isBetween("2026-11-05", "2026-11-01", "2026-11-10")).toBe(true);
    expect(isBetween("2026-11-01", "2026-11-01", "2026-11-10", true)).toBe(true);
    expect(isBetween("2026-11-01", "2026-11-01", "2026-11-10", false)).toBe(false);
    expect(isBetween("2026-11-15", "2026-11-01", "2026-11-10")).toBe(false);
    // Reversed bounds support
    expect(isBetween("2026-11-05", "2026-11-10", "2026-11-01")).toBe(true);
  });

  it("converts date to parts with toDateParts", () => {
    expect(toDateParts("2026-11-02")).toEqual({
      year: 2026,
      month: 11,
      day: 2,
    });
  });

  it("builds valid date from parts with fromDateParts", () => {
    expect(fromDateParts({ year: 2026, month: 11, day: 2 })).toBe("2026-11-02");
    expect(fromDateParts({ year: 2024, month: 2, day: 29 })).toBe("2024-02-29");
  });

  it("throws RangeError in fromDateParts for invalid calendar combinations", () => {
    expect(() => fromDateParts({ year: 2023, month: 2, day: 29 })).toThrow(RangeError);
    expect(() => fromDateParts({ year: 2026, month: 4, day: 31 })).toThrow(RangeError);
    expect(() => fromDateParts({ year: 0, month: 1, day: 1 })).toThrow(RangeError);
  });

  it("returns today in UTC format with todayUtc", () => {
    const today = todayUtc();
    expect(typeof today).toBe("string");
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

