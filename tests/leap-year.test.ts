import { describe, expect, it } from "vitest";
import { isLeapYear } from "../src";

describe("isLeapYear", () => {
  it("correctly identifies standard 4-year leap years", () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2028)).toBe(true);
    expect(isLeapYear(2020)).toBe(true);
    expect(isLeapYear(2016)).toBe(true);
    expect(isLeapYear(4)).toBe(true);
  });

  it("correctly rejects common years", () => {
    expect(isLeapYear(2023)).toBe(false);
    expect(isLeapYear(2025)).toBe(false);
    expect(isLeapYear(2026)).toBe(false);
    expect(isLeapYear(2027)).toBe(false);
  });

  it("applies the century exception (divisible by 100 but not 400)", () => {
    expect(isLeapYear(1700)).toBe(false);
    expect(isLeapYear(1800)).toBe(false);
    expect(isLeapYear(1900)).toBe(false);
    expect(isLeapYear(2100)).toBe(false);
    expect(isLeapYear(2200)).toBe(false);
    expect(isLeapYear(2300)).toBe(false);
  });

  it("applies the 400-year quadricentennial rule", () => {
    expect(isLeapYear(1600)).toBe(true);
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(2400)).toBe(true);
  });

  it("returns false for invalid, out of range, or non-integer inputs", () => {
    expect(isLeapYear(0)).toBe(false);
    expect(isLeapYear(-4)).toBe(false);
    expect(isLeapYear(10000)).toBe(false);
    expect(isLeapYear(2024.5)).toBe(false);
    expect(isLeapYear(Number.NaN)).toBe(false);
    expect(isLeapYear(Number.POSITIVE_INFINITY)).toBe(false);
    expect(isLeapYear("2024" as unknown as number)).toBe(false);
  });
});

