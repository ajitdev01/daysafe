import { describe, expect, it } from "vitest";
import { daysBetween } from "../src";

describe("daysBetween", () => {
  it("calculates positive day difference when end is after start", () => {
    expect(daysBetween("2026-11-01", "2026-11-05")).toBe(4);
    expect(daysBetween("2026-10-31", "2026-11-02")).toBe(2);
    expect(daysBetween("2025-12-31", "2026-01-01")).toBe(1);
  });

  it("calculates negative day difference when end is before start", () => {
    expect(daysBetween("2026-11-05", "2026-11-01")).toBe(-4);
    expect(daysBetween("2026-11-02", "2026-10-31")).toBe(-2);
    expect(daysBetween("2026-01-01", "2025-12-31")).toBe(-1);
  });

  it("returns 0 when start and end are identical", () => {
    expect(daysBetween("2026-11-01", "2026-11-01")).toBe(0);
    expect(daysBetween("2024-02-29", "2024-02-29")).toBe(0);
  });

  it("accurately handles leap days and leap years", () => {
    // Leap year February: Feb 28 to Mar 1 has Feb 29 between them (2 days)
    expect(daysBetween("2024-02-28", "2024-03-01")).toBe(2);
    // Common year February: Feb 28 to Mar 1 is 1 day
    expect(daysBetween("2023-02-28", "2023-03-01")).toBe(1);
    // Full leap year
    expect(daysBetween("2024-01-01", "2025-01-01")).toBe(366);
    // Full common year
    expect(daysBetween("2025-01-01", "2026-01-01")).toBe(365);
  });

  it("accurately calculates days across century rules", () => {
    // 1900 is NOT a leap year (Feb 28 to Mar 1 is 1 day)
    expect(daysBetween("1900-02-28", "1900-03-01")).toBe(1);
    // 2000 IS a leap year (Feb 28 to Mar 1 is 2 days)
    expect(daysBetween("2000-02-28", "2000-03-01")).toBe(2);
    // 1900 to 2000 is 36524 days (76 common years * 365 + 24 leap years * 366 = 36524)
    expect(daysBetween("1900-01-01", "2000-01-01")).toBe(36524);
  });

  it("throws TypeError if either date is invalid", () => {
    expect(() => daysBetween("invalid", "2026-11-01")).toThrow(TypeError);
    expect(() => daysBetween("2026-11-01", "2026-02-30")).toThrow(TypeError);
  });
});

