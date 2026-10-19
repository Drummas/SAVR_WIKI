"use client";

import { cn } from "@/lib/utils";

import { useClock } from "./clock-provider";

/**
 * Renders an ISO timestamp in the clock the visitor picked. Server-rendered
 * markup is always UTC, so it is safe for static export; the saved preference
 * is applied after hydration.
 */
export function ZonedTime({
  value,
  date = false,
  showZone = true,
  className,
}: {
  value: string | number | Date;
  date?: boolean;
  showZone?: boolean;
  className?: string;
}) {
  const clock = useClock();
  return (
    <span className={cn("tabular-nums", className)}>
      {date ? clock.formatDateShort(value) : clock.formatTime(value)}
      {showZone && <span className="ml-1 text-muted-foreground/60">{clock.zone}</span>}
    </span>
  );
}
