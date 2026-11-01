import { describe, expect, it } from "vitest";
import { isValidDate } from "../src";

describe("isValidDate", () => {
  it("returns true for valid dates", () => {
    expect(isValidDate("2024-02-29")).toBe(true);
    expect(isValidDate("2026-11-02")).toBe(true);
    expect(isValidDate("2000-02-29")).toBe(true);
    expect(isValidDate("0001-01-01")).toBe(true);
    expect(isValidDate("9999-12-31")).toBe(true);
  });

  it("returns false for invalid dates", () => {
    expect(isValidDate("2023-02-29")).toBe(false);
    expect(isValidDate("2026-02-30")).toBe(false);
    expect(isValidDate("2026-04-31")).toBe(false);
    expect(isValidDate("2026-13-01")).toBe(false);
    expect(isValidDate("2026-00-10")).toBe(false);
    expect(isValidDate("0000-01-01")).toBe(false);
    expect(isValidDate("invalid")).toBe(false);
    expect(isValidDate("")).toBe(false);
    expect(isValidDate(null)).toBe(false);
    expect(isValidDate(undefined)).toBe(false);
    expect(isValidDate(20261102)).toBe(false);
  });
});

