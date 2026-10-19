import { zoneDateKey } from "@/lib/time";
import type { CalendarCategory, CalendarEvent } from "@/lib/types";

/**
 * Category tones. The calendar deliberately uses a spread of green-family hues
 * (neon → jade → teal → cyan → lime) plus amber and coral so seven overlapping
 * categories stay distinguishable on dark surfaces.
 */
export const categoryStyles: Record<
  CalendarCategory,
  { dot: string; chip: string; text: string; border: string; bg: string }
> = {
  "Alliance Events": {
    dot: "bg-emerald-400",
    chip: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
    text: "text-emerald-300",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
  },
  "Survival Battle": {
    dot: "bg-red-400",
    chip: "border-red-500/30 bg-red-500/10 text-red-200",
    text: "text-red-300",
    border: "border-red-500/30",
    bg: "bg-red-500/10",
  },
  "Alliance vs Alliance": {
    dot: "bg-lime-400",
    chip: "border-lime-500/30 bg-lime-500/10 text-lime-200",
    text: "text-lime-300",
    border: "border-lime-500/30",
    bg: "bg-lime-500/10",
  },
  "State Events": {
    dot: "bg-teal-400",
    chip: "border-teal-500/30 bg-teal-500/10 text-teal-200",
    text: "text-teal-300",
    border: "border-teal-500/30",
    bg: "bg-teal-500/10",
  },
  "Resource Events": {
    dot: "bg-green-400",
    chip: "border-green-500/30 bg-green-500/10 text-green-200",
    text: "text-green-300",
    border: "border-green-500/30",
    bg: "bg-green-500/10",
  },
  "Hero Events": {
    dot: "bg-cyan-400",
    chip: "border-cyan-500/30 bg-cyan-500/10 text-cyan-200",
    text: "text-cyan-300",
    border: "border-cyan-500/30",
    bg: "bg-cyan-500/10",
  },
  "Plague Events": {
    dot: "bg-amber-400",
    chip: "border-amber-500/30 bg-amber-500/10 text-amber-200",
    text: "text-amber-300",
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
  },
};

export function dateKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(
    date.getUTCDate(),
  ).padStart(2, "0")}`;
}

export function isoDateKey(value: string) {
  return value.slice(0, 10);
}

/**
 * Calendar day keys honour the clock the visitor is reading. A window that
 * opens at 23:30 UTC belongs to the next day for a player on UTC+2, and the
 * grid should agree with the time printed inside the cell.
 */
export function eventStartKey(event: CalendarEvent, offset = 0) {
  return offset === 0 ? isoDateKey(event.start) : zoneDateKey(event.start, offset);
}

export function eventEndKey(event: CalendarEvent, offset = 0) {
  const end = event.end ?? event.start;
  return offset === 0 ? isoDateKey(end) : zoneDateKey(end, offset);
}

export function eventOccursOn(event: CalendarEvent, key: string, offset = 0) {
  return key >= eventStartKey(event, offset) && key <= eventEndKey(event, offset);
}

export function utcDate(year: number, month: number, day: number) {
  return new Date(Date.UTC(year, month, day, 12, 0, 0));
}

export function monthGrid(cursor: Date) {
  const year = cursor.getUTCFullYear();
  const month = cursor.getUTCMonth();
  const first = utcDate(year, month, 1);
  const offset = (first.getUTCDay() + 6) % 7; // Monday-first
  const start = utcDate(year, month, 1 - offset);
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);
    return date;
  });
}

export function weekDays(cursor: Date) {
  const offset = (cursor.getUTCDay() + 6) % 7;
  const start = new Date(cursor);
  start.setUTCDate(cursor.getUTCDate() - offset);
  start.setUTCHours(12, 0, 0, 0);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);
    return date;
  });
}

export function addMonthsUtc(cursor: Date, amount: number) {
  return new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + amount, 1, 12));
}

export function addDaysUtc(cursor: Date, amount: number) {
  const next = new Date(cursor);
  next.setUTCDate(cursor.getUTCDate() + amount);
  return next;
}

export function monthLabel(cursor: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(cursor);
}

export function dayLabel(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  }).format(date);
}

/**
 * Full date label.
 *
 * Composed from single-field formatters on purpose: ICU versions disagree on
 * the comma in the en-GB full-date pattern (`Sunday, 18 October 2026` in Node 22
 * vs `Sunday 18 October 2026` in Chromium), which produced a text hydration
 * mismatch on the calendar page. Individual fields are identical everywhere.
 */
export function longDayLabel(date: Date) {
  const part = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-GB", { ...options, timeZone: "UTC" }).format(date);
  return `${part({ weekday: "long" })}, ${part({ day: "2-digit" })} ${part({
    month: "long",
  })} ${part({ year: "numeric" })}`;
}

export function isSameMonth(date: Date, cursor: Date) {
  return (
    date.getUTCFullYear() === cursor.getUTCFullYear() &&
    date.getUTCMonth() === cursor.getUTCMonth()
  );
}

export function isPastEvent(event: CalendarEvent, now = Date.now()) {
  return new Date(event.end ?? event.start).getTime() < now;
}
