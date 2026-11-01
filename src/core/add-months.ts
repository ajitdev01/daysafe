import type { DateInput, DateOnly } from "../types";
import { formatDateOnly } from "./civil-date";
import { getDaysInMonth } from "./days-in-month";
import { parseDatePartsOrThrow } from "./parse-date";

/**
 * Adds or subtracts a specific number of calendar months to a date.
 *
 * Implements predictable month-end clamping:
 * If the resulting month has fewer days than the original day of the month,
 * the date is clamped to the last day of the resulting month.
 *
 * @param date - A valid calendar date string ("YYYY-MM-DD") or `DateOnly`.
 * @param amount - Signed integer number of months to add (positive) or subtract (negative).
 * @returns The resulting calendar date as a `DateOnly` branded string.
 * @throws {TypeError} If date is invalid or amount is not an integer.
 * @throws {RangeError} If the resulting year is outside the supported range (0001-9999).
 *
 * @example
 * ```ts
 * addMonths("2026-01-31", 1);  // "2026-02-28" (clamped to end of Feb)
 * addMonths("2024-01-31", 1);  // "2024-02-29" (clamped to leap day)
 * addMonths("2026-03-31", -1); // "2026-02-28"
 * addMonths("2026-01-15", 3);  // "2026-04-15"
 * ```
 */
export function addMonths(date: DateInput, amount: number): DateOnly {
  const { year, month, day } = parseDatePartsOrThrow(date, "date");

  if (typeof amount !== "number" || !Number.isInteger(amount)) {
    throw new TypeError(`Expected amount to be an integer, got: ${String(amount)}`);
  }

  if (amount === 0) {
    return date as DateOnly;
  }

  const totalMonths = year * 12 + (month - 1) + amount;
  const targetYear = Math.floor(totalMonths / 12);
  const targetMonth = ((totalMonths % 12) + 12) % 12 + 1;

  if (targetYear < 1 || targetYear > 9999) {
    throw new RangeError(
      `Resulting year ${targetYear} is outside the supported Gregorian range (0001-9999)`
    );
  }

  const maxDays = getDaysInMonth(targetYear, targetMonth);
  const targetDay = Math.min(day, maxDays);

  return formatDateOnly(targetYear, targetMonth, targetDay);
}

