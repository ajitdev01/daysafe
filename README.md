# DaySafe

> Timezone-safe date-only utilities for JavaScript and TypeScript.

[![npm version](https://img.shields.io/npm/v/daysafe.svg?color=blue)](https://www.npmjs.com/package/daysafe)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178c6.svg)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)](https://www.npmjs.com/package/daysafe)
[![CI](https://github.com/ajitdev01/daysafe/actions/workflows/ci.yml/badge.svg)](https://github.com/ajitdev01/daysafe/actions/workflows/ci.yml)

[GitHub Repository](https://github.com/ajitdev01/daysafe) &bull; [NPM Package](https://www.npmjs.com/package/daysafe)

---

## At a Glance

- **What DaySafe does:** DaySafe is a lightweight, zero-dependency library built exclusively for **calendar-date operations** (`YYYY-MM-DD`).
- **Why you need it:** JavaScript `Date` represents an instantaneous timestamp (milliseconds since epoch). When parsed or formatted in different timezones, dates like `"2026-11-02"` routinely shift by &plusmn;1 day in Western or Eastern timezones. DaySafe eliminates timestamp conversions entirely, ensuring calendar dates remain identical everywhere on Earth.
- **Install:** `npm install daysafe`
- **Instant Example:**

```ts
import { parseDate, addDays, daysBetween, formatDate } from "daysafe";

// Strictly validated calendar date (returns DateOnly | null)
const invoiceDate = parseDate("2026-11-02");

// Exact calendar arithmetic — immune to Daylight Saving Time shifts
const dueDate = addDays(invoiceDate!, 30); // "2026-12-02"

// Signed calendar day difference
const remainingDays = daysBetween(invoiceDate!, dueDate); // 30

// Timezone-safe formatting (locked to UTC noon — never shifts across day boundaries)
const formatted = formatDate(dueDate, { locale: "en-US", style: "long" });
// "December 2, 2026" in every timezone worldwide
```

---

## Table of Contents

- [The Date-Only Problem in JavaScript](#the-date-only-problem-in-javascript)
- [Key Features](#key-features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [API Overview](#api-overview)
  - [Parsing and Validation](#1-parsing-and-validation)
  - [Date Arithmetic](#2-date-arithmetic)
  - [Calendar Utilities](#3-calendar-utilities)
  - [Formatting](#4-formatting)
  - [Date Helpers](#5-date-helpers)
- [Real-World Examples](#real-world-examples)
  - [1. Date of Birth Validation](#1-date-of-birth-validation)
  - [2. Hotel and Booking Scheduling](#2-hotel-and-booking-scheduling)
  - [3. Invoice Due Dates (Net 30 / Net 60)](#3-invoice-due-dates-net-30--net-60)
  - [4. Monthly Subscription Billing](#4-monthly-subscription-billing)
  - [5. Month Range Queries](#5-month-range-queries)
- [TypeScript Support](#typescript-support)
- [Timezone Safety & Civil Arithmetic](#timezone-safety--civil-arithmetic)
- [Error Handling and Limitations](#error-handling-and-limitations)
- [Development and Testing](#development-and-testing)
- [Project Structure](#project-structure)
- [Compatibility](#compatibility)
- [Contributing](#contributing)
- [License](#license)

---

## The Date-Only Problem in JavaScript

Developers frequently handle data that represents a specific **calendar day** rather than an instant in time:

- **Dates of birth**
- **Hotel and flight reservations**
- **Invoice and payment due dates**
- **Examination dates**
- **Subscription start and renewal dates**
- **Statutory holiday calendars**
- **Database `DATE` fields** (PostgreSQL `DATE`, MySQL `DATE`, or ISO `YYYY-MM-DD` strings)

A date of birth such as `2026-11-02` should designate the exact same calendar day regardless of whether the user or server is in New York, London, Tokyo, or Kolkata.

### Why Standard JavaScript `Date` Causes Bugs

| Common Issue | Standard JavaScript `Date` | DaySafe Solution |
|---|---|---|
| **Off-by-One Day Shift** | `new Date("2026-11-02")` creates UTC midnight. In New York (UTC-5), `d.getDate()` returns `1` (Nov 1st). | `parseDate("2026-11-02")` evaluates calendar components directly. Returns `"2026-11-02"` in every timezone. |
| **Daylight Saving Time (DST)** | `(t2 - t1) / 86400000` divides milliseconds. On 23-hour or 25-hour DST transition days, it yields fractional errors (`2.0416...` or `1.9583...`). | `daysBetween(start, end)` uses pure integer civil day arithmetic. Always yields exact integer differences. |
| **Silent Rollover** | `new Date(2026, 1, 30)` silently rolls over to `March 2, 2026`, hiding invalid user input. | `parseDate("2026-02-30")` strictly rejects impossible days, returning `null`. |
| **Early Year Bug** | `Date.UTC(25, 0, 1)` treats year `25` as `1925`. | Safely handles Gregorian years `0001` through `9999` without legacy century mappings. |

---

## Key Features

- **Zero Runtime Dependencies:** Completely self-contained (`dependencies: {}`).
- **Timezone-Independent:** Local machine offsets and DST shifts never alter calendar calculations.
- **Strict Validation:** Enforces `YYYY-MM-DD` for Gregorian years `0001` through `9999`. Rejects timestamps, invalid months, impossible days, and year zero.
- **Branded Type Safety:** Exports a branded `DateOnly` type that prevents accidental use of raw, unvalidated strings in business logic.
- **Pure Integer Calendar Arithmetic:** Utilizes Howard Hinnant's civil day algorithms for deterministic, integer-based date math.
- **Predictable Month-End Clamping:** Safely handles month additions (e.g., `2026-01-31` + 1 month = `2026-02-28`).
- **Accurate Leap-Year Handling:** Full Gregorian century rules (1900 is common, 2000 is leap).
- **Timezone-Safe Locale Formatting:** Uses native `Intl.DateTimeFormat` locked to UTC noon so output never drifts across day boundaries.
- **Dual Package Distribution:** First-class ESM (`dist/index.mjs`) and CommonJS (`dist/index.js`) with generated TypeScript declaration files (`.d.ts` and `.d.mts`).

---

## Installation

Install using your preferred package manager:

```bash
# npm
npm install daysafe

# yarn
yarn add daysafe

# pnpm
pnpm add daysafe
```

---

## Quick Start

```ts
import {
  parseDate,
  isValidDate,
  addDays,
  addMonths,
  daysBetween,
  getDayOfWeek,
  isWeekend,
  formatDate,
} from "daysafe";

// 1. Parsing and validation
const date = parseDate("2026-11-02");   // "2026-11-02" as DateOnly
parseDate("2026-02-30");               // null (February 30th does not exist)
isValidDate("2024-02-29");             // true (2024 is a leap year)
isValidDate("2023-02-29");             // false (2023 is not a leap year)

// 2. Calendar arithmetic
addDays("2026-11-02", 5);              // "2026-11-07"
addDays("2026-11-02", -2);             // "2026-10-31"

// 3. Month clamping
addMonths("2026-01-31", 1);            // "2026-02-28" (clamped to end of Feb)
addMonths("2024-01-31", 1);            // "2024-02-29" (clamped to leap day)

// 4. Exact calendar differences
daysBetween("2026-11-01", "2026-11-05"); // 4
daysBetween("2026-11-05", "2026-11-01"); // -4

// 5. Weekday numbering (ISO 8601: Monday = 1, Sunday = 7)
getDayOfWeek("2026-11-02");            // 1 (Monday)
isWeekend("2026-11-01");               // true (Sunday)

// 6. Timezone-safe formatting
formatDate("2026-11-02", { locale: "en-US", style: "long" });
// "November 2, 2026" (guaranteed identical in every timezone)
```

---

## API Reference

### API Overview

| Function | Signature | Return Type | Description |
|---|---|---|---|
| [`parseDate`](#parsedateinput-unknown-dateonly--null) | `(input: unknown)` | `DateOnly \| null` | Parses and validates `YYYY-MM-DD` strings. |
| [`isValidDate`](#isvaliddateinput-unknown-input-is-dateonly) | `(input: unknown)` | `input is DateOnly` | Type guard checking valid calendar dates. |
| [`isLeapYear`](#isleapyearyear-number-boolean) | `(year: number)` | `boolean` | Gregorian leap-year check with century rules. |
| [`getDaysInMonth`](#getdaysinmonthyear-number-month-number-number) | `(year: number, month: number)` | `number` | Returns days in month (28, 29, 30, or 31). |
| [`addDays`](#adddaysdate-dateinput-amount-number-dateonly) | `(date: DateInput, amount: number)` | `DateOnly` | Adds or subtracts signed calendar days. |
| [`addMonths`](#addmonthsdate-dateinput-amount-number-dateonly) | `(date: DateInput, amount: number)` | `DateOnly` | Adds months with predictable month-end clamping. |
| [`addYears`](#addyearsdate-dateinput-amount-number-dateonly) | `(date: DateInput, amount: number)` | `DateOnly` | Adds years with leap-day handling. |
| [`daysBetween`](#daysbetweenstart-dateinput-end-dateinput-number) | `(start: DateInput, end: DateInput)` | `number` | Signed calendar-day difference (`end - start`). |
| [`compareDates`](#comparedatesa-dateinput-b-dateinput-comparisonresult) | `(a: DateInput, b: DateInput)` | `-1 \| 0 \| 1` | Chronological comparison for sorting. |
| [`getDayOfWeek`](#getdayofweekdate-dateinput-number) | `(date: DateInput)` | `number` | ISO 8601 weekday (Monday = 1, Sunday = 7). |
| [`isWeekend`](#isweekenddate-dateinput-boolean) | `(date: DateInput)` | `boolean` | Checks if date falls on Saturday or Sunday. |
| [`startOfMonth`](#startofmonthdate-dateinput-dateonly) | `(date: DateInput)` | `DateOnly` | Returns `YYYY-MM-01`. |
| [`endOfMonth`](#endofmonthdate-dateinput-dateonly) | `(date: DateInput)` | `DateOnly` | Returns last calendar day of the month. |
| [`formatDate`](#formatdatedate-dateinput-options-formatdateoptions-string) | `(date: DateInput, options?)` | `string` | Timezone-safe localized formatting via `Intl`. |
| [`minDate`](#mindatedates-dateinput-dateonly) | `(...dates: DateInput[])` | `DateOnly` | Returns earliest calendar date. |
| [`maxDate`](#maxdatedates-dateinput-dateonly) | `(...dates: DateInput[])` | `DateOnly` | Returns latest calendar date. |
| [`isBefore`](#isbeforea-dateinput-b-dateinput-boolean) | `(a: DateInput, b: DateInput)` | `boolean` | Checks if date `a` is strictly before `b`. |
| [`isAfter`](#isaftera-dateinput-b-dateinput-boolean) | `(a: DateInput, b: DateInput)` | `boolean` | Checks if date `a` is strictly after `b`. |
| [`isSame`](#issamea-dateinput-b-dateinput-boolean) | `(a: DateInput, b: DateInput)` | `boolean` | Checks if date `a` is equal to `b`. |
| [`isBetween`](#isbetweendate-dateinput-start-dateinput-end-dateinput-inclusive-boolean-boolean) | `(date, start, end, inclusive?)` | `boolean` | Checks if date falls between start and end. |
| [`toDateParts`](#todatepartsdate-dateinput-dateparts) | `(date: DateInput)` | `DateParts` | Extracts `{ year, month, day }` integers. |
| [`fromDateParts`](#fromdatepartsparts-dateparts-dateonly) | `(parts: DateParts)` | `DateOnly` | Constructs a validated `DateOnly` from parts. |
| [`todayUtc`](#todayutc-dateonly) | `()` | `DateOnly` | Returns today's UTC calendar date. |

---

### 1. Parsing and Validation

#### `parseDate(input: unknown): DateOnly | null`
Parses an unknown input and verifies if it is a valid calendar date string in `YYYY-MM-DD` format.

- **Parameters:** `input: unknown` — The value to parse and validate.
- **Return Type:** `DateOnly | null`
- **Behavior:** Returns `DateOnly` on success. Returns `null` for non-strings, malformed strings, impossible days (e.g. Feb 30), timestamps, and year zero. Never silently normalizes.
- **Edge cases:** `0000-01-01` returns `null`. `2024-02-29` returns `"2024-02-29"`. `2023-02-29` returns `null`.

```ts
parseDate("2026-11-02");           // "2026-11-02"
parseDate("2024-02-29");           // "2024-02-29"
parseDate("2023-02-29");           // null
parseDate("2026-02-30");           // null
parseDate("2026-11-02T00:00:00Z"); // null
```

#### `isValidDate(input: unknown): input is DateOnly`
TypeScript type guard checking whether an input is a valid calendar date string.

- **Parameters:** `input: unknown`
- **Return Type:** `input is DateOnly` (boolean)

```ts
isValidDate("2026-11-02"); // true
isValidDate("2026-02-30"); // false
```

#### `isLeapYear(year: number): boolean`
Determines whether a given year is a leap year in the Gregorian calendar.

- **Parameters:** `year: number` — Integer year (`1..9999`).
- **Return Type:** `boolean`
- **Behavior:** Returns `true` if divisible by 4, except century years which must be divisible by 400. Returns `false` for non-integers, out-of-range years, and common years.

```ts
isLeapYear(2024); // true
isLeapYear(2023); // false
isLeapYear(1900); // false (century non-leap)
isLeapYear(2000); // true (400-year quadricentennial)
```

#### `getDaysInMonth(year: number, month: number): number`
Returns the total number of calendar days in a specific Gregorian month and year.

- **Parameters:**
  - `year: number` — Integer year (`1..9999`).
  - `month: number` — Calendar month index (`1` to `12`, where `1` = January, `12` = December).
- **Return Type:** `number` (28, 29, 30, or 31)
- **Error handling:** Throws `TypeError` for non-integers. Throws `RangeError` if `month < 1 || month > 12` or `year < 1 || year > 9999`.

```ts
getDaysInMonth(2024, 2); // 29 (leap year)
getDaysInMonth(2026, 2); // 28
getDaysInMonth(2026, 4); // 30
```

---

### 2. Date Arithmetic

All arithmetic functions accept `DateInput` (`DateOnly | string`) and return a new `DateOnly` string. Caller inputs are never mutated.

#### `addDays(date: DateInput, amount: number): DateOnly`
Adds or subtracts a signed integer count of calendar days.

- **Parameters:**
  - `date: DateInput` — Calendar date (`YYYY-MM-DD`).
  - `amount: number` — Integer days to add (positive) or subtract (negative).
- **Return Type:** `DateOnly`
- **Error handling:** Throws `TypeError` if `date` is invalid or `amount` is not an integer. Throws `RangeError` if the resulting year falls outside `0001..9999`.

```ts
addDays("2026-11-02", 5);  // "2026-11-07"
addDays("2026-11-02", -2); // "2026-10-31"
addDays("2024-02-28", 1);  // "2024-02-29"
```

#### `addMonths(date: DateInput, amount: number): DateOnly`
Adds or subtracts calendar months with **predictable end-of-month clamping**.

- **Parameters:**
  - `date: DateInput` — Calendar date (`YYYY-MM-DD`).
  - `amount: number` — Integer months to add or subtract.
- **Return Type:** `DateOnly`
- **Clamping Rule:** If the target month has fewer days than the starting day, the result is clamped to the last day of the target month.
- **Error handling:** Throws `TypeError` if date is invalid or amount is not an integer. Throws `RangeError` if target year is outside `0001..9999`.

```ts
addMonths("2026-01-31", 1);  // "2026-02-28" (clamped to end of Feb)
addMonths("2024-01-31", 1);  // "2024-02-29" (clamped to leap day)
addMonths("2026-03-31", -1); // "2026-02-28"
addMonths("2026-01-15", 3);  // "2026-04-15" (no clamping needed)
```

#### `addYears(date: DateInput, amount: number): DateOnly`
Adds or subtracts calendar years with leap-day preservation and clamping.

- **Parameters:**
  - `date: DateInput` — Calendar date (`YYYY-MM-DD`).
  - `amount: number` — Integer years to add or subtract.
- **Return Type:** `DateOnly`
- **Leap-Day Rule:** Adding years to February 29 clamps to February 28 unless the target year is also a leap year.

```ts
addYears("2024-02-29", 1); // "2025-02-28" (clamped)
addYears("2024-02-29", 4); // "2028-02-29" (target year is leap)
addYears("2026-11-02", 2); // "2028-11-02"
```

#### `daysBetween(start: DateInput, end: DateInput): number`
Calculates the exact signed integer calendar days between two dates (`end - start`).

- **Parameters:** `start: DateInput`, `end: DateInput`
- **Return Type:** `number`
- **Behavior:** Positive if `end > start`, negative if `end < start`, `0` if identical. Unaffected by DST 23-hour or 25-hour days.

```ts
daysBetween("2026-11-01", "2026-11-05"); // 4
daysBetween("2026-11-05", "2026-11-01"); // -4
daysBetween("2026-11-01", "2026-11-01"); // 0
```

#### `compareDates(a: DateInput, b: DateInput): ComparisonResult`
Compares two dates chronologically for sorting or ordering.

- **Return Type:** `-1 | 0 | 1` (`-1` if `a < b`, `0` if `a === b`, `1` if `a > b`).

```ts
compareDates("2026-11-01", "2026-11-05"); // -1
compareDates("2026-11-05", "2026-11-01"); // 1
compareDates("2026-11-01", "2026-11-01"); // 0

const dates = ["2026-12-31", "2024-02-29", "2026-01-15"];
dates.sort(compareDates); // ["2024-02-29", "2026-01-15", "2026-12-31"]
```

---

### 3. Calendar Utilities

#### `getDayOfWeek(date: DateInput): number`
Returns the ISO 8601 day of the week:
- `1` = Monday, `2` = Tuesday, `3` = Wednesday, `4` = Thursday, `5` = Friday, `6` = Saturday, `7` = Sunday.

```ts
getDayOfWeek("2026-11-02"); // 1 (Monday)
getDayOfWeek("2026-11-01"); // 7 (Sunday)
```

#### `isWeekend(date: DateInput): boolean`
Returns `true` if the date falls on Saturday (6) or Sunday (7).

```ts
isWeekend("2026-11-01"); // true (Sunday)
isWeekend("2026-11-02"); // false (Monday)
```

#### `startOfMonth(date: DateInput): DateOnly`
Returns the first calendar day of the month (`YYYY-MM-01`).

```ts
startOfMonth("2026-11-15"); // "2026-11-01"
```

#### `endOfMonth(date: DateInput): DateOnly`
Returns the last calendar day of the month, accounting for leap years.

```ts
endOfMonth("2026-11-15"); // "2026-11-30"
endOfMonth("2024-02-10"); // "2024-02-29" (leap year)
endOfMonth("2025-02-10"); // "2025-02-28" (common year)
```

---

### 4. Formatting

#### `formatDate(date: DateInput, options?: FormatDateOptions): string`
Formats a calendar date using the native `Intl.DateTimeFormat` API with guaranteed timezone independence.

- **Parameters:**
  - `date: DateInput` — Calendar date (`YYYY-MM-DD`).
  - `options?: FormatDateOptions` — Formatting options:
    - `locale?: string | string[]` — BCP 47 language tag (e.g. `"en-US"`, `"en-IN"`, `"de-DE"`).
    - `style?: "full" | "long" | "medium" | "short"` — Preset date style.
    - `dateStyle?: "full" | "long" | "medium" | "short"` — Standard `Intl` dateStyle.
    - Component options: `year`, `month`, `day`, `weekday`, `era`.
- **Timezone Guarantee:** Formatting is locked to UTC noon internally. Local offsets cannot cause date shifting.

```ts
formatDate("2026-11-02", { locale: "en-IN" }); 
// "2/11/2026"

formatDate("2026-11-02", { locale: "en-US", style: "long" }); 
// "November 2, 2026"

formatDate("2026-11-02", { locale: "de-DE", style: "medium" }); 
// "02.11.2026"

formatDate("2026-11-02", {
  locale: "en-US",
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});
// "Monday, November 2, 2026"
```

---

### 5. Date Helpers

#### `minDate(...dates: DateInput[]): DateOnly`
Returns the earliest calendar date. Throws `TypeError` if called with no arguments or if any date is invalid.

```ts
minDate("2026-11-05", "2026-11-02", "2026-11-08"); // "2026-11-02"
```

#### `maxDate(...dates: DateInput[]): DateOnly`
Returns the latest calendar date. Throws `TypeError` if called with no arguments or if any date is invalid.

```ts
maxDate("2026-11-05", "2026-11-02", "2026-11-08"); // "2026-11-08"
```

#### `isBefore(a: DateInput, b: DateInput): boolean`
```ts
isBefore("2026-11-01", "2026-11-02"); // true
```

#### `isAfter(a: DateInput, b: DateInput): boolean`
```ts
isAfter("2026-11-02", "2026-11-01"); // true
```

#### `isSame(a: DateInput, b: DateInput): boolean`
```ts
isSame("2026-11-01", "2026-11-01"); // true
```

#### `isBetween(date: DateInput, start: DateInput, end: DateInput, inclusive = true): boolean`
Checks whether `date` falls between `start` and `end`. Automatically handles reverse ranges (`start > end`).

```ts
isBetween("2026-11-05", "2026-11-01", "2026-11-10"); // true
isBetween("2026-11-01", "2026-11-01", "2026-11-10", false); // false (exclusive)
```

#### `toDateParts(date: DateInput): DateParts`
Deconstructs a calendar date into numeric `{ year, month, day }` components.

```ts
toDateParts("2026-11-02"); // { year: 2026, month: 11, day: 2 }
```

#### `fromDateParts(parts: DateParts): DateOnly`
Constructs and validates a `DateOnly` string from numeric components. Throws `TypeError` for non-integers or `RangeError` for invalid calendar dates.

```ts
fromDateParts({ year: 2026, month: 11, day: 2 }); // "2026-11-02"
```

#### `todayUtc(): DateOnly`
Returns today's UTC calendar date as a `DateOnly` string (`YYYY-MM-DD`).

```ts
todayUtc(); // e.g. "2026-11-02"
```

---

## Real-World Examples

### 1. Date of Birth Validation

Validate user input and verify the user is at least 18 years old:

```ts
import { parseDate, addYears, isBefore, todayUtc } from "daysafe";

function validateAdultDob(rawInput: string): { valid: boolean; error?: string } {
  const dob = parseDate(rawInput);
  if (!dob) {
    return { valid: false, error: "Please enter a valid calendar date (YYYY-MM-DD)." };
  }

  const today = todayUtc();
  if (isBefore(today, dob)) {
    return { valid: false, error: "Date of birth cannot be in the future." };
  }

  // Exact 18-year boundary (preserves leap days correctly)
  const eighteenthBirthday = addYears(dob, 18);
  if (isBefore(today, eighteenthBirthday)) {
    return { valid: false, error: "You must be at least 18 years old." };
  }

  return { valid: true };
}

validateAdultDob("2000-02-29"); // { valid: true }
validateAdultDob("2026-02-30"); // { valid: false, error: "Please enter a valid calendar date..." }
```

### 2. Hotel and Booking Scheduling

Calculate stay durations and identify weekend stays for dynamic pricing:

```ts
import { parseDate, addDays, daysBetween, isWeekend } from "daysafe";

function calculateBooking(checkInDate: string, nights: number) {
  const checkIn = parseDate(checkInDate);
  if (!checkIn || nights <= 0) {
    throw new Error("Invalid booking parameters");
  }

  const checkOut = addDays(checkIn, nights);
  const totalNights = daysBetween(checkIn, checkOut);

  // Check how many weekend nights fall within the stay
  let weekendNights = 0;
  for (let i = 0; i < totalNights; i++) {
    const currentNight = addDays(checkIn, i);
    if (isWeekend(currentNight)) {
      weekendNights++;
    }
  }

  return { checkIn, checkOut, totalNights, weekendNights };
}

calculateBooking("2026-11-06", 3);
// checkIn: "2026-11-06" (Fri), checkOut: "2026-11-09" (Mon), totalNights: 3, weekendNights: 2 (Sat & Sun)
```

### 3. Invoice Due Dates (Net 30 / Net 60)

Generate exact payment terms without timezone shifts:

```ts
import { parseDate, addDays, formatDate, todayUtc, daysBetween } from "daysafe";

interface Invoice {
  id: string;
  issueDate: string;
  termDays: number;
}

function processInvoice(invoice: Invoice) {
  const issue = parseDate(invoice.issueDate)!;
  const dueDate = addDays(issue, invoice.termDays);
  const today = todayUtc();

  const daysRemaining = daysBetween(today, dueDate);
  const isOverdue = daysRemaining < 0;

  return {
    invoiceId: invoice.id,
    dueDate,
    formattedDue: formatDate(dueDate, { locale: "en-US", style: "medium" }),
    daysRemaining,
    isOverdue,
  };
}

processInvoice({ id: "INV-1001", issueDate: "2026-11-02", termDays: 30 });
// dueDate: "2026-12-02", formattedDue: "Dec 2, 2026"
```

### 4. Monthly Subscription Billing

Safely advance monthly billing dates with automatic month-end clamping:

```ts
import { parseDate, addMonths } from "daysafe";

function getNextBillingCycle(startDate: string, billingCycles: number): string[] {
  const start = parseDate(startDate)!;
  const schedule: string[] = [];

  for (let i = 1; i <= billingCycles; i++) {
    schedule.push(addMonths(start, i));
  }

  return schedule;
}

// January 31st automatically clamps to end-of-month in February, March, April
getNextBillingCycle("2026-01-31", 4);
// ["2026-02-28", "2026-03-31", "2026-04-30", "2026-05-31"]
```

### 5. Month Range Queries

Determine start and end dates for database queries:

```ts
import { parseDate, startOfMonth, endOfMonth } from "daysafe";

function getMonthFilter(dateString: string) {
  const date = parseDate(dateString)!;

  return {
    start: startOfMonth(date), // e.g. "2026-11-01"
    end: endOfMonth(date),     // e.g. "2026-11-30"
  };
}

getMonthFilter("2024-02-15");
// { start: "2024-02-01", end: "2024-02-29" } (leap year accounted for)
```

---

## TypeScript Support

DaySafe provides first-class TypeScript support with nominal type branding:

```ts
export type DateOnly = string & {
  readonly __brand: "DateOnly";
};
```

This ensures that unvalidated strings cannot be passed into functions expecting verified dates:

```ts
import { parseDate, addDays, DateOnly } from "daysafe";

function processPayment(dueDate: DateOnly) {
  return addDays(dueDate, 10);
}

const unvalidatedString: string = "2026-11-02";

// @ts-expect-error Type 'string' is not assignable to type 'DateOnly'.
processPayment(unvalidatedString);

// Correct usage:
const validated = parseDate(unvalidatedString);
if (validated) {
  processPayment(validated); // Compiles cleanly!
}
```

### Public Type Exports

```ts
import type {
  DateOnly,
  DateInput,
  DateParts,
  FormatDateOptions,
  ComparisonResult,
} from "daysafe";
```

---

## Timezone Safety & Civil Arithmetic

### The Root Cause of Timezone Bugs
In standard JavaScript:
1. `new Date("2026-11-02")` creates UTC midnight: `2026-11-02T00:00:00.000Z`.
2. When accessed via `.getDate()` in Chicago or New York (UTC-5/6), the local time is `2026-11-01 19:00:00`.
3. The calendar date has unintentionally drifted back by one day.

### How DaySafe Guarantees Safety
1. **Civil Day Integer Calculations:** DaySafe implements Howard Hinnant's civil calendar algorithm to convert `(year, month, day)` tuples into an integer civil day count relative to 1970-01-01. Calculations never construct a timestamp, convert milliseconds, or query the host machine's timezone.
2. **Deterministic Intl Formatting:** When formatting with `formatDate()`, DaySafe initializes a baseline UTC Date at noon (`12:00:00 UTC`) using `.setUTCFullYear()` and forces `timeZone: "UTC"` in `Intl.DateTimeFormat`. Because noon UTC is 12 hours away from midnight, the calendar day never drifts in any timezone worldwide (UTC-12 to UTC+14).
3. **No Year 0–99 Quirk:** DaySafe avoids `Date.UTC(year, ...)` for early years, avoiding JavaScript's legacy behavior of mapping years 0–99 to 1900–1999.

---

## Error Handling and Limitations

### Error Handling Policy

| Function Category | Behavior on Invalid Input | Examples |
|---|---|---|
| **Parsing Functions** | Returns `null` | `parseDate("2026-02-30")` &rarr; `null`<br>`parseDate("invalid")` &rarr; `null` |
| **Predicate Functions** | Returns `false` | `isValidDate("invalid")` &rarr; `false`<br>`isLeapYear(NaN)` &rarr; `false` |
| **Arithmetic Functions** | Throws `TypeError` or `RangeError` | `addDays("invalid", 5)` &rarr; `throws TypeError`<br>`addDays("9999-12-31", 1)` &rarr; `throws RangeError` |
| **Comparison & Boundaries** | Throws `TypeError` | `compareDates("invalid", "2026-01-01")` &rarr; `throws TypeError` |
| **Helper Functions** | Throws `TypeError` | `minDate()` &rarr; `throws TypeError` (requires at least 1 date) |

### Supported Range and Known Limitations
- **Format:** Strictly `YYYY-MM-DD` (four-digit year, two-digit month, two-digit day).
- **Year Range:** Gregorian `0001` through `9999`.
- **Year Zero:** Explicitly rejected (the civil calendar transitions directly from 1 BCE to 1 CE; astronomical year 0000 is not supported).
- **No Timestamps:** Strings containing time components, `T` separators, or timezone offsets are rejected by `parseDate`.
- **Date-Only Focus:** DaySafe does not perform clock-time conversions, hourly arithmetic, or time-zone conversion outside the calendar date domain.

---

## Development and Testing

The repository scripts are defined in `package.json`:

```bash
# Clone the repository
git clone https://github.com/ajitdev01/daysafe.git
cd daysafe

# Install dependencies
npm install

# Type-check with strict TypeScript
npm run typecheck

# Run test suite via Vitest (14 test files, 123 tests)
npm test

# Run tests in watch mode
npm run test:watch

# Build dual ESM and CommonJS bundles with declarations via tsup
npm run build

# Run prepublish validation (typecheck + test + build)
npm run prepublishOnly

# Inspect the npm distribution package
npm pack --dry-run
```

---

## Project Structure

```text
daysafe/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Automated testing on Node 18, 20, 22
│       └── publish.yml            # Automated npm release workflow
├── src/
│   ├── index.ts                   # Public API barrel export
│   ├── core/
│   │   ├── add-days.ts            # Calendar day arithmetic
│   │   ├── add-months.ts          # Month arithmetic with clamping
│   │   ├── add-years.ts           # Year arithmetic with leap-day rules
│   │   ├── civil-date.ts          # Howard Hinnant civil day algorithms
│   │   ├── compare-dates.ts       # Chronological comparison (-1 | 0 | 1)
│   │   ├── day-of-week.ts         # ISO weekday and weekend check
│   │   ├── days-between.ts        # Signed calendar-day differences
│   │   ├── days-in-month.ts       # Month lengths (leap-year aware)
│   │   ├── leap-year.ts           # Gregorian leap-year validation
│   │   ├── month-boundaries.ts    # Start and end of month
│   │   ├── parse-date.ts          # Strict YYYY-MM-DD parsing
│   │   └── validate-date.ts       # Type guard validation
│   ├── formatting/
│   │   └── format-date.ts         # Timezone-safe Intl formatting
│   ├── utilities/
│   │   ├── date-helpers.ts        # isBefore, isAfter, isSame, isBetween, parts, todayUtc
│   │   ├── max-date.ts            # Latest date evaluation
│   │   └── min-date.ts            # Earliest date evaluation
│   └── types/
│       └── index.ts               # DateOnly, DateInput, DateParts, FormatDateOptions
├── tests/
│   ├── add-days.test.ts
│   ├── add-months.test.ts
│   ├── add-years.test.ts
│   ├── compare-dates.test.ts
│   ├── day-of-week.test.ts
│   ├── days-between.test.ts
│   ├── days-in-month.test.ts
│   ├── format-date.test.ts
│   ├── leap-year.test.ts
│   ├── month-boundaries.test.ts
│   ├── parse-date.test.ts
│   ├── timezone.test.ts           # Multi-timezone and DST verification
│   ├── utilities.test.ts
│   └── validate-date.test.ts
├── .gitignore                     # Git ignore rules
├── CHANGELOG.md                   # Release changelog
├── LICENSE                        # MIT License
├── package.json                   # Package manifest with scripts and exports
├── README.md                      # Library documentation
├── tsconfig.json                  # Strict TypeScript configuration
├── tsup.config.ts                 # Dual ESM/CJS build configuration
└── vitest.config.ts               # Test runner configuration
```

---

## Compatibility

- **Node.js:** `>= 18.0.0` (tested across Node 18, 20, and 22 in CI)
- **Browsers:** Modern Evergreen browsers (Chrome, Edge, Firefox, Safari) supporting ES2022 and `Intl.DateTimeFormat`.
- **Runtimes:** Fully compatible with Bun and Deno.
- **Module Formats:** Native ES Modules (`import`) and CommonJS (`require`).

---

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository on GitHub: [https://github.com/ajitdev01/daysafe](https://github.com/ajitdev01/daysafe)
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Install dependencies: `npm install`
4. Add implementation with comprehensive Vitest tests.
5. Verify all checks pass:
   ```bash
   npm run prepublishOnly
   ```
6. Submit a pull request with a detailed description of the changes.

When submitting bug reports, please include reproducible date inputs, node/runtime version, and environment details.

---

## License

This project is licensed under the [MIT License](LICENSE).

Copyright (c) 2026 Ajit Kumar
