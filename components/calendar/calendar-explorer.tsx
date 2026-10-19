"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Info,
  List,
  Search,
  X,
  Zap,
} from "lucide-react";

import { Countdown } from "@/components/countdown";
import { useClock } from "@/components/time/clock-provider";
import { Badge } from "@/components/ui/badge";
import {
  addDaysUtc,
  addMonthsUtc,
  categoryStyles,
  dateKey,
  dayLabel,
  eventOccursOn,
  eventStartKey,
  isSameMonth,
  monthGrid,
  monthLabel,
  weekDays,
} from "@/lib/calendar";
import { calendarCategories } from "@/lib/navigation";
import { formatZoneMonthShort, zoneDateKey } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { CalendarCategory, CalendarEvent } from "@/lib/types";

type View = "month" | "week" | "agenda";
type ClockFormats = ReturnType<typeof useClock>;

function shortEventLabel(event: CalendarEvent) {
  const week = event.title.match(/Week (\d+)/)?.[1];
  if (event.category === "Alliance vs Alliance" && week) return `AvA · W${week}`;
  if (event.category === "Survival Battle") return "Survival · 6 rounds";
  if (event.category === "Plague Events") return event.title.split("·")[0]?.trim() ?? event.title;
  const base = event.title.split("·")[0]?.trim() ?? event.title;
  return base.length > 20 ? `${base.slice(0, 18)}…` : base;
}

function timeRange(event: CalendarEvent, clock: ClockFormats) {
  if (!event.end) return `${clock.formatTime(event.start)} ${clock.zone}`;
  if (clock.dateKey(event.start) !== clock.dateKey(event.end)) {
    return `${clock.formatDateShort(event.start)} – ${clock.formatDateShort(event.end)}`;
  }
  return `${clock.formatTime(event.start)} – ${clock.formatTime(event.end)} ${clock.zone}`;
}

export function CalendarExplorer({
  events,
  initialDate,
}: {
  events: CalendarEvent[];
  initialDate: string;
}) {
  const clock = useClock();
  const offset = clock.offset;
  const [cursor, setCursor] = useState(() => new Date(`${initialDate}T12:00:00Z`));
  const [selectedKey, setSelectedKey] = useState(initialDate);
  const [view, setView] = useState<View>("month");
  const [activeCategories, setActiveCategories] = useState<CalendarCategory[]>([
    ...calendarCategories,
  ]);
  const [query, setQuery] = useState("");
  const [highlightedEvent, setHighlightedEvent] = useState<string | null>(null);

  // Anchor the grid on the live current day, not on the build date. The clock
  // provider refreshes, so the "today" marker and the week view roll over at
  // midnight without a rebuild.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const target = params.get("event");
    if (target) {
      const match = events.find((event) => event.id === target);
      if (match) {
        setCursor(new Date(`${eventStartKey(match, offset)}T12:00:00Z`));
        setSelectedKey(eventStartKey(match, offset));
        setHighlightedEvent(match.id);
        window.setTimeout(() => {
          document
            .getElementById(`calendar-detail-${match.id}`)
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 250);
        return;
      }
    }
    const today = zoneDateKey(Date.now(), offset);
    setCursor(new Date(`${today}T12:00:00Z`));
    setSelectedKey(today);
  }, [events, offset]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return events.filter((event) => {
      if (!activeCategories.includes(event.category)) return false;
      if (!needle) return true;
      return `${event.title} ${event.description} ${event.category} ${event.phase ?? ""}`
        .toLowerCase()
        .includes(needle);
    });
  }, [activeCategories, events, query]);

  const selectedDate = new Date(`${selectedKey}T12:00:00Z`);
  const selectedEvents = filtered.filter((event) => eventOccursOn(event, selectedKey, offset));
  const nowMs = clock.nowMs ?? new Date(`${initialDate}T12:00:00Z`).getTime();
  const upcoming = filtered
    .filter((event) => new Date(event.end ?? event.start).getTime() >= nowMs)
    .slice(0, 4);

  function toggleCategory(category: CalendarCategory) {
    setActiveCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  }

  function move(amount: number) {
    if (view === "month") setCursor((current) => addMonthsUtc(current, amount));
    else if (view === "week") setCursor((current) => addDaysUtc(current, amount * 7));
  }

  function goToday() {
    const today = zoneDateKey(Date.now(), offset);
    setCursor(new Date(`${today}T12:00:00Z`));
    setSelectedKey(today);
  }

  const days = monthGrid(cursor);
  const week = weekDays(cursor);
  const todayKey = clock.nowMs ? clock.dateKey(clock.nowMs) : initialDate;
  const windowLabel =
    view === "week"
      ? `${dayLabel(week[0])} – ${dayLabel(week[6])}`
      : monthLabel(cursor);

  return (
    <div className="space-y-5">
      <div className="rounded-md border border-border/70 bg-card/50 p-3 sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex rounded-sm border border-border/80 bg-background/50 p-0.5">
              {[
                { id: "month" as View, label: "Month", icon: CalendarDays },
                { id: "week" as View, label: "Week", icon: Clock },
                { id: "agenda" as View, label: "Agenda", icon: List },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setView(item.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.1em] transition-colors sm:text-[10px]",
                    view === item.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <item.icon className="size-3" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              ))}
            </div>
            <div className="relative min-w-0 flex-1 sm:w-56">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/60" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter events…"
                aria-label="Filter calendar events"
                className="h-9 w-full rounded-sm border border-border/80 bg-background/50 pl-8 pr-8 text-xs text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-primary/50"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear event filter"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {view !== "agenda" && (
            <div className="flex items-center justify-between gap-2 sm:justify-end">
              <button
                type="button"
                onClick={() => move(-1)}
                className="inline-flex size-8 items-center justify-center rounded-sm border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                aria-label={view === "month" ? "Previous month" : "Previous week"}
              >
                <ChevronLeft className="size-4" />
              </button>
              <p className="min-w-[170px] text-center font-display text-lg uppercase tracking-wide text-foreground">
                {windowLabel}
              </p>
              <button
                type="button"
                onClick={() => move(1)}
                className="inline-flex size-8 items-center justify-center rounded-sm border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                aria-label={view === "month" ? "Next month" : "Next week"}
              >
                <ChevronRight className="size-4" />
              </button>
              <button
                type="button"
                onClick={goToday}
                className="ml-1 rounded-sm border border-border px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                Today
              </button>
            </div>
          )}
        </div>

        <div className="mt-3 flex items-start gap-2 border-t border-border/60 pt-3">
          <Filter className="mt-0.5 size-3 shrink-0 text-muted-foreground/50" />
          <div className="flex flex-1 flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setActiveCategories([...calendarCategories])}
              className={cn(
                "rounded-sm border px-2 py-1 font-mono text-[8px] uppercase tracking-[0.1em] transition-colors sm:text-[9px]",
                activeCategories.length === calendarCategories.length
                  ? "border-primary/40 bg-primary/10 text-emerald-300"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              All
            </button>
            {calendarCategories.map((category) => {
              const active = activeCategories.includes(category);
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleCategory(category)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-sm border px-2 py-1 font-mono text-[8px] uppercase tracking-[0.08em] transition-colors sm:text-[9px]",
                    active
                      ? categoryStyles[category].chip
                      : "border-border/60 text-muted-foreground/50 hover:text-foreground",
                  )}
                >
                  <span className={cn("size-1 rounded-full", categoryStyles[category].dot)} />
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          {view === "month" && (
            <div className="overflow-hidden rounded-md border border-border/70 bg-card/30">
              <div className="grid grid-cols-7 border-b border-border/60 bg-secondary/40">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div
                    key={day}
                    className="px-1.5 py-2 text-center font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/60"
                  >
                    <span className="hidden sm:inline">{day}</span>
                    <span className="sm:hidden">{day.slice(0, 1)}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {days.map((date) => {
                  const key = dateKey(date);
                  const dayEvents = filtered.filter((event) =>
                    eventOccursOn(event, key, offset),
                  );
                  const hasOverlap = dayEvents.some((event) => (event.overlapWith?.length ?? 0) > 0);
                  const isSelected = key === selectedKey;
                  const isToday = key === todayKey;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedKey(key)}
                      className={cn(
                        "relative min-h-[74px] border-b border-r border-border/40 p-1.5 text-left transition-colors last:border-r-0 sm:min-h-[104px] sm:p-2",
                        !isSameMonth(date, cursor) && "bg-background/40 text-muted-foreground/40",
                        isSelected ? "bg-primary/[0.06]" : "hover:bg-secondary/30",
                      )}
                      aria-label={`${clock.formatDayLong(date)}, ${dayEvents.length} events`}
                      aria-pressed={isSelected}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={cn(
                            "flex size-5 items-center justify-center rounded-sm font-mono text-[10px] sm:size-6",
                            isToday
                              ? "bg-primary font-semibold text-primary-foreground"
                              : isSelected
                                ? "text-emerald-200"
                                : "text-foreground/80",
                          )}
                        >
                          {date.getUTCDate()}
                        </span>
                        {hasOverlap && (
                          <Zap
                            className="size-2.5 text-primary/70 sm:size-3"
                            aria-label="Overlap window"
                          />
                        )}
                      </div>
                      <div className="mt-1 space-y-0.5">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={cn(
                              "flex items-center gap-1 truncate rounded-sm px-1 py-0.5 text-[8px] leading-tight sm:text-[9px]",
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
                            <span className="hidden truncate sm:inline">{shortEventLabel(event)}</span>
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <p className="px-1 font-mono text-[8px] text-muted-foreground/60">
                            +{dayEvents.length - 2} more
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/50 px-3 py-2">
                <p className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground/50">
                  <Zap className="size-2.5 text-primary/60" /> Overlap indicator · tap a day for detail
                </p>
                <p className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground/40">
                  All times {clock.zone}
                </p>
              </div>
            </div>
          )}

          {view === "week" && (
            <div className="overflow-x-auto rounded-md border border-border/70 bg-card/30">
              <div className="grid min-w-[760px] grid-cols-7">
                {week.map((date) => {
                  const key = dateKey(date);
                  const dayEvents = filtered.filter((event) =>
                    eventOccursOn(event, key, offset),
                  );
                  return (
                    <div key={key} className="min-h-[420px] border-r border-border/40 last:border-r-0">
                      <button
                        type="button"
                        onClick={() => setSelectedKey(key)}
                        className={cn(
                          "flex w-full items-center justify-between border-b border-border/40 px-2 py-2.5 text-left",
                          key === selectedKey && "bg-primary/[0.06]",
                        )}
                      >
                        <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground/70">
                          {dayLabel(date)}
                        </span>
                        {key === todayKey && <span className="size-1.5 rounded-full bg-primary" />}
                      </button>
                      <div className="space-y-1 p-1.5">
                        {dayEvents.map((event) => (
                          <button
                            key={event.id}
                            type="button"
                            onClick={() => {
                              setSelectedKey(key);
                              setHighlightedEvent(event.id);
                            }}
                            className={cn(
                              "w-full rounded-sm border-l-2 px-1.5 py-1.5 text-left transition-colors hover:brightness-125",
                              categoryStyles[event.category].bg,
                              categoryStyles[event.category].border,
                            )}
                          >
                            <p className="font-mono text-[8px] uppercase tracking-[0.08em] text-muted-foreground/60">
                              {clock.formatTime(event.start)} {clock.zone}
                            </p>
                            <p className="mt-0.5 text-[9px] font-medium leading-tight text-foreground">
                              {event.title}
                            </p>
                          </button>
                        ))}
                        {!dayEvents.length && (
                          <p className="px-1 py-4 font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground/30">
                            No windows
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {view === "agenda" && (
            <div className="space-y-2">
              {filtered
                .filter((event) => new Date(event.end ?? event.start).getTime() >= nowMs)
                .slice(0, 24)
                .map((event) => {
                  const start = new Date(event.start);
                  const style = categoryStyles[event.category];
                  return (
                    <div
                      key={event.id}
                      id={`calendar-detail-${event.id}`}
                      className={cn(
                        "grid gap-3 rounded-md border border-border/70 bg-card/40 p-3.5 sm:grid-cols-[64px_1fr_auto] sm:items-center",
                        highlightedEvent === event.id && "border-primary/60 bg-primary/[0.05]",
                      )}
                    >
                      <div className="flex items-center gap-2 sm:flex-col sm:gap-0">
                        <span className="font-display text-2xl leading-none text-foreground">
                          {start.getUTCDate().toString().padStart(2, "0")}
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                          {formatZoneMonthShort(start, offset)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className={style.chip}>{event.category}</Badge>
                          <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground/50">
                            {timeRange(event, clock)}
                          </span>
                        </div>
                        <p className="mt-1 text-xs font-medium text-foreground">{event.title}</p>
                        <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                          {event.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                        {new Date(event.end ?? event.start).getTime() >= nowMs ? (
                          <Countdown target={event.start} end={event.end} compact />
                        ) : null}
                        {event.href && (
                          <Link
                            href={event.href}
                            className="inline-flex items-center gap-1 text-[10px] font-medium text-primary hover:text-emerald-300"
                          >
                            Brief <ArrowRight className="size-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              {!filtered.length && (
                <div className="rounded-md border border-border/70 bg-card/40 p-8 text-center">
                  <p className="text-sm text-muted-foreground">No events match the current filters.</p>
                </div>
              )}
            </div>
          )}

          {view !== "agenda" && (
            <div className="mt-5 rounded-md border border-border/70 bg-card/40">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 px-4 py-3">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
                    Selected day
                  </p>
                  <p className="mt-0.5 font-display text-xl uppercase tracking-wide text-foreground">
                    {clock.formatDayLong(selectedDate)}
                  </p>
                </div>
                <Badge variant="secondary">
                  {selectedEvents.length} window{selectedEvents.length === 1 ? "" : "s"}
                </Badge>
              </div>
              <div className="divide-y divide-border/40">
                {selectedEvents.length ? (
                  selectedEvents.map((event) => {
                    const style = categoryStyles[event.category];
                    return (
                      <div
                        key={event.id}
                        id={`calendar-detail-${event.id}`}
                        className={cn(
                          "p-4 transition-colors",
                          highlightedEvent === event.id && "bg-primary/[0.04]",
                        )}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className={style.chip}>{event.category}</Badge>
                          <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground/60">
                            {timeRange(event, clock)}
                          </span>
                          {(event.overlapWith?.length ?? 0) > 0 && (
                            <Badge variant="outline">
                              <Zap className="size-2.5" /> Overlap
                            </Badge>
                          )}
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-medium text-foreground">{event.title}</p>
                          {new Date(event.end ?? event.start).getTime() >= nowMs && (
                            <Countdown target={event.start} end={event.end} compact />
                          )}
                        </div>
                        <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
                          {event.description}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 font-mono text-[9px] uppercase tracking-[0.08em] text-muted-foreground/45">
                          <span>Source: {event.source}</span>
                          {event.phase && <span>· {event.phase}</span>}
                        </div>
                        {event.href && (
                          <Link
                            href={event.href}
                            className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium text-primary hover:text-emerald-300"
                          >
                            Open briefing <ArrowRight className="size-3" />
                          </Link>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="px-4 py-8 text-center">
                    <Info className="mx-auto size-5 text-muted-foreground/40" />
                    <p className="mt-2 text-xs text-muted-foreground">
                      No planning windows on this day. Check the live event tab before assuming the day is
                      clear.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-md border border-border/70 bg-card/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
                Next windows
              </p>
              <Clock className="size-3.5 text-muted-foreground/50" />
            </div>
            <div className="space-y-3">
              {upcoming.map((event) => (
                <div key={event.id} className="border-b border-border/40 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "size-1.5 shrink-0 rounded-full",
                        categoryStyles[event.category].dot,
                      )}
                    />
                    <p className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">
                      {event.title}
                    </p>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-2 pl-3">
                    <span className="font-mono text-[8px] uppercase tracking-[0.08em] text-muted-foreground/50">
                      {clock.formatDateShort(event.start)} · {clock.formatTime(event.start)}{" "}
                      {clock.zone}
                    </span>
                    <Countdown target={event.start} end={event.end} compact />
                  </div>
                </div>
              ))}
              {!upcoming.length && (
                <p className="py-3 text-xs text-muted-foreground">
                  No upcoming events match the filters.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-md border border-lime-500/20 bg-lime-500/[0.035] p-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-lime-300">
              Schedule confidence
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
              Community-reported pattern, planning template, or verified capture — check the source label on
              every event. The live in-game event tab always wins.
            </p>
          </div>

          <div className="rounded-md border border-border/70 bg-card/40 p-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
              Update the calendar
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
              Leadership can edit event dates, categories and descriptions through the content studio. No code
              knowledge required.
            </p>
            <Link
              href="/admin/cms/"
              prefetch={false}
              className="mt-3 inline-flex items-center gap-1 text-[10px] font-medium text-primary hover:text-emerald-300"
            >
              Open studio <ArrowRight className="size-3" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
