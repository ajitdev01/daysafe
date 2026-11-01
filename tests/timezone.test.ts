import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  addDays,
  addMonths,
  addYears,
  daysBetween,
  endOfMonth,
  formatDate,
  getDayOfWeek,
  isWeekend,
  parseDate,
  startOfMonth,
} from "../src";

const REPRESENTATIVE_TIMEZONES = [
  "UTC",
  "Asia/Kolkata",
  "America/New_York",
  "Europe/London",
  "Pacific/Auckland",
] as const;

describe("Timezone independence across representative timezones", () => {
  const originalTZ = process.env.TZ;

  afterEach(() => {
    process.env.TZ = originalTZ;
  });

  for (const tz of REPRESENTATIVE_TIMEZONES) {
    describe(`Timezone: ${tz}`, () => {
      beforeEach(() => {
        process.env.TZ = tz;
      });

      it("parses calendar dates without timezone drift", () => {
        const parsed = parseDate("2026-11-02");
        expect(parsed).toBe("2026-11-02");
      });

      it("formats calendar dates without shifting the day", () => {
        const formatted = formatDate("2026-11-02", {
          locale: "en-US",
          style: "long",
        });
        expect(formatted).toBe("November 2, 2026");
      });

      it("consistently computes day of the week (Monday = 1)", () => {
        expect(getDayOfWeek("2026-11-02")).toBe(1);
        expect(isWeekend("2026-11-02")).toBe(false);
        expect(isWeekend("2026-11-01")).toBe(true);
      });

      it("performs exact calendar-day arithmetic without DST or timezone shifts", () => {
        expect(addDays("2026-11-02", 5)).toBe("2026-11-07");
        expect(addDays("2026-11-02", -2)).toBe("2026-10-31");
      });

      it("calculates exact days between calendar dates", () => {
        expect(daysBetween("2026-10-31", "2026-11-02")).toBe(2);
        expect(daysBetween("2026-11-02", "2026-10-31")).toBe(-2);
      });

      it("correctly identifies month boundaries", () => {
        expect(startOfMonth("2026-11-15")).toBe("2026-11-01");
        expect(endOfMonth("2026-11-15")).toBe("2026-11-30");
      });

      it("handles month and year arithmetic without timezone distortion", () => {
        expect(addMonths("2026-01-31", 1)).toBe("2026-02-28");
        expect(addYears("2024-02-29", 1)).toBe("2025-02-28");
      });
    });
  }
});

describe("Daylight Saving Time (DST) edge cases", () => {
  const originalTZ = process.env.TZ;

  afterEach(() => {
    process.env.TZ = originalTZ;
  });

  it("handles US Fall DST transition (25-hour day) without fractional error", () => {
    process.env.TZ = "America/New_York";

    // In America/New_York, DST ended on 2026-11-01 (clock turned back 1 hour, 25 hours long)
    // Naive Date arithmetic dividing milliseconds by 86,400,000 yields 2.0416...
    expect(daysBetween("2026-10-31", "2026-11-02")).toBe(2);
    expect(addDays("2026-10-31", 2)).toBe("2026-11-02");
    expect(addDays("2026-11-02", -2)).toBe("2026-10-31");
  });

  it("handles US Spring DST transition (23-hour day) without truncation error", () => {
    process.env.TZ = "America/New_York";

    // In America/New_York, DST begins on 2026-03-08 (clock moved forward 1 hour, 23 hours long)
    // Naive Date arithmetic dividing milliseconds by 86,400,000 yields 1.9583... (Math.floor gives 1 instead of 2)
    expect(daysBetween("2026-03-07", "2026-03-09")).toBe(2);
    expect(addDays("2026-03-07", 2)).toBe("2026-03-09");
    expect(addDays("2026-03-09", -2)).toBe("2026-03-07");
  });

  it("handles European Fall DST transition without calendar shift", () => {
    process.env.TZ = "Europe/London";

    // European DST ended on 2026-10-25
    expect(daysBetween("2026-10-24", "2026-10-26")).toBe(2);
    expect(addDays("2026-10-24", 2)).toBe("2026-10-26");
  });

  it("proves native Date introduces the 'off-by-one-day' bug in Western timezones while DaySafe does not", () => {
    process.env.TZ = "America/New_York";

    // Native Date in America/New_York (UTC-4/5) shifts UTC midnight to previous day:
    const nativeDate = new Date("2026-11-02");
    expect(nativeDate.getDate()).toBe(1); // Shifts to Nov 1 in local time!

    // DaySafe guarantees exact calendar date preservation:
    const safeDate = parseDate("2026-11-02");
    expect(safeDate).toBe("2026-11-02");

    const formatted = formatDate("2026-11-02", { locale: "en-US", style: "long" });
    expect(formatted).toBe("November 2, 2026");
  });
});
