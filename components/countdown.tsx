"use client";

import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

function diffParts(target: Date, now: Date) {
  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds, expired: diff === 0 };
}

export function Countdown({
  target,
  className,
  compact = false,
}: {
  target: string;
  className?: string;
  compact?: boolean;
}) {
  const targetDate = useMemo(() => new Date(target), [target]);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (!now) {
    return (
      <div className={cn("flex items-center gap-1.5 font-mono text-xs text-muted-foreground", className)}>
        <span className="animate-pulse-soft">--:--:--</span>
      </div>
    );
  }

  const { days, hours, minutes, seconds, expired } = diffParts(targetDate, now);

  if (expired) {
    return (
      <span className={cn("font-mono text-xs uppercase tracking-widest text-muted-foreground", className)}>
        Window closed
      </span>
    );
  }

  if (compact) {
    return (
      <span className={cn("font-mono text-xs tabular-nums text-emerald-300", className)}>
        {days > 0 && `${days}d `}
        {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
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
    <div className={cn("flex items-center gap-2", className)}>
      {cells.map((cell, index) => (
        <div key={cell.label} className="flex items-center gap-2">
          <div className="min-w-[3rem] rounded-sm border border-border/80 bg-background/70 px-2 py-1.5 text-center sm:min-w-[3.5rem]">
            <div className="font-display text-xl leading-none tabular-nums text-foreground sm:text-2xl">
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
  );
}
