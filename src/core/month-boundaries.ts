import type { DateInput, DateOnly } from "../types";
import { formatDateOnly } from "./civil-date";
import { getDaysInMonth } from "./days-in-month";
import { parseDatePartsOrThrow } from "./parse-date";

/**
 * Returns the first calendar date of the month for the given date.
 *
 * @param date - A valid calendar date string ("YYYY-MM-DD") or `DateOnly`.
 * @returns The first day of the month as a `DateOnly` branded string (`YYYY-MM-01`).
 * @throws {TypeError} If date is invalid.
 *
 * @example
 * ```ts
 * startOfMonth("2026-11-15"); // "2026-11-01"
 * startOfMonth("2024-02-29"); // "2024-02-01"
 * ```
 */
export function startOfMonth(date: DateInput): DateOnly {
  const { year, month } = parseDatePartsOrThrow(date, "date");
  return formatDateOnly(year, month, 1);
}

/**
 * Returns the last calendar date of the month for the given date.
 *
 * Automatically accounts for leap years in February.
 *
 * @param date - A valid calendar date string ("YYYY-MM-DD") or `DateOnly`.
 * @returns The last day of the month as a `DateOnly` branded string.
 * @throws {TypeError} If date is invalid.
 *
 * @example
 * ```ts
 * endOfMonth("2026-11-15"); // "2026-11-30"
 * endOfMonth("2024-02-10"); // "2024-02-29" (leap year)
 * endOfMonth("2025-02-10"); // "2025-02-28" (common year)
 * ```
 */
export function endOfMonth(date: DateInput): DateOnly {
  const { year, month } = parseDatePartsOrThrow(date, "date");
  const lastDay = getDaysInMonth(year, month);
  return formatDateOnly(year, month, lastDay);
}

