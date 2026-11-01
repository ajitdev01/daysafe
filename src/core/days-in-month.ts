import { isLeapYear } from "./leap-year";

/**
 * Days in each Gregorian month for common (non-leap) years.
 * Index 1 corresponds to January, index 12 corresponds to December.
 */
const DAYS_PER_MONTH = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const;

/**
 * Returns the number of calendar days in a specific Gregorian month and year.
 *
 * Uses 1-indexed months (1 = January, 12 = December).
 * Accounts for leap years in February (29 days in leap years, 28 in common years).
 *
 * @param year - Gregorian year (integer between 1 and 9999).
 * @param month - Calendar month index (integer between 1 and 12).
 * @returns Number of days in the specified month (28, 29, 30, or 31).
 * @throws {TypeError} If year or month is not an integer.
 * @throws {RangeError} If year is outside 1..9999 or month is outside 1..12.
 *
 * @example
 * ```ts
 * getDaysInMonth(2024, 2); // 29 (leap year)
 * getDaysInMonth(2026, 2); // 28
 * getDaysInMonth(2026, 11); // 30
 * ```
 */
export function getDaysInMonth(year: number, month: number): number {
  if (typeof year !== "number" || !Number.isInteger(year)) {
    throw new TypeError(`Expected year to be an integer, got: ${String(year)}`);
  }
  if (typeof month !== "number" || !Number.isInteger(month)) {
    throw new TypeError(`Expected month to be an integer, got: ${String(month)}`);
  }
  if (year < 1 || year > 9999) {
    throw new RangeError(`Year must be between 1 and 9999, got: ${year}`);
  }
  if (month < 1 || month > 12) {
    throw new RangeError(`Month must be between 1 and 12, got: ${month}`);
  }

  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  }

  return DAYS_PER_MONTH[month]!;
}

