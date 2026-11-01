import type { DateOnly } from "../types";
import { parseDate } from "./parse-date";

/**
 * Checks whether an input value is a valid calendar date string conforming to "YYYY-MM-DD"
 * within the supported Gregorian calendar range (0001-01-01 to 9999-12-31).
 *
 * Functions as a TypeScript type guard, narrowing the type to `DateOnly`.
 *
 * @param input - Any value to test.
 * @returns `true` if input is a valid calendar date string, `false` otherwise.
 *
 * @example
 * ```ts
 * isValidDate("2024-02-29"); // true
 * isValidDate("2023-02-29"); // false
 * isValidDate("2026-11-02"); // true
 * isValidDate("2026-02-30"); // false
 * isValidDate("invalid");    // false
 * ```
 */
export function isValidDate(input: unknown): input is DateOnly {
  return parseDate(input) !== null;
}

