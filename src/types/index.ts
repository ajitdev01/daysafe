/**
 * A branded string representing a strictly validated Gregorian calendar date in "YYYY-MM-DD" format.
 * Valid year range: 0001 through 9999.
 */
export type DateOnly = string & {
  readonly __brand: "DateOnly";
};

/**
 * Flexible input type accepted by DaySafe operations.
 * Can be a branded `DateOnly` or a plain string formatted as "YYYY-MM-DD".
 */
export type DateInput = DateOnly | string;

/**
 * Deconstructed calendar date components.
 */
export interface DateParts {
  /** Gregorian year (1 - 9999) */
  year: number;
  /** Gregorian month (1 = January, 12 = December) */
  month: number;
  /** Day of the month (1 - 31) */
  day: number;
}

/**
 * Options for locale-aware formatting using `formatDate`.
 * Guaranteed to format without local timezone shifts.
 */
export interface FormatDateOptions {
  /**
   * BCP 47 language tag or array of language tags (e.g. "en-IN", "en-US", "de-DE").
   */
  locale?: string | string[];

  /**
   * Shorthand for dateStyle ("full" | "long" | "medium" | "short").
   */
  style?: "full" | "long" | "medium" | "short";

  /**
   * Standard Intl.DateTimeFormat dateStyle option.
   */
  dateStyle?: "full" | "long" | "medium" | "short";

  /**
   * Format representation for the year.
   */
  year?: "numeric" | "2-digit";

  /**
   * Format representation for the month.
   */
  month?: "numeric" | "2-digit" | "long" | "short" | "narrow";

  /**
   * Format representation for the day.
   */
  day?: "numeric" | "2-digit";

  /**
   * Format representation for the day of the week.
   */
  weekday?: "long" | "short" | "narrow";

  /**
   * Format representation for the era.
   */
  era?: "long" | "short" | "narrow";
}

/**
 * Result of date comparison:
 * -1 if date A is earlier than date B
 *  0 if date A is equal to date B
 *  1 if date A is later than date B
 */
export type ComparisonResult = -1 | 0 | 1;

