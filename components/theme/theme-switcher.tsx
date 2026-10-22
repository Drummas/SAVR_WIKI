"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Palette } from "lucide-react";

import { THEMES, type ThemeId } from "@/lib/themes";
import { cn } from "@/lib/utils";

import { useTheme } from "./theme-provider";

/** Three-square swatch strip used by the trigger, the menu rows and the tiles. */
function Swatches({
  swatches,
  className,
}: {
  swatches: readonly string[];
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex overflow-hidden rounded-[2px] border border-border/70", className)}
      aria-hidden="true"
    >
      {swatches.map((color) => (
        <span key={color} className="size-3.5" style={{ backgroundColor: color }} />
      ))}
    </span>
  );
}

function activeTheme(theme: ThemeId) {
  return THEMES.find((entry) => entry.id === theme) ?? THEMES[0];
}

/**
 * Header theme menu. Kept as a popover rather than a select so each palette
 * can show its actual swatches — the point of the control is to preview a
 * colour direction, not just name one.
 */
export function ThemeMenu({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const active = activeTheme(theme);

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
        aria-label={`Appearance: ${active.label} theme`}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 font-mono uppercase tracking-[0.12em] transition-colors",
          open
            ? "border-primary/50 bg-primary/10 text-primary-soft"
            : "border-border/70 text-muted-foreground/80 hover:border-primary/40 hover:text-primary",
        )}
      >
        <Palette className="size-3" aria-hidden="true" />
        <Swatches swatches={active.swatches} className="hidden xl:inline-flex" />
        <ChevronDown
          className={cn("size-2.5 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          id="theme-menu"
          role="group"
          aria-label="Theme"
          className="hud-corners absolute right-0 top-full z-[60] mt-2 w-[268px] rounded-lg border border-border bg-popover p-2 font-sans text-xs normal-case tracking-normal shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
        >
          <p className="px-2 pb-1.5 pt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
            Appearance
          </p>
          {THEMES.map((entry) => {
            const selected = entry.id === theme;
            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => {
                  setTheme(entry.id);
                  setOpen(false);
                }}
                aria-pressed={selected}
                aria-label={`${entry.label} theme`}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-sm px-2 py-2 text-left transition-colors",
                  selected ? "bg-primary/10" : "hover:bg-secondary",
                )}
              >
                <Swatches swatches={entry.swatches} />
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block text-[11px] font-medium",
                      selected ? "text-primary-soft" : "text-foreground",
                    )}
                  >
                    {entry.label}
                  </span>
                  <span className="mt-0.5 block truncate font-mono text-[8px] uppercase tracking-[0.08em] text-muted-foreground/60">
                    {entry.description}
                  </span>
                </span>
                {selected && <Check className="size-3.5 shrink-0 text-primary" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Inline picker for the mobile drawer, where a popover would not fit. */
export function ThemePicker({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div role="group" aria-label="Theme" className={cn("grid grid-cols-3 gap-2", className)}>
      {THEMES.map((entry) => {
        const selected = entry.id === theme;
        return (
          <button
            key={entry.id}
            type="button"
            onClick={() => setTheme(entry.id)}
            aria-pressed={selected}
            aria-label={`${entry.label} theme`}
            title={entry.description}
            className={cn(
              "flex flex-col gap-1.5 rounded-sm border px-2 py-2 text-left transition-colors",
              selected
                ? "border-primary/50 bg-primary/10 text-primary-soft"
                : "border-border/70 bg-background/40 text-muted-foreground hover:border-primary/30 hover:text-foreground",
            )}
          >
            <span
              className="flex h-2.5 w-full overflow-hidden rounded-[2px] border border-border/60"
              aria-hidden="true"
            >
              {entry.swatches.map((color) => (
                <span key={color} className="flex-1" style={{ backgroundColor: color }} />
              ))}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.12em]">{entry.label}</span>
          </button>
        );
      })}
    </div>
  );
}
