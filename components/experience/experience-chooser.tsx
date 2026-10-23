"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowRight, Crosshair, Sprout } from "lucide-react";

import { EXPERIENCES, type ExperienceId } from "@/lib/experience";
import { cn } from "@/lib/utils";

const optionCopy: Record<
  ExperienceId,
  { icon: typeof Sprout; title: string; description: string; chips: string[] }
> = {
  beginner: {
    icon: Sprout,
    title: "Beginner",
    description:
      "Just started Last Asylum: Plague. Starter guides, a first-week checklist and the basics without the event spreadsheets.",
    chips: ["Start-here guides", "Short menus"],
  },
  advanced: {
    icon: Crosshair,
    title: "Advanced",
    description:
      "You know the loop. Full event breakdowns, AvA scoring, strategy briefs, the calendar and planning tools.",
    chips: ["Full archive", "Full menus"],
  },
};

/**
 * First-visit layout picker. It cannot be dismissed without an answer: the
 * choice is one click either way and it is the only thing the site needs to
 * know to serve the right home page. The answer is stored on the device.
 */
export function ExperienceChooser({
  open,
  onChoose,
}: {
  open: boolean;
  onChoose: (experience: ExperienceId) => void;
}) {
  return (
    <DialogPrimitive.Root open={open}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          onEscapeKeyDown={(event) => event.preventDefault()}
          onPointerDownOutside={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
          className="fixed left-1/2 top-1/2 z-[91] max-h-[calc(100dvh-1.5rem)] w-[min(94vw,540px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-border bg-popover shadow-[0_40px_120px_-30px_rgba(0,0,0,0.95)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <div className="hud-corners border-b border-border/60 bg-gradient-to-br from-primary/[0.12] via-card/40 to-transparent px-5 py-5 sm:px-6">
            <p className="eyebrow mb-2">
              <span className="inline-block size-1.5 animate-pulse-soft rounded-full bg-primary" />
              Choose your layout
            </p>
            <DialogPrimitive.Title className="font-display text-3xl uppercase leading-none tracking-wide text-foreground sm:text-4xl">
              How much intel?
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="mt-2.5 max-w-md text-xs leading-relaxed text-muted-foreground">
              Pick where to start. Both layouts read the same field manual — they just surface
              different amounts of it.
            </DialogPrimitive.Description>
          </div>

          <div className="grid gap-2 p-4 sm:p-5">
            {EXPERIENCES.map((entry) => {
              const copy = optionCopy[entry.id];
              const Icon = copy.icon;
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => onChoose(entry.id)}
                  autoFocus={entry.id === "beginner"}
                  className={cn(
                    "group flex w-full items-start gap-3 rounded-md border border-border/80 bg-background/50 p-4 text-left transition-colors",
                    "hover:border-primary/50 hover:bg-primary/[0.06] focus-visible:border-primary/60",
                  )}
                >
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-sm border border-primary/30 bg-primary/10 text-primary">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="font-display text-xl uppercase leading-none tracking-wide text-foreground">
                        {copy.title}
                      </span>
                      <ArrowRight
                        className="size-3.5 text-primary opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="mt-1.5 block text-[11px] leading-relaxed text-muted-foreground">
                      {copy.description}
                    </span>
                    <span className="mt-2.5 flex flex-wrap gap-1.5">
                      {copy.chips.map((chip) => (
                        <span
                          key={chip}
                          className="rounded-sm border border-border/60 bg-secondary/50 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground/70"
                        >
                          {chip}
                        </span>
                      ))}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <p className="border-t border-border/60 px-5 py-3 font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground/50">
            Saved on this device · switch any time from the header
          </p>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
