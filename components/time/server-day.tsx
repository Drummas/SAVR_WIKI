"use client";

import { useEffect, useState } from "react";

import siteConfig from "@/data/site.json";
import { formatServerDate, msUntilServerMidnight, serverDayNumber } from "@/lib/time";
import { cn } from "@/lib/utils";

/**
 * Server day counter and today's date, both on the in-game clock.
 *
 * The count is derived from `serverLaunch` in `data/site.json`, so it advances
 * at server midnight rather than the visitor's: a timer parked on the next
 * rollover re-renders on the exact tick, with a slow interval as a safety net
 * for devices that were asleep through it. Nothing time-based is rendered on
 * the server, so the static export can never bake in a stale day.
 */
export function ServerDay({
  className,
  prefix = "Day",
  showDate = true,
}: {
  className?: string;
  prefix?: string;
  /** Drop the date where the surrounding card already prints one. */
  showDate?: boolean;
}) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (now === null) return;
    // Land just after the rollover so the new day is already in effect.
    const timer = window.setTimeout(() => setNow(Date.now()), msUntilServerMidnight(now) + 500);
    return () => window.clearTimeout(timer);
  }, [now]);

  const day = now === null ? null : serverDayNumber(siteConfig.serverLaunch, now);
  const date = now === null ? null : formatServerDate(now);

  return (
    <span
      className={cn("inline-flex items-baseline gap-1.5 tabular-nums", className)}
      title={
        day === null
          ? "Server day"
          : `Server day ${day} · rolls over at midnight on the in-game clock`
      }
    >
      <span className="text-primary/80">
        {prefix} {day ?? "---"}
      </span>
      {showDate && (
        <>
          <span aria-hidden="true" className="text-muted-foreground/30">
            ·
          </span>
          <span className="text-muted-foreground/70">{date ?? "—"}</span>
        </>
      )}
    </span>
  );
}
