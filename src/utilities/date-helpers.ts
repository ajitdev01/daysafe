import { formatDateOnly } from "../core/civil-date";
import { getDaysInMonth } from "../core/days-in-month";
import { parseDatePartsOrThrow } from "../core/parse-date";
import type { DateInput, DateOnly, DateParts } from "../types";

/**
 * Checks whether calendar date `a` is strictly before calendar date `b`.
 *
 * @param a - First calendar date.
 * @param b - Second calendar date.
 * @returns `true` if `a < b`, otherwise `false`.
 * @throws {TypeError} If either date is invalid.
 */
export function isBefore(a: DateInput, b: DateInput): boolean {
  parseDatePartsOrThrow(a, "first date");
  parseDatePartsOrThrow(b, "second date");
  return a < b;
}

/**
 * Checks whether calendar date `a` is strictly after calendar date `b`.
 *
 * @param a - First calendar date.
 * @param b - Second calendar date.
 * @returns `true` if `a > b`, otherwise `false`.
 * @throws {TypeError} If either date is invalid.
 */
export function isAfter(a: DateInput, b: DateInput): boolean {
  parseDatePartsOrThrow(a, "first date");
  parseDatePartsOrThrow(b, "second date");
  return a > b;
}

/**
 * Checks whether calendar date `a` is equal to calendar date `b`.
 *
 * @param a - First calendar date.
 * @param b - Second calendar date.
 * @returns `true` if `a === b`, otherwise `false`.
 * @throws {TypeError} If either date is invalid.
 */
export function isSame(a: DateInput, b: DateInput): boolean {
  parseDatePartsOrThrow(a, "first date");
  parseDatePartsOrThrow(b, "second date");
  return a === b;
}

/**
 * Checks whether a calendar date falls between a start date and an end date.
 *
 * @param date - The target date to check.
 * @param start - The boundary start date.
 * @param end - The boundary end date.
 * @param inclusive - Whether the comparison includes the boundary dates (default: `true`).
 * @returns `true` if `date` is between `start` and `end`.
 * @throws {TypeError} If any date is invalid.
 */
export function isBetween(
  date: DateInput,
  start: DateInput,
  end: DateInput,
  inclusive = true
): boolean {
  parseDatePartsOrThrow(date, "target date");
  parseDatePartsOrThrow(start, "start date");
  parseDatePartsOrThrow(end, "end date");

  const min = start <= end ? start : end;
  const max = start <= end ? end : start;

  if (inclusive) {
    return date >= min && date <= max;
  }
  return date > min && date < max;
}

/**
 * Extracts year, month, and day integers from a calendar date.
 *
 * @param date - A valid calendar date string or `DateOnly`.
 * @returns Object with numeric `year`, `month` (1-12), and `day` (1-31).
 * @throws {TypeError} If the date is invalid.
 */
export function toDateParts(date: DateInput): DateParts {
  return parseDatePartsOrThrow(date, "date");
}

/**
 * Constructs a validated `DateOnly` branded string from numeric year, month, and day components.
 *
 * @param parts - Object containing `year`, `month`, and `day`.
 * @returns A validated `DateOnly` string (`YYYY-MM-DD`).
 * @throws {TypeError} If any part is not an integer.
 * @throws {RangeError} If parts form an invalid calendar date.
 */
export function fromDateParts(parts: DateParts): DateOnly {
  if (typeof parts !== "object" || parts === null) {
    throw new TypeError("Expected parts to be an object with year, month, and day");
  }

  const { year, month, day } = parts;

  if (typeof year !== "number" || !Number.isInteger(year)) {
    throw new TypeError(`Expected year to be an integer, got: ${String(year)}`);
  }
  if (typeof month !== "number" || !Number.isInteger(month)) {
    throw new TypeError(`Expected month to be an integer, got: ${String(month)}`);
  }
  if (typeof day !== "number" || !Number.isInteger(day)) {
    throw new TypeError(`Expected day to be an integer, got: ${String(day)}`);
  }

  if (year < 1 || year > 9999) {
    throw new RangeError(`Year must be between 1 and 9999, got: ${year}`);
  }
  if (month < 1 || month > 12) {
    throw new RangeError(`Month must be between 1 and 12, got: ${month}`);
  }

  const maxDays = getDaysInMonth(year, month);
  if (day < 1 || day > maxDays) {
    throw new RangeError(
      `Day must be between 1 and ${maxDays} for month ${month} of year ${year}, got: ${day}`
    );
  }

  return formatDateOnly(year, month, day);
}

/**
 * Returns the current calendar date in UTC as a `DateOnly` branded string.
 *
 * Always uses UTC time, eliminating variance from the local machine's timezone.
 *
 * @returns Today's UTC calendar date as `DateOnly` (`YYYY-MM-DD`).
 */
export function todayUtc(): DateOnly {
  const now = new Date();
  return formatDateOnly(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate());
}

