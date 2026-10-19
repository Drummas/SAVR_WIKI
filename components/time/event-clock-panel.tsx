"use client";

import { Clock, Wifi } from "lucide-react";

import { cn } from "@/lib/utils";

import { ClockControls } from "./clock-controls";
import { useClock } from "./clock-provider";
import { LiveClock } from "./live-clock";

/**
 * Full-width clock panel for the calendar page: a live readout plus the
 * server/local switch. Times everywhere below follow this choice.
 */
export function EventClockPanel({ className }: { className?: string }) {
  const { mode, zone, formatDate, formatWeekday, offset, nowMs } = useClock();

  const todayLabel = formatDate(nowMs ?? Date.now());
  const weekday = formatWeekday(nowMs ?? Date.now());

  return (
    <div
      className={cn(
        "grid gap-4 rounded-md border border-border/70 bg-card/50 p-4 sm:grid-cols-[minmax(0,1fr)_240px] sm:items-center",
        className,
      )}
    >
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
            <Clock className="size-3" />
            {mode === "server" ? "Server clock" : "Your local clock"}
          </p>
          <span className="inline-flex items-center gap-1 rounded-sm border border-border/70 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground/60">
            <Wifi className="size-2.5 text-primary/70" />
            {zone} · {offset === 0 ? "in-game clock" : "custom offset"}
          </span>
        </div>
        <div className="mt-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <LiveClock size="lg" showZone />
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground/60">
            {weekday} · {todayLabel}
          </span>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          Synced to the device clock and refreshed every second, so countdowns never drift. Set your own
          offset the way you do in game and the whole calendar re-times to it.
        </p>
      </div>
      <div className="rounded-sm border border-border/60 bg-background/50 p-3">
        <ClockControls compact />
      </div>
    </div>
  );
}
