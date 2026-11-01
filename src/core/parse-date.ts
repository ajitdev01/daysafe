import type { DateOnly, DateParts } from "../types";
import { getDaysInMonth } from "./days-in-month";

/**
 * Strict regex pattern for calendar dates: YYYY-MM-DD.
 * Enforces exactly 4 digits for year, 2 digits for month (01-12), and 2 digits for day (01-31).
 */
const DATE_FORMAT_REGEX = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

/**
 * Parses an unknown input and verifies if it is a valid calendar date string in "YYYY-MM-DD" format.
 *
 * Supported range: "0001-01-01" through "9999-12-31".
 *
 * Validation checks:
 * - Must be a string strictly matching `YYYY-MM-DD`.
 * - Year must be between 0001 and 9999 (year 0000 is rejected).
 * - Month must be between 01 and 12.
 * - Day must not exceed the actual number of days in that specific month and year (accounts for leap years).
 * - Timestamps (e.g. containing 'T' or time components) and invalid calendar days (e.g. Feb 30) are rejected.
 *
 * Never silently normalizes or shifts invalid dates.
 *
 * @param input - The value to parse.
 * @returns A validated `DateOnly` branded string, or `null` if invalid.
 *
 * @example
 * ```ts
 * parseDate("2026-11-02"); // "2026-11-02" as DateOnly
 * parseDate("2024-02-29"); // "2024-02-29" as DateOnly (leap year)
 * parseDate("2023-02-29"); // null (not a leap year)
 * parseDate("2026-02-30"); // null (impossible calendar day)
 * parseDate("invalid");    // null
 * ```
 */
export function parseDate(input: unknown): DateOnly | null {
  if (typeof input !== "string") {
    return null;
  }

  const match = DATE_FORMAT_REGEX.exec(input);
  if (!match) {
    return null;
  }

  const year = Number.parseInt(match[1]!, 10);
  const month = Number.parseInt(match[2]!, 10);
  const day = Number.parseInt(match[3]!, 10);

  if (year < 1 || year > 9999) {
    return null;
  }

  const maxDays = getDaysInMonth(year, month);
  if (day > maxDays) {
    return null;
  }

  return input as DateOnly;
}

/**
 * Internal helper to parse and deconstruct an input date into year, month, and day parts.
 * Throws a descriptive error if the date string is invalid.
 *
 * @internal
 */
export function parseDatePartsOrThrow(input: unknown, paramName = "date"): DateParts {
  const validated = parseDate(input);
  if (!validated) {
    throw new TypeError(
      `Invalid ${paramName}: expected a valid calendar date string in 'YYYY-MM-DD' format (0001-01-01 to 9999-12-31), got: ${String(input)}`
    );
  }

  const year = Number.parseInt(validated.slice(0, 4), 10);
  const month = Number.parseInt(validated.slice(5, 7), 10);
  const day = Number.parseInt(validated.slice(8, 10), 10);

  return { year, month, day };
}

