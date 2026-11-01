/**
 * Determines whether a given year is a leap year in the Gregorian calendar.
 *
 * A Gregorian leap year occurs:
 * - In every year that is evenly divisible by 4,
 * - Except for end-of-century years (ending in 00),
 * - Which are leap years only if they are also divisible by 400.
 *
 * For example:
 * - 2024 is a leap year (divisible by 4).
 * - 1900 is NOT a leap year (divisible by 100 but not 400).
 * - 2000 IS a leap year (divisible by 400).
 *
 * Only years 0001 through 9999 are supported. Invalid or out-of-range inputs return `false`.
 *
 * @param year - Gregorian year (integer between 1 and 9999).
 * @returns `true` if the year is a valid Gregorian leap year, otherwise `false`.
 *
 * @example
 * ```ts
 * isLeapYear(2024); // true
 * isLeapYear(1900); // false
 * isLeapYear(2000); // true
 * isLeapYear(2023); // false
 * ```
 */
export function isLeapYear(year: number): boolean {
  if (typeof year !== "number" || !Number.isInteger(year) || year < 1 || year > 9999) {
    return false;
  }

  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

