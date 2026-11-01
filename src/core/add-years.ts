import type { DateInput, DateOnly } from "../types";
import { formatDateOnly } from "./civil-date";
import { isLeapYear } from "./leap-year";
import { parseDatePartsOrThrow } from "./parse-date";

/**
 * Adds or subtracts a specific number of calendar years to a date.
 *
 * Leap day handling:
 * If the starting date is February 29 (a leap day) and the target year is not a leap year,
 * the resulting date is clamped to February 28.
 * If the target year is also a leap year (e.g. +4 years), February 29 is preserved.
 *
 * @param date - A valid calendar date string ("YYYY-MM-DD") or `DateOnly`.
 * @param amount - Signed integer number of years to add (positive) or subtract (negative).
 * @returns The resulting calendar date as a `DateOnly` branded string.
 * @throws {TypeError} If date is invalid or amount is not an integer.
 * @throws {RangeError} If the resulting year is outside the supported range (0001-9999).
 *
 * @example
 * ```ts
 * addYears("2024-02-29", 1); // "2025-02-28" (clamped from leap day)
 * addYears("2024-02-29", 4); // "2028-02-29" (target year is leap)
 * addYears("2026-11-02", 2); // "2028-11-02"
 * addYears("2026-11-02", -5); // "2021-11-02"
 * ```
 */
export function addYears(date: DateInput, amount: number): DateOnly {
  const { year, month, day } = parseDatePartsOrThrow(date, "date");

  if (typeof amount !== "number" || !Number.isInteger(amount)) {
    throw new TypeError(`Expected amount to be an integer, got: ${String(amount)}`);
  }

  if (amount === 0) {
    return date as DateOnly;
  }

  const targetYear = year + amount;

  if (targetYear < 1 || targetYear > 9999) {
    throw new RangeError(
      `Resulting year ${targetYear} is outside the supported Gregorian range (0001-9999)`
    );
  }

  let targetDay = day;
  if (month === 2 && day === 29 && !isLeapYear(targetYear)) {
    targetDay = 28;
  }

  return formatDateOnly(targetYear, month, targetDay);
}

