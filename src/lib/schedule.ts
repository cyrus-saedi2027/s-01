/**
 * Scheduling helpers for the booking panel.
 *
 * Everything here works in real instants (UTC milliseconds) and converts for
 * display only. The host publishes working hours as wall-clock time in their
 * own zone, the visitor reads them in theirs, and the two are not a fixed
 * number of hours apart — the offset moves with daylight saving on both sides.
 * So a slot is resolved to an instant first, and only then formatted.
 */

/** A calendar date with no time and no zone attached. */
export type CivilDate = { y: number; m: number; d: number };

/** Milliseconds a zone is ahead of UTC at a given instant. */
export function zoneOffset(at: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(at));

  const f = (type: string) => Number(parts.find((p) => p.type === type)!.value);
  const asIfUtc = Date.UTC(f("year"), f("month") - 1, f("day"), f("hour"), f("minute"), f("second"));
  // Instants carry milliseconds the formatter drops, so compare on whole seconds.
  return asIfUtc - Math.floor(at / 1000) * 1000;
}

/**
 * The instant at which a wall clock in `timeZone` reads the given date and time.
 *
 * The offset depends on the instant we are solving for, so this guesses once,
 * corrects with the offset that guess lands in, and re-checks. The second pass
 * matters only across a DST boundary, where the first guess can land on the
 * wrong side of the jump.
 */
export function zonedTimeToInstant(
  date: CivilDate,
  hour: number,
  minute: number,
  timeZone: string
): number {
  const guess = Date.UTC(date.y, date.m, date.d, hour, minute);
  const first = guess - zoneOffset(guess, timeZone);
  const second = guess - zoneOffset(first, timeZone);
  return second;
}

/** The civil date an instant falls on, as read in `timeZone`. */
export function civilDateIn(at: number, timeZone: string): CivilDate {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(at));
  const f = (type: string) => Number(parts.find((p) => p.type === type)!.value);
  return { y: f("year"), m: f("month") - 1, d: f("day") };
}

export const sameDate = (a: CivilDate, b: CivilDate) =>
  a.y === b.y && a.m === b.m && a.d === b.d;

/** Sorts as a plain number so dates compare without building Date objects. */
export const dateKey = (d: CivilDate) => d.y * 10000 + d.m * 100 + d.d;

/** Day of week for a civil date, 0 = Sunday. */
export const weekdayOf = (d: CivilDate) => new Date(Date.UTC(d.y, d.m, d.d)).getUTCDay();

export const addMonths = (d: CivilDate, n: number): CivilDate => {
  const t = new Date(Date.UTC(d.y, d.m + n, 1));
  return { y: t.getUTCFullYear(), m: t.getUTCMonth(), d: 1 };
};

/**
 * Six weeks of dates covering the month, starting on `weekStart`.
 *
 * Always six rows: a grid that changes height as you page through months makes
 * the panel jump, and the whole layout is anchored to it.
 */
export function monthGrid(year: number, month: number, weekStart = 0): CivilDate[] {
  const first = new Date(Date.UTC(year, month, 1));
  const lead = (first.getUTCDay() - weekStart + 7) % 7;
  return Array.from({ length: 42 }, (_, i) => {
    const t = new Date(Date.UTC(year, month, 1 - lead + i));
    return { y: t.getUTCFullYear(), m: t.getUTCMonth(), d: t.getUTCDate() };
  });
}

export type Availability = {
  /** Open weekdays, 0 = Sunday. */
  days: readonly number[];
  /**
   * Wall-clock hours, end exclusive, read in whichever zone the visitor has
   * selected — so the day always runs from `start` to `end` on their own clock
   * rather than sliding by the offset between them and the studio.
   */
  start: number;
  end: number;
  /** How far ahead bookings are open, in days. */
  horizon: number;
};

/**
 * Stable pseudo-random in [0, 1) from a date and index — same day, same gaps.
 *
 * Two things this has to get right, both of which it got wrong before:
 * every multiply goes through `Math.imul`, because a plain
 * `key * 2654435761` is a double and with a key around 2e7 the product passes
 * 2^53, losing exactly the low bits the mixing works on; and the result is
 * coerced back to unsigned before the divide, because `^` yields a signed
 * int32. Either one alone pushed three quarters of the day into "booked".
 */
function jitter(key: number, i: number): number {
  let h = (Math.imul(key, 2654435761) ^ Math.imul(i + 1, 40503)) >>> 0;
  h ^= h >>> 15;
  h = Math.imul(h, 2246822507) >>> 0;
  h ^= h >>> 13;
  h = Math.imul(h, 3266489909) >>> 0;
  h ^= h >>> 16;
  // `^` yields a *signed* int32. Without this the top bit reads as negative and
  // every such value falls under any threshold — half the range, silently.
  return (h >>> 0) / 4294967296;
}

/**
 * Open slots on a date, as instants, ascending.
 *
 * Some are dropped so the month reads like a real diary rather than a
 * timetable; the drops are derived from the date, so a day looks the same on
 * every render and on every visit.
 */
export function slotsOn(
  date: CivilDate,
  durationMinutes: number,
  avail: Availability,
  now: number,
  timeZone: string
): number[] {
  const today = civilDateIn(now, timeZone);
  if (dateKey(date) < dateKey(today)) return [];

  const horizon = new Date(Date.UTC(today.y, today.m, today.d + avail.horizon));
  if (dateKey(date) > dateKey(civilDateIn(horizon.getTime(), "UTC"))) return [];

  if (!avail.days.includes(weekdayOf(date))) return [];

  const key = dateKey(date);
  const step = durationMinutes;
  const from = avail.start * 60;
  const out: number[] = [];

  for (let mins = from; mins + step <= avail.end * 60; mins += step) {
    // Index by position in the day, so a slot's fate does not depend on how
    // many before it happened to survive.
    if (jitter(key, (mins - from) / step) < TAKEN) continue;
    const at = zonedTimeToInstant(date, Math.floor(mins / 60), mins % 60, timeZone);
    if (at <= now) continue; // today's slots that have passed
    out.push(at);
  }
  return out;
}

/** Share of the day already booked, so a month reads like a diary. */
const TAKEN = 0.24;

/** Formats an instant as a time of day in the viewer's zone. */
export function formatTime(at: number, timeZone: string, hour12: boolean): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12,
  })
    .format(new Date(at))
    .toLowerCase();
}

/** The zones offered in the picker, with the viewer's own first. */
export function timeZoneChoices(): string[] {
  const here = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const common = [
    "Europe/Amsterdam",
    "Europe/London",
    "America/New_York",
    "America/Los_Angeles",
    "Asia/Tehran",
    "Asia/Dubai",
    "Asia/Tokyo",
    "Australia/Sydney",
    "UTC",
  ];
  return [here, ...common.filter((z) => z !== here)];
}

/** Short label for a zone, e.g. "Amsterdam · GMT+2". */
export function zoneLabel(timeZone: string, at: number): string {
  const city = timeZone.split("/").pop()!.replace(/_/g, " ");
  const mins = zoneOffset(at, timeZone) / 60000;
  const sign = mins < 0 ? "−" : "+";
  const h = Math.floor(Math.abs(mins) / 60);
  const m = Math.abs(mins) % 60;
  return `${city} · GMT${mins === 0 ? "" : sign + h + (m ? `:${String(m).padStart(2, "0")}` : "")}`;
}
