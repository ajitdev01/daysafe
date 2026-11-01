import type { ComparisonResult, DateInput } from "../types";
import { parseDatePartsOrThrow } from "./parse-date";

/**
 * Compares two calendar dates chronologically.
 *
 * Designed for sorting and comparison operations:
 * - Returns `-1` if date `a` is strictly earlier than date `b`.
 * - Returns `0` if date `a` is equal to date `b`.
 * - Returns `1` if date `a` is strictly later than date `b`.
 *
 * @param a - First calendar date string ("YYYY-MM-DD") or `DateOnly`.
 * @param b - Second calendar date string ("YYYY-MM-DD") or `DateOnly`.
 * @returns `-1 | 0 | 1` representing chronological ordering.
 * @throws {TypeError} If either date is invalid.
 *
 * @example
 * ```ts
 * compareDates("2026-11-01", "2026-11-05"); // -1
 * compareDates("2026-11-05", "2026-11-01"); // 1
 * compareDates("2026-11-01", "2026-11-01"); // 0
 *
 * // Useful with Array.prototype.sort:
 * const dates = ["2026-12-01", "2026-01-15", "2026-06-20"];
 * dates.sort(compareDates); // ["2026-01-15", "2026-06-20", "2026-12-01"]
 * ```
 */
export function compareDates(a: DateInput, b: DateInput): ComparisonResult {
  parseDatePartsOrThrow(a, "first date");
  parseDatePartsOrThrow(b, "second date");

  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}

