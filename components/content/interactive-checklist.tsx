"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ListChecks, RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";

export function InteractiveChecklist({
  items,
  storageKey,
  title = "Event checklist",
}: {
  items: string[];
  storageKey: string;
  title?: string;
}) {
  const key = `alliance-ops:checklist:${storageKey}`;
  const [checked, setChecked] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setChecked(parsed.filter((value): value is string => typeof value === "string"));
        }
      }
    } catch {
      // Ignore unavailable or corrupt local storage.
    }
    setReady(true);
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(checked));
    } catch {
      // Storage may be unavailable in private mode; checklist still works in memory.
    }
  }, [checked, ready, key]);

  const progress = useMemo(
    () => (items.length ? Math.round((checked.length / items.length) * 100) : 0),
    [checked.length, items.length],
  );

  function toggle(item: string) {
    setChecked((current) =>
      current.includes(item) ? current.filter((value) => value !== item) : [...current, item],
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-border/80 bg-card/50">
      <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
        <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
          <ListChecks className="size-3.5" /> {title}
        </p>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
            {checked.length}/{items.length}
          </span>
          <button
            type="button"
            onClick={() => setChecked([])}
            className="rounded-sm p-1 text-muted-foreground/60 transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Reset checklist"
          >
            <RotateCcw className="size-3.5" />
          </button>
        </div>
      </div>
      <div className="h-0.5 bg-secondary">
        <div
          className="h-full bg-primary transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <ul className="divide-y divide-border/40">
        {items.map((item) => {
          const isChecked = checked.includes(item);
          return (
            <li key={item}>
              <button
                type="button"
                onClick={() => toggle(item)}
                aria-pressed={isChecked}
                className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/30"
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-sm border transition-colors",
                    isChecked
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background",
                  )}
                >
                  {isChecked && <Check className="size-3" />}
                </span>
                <span
                  className={cn(
                    "text-xs leading-relaxed transition-colors",
                    isChecked ? "text-muted-foreground/50 line-through" : "text-muted-foreground",
                  )}
                >
                  {item}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="border-t border-border/50 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/40">
        Saved on this device
      </p>
    </div>
  );
}
