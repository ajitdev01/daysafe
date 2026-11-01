import type { DateInput } from "../types";
import { civilDateToDays } from "./civil-date";
import { parseDatePartsOrThrow } from "./parse-date";

/**
 * Calculates the exact signed number of calendar days between two dates (`end - start`).
 *
 * Guaranteed to return exact integer calendar days regardless of daylight saving time transitions
 * (23-hour or 25-hour days) or local timezones, eliminating timestamp division errors.
 *
 * @param start - The starting calendar date string ("YYYY-MM-DD") or `DateOnly`.
 * @param end - The ending calendar date string ("YYYY-MM-DD") or `DateOnly`.
 * @returns Signed integer difference in calendar days. Positive if `end > start`, negative if `end < start`, 0 if identical.
 * @throws {TypeError} If either date is invalid.
 *
 * @example
 * ```ts
 * daysBetween("2026-11-01", "2026-11-05"); // 4
 * daysBetween("2026-11-05", "2026-11-01"); // -4
 * daysBetween("2026-11-01", "2026-11-01"); // 0
 * daysBetween("2024-02-28", "2024-03-01"); // 2 (leap year)
 * ```
 */
export function daysBetween(start: DateInput, end: DateInput): number {
  const startParts = parseDatePartsOrThrow(start, "start date");
  const endParts = parseDatePartsOrThrow(end, "end date");

  const startDays = civilDateToDays(startParts.year, startParts.month, startParts.day);
  const endDays = civilDateToDays(endParts.year, endParts.month, endParts.day);

  return endDays - startDays;
}

