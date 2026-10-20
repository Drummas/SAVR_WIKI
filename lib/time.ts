/**
 * Clock and timezone helpers.
 *
 * Calendar data is authored on the in-game clock, which runs at `UTC-4` —
 * four hours behind UTC, and five hours behind UK summer time (BST). A stored
 * value therefore describes server wall-clock time, not an absolute UTC
 * instant: `2026-10-19T00:00:00Z` in the JSON means midnight on the server,
 * which is 04:00 UTC.
 *
 * `SERVER_OFFSET` is the server offset in minutes east of UTC. Rendering in
 * server time shows a stored value unchanged; rendering in any other zone
 * shifts it by `zoneOffset - SERVER_OFFSET` (see `displayOffset`).
 *
 * Everything here is pure and offset-based (never the host machine's zone), so
 * server-rendered markup and the first client render always agree.
 */

export const SERVER_OFFSET = -240;

export type ClockMode = "server" | "local";

export function zoneLabel(offset: number) {
  if (offset === 0) return "UTC";
  const sign = offset < 0 ? "-" : "+";
  const absolute = Math.abs(offset);
  const hours = Math.floor(absolute / 60);
  const minutes = absolute % 60;
  return `UTC${sign}${hours}${minutes ? `:${String(minutes).padStart(2, "0")}` : ""}`;
}

const cityHints: Record<number, string> = {
  [-720]: "Baker Island",
  [-660]: "Pago Pago",
  [-600]: "Honolulu",
  [-570]: "Marquesas",
  [-540]: "Anchorage",
  [-480]: "Los Angeles",
  [-420]: "Denver",
  [-360]: "Chicago",
  [-300]: "New York",
  [-240]: "Server time · Halifax",
  [-210]: "St. John's",
  [-180]: "São Paulo",
  [-120]: "South Georgia",
  [-60]: "Azores",
  [-30]: "Mid-Atlantic",
  0: "GMT / UTC",
  60: "Central Europe",
  120: "Eastern Europe",
  180: "Moscow",
  210: "Tehran",
  240: "Gulf",
  270: "Kabul",
  300: "Karachi",
  330: "India",
  345: "Kathmandu",
  360: "Dhaka",
  390: "Myanmar",
  420: "Bangkok",
  480: "Singapore",
  540: "Tokyo",
  570: "Adelaide",
  600: "Sydney",
  630: "Lord Howe",
  660: "Solomon Islands",
  720: "Auckland",
  780: "Samoa",
  840: "Kiritimati",
};

export interface ZoneOption {
  offset: number;
  label: string;
  hint?: string;
}

/** Every offset from UTC-12:00 to UTC+14:00 in 30-minute steps. */
export const zoneOptions: ZoneOption[] = Array.from(
  { length: (840 - -720) / 30 + 1 },
  (_, index) => {
    const offset = -720 + index * 30;
    return { offset, label: zoneLabel(offset), hint: cityHints[offset] };
  },
);

/** The browser's current offset in minutes east of UTC (UTC+2 → 120). */
export function browserOffset() {
  return -new Date().getTimezoneOffset();
}

/**
 * Shift to apply to a stored (server-clock) timestamp so it renders in
 * `offset`. Server time is the identity; any other zone includes the five-hour
 * hop between the in-game clock and UTC.
 */
export function displayOffset(offset: number) {
  return offset - SERVER_OFFSET;
}

/**
 * Current time expressed on the server clock — the same space as the stored
 * calendar values, so comparisons and countdowns line up with them.
 */
export function nowOnServerClock(now = Date.now()) {
  return now + SERVER_OFFSET * 60_000;
}

/** Today's date key (`YYYY-MM-DD`) on the server clock. */
export function serverTodayKey(now = Date.now()) {
  return new Date(nowOnServerClock(now)).toISOString().slice(0, 10);
}

/** Shift an instant so its UTC getters read as wall-clock time in the zone. */
export function toWallClock(value: string | number | Date, offset: number) {
  const instant = value instanceof Date ? value : new Date(value);
  return new Date(instant.getTime() + offset * 60_000);
}

export function formatZoneTime(value: string | number | Date, offset: number) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "UTC",
  }).format(toWallClock(value, offset));
}

export function formatZoneTimeWithSeconds(value: string | number | Date, offset: number) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    timeZone: "UTC",
  }).format(toWallClock(value, offset));
}

export function formatZoneDate(
  value: string | number | Date,
  offset: number,
  options: Intl.DateTimeFormatOptions = {},
) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
    ...options,
  }).format(toWallClock(value, offset));
}

export function formatZoneDateShort(value: string | number | Date, offset: number) {
  return formatZoneDate(value, offset, { day: "2-digit", month: "short" });
}

export function formatZoneWeekday(value: string | number | Date, offset: number) {
  return new Intl.DateTimeFormat("en-GB", { weekday: "short", timeZone: "UTC" }).format(
    toWallClock(value, offset),
  );
}

export function formatZoneMonthShort(value: string | number | Date, offset: number) {
  return new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" }).format(
    toWallClock(value, offset),
  );
}

/**
 * Calendar day key (`YYYY-MM-DD`) for an instant, in the display zone.
 * Composed from single-field formatters: ICU builds disagree on the comma in
 * en-GB long dates, and a mismatch here produced a hydration warning before.
 */
export function zoneDateKey(value: string | number | Date, offset: number) {
  const wall = toWallClock(value, offset);
  return `${wall.getUTCFullYear()}-${String(wall.getUTCMonth() + 1).padStart(2, "0")}-${String(
    wall.getUTCDate(),
  ).padStart(2, "0")}`;
}

/**
 * Server day number, counting the launch day as day 1. The launch date is a
 * server-clock calendar day (`YYYY-MM-DD`), so the number flips at server
 * midnight, not at the visitor's midnight.
 */
export function serverDayNumber(launchKey: string, now = Date.now()): number | null {
  const launch = Date.parse(`${launchKey}T00:00:00Z`);
  const today = Date.parse(`${serverTodayKey(now)}T00:00:00Z`);
  if (!Number.isFinite(launch) || !Number.isFinite(today)) return null;
  return Math.round((today - launch) / 86_400_000) + 1;
}

/** Milliseconds until the next server-clock midnight (the day rollover). */
export function msUntilServerMidnight(now = Date.now()) {
  const wall = nowOnServerClock(now);
  return 86_400_000 - (wall % 86_400_000);
}

/**
 * Today's date on the server clock, e.g. `OCTOBER 20, 2026`. Built from single
 * fields for the same hydration reason as `formatZoneDayLong`.
 */
export function formatServerDate(now = Date.now()) {
  const wall = new Date(nowOnServerClock(now));
  const part = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" }).format(wall);
  return `${part({ month: "long" }).toUpperCase()} ${part({ day: "numeric" })}, ${part({
    year: "numeric",
  })}`;
}

/** Weekday name plus date, built from single fields to stay hydration-safe. */
export function formatZoneDayLong(value: string | number | Date, offset: number) {
  const wall = toWallClock(value, offset);
  const part = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-GB", { ...options, timeZone: "UTC" }).format(wall);
  return `${part({ weekday: "long" })}, ${part({ day: "2-digit" })} ${part({
    month: "long",
  })} ${part({ year: "numeric" })}`;
}

