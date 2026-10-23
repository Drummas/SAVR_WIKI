"use client";

import { Crosshair, Sprout } from "lucide-react";

import { EXPERIENCES, type ExperienceId } from "@/lib/experience";
import { cn } from "@/lib/utils";

import { useExperience } from "./experience-provider";

const icons: Record<ExperienceId, typeof Sprout> = {
  beginner: Sprout,
  advanced: Crosshair,
};

/**
 * Header layout switch. Both segments are always visible so the alternative
 * stays one click away; the label appears once the header has room for it and
 * the icon carries the meaning below that.
 */
export function ExperienceToggle({ className }: { className?: string }) {
  const { experience, setExperience, hintVisible } = useExperience();

  return (
    <div
      data-experience-toggle
      role="group"
      aria-label="Site layout"
      className={cn(
        "inline-flex shrink-0 items-center gap-0.5 rounded-sm border bg-secondary/40 p-0.5 transition-shadow",
        hintVisible
          ? "border-primary/70 shadow-[0_0_0_3px_rgb(var(--primary-rgb)/0.18)]"
          : "border-border",
        className,
      )}
    >
      {EXPERIENCES.map((entry) => {
        const Icon = icons[entry.id];
        const active = entry.id === experience;
        return (
          <button
            key={entry.id}
            type="button"
            onClick={() => setExperience(entry.id)}
            aria-pressed={active}
            aria-label={`${entry.label} layout`}
            title={`${entry.label} layout — ${entry.description}`}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-[2px] px-2 font-mono text-[9px] uppercase tracking-[0.1em] transition-colors",
              active
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground/70 hover:bg-secondary hover:text-foreground",
            )}
          >
            <Icon className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="hidden xl:inline">{entry.label}</span>
          </button>
        );
      })}
    </div>
  );
}
