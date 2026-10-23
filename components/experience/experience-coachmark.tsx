"use client";

import { useEffect, useState } from "react";
import { ArrowUp, MousePointerClick } from "lucide-react";

interface HintPosition {
  top: number;
  left: number;
  width: number;
  arrow: number;
}

/**
 * Small callout anchored under the header layout toggle. It appears once the
 * visitor answers the first-visit dialog, then the provider dismisses it after
 * a few seconds. The position is measured from the DOM so the same component
 * works above the mobile header and above the desktop header.
 */
export function ExperienceCoachmark({
  visible,
  onDismiss,
}: {
  visible: boolean;
  onDismiss: () => void;
}) {
  const [position, setPosition] = useState<HintPosition | null>(null);

  useEffect(() => {
    if (!visible) {
      setPosition(null);
      return;
    }

    function measure() {
      const toggles = Array.from(
        document.querySelectorAll<HTMLElement>("[data-experience-toggle]"),
      );
      const target = toggles.find((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const width = Math.min(292, window.innerWidth - 24);
      const centre = rect.left + rect.width / 2;
      const left = Math.min(
        Math.max(centre - width / 2, 12),
        Math.max(12, window.innerWidth - width - 12),
      );
      setPosition({
        top: rect.bottom + 14,
        left,
        width,
        arrow: Math.min(Math.max(centre - left, 22), width - 22),
      });
    }

    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [visible]);

  if (!visible || !position) return null;

  return (
    <div
      className="fixed z-[85]"
      style={{ top: position.top, left: position.left, width: position.width }}
    >
      <div
        className="animate-in fade-in-0 slide-in-from-top-1 duration-200"
        role="status"
        aria-live="polite"
      >
        <div className="relative rounded-md border border-primary/50 bg-popover px-3.5 py-3 shadow-[0_24px_60px_-16px_rgba(0,0,0,0.95)]">
          <span
            className="absolute -top-3 -translate-x-1/2"
            style={{ left: position.arrow }}
            aria-hidden="true"
          >
            <span className="flex size-6 animate-bounce items-center justify-center rounded-full border border-primary/60 bg-primary text-primary-foreground shadow-[0_0_18px_-2px] shadow-primary/70 [animation-duration:1.3s]">
              <ArrowUp className="size-3.5" />
            </span>
          </span>
          <button
            type="button"
            onClick={onDismiss}
            className="flex w-full items-start gap-2 text-left"
            aria-label="Dismiss layout hint"
          >
            <MousePointerClick className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" />
            <span className="pr-1 text-[11px] font-medium leading-relaxed text-foreground">
              You can always toggle to another layout here.
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
