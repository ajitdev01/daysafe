/**
 * DaySafe - Zero-dependency, timezone-independent calendar date library for JavaScript & TypeScript.
 *
 * @packageDocumentation
 */

// Types
export type {
  ComparisonResult,
  DateInput,
  DateOnly,
  DateParts,
  FormatDateOptions,
} from "./types";

// Core - Parsing & Validation
export { parseDate } from "./core/parse-date";
export { isValidDate } from "./core/validate-date";
export { isLeapYear } from "./core/leap-year";
export { getDaysInMonth } from "./core/days-in-month";

// Core - Date Arithmetic
export { addDays } from "./core/add-days";
export { addMonths } from "./core/add-months";
export { addYears } from "./core/add-years";
export { daysBetween } from "./core/days-between";
export { compareDates } from "./core/compare-dates";

// Core - Calendar Utilities
export { getDayOfWeek, isWeekend } from "./core/day-of-week";
export { endOfMonth, startOfMonth } from "./core/month-boundaries";

// Formatting
export { formatDate } from "./formatting/format-date";

// Utilities & Helpers
export { minDate } from "./utilities/min-date";
export { maxDate } from "./utilities/max-date";
export {
  fromDateParts,
  isAfter,
  isBefore,
  isBetween,
  isSame,
  toDateParts,
  todayUtc,
} from "./utilities/date-helpers";

