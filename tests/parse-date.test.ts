import { describe, expect, it } from "vitest";
import { parseDate } from "../src";

describe("parseDate", () => {
  it("parses valid standard calendar dates", () => {
    expect(parseDate("2026-11-02")).toBe("2026-11-02");
    expect(parseDate("2025-01-01")).toBe("2025-01-01");
    expect(parseDate("2025-12-31")).toBe("2025-12-31");
  });

  it("parses leap days correctly", () => {
    expect(parseDate("2024-02-29")).toBe("2024-02-29");
    expect(parseDate("2000-02-29")).toBe("2000-02-29"); // 400-year leap year
  });

  it("handles boundary years 0001 and 9999", () => {
    expect(parseDate("0001-01-01")).toBe("0001-01-01");
    expect(parseDate("9999-12-31")).toBe("9999-12-31");
  });

  it("rejects non-leap year Feb 29 and century non-leap Feb 29", () => {
    expect(parseDate("2023-02-29")).toBeNull();
    expect(parseDate("1900-02-29")).toBeNull();
    expect(parseDate("2100-02-29")).toBeNull();
  });

  it("rejects impossible days for 30-day months", () => {
    expect(parseDate("2026-04-31")).toBeNull();
    expect(parseDate("2026-06-31")).toBeNull();
    expect(parseDate("2026-09-31")).toBeNull();
    expect(parseDate("2026-11-31")).toBeNull();
  });

  it("rejects invalid month numbers", () => {
    expect(parseDate("2026-00-10")).toBeNull();
    expect(parseDate("2026-13-01")).toBeNull();
  });

  it("rejects invalid day numbers", () => {
    expect(parseDate("2026-01-00")).toBeNull();
    expect(parseDate("2026-01-32")).toBeNull();
    expect(parseDate("2026-02-30")).toBeNull();
  });

  it("rejects year zero and timestamps", () => {
    expect(parseDate("0000-01-01")).toBeNull();
    expect(parseDate("2026-11-02T00:00:00Z")).toBeNull();
    expect(parseDate("2026-11-02 00:00:00")).toBeNull();
  });

  it("rejects malformed string formats", () => {
    expect(parseDate("26-11-02")).toBeNull();
    expect(parseDate("2026/11/02")).toBeNull();
    expect(parseDate("2026-2-02")).toBeNull();
    expect(parseDate("2026-02-2")).toBeNull();
    expect(parseDate("")).toBeNull();
    expect(parseDate("   ")).toBeNull();
    expect(parseDate("2026-11-02 ")).toBeNull();
  });

  it("rejects non-string inputs", () => {
    expect(parseDate(null)).toBeNull();
    expect(parseDate(undefined)).toBeNull();
    expect(parseDate(12345)).toBeNull();
    expect(parseDate({})).toBeNull();
    expect(parseDate(new Date())).toBeNull();
  });
});

