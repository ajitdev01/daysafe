import type { DateInput, DateOnly } from "../types";
import { civilDateToDays, civilDaysToDate, formatDateOnly } from "./civil-date";
import { parseDatePartsOrThrow } from "./parse-date";

/**
 * Adds or subtracts a specific number of calendar days to a date.
 *
 * Performs exact calendar arithmetic without timezone conversions or daylight saving time shifts.
 *
 * @param date - A valid calendar date string ("YYYY-MM-DD") or `DateOnly`.
 * @param amount - Signed integer number of days to add (positive) or subtract (negative).
 * @returns The resulting calendar date as a `DateOnly` branded string.
 * @throws {TypeError} If date is invalid or amount is not an integer.
 * @throws {RangeError} If the resulting year is outside the supported range (0001-9999).
 *
 * @example
 * ```ts
 * addDays("2026-11-02", 5);  // "2026-11-07"
 * addDays("2026-11-02", -2); // "2026-10-31"
 * addDays("2024-02-28", 1);  // "2024-02-29" (leap year)
 * ```
 */
export function addDays(date: DateInput, amount: number): DateOnly {
  const { year, month, day } = parseDatePartsOrThrow(date, "date");

  if (typeof amount !== "number" || !Number.isInteger(amount)) {
    throw new TypeError(`Expected amount to be an integer, got: ${String(amount)}`);
  }

  if (amount === 0) {
    return date as DateOnly;
  }

  const currentDays = civilDateToDays(year, month, day);
  const targetDays = currentDays + amount;
  const [newYear, newMonth, newDay] = civilDaysToDate(targetDays);

  if (newYear < 1 || newYear > 9999) {
    throw new RangeError(
      `Resulting year ${newYear} is outside the supported Gregorian range (0001-9999)`
    );
  }

  return formatDateOnly(newYear, newMonth, newDay);
}

