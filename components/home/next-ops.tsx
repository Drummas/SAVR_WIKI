"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, Radio, Zap } from "lucide-react";

import { Countdown } from "@/components/countdown";
import { useClock } from "@/components/time/clock-provider";
import { categoryStyles, dateKey, eventOccursOn, isSameMonth } from "@/lib/calendar";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/lib/types";

/**
 * Seven days starting today, expressed as wall-clock dates in the active zone
 * so the strip always opens on the current day and rolls over at midnight.
 */
function nextSevenDays(now: number, offset: number) {
  const start = new Date(now + offset * 60_000);
  start.setUTCHours(12, 0, 0, 0);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);
    return date;
  });
}

export function NextOps({
  events,
  initialDate,
  variant = "panel",
}: {
  events: CalendarEvent[];
  initialDate: string;
  variant?: "panel" | "section";
}) {
  const clock = useClock();
  const offset = clock.offset;
  const now = clock.nowMs ?? new Date(`${initialDate}T12:00:00Z`).getTime();

  const upcoming = useMemo(
    () =>
      [...events]
        .filter((event) => new Date(event.end ?? event.start).getTime() >= now)
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()),
    [events, now],
  );

  const days = nextSevenDays(now, offset);
  const today = new Date(now + offset * 60_000);
  const todayKey = clock.dateKey(now);

  if (variant === "section") {
    return (
      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-md border border-border/70 bg-card/40 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
              <CalendarDays className="size-3.5" /> Next seven days
            </p>
            <Link
              href="/calendar/"
              className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground/60 hover:text-primary"
            >
              Full calendar <ArrowRight className="size-3" />
            </Link>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((date) => {
              const key = dateKey(date);
              const dayEvents = events.filter((event) => eventOccursOn(event, key, offset));
              const isToday = key === todayKey;
              return (
                <Link
                  href="/calendar/"
                  key={key}
                  className={cn(
                    "group relative flex min-h-[118px] flex-col rounded-sm border p-1.5 transition-colors sm:min-h-[150px] sm:p-2",
                    isToday
                      ? "border-primary/40 bg-primary/[0.06]"
                      : "border-border/50 bg-background/30 hover:border-primary/30",
                    !isSameMonth(date, today) && "opacity-80",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[8px] uppercase tracking-wide text-muted-foreground/60">
                      {new Intl.DateTimeFormat("en-GB", { weekday: "short", timeZone: "UTC" }).format(date)}
                    </span>
                    <span
                      className={cn(
                        "flex size-5 items-center justify-center rounded-sm font-mono text-[9px]",
                        isToday ? "bg-primary text-primary-foreground" : "text-foreground/70",
                      )}
                    >
                      {date.getUTCDate()}
                    </span>
                  </div>
                  <div className="mt-1.5 space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className={cn(
                          "flex items-center gap-1 rounded-sm px-1 py-0.5 text-[7px] leading-tight sm:text-[8px]",
                          categoryStyles[event.category].bg,
                          categoryStyles[event.category].text,
                        )}
                      >
                        <span
                          className={cn(
                            "size-1 shrink-0 rounded-full",
                            categoryStyles[event.category].dot,
                          )}
                        />
                        <span className="line-clamp-2">{event.title}</span>
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <p className="font-mono text-[7px] text-muted-foreground/50">
                        +{dayEvents.length - 3}
                      </p>
                    )}
                    {!dayEvents.length && (
                      <p className="pt-1 font-mono text-[7px] uppercase tracking-wide text-muted-foreground/25">
                        Clear
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
          <p className="mt-3 flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground/40">
            <Zap className="size-2.5 text-primary/50" /> Overlap windows visible in the full calendar
          </p>
        </div>

        <div className="rounded-md border border-border/70 bg-card/40 p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
              <Radio className="size-3.5" /> Upcoming windows
            </p>
            <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground/40">
              {clock.zone}
            </span>
          </div>
          <div className="divide-y divide-border/40">
            {upcoming.slice(0, 4).map((event) => (
              <div key={event.id} className="py-2.5 first:pt-0 last:pb-0">
                <div className="flex items-start gap-2">
                  <span
                    className={cn(
                      "mt-1.5 size-1.5 shrink-0 rounded-full",
                      categoryStyles[event.category].dot,
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-foreground">{event.title}</p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.06em] text-muted-foreground/50">
                      <span>{clock.formatDateShort(event.start)}</span>
                      <span>·</span>
                      <span>
                        {clock.formatTime(event.start)} {clock.zone}
                      </span>
                      <span>·</span>
                      <span>{event.source}</span>
                    </p>
                  </div>
                  <Countdown target={event.start} end={event.end} compact className="shrink-0 text-[9px]" />
                </div>
              </div>
            ))}
          </div>
          {!upcoming.length && (
            <p className="py-6 text-center text-xs text-muted-foreground">
              No upcoming windows. Update the calendar from the content studio.
            </p>
          )}
        </div>
      </div>
    );
  }

  const next = upcoming[0];

  return (
    <div className="hud-corners relative overflow-hidden rounded-lg border border-border/80 bg-card/70 p-4 backdrop-blur-md sm:p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-primary">
          <span className="size-1.5 animate-pulse-soft rounded-full bg-primary" /> Next operation
        </p>
        <Link
          href="/calendar/"
          className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground/50 hover:text-primary"
        >
          Calendar →
        </Link>
      </div>

      {next ? (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-sm border px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.08em]",
                categoryStyles[next.category].chip,
              )}
            >
              {next.category}
            </span>
            <span className="font-mono text-[8px] uppercase tracking-[0.08em] text-muted-foreground/50">
              {clock.formatDateShort(next.start)} · {clock.formatTime(next.start)} {clock.zone}
            </span>
          </div>
          <Link href={next.href ?? "/calendar/"} className="mt-2 block">
            <h2 className="font-display text-2xl uppercase leading-none tracking-wide text-foreground hover:text-emerald-100">
              {next.title}
            </h2>
          </Link>
          <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
            {next.description}
          </p>
          <div className="mt-4 rounded-sm border border-border/60 bg-background/50 p-2.5">
            <Countdown target={next.start} end={next.end} />
          </div>

          <div className="mt-3 space-y-2 border-t border-border/50 pt-3">
            {upcoming.slice(1, 3).map((event) => (
              <Link
                key={event.id}
                href={event.href ?? "/calendar/"}
                className="group flex items-center gap-2"
              >
                <span
                  className={cn("size-1.5 shrink-0 rounded-full", categoryStyles[event.category].dot)}
                />
                <span className="min-w-0 flex-1 truncate text-[11px] text-muted-foreground group-hover:text-foreground">
                  {event.title}
                </span>
                <span className="shrink-0 font-mono text-[8px] uppercase tracking-wide text-muted-foreground/40">
                  {clock.formatDateShort(event.start)}
                </span>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <div className="py-10 text-center">
          <Clock className="mx-auto size-6 text-muted-foreground/30" />
          <p className="mt-2 text-sm text-muted-foreground">No upcoming windows scheduled.</p>
          <Link
            href="/calendar/"
            className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:text-emerald-300"
          >
            Update the calendar <ArrowRight className="size-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
