"use client";

import { Monitor, Server } from "lucide-react";

import { SERVER_OFFSET, zoneLabel, zoneOptions } from "@/lib/time";
import { cn } from "@/lib/utils";

import { useClock } from "./clock-provider";

/**
 * Clock source picker: server time (the in-game clock, UTC-2) or a local
 * offset the player sets by hand, the same way the game asks for a timezone.
 */
export function ClockControls({
  className,
  compact = false,
  showHint = false,
}: {
  className?: string;
  compact?: boolean;
  showHint?: boolean;
}) {
  const { mode, setMode, localOffset, setLocalOffset, useBrowserOffset, zone } = useClock();

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className="flex rounded-sm border border-border/80 bg-background/60 p-0.5"
        role="group"
        aria-label="Clock source"
      >
        {[
          { id: "server" as const, label: "Server", icon: Server },
          { id: "local" as const, label: "My local", icon: Monitor },
        ].map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={mode === option.id}
            onClick={() => setMode(option.id)}
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-sm px-2 py-1.5 font-mono uppercase tracking-[0.08em] transition-colors",
              compact ? "text-[8px]" : "text-[9px]",
              mode === option.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <option.icon className="size-3" />
            {option.label}
          </button>
        ))}
      </div>

      <label className="block">
        <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground/60">
          Local offset
        </span>
        <select
          value={localOffset}
          onChange={(event) => setLocalOffset(Number(event.target.value))}
          className="mt-1 h-8 w-full rounded-sm border border-border/80 bg-background/60 px-2 font-mono text-[10px] text-foreground outline-none focus:border-primary/50"
        >
          {zoneOptions.map((option) => (
            <option key={option.offset} value={option.offset}>
              {option.label}
              {option.hint ? ` · ${option.hint}` : ""}
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={useBrowserOffset}
          className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground/60 underline-offset-2 hover:text-primary hover:underline"
        >
          Detect from device
        </button>
        <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground/40">
          Showing {zone}
        </span>
      </div>

      {showHint && (
        <p className="text-[10px] leading-relaxed text-muted-foreground/70">
          Server time is the in-game clock ({zoneLabel(SERVER_OFFSET)}) — two hours behind UTC. Set your own
          offset and the whole calendar follows it.
        </p>
      )}
    </div>
  );
}
