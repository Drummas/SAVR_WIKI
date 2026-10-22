"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { GiftCode } from "@/lib/types";

const COPY_ALL = "__all";

/** Clipboard with a fallback for browsers that block the async API. */
async function writeClipboard(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return;
  } catch {
    const area = document.createElement("textarea");
    area.value = value;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    document.body.removeChild(area);
  }
}

export function GiftCodeList({ codes }: { codes: GiftCode[] }) {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return codes;
    return codes.filter((entry) => {
      return (
        entry.code.toLowerCase().includes(needle) ||
        (entry.reward ?? "").toLowerCase().includes(needle)
      );
    });
  }, [codes, query]);

  const allCodes = useMemo(() => codes.map((entry) => entry.code).join("\n"), [codes]);

  async function copy(value: string, marker = value) {
    await writeClipboard(value);
    setCopied(marker);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(null), 1800);
  }

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/60"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter by code…"
            aria-label="Filter gift codes"
            className="h-10 w-full rounded-sm border border-border bg-background/60 pl-9 pr-9 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear filter"
              className="absolute right-2 top-1/2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground/60 transition-colors hover:text-foreground"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => copy(allCodes, COPY_ALL)}
          className={cn(
            "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-sm border px-3 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors",
            copied === COPY_ALL
              ? "border-primary/50 bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary",
          )}
        >
          {copied === COPY_ALL ? <Check className="size-3" /> : <Copy className="size-3" />}
          {copied === COPY_ALL ? "All copied" : "Copy all"}
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/50">
        <span>
          {String(filtered.length).padStart(2, "0")} / {String(codes.length).padStart(2, "0")} codes
        </span>
        <span>Case-sensitive · one at a time</span>
      </div>

      {filtered.length > 0 ? (
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
          {filtered.map((entry) => {
            const isCopied = copied === entry.code;
            return (
              <li key={entry.code}>
                <div className="flex items-center gap-2.5 rounded-sm border border-border/70 bg-background/40 py-2 pl-3 pr-2 transition-colors hover:border-primary/35">
                  <span className="size-1.5 shrink-0 rounded-full bg-success" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="select-all truncate font-mono text-sm tracking-[0.06em] text-foreground">
                      {entry.code}
                    </p>
                    {entry.reward && (
                      <p className="mt-0.5 truncate text-[10px] text-muted-foreground/70">
                        {entry.reward}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => copy(entry.code)}
                    aria-label={`Copy ${entry.code}`}
                    className={cn(
                      "inline-flex h-7 shrink-0 items-center gap-1 rounded-sm border px-2 font-mono text-[9px] uppercase tracking-[0.1em] transition-colors",
                      isCopied
                        ? "border-primary/50 bg-primary/10 text-primary"
                        : "border-border/70 text-muted-foreground/70 hover:border-primary/40 hover:text-primary",
                    )}
                  >
                    {isCopied ? <Check className="size-3" /> : <Copy className="size-3" />}
                    {isCopied ? "Copied" : "Copy"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-3 rounded-sm border border-dashed border-border bg-card/30 p-6 text-center">
          <p className="font-display text-lg uppercase tracking-wide text-foreground">
            No code matches that filter
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Clear the filter to see all {codes.length} active codes.
          </p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mt-3 inline-flex items-center gap-1.5 rounded-sm border border-primary/40 bg-primary/10 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <X className="size-3" /> Clear filter
          </button>
        </div>
      )}

      <span role="status" aria-live="polite" className="sr-only">
        {copied === COPY_ALL
          ? `${codes.length} codes copied to clipboard`
          : copied
            ? `${copied} copied to clipboard`
            : ""}
      </span>
    </div>
  );
}
