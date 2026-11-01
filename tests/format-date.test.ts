import { describe, expect, it } from "vitest";
import { formatDate } from "../src";

describe("formatDate", () => {
  it("formats dates with style option in en-US", () => {
    const formattedLong = formatDate("2026-11-02", {
      locale: "en-US",
      style: "long",
    });
    expect(formattedLong).toBe("November 2, 2026");

    const formattedShort = formatDate("2026-11-02", {
      locale: "en-US",
      style: "short",
    });
    expect(formattedShort).toBe("11/2/26");
  });

  it("supports dateStyle alias", () => {
    const formatted = formatDate("2026-11-02", {
      locale: "en-US",
      dateStyle: "medium",
    });
    expect(formatted).toBe("Nov 2, 2026");
  });

  it("formats dates in international locales", () => {
    const deResult = formatDate("2026-11-02", {
      locale: "de-DE",
      style: "medium",
    });
    expect(deResult).toBe("02.11.2026");

    const inResult = formatDate("2026-11-02", {
      locale: "en-IN",
    });
    // In en-IN standard formatting is day/month/year (e.g. 2/11/2026 or 02/11/2026)
    expect(inResult).toMatch(/^0?2\/11\/2026$/);
  });

  it("supports custom formatting options (weekday, year, month, day)", () => {
    const custom = formatDate("2026-11-02", {
      locale: "en-US",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    expect(custom).toBe("Monday, November 2, 2026");
  });

  it("safely formats early years (0001 - 0099) without the Date.UTC year-1900 bug", () => {
    const year25 = formatDate("0025-01-01", {
      locale: "en-US",
      style: "long",
    });
    expect(year25).toBe("January 1, 25");
  });

  it("throws TypeError if input date is invalid", () => {
    expect(() => formatDate("invalid")).toThrow(TypeError);
    expect(() => formatDate("2026-02-30")).toThrow(TypeError);
  });
});

