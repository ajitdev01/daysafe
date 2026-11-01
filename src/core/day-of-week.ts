import type { DateInput } from "../types";
import { civilDateToDays } from "./civil-date";
import { parseDatePartsOrThrow } from "./parse-date";

/**
 * Returns the day of the week for a given calendar date following ISO 8601 numbering:
 * - 1 = Monday
 * - 2 = Tuesday
 * - 3 = Wednesday
 * - 4 = Thursday
 * - 5 = Friday
 * - 6 = Saturday
 * - 7 = Sunday
 *
 * Calculated using pure calendar arithmetic, independent of system timezone or locale.
 *
 * @param date - A valid calendar date string ("YYYY-MM-DD") or `DateOnly`.
 * @returns ISO weekday number (1 to 7).
 * @throws {TypeError} If date is invalid.
 *
 * @example
 * ```ts
 * getDayOfWeek("2026-11-02"); // 1 (Monday)
 * getDayOfWeek("2026-11-01"); // 7 (Sunday)
 * getDayOfWeek("2026-10-31"); // 6 (Saturday)
 * ```
 */
export function getDayOfWeek(date: DateInput): number {
  const { year, month, day } = parseDatePartsOrThrow(date, "date");
  const days = civilDateToDays(year, month, day);

  // 1970-01-01 was a Thursday (ISO day 4).
  // Formula maps days since 1970-01-01 to 1..7 (Monday=1, Sunday=7).
  return (((days + 3) % 7) + 7) % 7 + 1;
}

/**
 * Determines whether a given calendar date falls on a weekend (Saturday or Sunday).
 *
 * @param date - A valid calendar date string ("YYYY-MM-DD") or `DateOnly`.
 * @returns `true` if the date is Saturday (6) or Sunday (7), otherwise `false`.
 * @throws {TypeError} If date is invalid.
 *
 * @example
 * ```ts
 * isWeekend("2026-11-01"); // true (Sunday)
 * isWeekend("2026-10-31"); // true (Saturday)
 * isWeekend("2026-11-02"); // false (Monday)
 * ```
 */
export function isWeekend(date: DateInput): boolean {
  const dow = getDayOfWeek(date);
  return dow === 6 || dow === 7;
}

