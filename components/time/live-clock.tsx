"use client";

import { useEffect, useState } from "react";

import { formatZoneTimeWithSeconds } from "@/lib/time";
import { cn } from "@/lib/utils";

import { useClock } from "./clock-provider";

/**
 * Ticking readout of the active clock. The timestamp comes from the visitor's
 * device and is re-read every second, so the displayed time never drifts from
 * the server clock the way a build-time value would.
 */
export function LiveClock({
  className,
  showDate = false,
  showZone = true,
  seconds = true,
  size = "sm",
}: {
  className?: string;
  showDate?: boolean;
  showZone?: boolean;
  seconds?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const { offset, zone, formatDate } = useClock();
  const [nowMs, setNowMs] = useState<number | null>(null);

  useEffect(() => {
    setNowMs(Date.now());
    const timer = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const time = nowMs === null ? null : formatZoneTimeWithSeconds(nowMs, offset);
  const display = time ? (seconds ? time : time.slice(0, 5)) : seconds ? "--:--:--" : "--:--";

  return (
    <span className={cn("inline-flex items-baseline gap-1.5", className)}>
      <span
        className={cn(
          "font-mono tabular-nums tracking-tight text-foreground",
          size === "lg" && "text-3xl",
          size === "md" && "text-xl",
          size === "sm" && "text-xs",
        )}
      >
        {display}
      </span>
      {showZone && (
        <span
          className={cn(
            "font-mono uppercase tracking-[0.12em] text-primary/80",
            size === "lg" ? "text-[11px]" : "text-[9px]",
          )}
        >
          {zone}
        </span>
      )}
      {showDate && nowMs !== null && (
        <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground/60">
          {formatDate(nowMs)}
        </span>
      )}
    </span>
  );
}
