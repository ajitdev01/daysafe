# 📅 DaySafe

> **Timezone-safe, zero-dependency calendar date utilities for JavaScript & TypeScript.**  
> Never get bitten by the "off-by-one day" timezone bug again.

[![npm version](https://img.shields.io/npm/v/daysafe.svg?color=blue&style=flat-square)](https://www.npmjs.com/package/daysafe)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg?style=flat-square)](https://www.npmjs.com/package/daysafe)
[![Tests Passing](https://img.shields.io/badge/tests-123%20passed-brightgreen.svg?style=flat-square)](https://github.com/ajitdev01/daysafe-)
[![CI](https://github.com/ajitdev01/daysafe-/actions/workflows/ci.yml/badge.svg?style=flat-square)](https://github.com/ajitdev01/daysafe-/actions)

---

### 🔗 Quick Links

- 🎮 **[Interactive Playground](https://daysafe.ajitdev.com/playground)** — Test live in your browser without installing!
- 📦 **[NPM Package](https://www.npmjs.com/package/daysafe)** — Package details & release history
- 🐙 **[GitHub Repository](https://github.com/ajitdev01/daysafe-)** — Source code, issues & discussions

---

## ⚡ Installation

Install DaySafe using your package manager of choice:

```bash
# npm
npm install daysafe

# yarn
yarn add daysafe

# pnpm
pnpm add daysafe

# bun
bun add daysafe
```

---

## 🎮 Interactive Live Playground

Want to see DaySafe in action before adding it to your project?  
Test calendar parsing, timezone offsets, leap-year calculations, and month clamping live in your browser:

👉 **[https://daysafe.ajitdev.com/playground](https://daysafe.ajitdev.com/playground)**

---

## 🚀 Quick Start (in 30 Seconds)

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

// 1. Strict calendar parsing (returns branded DateOnly | null)
const invoiceDate = parseDate("2026-11-02"); // "2026-11-02" as DateOnly
parseDate("2026-02-30"); // null (impossible calendar days strictly rejected)

// 2. Exact calendar arithmetic (immune to Daylight Saving Time & timezone drift)
const dueDate = addDays(invoiceDate!, 30); // "2026-12-02"

// 3. Smart month clamping
addMonths("2026-01-31", 1); // "2026-02-28" (clamped to end of Feb)
addMonths("2024-01-31", 1); // "2024-02-29" (clamped to leap day)

// 4. Exact calendar day differences
const remainingDays = daysBetween("2026-11-02", dueDate); // 30

// 5. ISO weekday check (Monday = 1 ... Sunday = 7)
getDayOfWeek("2026-11-02"); // 1 (Monday)
isWeekend("2026-11-01");   // true (Sunday)

// 6. Timezone-safe localized formatting (locked to UTC noon — never flips date!)
const formatted = formatDate(dueDate, { locale: "en-US", style: "long" });
// "December 2, 2026" (guaranteed identical in London, New York, Tokyo, or Kolkata 🌍)
```

---

## 📑 Table of Contents

- [The Date-Only Problem in JavaScript](#the-date-only-problem-in-javascript)
  - [Why Standard JavaScript Date Causes Production Bugs](#why-standard-javascript-date-causes-production-bugs)
  - [Native Date vs DaySafe Comparison](#native-date-vs-daysafe-comparison)
- [Key Features](#key-features)
- [Installation](#installation)
- [Interactive Playground](#interactive-live-playground)
- [Quick Start](#quick-start-in-30-seconds)
- [Complete API Reference](#complete-api-reference)
  - [API Overview](#api-overview)
  - [1. Parsing and Validation](#1-parsing-and-validation)
  - [2. Calendar Arithmetic](#2-calendar-arithmetic)
  - [3. Calendar Utilities](#3-calendar-utilities)
  - [4. Timezone-Safe Formatting](#4-timezone-safe-formatting)
  - [5. Comparison & Helper Utilities](#5-comparison--helper-utilities)
- [Real-World Recipes & Patterns](#real-world-recipes--patterns)
  - [1. Date of Birth & Age Verification](#1-date-of-birth--age-verification)
  - [2. Hotel & Booking Scheduling](#2-hotel--booking-scheduling)
  - [3. Invoice Due Dates (Net 30 / Net 60)](#3-invoice-due-dates-net-30--net-60)
  - [4. Monthly Subscription Billing Cycles](#4-monthly-subscription-billing-cycles)
  - [5. Month Range Database Queries](#5-month-range-database-queries)
- [TypeScript Branded Type Safety](#typescript-branded-type-safety)
- [Architecture & Timezone Safety](#architecture--timezone-safety)
  - [Howard Hinnant Civil Day Algorithms](#howard-hinnant-civil-day-algorithms)
  - [UTC Noon Formatting Lock](#utc-noon-formatting-lock)
- [Error Handling & Edge Cases](#error-handling--edge-cases)
- [Development and Testing](#development-and-testing)
- [Project Structure](#project-structure)
- [Compatibility](#compatibility)
- [Contributing](#contributing)
- [License](#license)

---

## The Date-Only Problem in JavaScript

Developers frequently handle domain models that represent a specific **calendar day** rather than an instant in time:

- **Dates of birth** (DOB)
- **Hotel bookings & flight reservations**
- **Invoices, payroll & tax payment due dates**
- **Statutory holidays and bank schedules**
- **Subscription renewal cycles**
- **Database `DATE` fields** (PostgreSQL `DATE`, MySQL `DATE`, ISO `YYYY-MM-DD` strings)

A calendar day such as `2026-11-02` must represent the **exact same day** across the globe regardless of whether your client or server runs in London (UTC+0), New York (UTC-5), San Francisco (UTC-8), Tokyo (UTC+9), or New Delhi (UTC+5:30).

### Why Standard JavaScript `Date` Causes Production Bugs

1. **The Midnight UTC Shift:**
   When you run `new Date("2026-11-02")`, JavaScript parses it as UTC midnight: `2026-11-02T00:00:00.000Z`. In any timezone behind UTC (like the Americas), calling `.getDate()`, `.toLocaleDateString()`, or `.getDay()` immediately shifts the date backwards:
   ```ts
   // In New York (UTC-5):
   const d = new Date("2026-11-02");
   console.log(d.getDate()); // 1  <-- BUG! Turned into November 1st!
   ```

2. **Daylight Saving Time (DST) Arithmetic Corruptions:**
   Computing date differences by converting to milliseconds and dividing by `86,400,000` is fundamentally broken:
   ```ts
   // On a 23-hour or 25-hour DST transition day:
   const diff = (day2.getTime() - day1.getTime()) / (1000 * 60 * 60 * 24);
   console.log(diff); // 1.9583333333333333  <-- BUG! Not an integer!
   ```

3. **Silent Rollover Bugs:**
   Standard JavaScript date constructors automatically roll over impossible dates without warning:
   ```ts
   new Date(2026, 1, 30); // Silently becomes March 2, 2026!
   ```

4. **Early Year Bug:**
   `new Date(25, 0, 1)` or `Date.UTC(25, 0, 1)` maps year `25` to `1925` due to legacy 1990s web compatibility quirks.

### Native `Date` vs DaySafe Comparison

| Problem / Scenario | Native JavaScript `Date` | DaySafe |
|---|---|---|
| `"2026-11-02"` in NY or LA | Shifts back by 1 day (Nov 1st) ❌ | Stays `"2026-11-02"` everywhere ✅ |
| Daylight Saving Time (DST) | Inexact floating-point numbers (`1.958...`) ❌ | Exact integer civil days (`daysBetween`) ✅ |
| Impossible Day (`"2026-02-30"`) | Silently rolls over into `March 2` ❌ | Strictly returns `null` ✅ |
| Month End Clamping (`Jan 31 + 1 mo`) | Rolls into March ❌ | Clamps safely to Feb 28 (or Feb 29) ✅ |
| Bundle Overhead | Massive (Moment: ~70KB, Day.js + plugins) ❌ | **Zero dependencies, ultra-lightweight (<3KB)** ✅ |
| Type Safety | Accepts any raw `string` ❌ | Branded nominal `DateOnly` type ✅ |
| Ancient / Historical Years | Maps `0025` to `1925` ❌ | Full Gregorian support `0001..9999` ✅ |

---

## Key Features

- 🪶 **Zero Runtime Dependencies:** Completely isolated (`dependencies: {}`). No transitive supply-chain risks.
- 🌍 **100% Timezone Independent:** No millisecond conversions, no local clock queries, and immune to DST 23/25 hour shifts.
- 🔒 **Branded TypeScript Safety:** Employs nominal type branding (`DateOnly`) so unvalidated strings cannot bypass business rules.
- 🎯 **Civil Calendar Math:** Built on Howard Hinnant's proven integer civil calendar algorithms.
- 📅 **Predictable Month Clamping:** Safely handles variable month lengths (e.g. `2026-01-31` + 1 month = `2026-02-28`).
- 🌐 **Timezone-Safe Locale Formatting:** Uses native `Intl.DateTimeFormat` pinned to UTC noon so formatted text never flips across date boundaries.
- 📦 **Dual ESM & CommonJS:** Native ES Modules (`dist/index.mjs`) and CommonJS (`dist/index.js`) with complete `.d.ts` and `.d.mts` declarations.
- 🧪 **100% Tested:** 123 tests across 14 test suites covering multi-timezone environments and edge cases.

---

## Complete API Reference

### API Overview

| Function | Signature | Return Type | Description |
|---|---|---|---|
| [`parseDate`](#parsedateinput-unknown-dateonly--null) | `(input: unknown)` | `DateOnly \| null` | Validates & parses `YYYY-MM-DD` strings. |
| [`isValidDate`](#isvaliddateinput-unknown-input-is-dateonly) | `(input: unknown)` | `input is DateOnly` | TypeScript type guard for valid calendar dates. |
| [`isLeapYear`](#isleapyearyear-number-boolean) | `(year: number)` | `boolean` | Gregorian leap-year check with full century rules. |
| [`getDaysInMonth`](#getdaysinmonthyear-number-month-number-number) | `(year: number, month: number)` | `number` | Returns days in month (28, 29, 30, or 31). |
| [`addDays`](#adddaysdate-dateinput-amount-number-dateonly) | `(date: DateInput, amount: number)` | `DateOnly` | Adds or subtracts signed calendar days. |
| [`addMonths`](#addmonthsdate-dateinput-amount-number-dateonly) | `(date: DateInput, amount: number)` | `DateOnly` | Adds months with automatic month-end clamping. |
| [`addYears`](#addyearsdate-dateinput-amount-number-dateonly) | `(date: DateInput, amount: number)` | `DateOnly` | Adds years with leap-day preservation. |
| [`daysBetween`](#daysbetweenstart-dateinput-end-dateinput-number) | `(start: DateInput, end: DateInput)` | `number` | Exact signed civil day difference (`end - start`). |
| [`compareDates`](#comparedatesa-dateinput-b-dateinput-comparisonresult) | `(a: DateInput, b: DateInput)` | `-1 \| 0 \| 1` | Chronological comparison for sorting. |
| [`getDayOfWeek`](#getdayofweekdate-dateinput-number) | `(date: DateInput)` | `number` | ISO 8601 weekday (Monday = 1, Sunday = 7). |
| [`isWeekend`](#isweekenddate-dateinput-boolean) | `(date: DateInput)` | `boolean` | Checks if date falls on Saturday or Sunday. |
| [`startOfMonth`](#startofmonthdate-dateinput-dateonly) | `(date: DateInput)` | `DateOnly` | Returns first calendar day of month (`YYYY-MM-01`). |
| [`endOfMonth`](#endofmonthdate-dateinput-dateonly) | `(date: DateInput)` | `DateOnly` | Returns last calendar day of month. |
| [`formatDate`](#formatdatedate-dateinput-options-formatdateoptions-string) | `(date: DateInput, options?)` | `string` | Localized formatting with UTC noon lock. |
| [`isBefore`](#isbeforea-dateinput-b-dateinput-boolean) | `(a: DateInput, b: DateInput)` | `boolean` | Checks if `a` is strictly before `b`. |
| [`isAfter`](#isaftera-dateinput-b-dateinput-boolean) | `(a: DateInput, b: DateInput)` | `boolean` | Checks if `a` is strictly after `b`. |
| [`isSame`](#issamea-dateinput-b-dateinput-boolean) | `(a: DateInput, b: DateInput)` | `boolean` | Checks if `a` is identical to `b`. |
| [`isBetween`](#isbetweendate-dateinput-start-dateinput-end-dateinput-inclusive-boolean-boolean) | `(date, start, end, inclusive?)` | `boolean` | Checks if date is within range. |
| [`minDate`](#mindatedates-dateinput-dateonly) | `(...dates: DateInput[])` | `DateOnly` | Returns earliest calendar date. |
| [`maxDate`](#maxdatedates-dateinput-dateonly) | `(...dates: DateInput[])` | `DateOnly` | Returns latest calendar date. |
| [`toDateParts`](#todatepartsdate-dateinput-dateparts) | `(date: DateInput)` | `DateParts` | Extracts numeric `{ year, month, day }`. |
| [`fromDateParts`](#fromdatepartsparts-dateparts-dateonly) | `(parts: DateParts)` | `DateOnly` | Creates a validated `DateOnly` from numeric parts. |
| [`todayUtc`](#todayutc-dateonly) | `()` | `DateOnly` | Returns today's UTC calendar date. |

---

### 1. Parsing and Validation

#### `parseDate(input: unknown): DateOnly | null`
Parses and validates an unknown input value as a calendar date in `YYYY-MM-DD` format.

- **Parameters:** `input: unknown`
- **Return Type:** `DateOnly | null`
- **Behavior:**
  - Returns a branded `DateOnly` string on success.
  - Returns `null` if the input is not a string, does not match `YYYY-MM-DD`, contains timestamps or timezone specifiers, represents an impossible day (e.g. February 30th), or specifies year zero.
  - Never mutates input or normalizes invalid dates silently.

```ts
parseDate("2026-11-02");           // "2026-11-02"
parseDate("2024-02-29");           // "2024-02-29" (valid leap year)
parseDate("2023-02-29");           // null (not a leap year)
parseDate("2026-02-30");           // null (February 30 does not exist)
parseDate("2026-11-02T00:00:00Z"); // null (timestamp rejected)
parseDate("0000-01-01");           // null (year zero rejected)
```

#### `isValidDate(input: unknown): input is DateOnly`
A TypeScript type guard that checks whether an unknown value is a valid calendar date string.

- **Parameters:** `input: unknown`
- **Return Type:** `input is DateOnly` (boolean)

```ts
const userSubmission: string = "2026-11-02";

if (isValidDate(userSubmission)) {
  // Inside this block, userSubmission is typed as DateOnly!
  const nextWeek = addDays(userSubmission, 7);
}
```

#### `isLeapYear(year: number): boolean`
Determines whether a Gregorian year is a leap year using astronomical 400-year rules.

- **Rule:** A year is a leap year if divisible by 4, unless divisible by 100, unless divisible by 400.
- **Parameters:** `year: number` (integer `1..9999`)
- **Return Type:** `boolean`

```ts
isLeapYear(2024); // true (divisible by 4)
isLeapYear(2023); // false
isLeapYear(1900); // false (century year not divisible by 400)
isLeapYear(2000); // true (quadricentennial leap year)
```

#### `getDaysInMonth(year: number, month: number): number`
Returns the exact number of calendar days in a specific Gregorian month (`1..12`).

- **Parameters:** `year: number`, `month: number` (1 = January, 12 = December)
- **Return Type:** `number` (28, 29, 30, or 31)
- **Error Handling:** Throws `TypeError` for non-integers. Throws `RangeError` if month is out of bounds (`1..12`) or year is out of bounds (`1..9999`).

```ts
getDaysInMonth(2024, 2); // 29 (leap year February)
getDaysInMonth(2026, 2); // 28 (common year February)
getDaysInMonth(2026, 4); // 30 (April)
getDaysInMonth(2026, 7); // 31 (July)
```

---

### 2. Calendar Arithmetic

All arithmetic operations accept `DateInput` (`DateOnly | string`) and return a new `DateOnly` string. Caller inputs are never mutated.

#### `addDays(date: DateInput, amount: number): DateOnly`
Adds or subtracts signed calendar days using civil day integer arithmetic. Completely unaffected by Daylight Saving Time.

- **Parameters:** `date: DateInput`, `amount: number` (integer)
- **Return Type:** `DateOnly`
- **Error Handling:** Throws `TypeError` if `date` is invalid or `amount` is not an integer. Throws `RangeError` if the resulting year is outside `0001..9999`.

```ts
addDays("2026-11-02", 5);  // "2026-11-07"
addDays("2026-11-02", -2); // "2026-10-31"
addDays("2024-02-28", 1);  // "2024-02-29"
addDays("2024-02-29", 1);  // "2024-03-01"
```

#### `addMonths(date: DateInput, amount: number): DateOnly`
Adds or subtracts calendar months with **predictable end-of-month clamping**.

- **Parameters:** `date: DateInput`, `amount: number` (integer)
- **Clamping Guarantee:** If the destination month has fewer days than the starting day, the result is clamped to the last day of the destination month.
- **Return Type:** `DateOnly`

```ts
// January 31st clamped to February:
addMonths("2026-01-31", 1);  // "2026-02-28" (clamped to end of Feb)
addMonths("2024-01-31", 1);  // "2024-02-29" (clamped to leap day)

// March 31st clamped backward:
addMonths("2026-03-31", -1); // "2026-02-28"

// Standard additions:
addMonths("2026-01-15", 3);  // "2026-04-15"
```

#### `addYears(date: DateInput, amount: number): DateOnly`
Adds or subtracts calendar years with leap-day preservation and clamping.

- **Parameters:** `date: DateInput`, `amount: number` (integer)
- **Return Type:** `DateOnly`

```ts
addYears("2024-02-29", 1); // "2025-02-28" (clamped to common year)
addYears("2024-02-29", 4); // "2028-02-29" (destination year is leap)
addYears("2026-11-02", 2); // "2028-11-02"
```

#### `daysBetween(start: DateInput, end: DateInput): number`
Calculates the exact signed integer calendar day difference between two dates (`end - start`).

- **Parameters:** `start: DateInput`, `end: DateInput`
- **Return Type:** `number`
- **Behavior:** Positive if `end > start`, negative if `end < start`, `0` if identical. Unaffected by DST 23-hour or 25-hour days.

```ts
daysBetween("2026-11-01", "2026-11-05"); // 4
daysBetween("2026-11-05", "2026-11-01"); // -4
daysBetween("2026-11-01", "2026-11-01"); // 0
```

#### `compareDates(a: DateInput, b: DateInput): ComparisonResult`
Compares two dates chronologically. Returns `-1`, `0`, or `1`. Designed for use in `Array.prototype.sort`.

```ts
compareDates("2026-11-01", "2026-11-05"); // -1
compareDates("2026-11-05", "2026-11-01"); // 1
compareDates("2026-11-01", "2026-11-01"); // 0

const dates = ["2026-12-31", "2024-02-29", "2026-01-15"];
dates.sort(compareDates);
// ["2024-02-29", "2026-01-15", "2026-12-31"]
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

### 4. Timezone-Safe Formatting

#### `formatDate(date: DateInput, options?: FormatDateOptions): string`
Formats a calendar date with the native `Intl.DateTimeFormat` API with guaranteed timezone independence.

- **Parameters:**
  - `date: DateInput`
  - `options?: FormatDateOptions`:
    - `locale?: string | string[]` — BCP 47 language tag (e.g. `"en-US"`, `"en-IN"`, `"de-DE"`).
    - `style?: "full" | "long" | "medium" | "short"` — Preset date style.
    - `dateStyle?: "full" | "long" | "medium" | "short"` — Standard `Intl` dateStyle.
    - Component options: `year`, `month`, `day`, `weekday`, `era`.
- **Timezone Guarantee:** The date is locked to UTC noon (`12:00:00 UTC`) internally, preventing offset-induced date shifting anywhere in the world.

```ts
// Preset styles
formatDate("2026-11-02", { locale: "en-US", style: "long" });
// "November 2, 2026"

formatDate("2026-11-02", { locale: "en-IN" });
// "2/11/2026"

formatDate("2026-11-02", { locale: "de-DE", style: "medium" });
// "02.11.2026"

// Granular custom formatting
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

### 5. Comparison & Helper Utilities

```ts
import {
  isBefore,
  isAfter,
  isSame,
  isBetween,
  minDate,
  maxDate,
  toDateParts,
  fromDateParts,
  todayUtc,
} from "daysafe";

// Chronological checks:
isBefore("2026-11-01", "2026-11-02"); // true
isAfter("2026-11-02", "2026-11-01");  // true
isSame("2026-11-01", "2026-11-01");   // true

// Range membership (inclusive by default, or strictly exclusive):
isBetween("2026-11-05", "2026-11-01", "2026-11-10");        // true
isBetween("2026-11-01", "2026-11-01", "2026-11-10", false); // false (exclusive)

// Extrema:
minDate("2026-11-05", "2026-11-02", "2026-11-08"); // "2026-11-02"
maxDate("2026-11-05", "2026-11-02", "2026-11-08"); // "2026-11-08"

// Object deconstruction & reconstruction:
toDateParts("2026-11-02"); // { year: 2026, month: 11, day: 2 }
fromDateParts({ year: 2026, month: 11, day: 2 }); // "2026-11-02"

// Today's UTC calendar date:
todayUtc(); // "2026-11-02"
```

---

## Real-World Recipes & Patterns

### 1. Date of Birth & Age Verification

Validate user input and verify the user has reached legal age (e.g. 18 years old):

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

### 2. Hotel & Booking Scheduling

Calculate stay durations and identify weekend nights for surge pricing:

```ts
import { parseDate, addDays, daysBetween, isWeekend } from "daysafe";

function calculateBooking(checkInDate: string, nights: number) {
  const checkIn = parseDate(checkInDate);
  if (!checkIn || nights <= 0) {
    throw new Error("Invalid booking parameters");
  }

  const checkOut = addDays(checkIn, nights);
  const totalNights = daysBetween(checkIn, checkOut);

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

Generate payment terms and determine overdue status without timezone distortions:

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
// dueDate: "2026-12-02", formattedDue: "Dec 2, 2026", daysRemaining: 30, isOverdue: false
```

### 4. Monthly Subscription Billing Cycles

Safely advance monthly billing dates with automatic month-end clamping:

```ts
import { parseDate, addMonths } from "daysafe";

function getNextBillingCycles(startDate: string, billingCycles: number): string[] {
  const start = parseDate(startDate)!;
  const schedule: string[] = [];

  for (let i = 1; i <= billingCycles; i++) {
    schedule.push(addMonths(start, i));
  }

  return schedule;
}

// January 31st safely clamps to February, March, April
getNextBillingCycles("2026-01-31", 4);
// ["2026-02-28", "2026-03-31", "2026-04-30", "2026-05-31"]
```

### 5. Month Range Database Queries

Determine start and end dates for SQL / Prisma / Drizzle `DATE` queries:

```ts
import { parseDate, startOfMonth, endOfMonth } from "daysafe";

function getMonthQueryBounds(dateString: string) {
  const date = parseDate(dateString)!;

  return {
    start: startOfMonth(date), // e.g. "2026-11-01"
    end: endOfMonth(date),     // e.g. "2026-11-30"
  };
}

getMonthQueryBounds("2024-02-15");
// { start: "2024-02-01", end: "2024-02-29" } (leap year accounted for)
```

---

## TypeScript Branded Type Safety

DaySafe uses nominal typing with a branded `DateOnly` type:

```ts
export type DateOnly = string & {
  readonly __brand: "DateOnly";
};
```

This prevents unvalidated, arbitrary strings from being passed into functions that require verified calendar dates:

```ts
import { parseDate, addDays, DateOnly } from "daysafe";

function chargeCustomer(billingDate: DateOnly) {
  return addDays(billingDate, 14);
}

const unvalidatedInput: string = "2026-11-02";

// ❌ TypeScript Error: Type 'string' is not assignable to type 'DateOnly'.
// chargeCustomer(unvalidatedInput);

// ✅ Validated and safe:
const validated = parseDate(unvalidatedInput);
if (validated) {
  chargeCustomer(validated); // Compiles cleanly!
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

## Architecture & Timezone Safety

### Howard Hinnant Civil Day Algorithms
Rather than converting calendar dates into UTC milliseconds and back, DaySafe implements Howard Hinnant's civil day algorithms:
1. `(year, month, day)` tuples are converted directly into a signed linear integer count of days relative to the civil epoch (`1970-01-01`).
2. Arithmetic on days (`addDays`, `daysBetween`) is performed entirely with pure integer operations (`days + amount`, `days2 - days1`).
3. Integer civil day counts are converted back to `(year, month, day)` using mathematical modulus and quotient rules.
4. Local timezones, daylight saving offsets, and clock shifts cannot alter the calculation.

### UTC Noon Formatting Lock
When formatting dates with `Intl.DateTimeFormat`, standard JavaScript initializes timestamps at UTC midnight (`00:00:00 UTC`). In timezones west of UTC, this shifts back into the previous day.

DaySafe initializes formatting at **UTC Noon (`12:00:00 UTC`)** via `.setUTCFullYear()` and locks `timeZone: "UTC"` on the formatter. Since noon UTC is 12 hours away from day boundaries, the calendar day remains fixed across all 26 world timezones (UTC-12 to UTC+14).

---

## Error Handling & Edge Cases

### Policy Matrix

| Function Category | Behavior on Invalid Input | Examples |
|---|---|---|
| **Parsing Functions** | Returns `null` | `parseDate("2026-02-30")` &rarr; `null`<br>`parseDate("abc")` &rarr; `null` |
| **Predicate Functions** | Returns `false` | `isValidDate("invalid")` &rarr; `false`<br>`isLeapYear(NaN)` &rarr; `false` |
| **Arithmetic Functions** | Throws `TypeError` or `RangeError` | `addDays("invalid", 5)` &rarr; `throws TypeError`<br>`addDays("9999-12-31", 1)` &rarr; `throws RangeError` |
| **Comparison Functions** | Throws `TypeError` | `compareDates("invalid", "2026-01-01")` &rarr; `throws TypeError` |
| **Extrema Helpers** | Throws `TypeError` | `minDate()` &rarr; `throws TypeError` (requires at least 1 date) |

### Supported Range
- **Format:** Strictly `YYYY-MM-DD` (four-digit year, two-digit month, two-digit day).
- **Supported Years:** Gregorian `0001` through `9999`.
- **Year Zero:** Explicitly rejected (`0000` does not exist in standard Gregorian civil calendars).
- **Timestamps:** Disallowed in `parseDate` to prevent ambiguous instant-to-date conversions.

---

## Development and Testing

```bash
# Clone the repository
git clone https://github.com/ajitdev01/daysafe-.git
cd daysafe-

# Install development dependencies
npm install

# Run type checking with strict TypeScript
npm run typecheck

# Run test suite via Vitest (14 test files, 123 tests)
npm test

# Run tests in watch mode
npm run test:watch

# Build dual ESM/CJS bundles with declarations via tsup
npm run build

# Run prepublish validation (typecheck + test + build)
npm run prepublishOnly
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

- **Node.js:** `>= 18.0.0` (validated on Node 18, 20, 22 in CI)
- **Browsers:** Modern Evergreen browsers (Chrome, Edge, Firefox, Safari) supporting ES2022 and `Intl.DateTimeFormat`.
- **Runtimes:** Fully compatible with Bun, Deno, and Cloudflare Workers.
- **Module Formats:** Native ES Modules (`import`) and CommonJS (`require`).

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository on GitHub: [https://github.com/ajitdev01/daysafe-](https://github.com/ajitdev01/daysafe-)
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Install dependencies: `npm install`
4. Add your changes with comprehensive Vitest tests.
5. Verify all tests and builds pass:
   ```bash
   npm run prepublishOnly
   ```
6. Submit a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).

Copyright &copy; 2026 [Ajit Kumar](https://github.com/ajitdev01)
