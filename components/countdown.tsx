"use client";

import { useEffect, useMemo, useState } from "react";
import { Radio } from "lucide-react";

import { nowOnServerClock } from "@/lib/time";
import { cn } from "@/lib/utils";

function diffParts(target: Date, now: Date) {
  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds, expired: diff === 0 };
}

type WindowState = "upcoming" | "live" | "closed";

function windowState(start: Date, end: Date | null, now: Date): WindowState {
  if (now.getTime() < start.getTime()) return "upcoming";
  if (end && now.getTime() < end.getTime()) return "live";
  return "closed";
}

/**
 * Counts down to a window opening, keeps counting while it is live, and only
 * reports "closed" once the end has actually passed. A window that started
 * earlier today is not closed — it is running, and the clock says so.
 */
export function Countdown({
  target,
  end,
  className,
  compact = false,
}: {
  target: string;
  end?: string;
  className?: string;
  compact?: boolean;
}) {
  const startDate = useMemo(() => new Date(target), [target]);
  const endDate = useMemo(() => (end ? new Date(end) : null), [end]);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Stored timestamps are on the in-game clock (UTC-5); reading the device
    // clock into that same space keeps the countdown honest.
    const tick = () => setNow(new Date(nowOnServerClock()));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (!now) {
    return (
      <div className={cn("flex items-center gap-1.5 font-mono text-xs text-muted-foreground", className)}>
        <span className="animate-pulse-soft">--:--:--</span>
      </div>
    );
  }

  const state = windowState(startDate, endDate, now);
  const targetDate = state === "live" && endDate ? endDate : startDate;
  const { days, hours, minutes, seconds } = diffParts(targetDate, now);

  if (state === "closed") {
    return (
      <span
        className={cn(
          "font-mono uppercase tracking-widest text-muted-foreground",
          compact ? "text-[9px]" : "text-xs",
          className,
        )}
      >
        Window closed
      </span>
    );
  }

  if (compact) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 font-mono text-xs tabular-nums",
          state === "live" ? "text-emerald-300" : "text-emerald-300/90",
          className,
        )}
      >
        {state === "live" && (
          <>
            <Radio className="size-2.5 animate-pulse-soft" aria-hidden="true" />
            <span className="text-[8px] uppercase tracking-[0.1em] text-primary/70">Live</span>
          </>
        )}
        <span>
          {days > 0 && `${days}d `}
          {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
          {String(seconds).padStart(2, "0")}
        </span>
      </span>
    );
  }

  const cells = [
    { value: days, label: "Days" },
    { value: hours, label: "Hrs" },
    { value: minutes, label: "Min" },
    { value: seconds, label: "Sec" },
  ];

  return (
    <div className={cn("space-y-2", className)}>
      <p
        className={cn(
          "font-mono text-[8px] uppercase tracking-[0.12em]",
          state === "live" ? "text-primary" : "text-muted-foreground/50",
        )}
      >
        {state === "live" ? "Window open · closes in" : "Window opens in"}
      </p>
      <div className="flex items-center gap-2">
        {cells.map((cell, index) => (
          <div key={cell.label} className="flex items-center gap-2">
            <div className="min-w-[3rem] rounded-sm border border-border/80 bg-background/70 px-2 py-1.5 text-center sm:min-w-[3.5rem]">
              <div
                className={cn(
                  "font-display text-xl leading-none tabular-nums sm:text-2xl",
                  state === "live" ? "text-emerald-300" : "text-foreground",
                )}
              >
                {String(cell.value).padStart(2, "0")}
              </div>
              <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.15em] text-muted-foreground">
                {cell.label}
              </div>
            </div>
            {index < cells.length - 1 && (
              <span className="font-mono text-xs text-primary/50">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
