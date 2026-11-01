import type { DateOnly } from "../types";

/**
 * Converts a Gregorian civil calendar date into a count of days relative to 1970-01-01.
 *
 * Implements Howard Hinnant's algorithm for civil calendar calculations.
 * Pure integer arithmetic, free from timezone dependencies, floating point inaccuracies,
 * and leap second shifts.
 *
 * @internal
 * @param year - Gregorian year (1 - 9999).
 * @param month - Calendar month (1 - 12).
 * @param day - Day of month (1 - 31).
 * @returns Days relative to 1970-01-01 (negative for earlier dates).
 */
export function civilDateToDays(year: number, month: number, day: number): number {
  let y = year;
  y -= month <= 2 ? 1 : 0;
  const era = Math.floor(y / 400);
  const yoe = y - era * 400;
  const doy = Math.floor((153 * (month > 2 ? month - 3 : month + 9) + 2) / 5) + day - 1;
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
  return era * 146097 + doe - 719468;
}

/**
 * Converts a civil day count relative to 1970-01-01 back to a Gregorian calendar tuple [year, month, day].
 *
 * @internal
 * @param z - Days relative to 1970-01-01.
 * @returns [year, month, day]
 */
export function civilDaysToDate(z: number): [year: number, month: number, day: number] {
  const zEpoch = z + 719468;
  const era = Math.floor((zEpoch >= 0 ? zEpoch : zEpoch - 146096) / 146097);
  const doe = zEpoch - era * 146097;
  const yoe = Math.floor(
    (doe - Math.floor(doe / 1460) + Math.floor(doe / 36524) - Math.floor(doe / 146096)) / 365
  );
  const y = yoe + era * 400;
  const doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100));
  const mp = Math.floor((5 * doy + 2) / 153);
  const day = doy - Math.floor((153 * mp + 2) / 5) + 1;
  const month = mp < 10 ? mp + 3 : mp - 9;
  const year = y + (month <= 2 ? 1 : 0);
  return [year, month, day];
}

/**
 * Formats year, month, and day integers into a valid `DateOnly` string (`YYYY-MM-DD`).
 *
 * @internal
 */
export function formatDateOnly(year: number, month: number, day: number): DateOnly {
  const y = String(year).padStart(4, "0");
  const m = String(month).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${y}-${m}-${d}` as DateOnly;
}

