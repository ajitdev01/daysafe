import { describe, expect, it } from "vitest";
import { getDayOfWeek, isWeekend } from "../src";

describe("getDayOfWeek and isWeekend", () => {
  it("returns correct ISO day of week (Monday=1, Sunday=7)", () => {
    expect(getDayOfWeek("2026-11-02")).toBe(1); // Monday
    expect(getDayOfWeek("2026-11-03")).toBe(2); // Tuesday
    expect(getDayOfWeek("2026-11-04")).toBe(3); // Wednesday
    expect(getDayOfWeek("2026-11-05")).toBe(4); // Thursday
    expect(getDayOfWeek("2026-11-06")).toBe(5); // Friday
    expect(getDayOfWeek("2026-11-07")).toBe(6); // Saturday
    expect(getDayOfWeek("2026-11-01")).toBe(7); // Sunday
  });

  it("handles historical and leap day reference dates", () => {
    expect(getDayOfWeek("1970-01-01")).toBe(4); // Thursday
    expect(getDayOfWeek("2000-01-01")).toBe(6); // Saturday
    expect(getDayOfWeek("2024-02-29")).toBe(4); // Thursday
  });

  it("correctly identifies weekend days", () => {
    expect(isWeekend("2026-11-07")).toBe(true);  // Saturday
    expect(isWeekend("2026-11-01")).toBe(true);  // Sunday
    expect(isWeekend("2026-11-02")).toBe(false); // Monday
    expect(isWeekend("2026-11-06")).toBe(false); // Friday
  });

  it("throws TypeError if input date is invalid", () => {
    expect(() => getDayOfWeek("invalid")).toThrow(TypeError);
    expect(() => getDayOfWeek("2026-02-30")).toThrow(TypeError);
    expect(() => isWeekend("2026-13-01")).toThrow(TypeError);
  });
});

