import { ArrowDown, Camera } from "lucide-react";

import { Screenshot } from "@/components/content/screenshot";
import type { WalkthroughStep } from "@/lib/types";

export function Walkthrough({ steps }: { steps: WalkthroughStep[] }) {
  if (!steps.length) {
    return (
      <div className="rounded-md border border-dashed border-border bg-card/30 p-6 text-center">
        <Camera className="mx-auto size-6 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">
          Visual walkthrough to be added by Alliance Leadership.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {steps.map((step, index) => (
        <div key={`${step.title}-${index}`} className="relative">
          <div className="mb-4 flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-primary/40 bg-primary/10 font-mono text-[11px] text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground/60">
                Step {index + 1}
              </p>
              <h3 className="mt-0.5 font-display text-xl uppercase tracking-wide text-foreground">
                {step.title}
              </h3>
              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
          <div className="sm:pl-12">
            <Screenshot
              src={step.image}
              alt={step.title}
              caption={step.caption}
              highlights={step.highlights}
              code={`STEP-${String(index + 1).padStart(2, "0")}`}
            />
          </div>
          {index < steps.length - 1 && (
            <div className="mt-6 flex items-center justify-center sm:pl-12" aria-hidden="true">
              <ArrowDown className="size-4 text-primary/40" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
