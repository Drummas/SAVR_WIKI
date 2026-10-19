/**
 * Clock and timezone helpers.
 *
 * Alliance data is stored in UTC (`...Z`), which is also the in-game server
 * clock. Players usually play on a fixed offset they set in game, so every
 * time on the site can be rendered either in server time or in that offset.
 *
 * Everything here is pure and offset-based (never the host machine's zone), so
 * server-rendered markup and the first client render always agree.
 */

export const SERVER_OFFSET = 0;

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
  [-240]: "Halifax",
  [-210]: "St. John's",
  [-180]: "São Paulo",
  [-120]: "South Georgia",
  [-60]: "Azores",
  [-30]: "Mid-Atlantic",
  0: "Server time",
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

/** Weekday name plus date, built from single fields to stay hydration-safe. */
export function formatZoneDayLong(value: string | number | Date, offset: number) {
  const wall = toWallClock(value, offset);
  const part = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-GB", { ...options, timeZone: "UTC" }).format(wall);
  return `${part({ weekday: "long" })}, ${part({ day: "2-digit" })} ${part({
    month: "long",
  })} ${part({ year: "numeric" })}`;
}

