import { parseDatePartsOrThrow } from "../core/parse-date";
import type { DateInput, DateOnly } from "../types";

/**
 * Returns the earliest calendar date among the provided arguments.
 *
 * All inputs are strictly validated. If any argument is not a valid calendar date,
 * an error is thrown.
 *
 * @param dates - One or more calendar date strings ("YYYY-MM-DD") or `DateOnly` values.
 * @returns The earliest calendar date as a `DateOnly` branded string.
 * @throws {TypeError} If no dates are provided or if any date is invalid.
 *
 * @example
 * ```ts
 * minDate("2026-11-05", "2026-11-02", "2026-11-08"); // "2026-11-02"
 * minDate("2024-02-29", "2024-03-01"); // "2024-02-29"
 * ```
 */
export function minDate(...dates: DateInput[]): DateOnly {
  if (dates.length === 0) {
    throw new TypeError("minDate requires at least one date argument");
  }

  // Validate all dates first
  for (let i = 0; i < dates.length; i++) {
    parseDatePartsOrThrow(dates[i], `dates[${i}]`);
  }

  let earliest = dates[0]! as DateOnly;
  for (let i = 1; i < dates.length; i++) {
    const current = dates[i]! as DateOnly;
    if (current < earliest) {
      earliest = current;
    }
  }

  return earliest;
}

