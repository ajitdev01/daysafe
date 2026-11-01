import { parseDatePartsOrThrow } from "../core/parse-date";
import type { DateInput, FormatDateOptions } from "../types";

/**
 * Formats a calendar date into a locale-aware string using the native `Intl.DateTimeFormat` API.
 *
 * Guarantees timezone independence:
 * JavaScript's `Date` object and default `Intl.DateTimeFormat` can shift calendar dates depending
 * on the host environment's local timezone (for example, displaying a date as the day before when
 * running in negative UTC offsets). `formatDate` locks formatting to the UTC calendar day,
 * guaranteeing that the displayed date exactly matches the calendar date in any timezone.
 *
 * Also safely handles early years (0001 - 0099) without the legacy `Date.UTC` year-1900 mapping quirk.
 *
 * @param date - A valid calendar date string ("YYYY-MM-DD") or `DateOnly`.
 * @param options - Optional formatting configuration (locale, date style, or individual components).
 * @returns The localized calendar date string.
 * @throws {TypeError} If the input date is invalid.
 *
 * @example
 * ```ts
 * formatDate("2026-11-02", { locale: "en-IN" }); // "2/11/2026"
 * formatDate("2026-11-02", { locale: "en-US", style: "long" }); // "November 2, 2026"
 * formatDate("2026-11-02", { locale: "de-DE", style: "medium" }); // "02.11.2026"
 * formatDate("2026-11-02", {
 *   locale: "en-US",
 *   weekday: "long",
 *   year: "numeric",
 *   month: "long",
 *   day: "numeric"
 * }); // "Monday, November 2, 2026"
 * ```
 */
export function formatDate(date: DateInput, options?: FormatDateOptions): string {
  const { year, month, day } = parseDatePartsOrThrow(date, "date");

  // Construct a Date object at UTC noon (12:00:00).
  // Using setUTCFullYear avoids the Date.UTC(0..99) quirk that maps 0-99 to 1900-1999.
  const utcDate = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));
  utcDate.setUTCFullYear(year, month - 1, day);

  const { locale, style, dateStyle, ...customOptions } = options ?? {};

  // Build Intl options, always locking timeZone to UTC
  const intlOptions: Intl.DateTimeFormatOptions = {
    ...customOptions,
    timeZone: "UTC",
  };

  const resolvedDateStyle = style ?? dateStyle;
  if (resolvedDateStyle) {
    intlOptions.dateStyle = resolvedDateStyle;
  }

  const formatter = new Intl.DateTimeFormat(locale, intlOptions);
  return formatter.format(utcDate);
}

