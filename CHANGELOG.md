# Changelog

All notable changes to the `daysafe` library will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-11-02

### Added

- Initial release of **DaySafe** (`daysafe`).
- Zero-dependency calendar date library for TypeScript and JavaScript.
- Strict `DateOnly` branded type ensuring type safety (`YYYY-MM-DD`).
- Core validation and parsing functions:
  - `parseDate`: parses `YYYY-MM-DD` strings into validated `DateOnly` values, returning `null` on invalid input.
  - `isValidDate`: type guard validating date-only strings without silent mutation.
  - `isLeapYear`: accurate Gregorian leap-year check with full century rules.
  - `getDaysInMonth`: month length for any month (1-12) and year (0001-9999).
- Calendar date arithmetic:
  - `addDays`: signed integer calendar-day arithmetic.
  - `addMonths`: month arithmetic with predictable month-end clamping (e.g., Jan 31 + 1 month = Feb 28/29).
  - `addYears`: year arithmetic preserving leap-day clamping (e.g., Feb 29 + 1 year = Feb 28).
  - `daysBetween`: signed calendar-day difference without timestamp division bugs.
  - `compareDates`: order comparison returning `-1 | 0 | 1`.
- Calendar utilities:
  - `getDayOfWeek`: ISO 8601 day of week (Monday = 1, Sunday = 7).
  - `startOfMonth`: returns first calendar day of month (`YYYY-MM-01`).
  - `endOfMonth`: returns last calendar day of month.
  - `isWeekend`: checks if date falls on Saturday or Sunday.
- Formatting:
  - `formatDate`: timezone-independent locale formatting using `Intl.DateTimeFormat`.
- Utilities:
  - `minDate`: finds the earliest date among arguments.
  - `maxDate`: finds the latest date among arguments.
  - Supporting helpers: `isBefore`, `isAfter`, `isSame`, `isBetween`, `toDateParts`, `fromDateParts`, `todayUtc`.
- Full ESM and CommonJS bundle with TypeScript type declarations (`.d.ts`) generated via `tsup`.
- Comprehensive Vitest test suite with timezone-independence verification.
- GitHub Actions workflows for continuous integration and automated releases.

