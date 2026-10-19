"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Clock } from "lucide-react";

import { cn } from "@/lib/utils";

import { ClockControls } from "./clock-controls";
import { useClock } from "./clock-provider";
import { LiveClock } from "./live-clock";

/**
 * Header clock chip. Shows live time in the active zone and opens a panel to
 * switch between server time and the player's own offset.
 */
export function ClockMenu({ className }: { className?: string }) {
  const { nowMs, formatDate } = useClock();
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent | TouchEvent) {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={wrapper} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Event clock settings"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 font-mono uppercase tracking-[0.12em] transition-colors",
          open
            ? "border-primary/50 bg-primary/10 text-emerald-200"
            : "border-border/70 text-muted-foreground/80 hover:border-primary/40 hover:text-primary",
        )}
      >
        <Clock className="size-3" />
        <LiveClock className="gap-1" />
        <ChevronDown
          className={cn("size-2.5 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Event clock"
          className="hud-corners absolute right-0 top-full z-[60] mt-2 w-[286px] rounded-lg border border-border bg-popover p-3 font-sans text-xs normal-case tracking-normal shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
        >
          <div className="flex items-center justify-between">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
              Event clock
            </p>
            <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground/60">
              {nowMs ? formatDate(nowMs) : null}
            </span>
          </div>
          <div className="mt-2 rounded-sm border border-border/60 bg-background/60 p-2.5">
            <LiveClock size="md" showZone seconds />
          </div>
          <ClockControls className="mt-3" compact showHint />
          <Link
            href="/calendar/"
            onClick={() => setOpen(false)}
            className="mt-3 inline-flex w-full items-center justify-center gap-1 rounded-sm border border-border/70 px-2 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            Open calendar <ArrowRight className="size-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
