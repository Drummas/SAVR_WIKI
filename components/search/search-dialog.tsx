"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowRight, Loader2, Search, X } from "lucide-react";

import { SearchResultRow } from "@/components/search/search-results";
import { useSearchIndex } from "@/components/search/use-search-index";
import { searchDocs, typeLabels } from "@/lib/search";
import { cn } from "@/lib/utils";
import type { ContentType } from "@/lib/types";

const filters: { label: string; types?: ContentType[] }[] = [
  { label: "All" },
  { label: "Events", types: ["event", "calendar"] },
  { label: "Guides", types: ["guide"] },
  { label: "Strategies", types: ["strategy"] },
  { label: "FAQ", types: ["faq"] },
  { label: "Images", types: ["image"] },
];

function SearchDialogBody({ onClose }: { onClose: () => void }) {
  const { index, loading, error } = useSearchIndex();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => window.clearTimeout(timer);
  }, []);

  const results = useMemo(
    () =>
      index
        ? searchDocs(index.docs, query, { types: filters[filter].types }).slice(0, 9)
        : [],
    [index, query, filter],
  );

  return (
    <div className="flex max-h-[80vh] flex-col overflow-hidden">
      <div className="flex items-center gap-3 border-b border-border/80 px-4 py-3">
        <Search className="size-4 shrink-0 text-primary" />
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search events, strategies, guides, FAQ…"
          aria-label="Search the knowledge base"
          className="h-9 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="rounded-sm p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        ) : (
          <kbd className="hidden rounded-sm border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:block">
            ESC
          </kbd>
        )}
      </div>

      <div className="no-scrollbar flex items-center gap-1 overflow-x-auto border-b border-border/50 px-3 py-2">
        {filters.map((item, index) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setFilter(index)}
            className={cn(
              "shrink-0 rounded-sm px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors",
              filter === index
                ? "bg-primary/15 text-emerald-300"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="no-scrollbar min-h-[12rem] flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin text-primary" /> Preparing search index…
          </div>
        ) : error ? (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">{error}</p>
        ) : results.length ? (
          <>
            {!query && (
              <p className="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/60">
                Latest intelligence
              </p>
            )}
            {results.map(({ doc }) => (
              <SearchResultRow key={doc.id} doc={doc} query={query} onSelect={onClose} compact />
            ))}
          </>
        ) : (
          <div className="px-4 py-12 text-center">
            <p className="text-sm font-medium text-foreground">No matches in the archive.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try a shorter term, a category name, or search for a system like “research”.
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border/80 bg-background/40 px-4 py-2.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/60">
          {index ? `${index.count} indexed entries` : "Local index"}
        </span>
        <Link
          href={query ? `/search/?q=${encodeURIComponent(query)}` : "/search/"}
          onClick={onClose}
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-emerald-300"
        >
          View all results <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-[8vh] z-[81] w-[calc(100%-1.5rem)] max-w-2xl -translate-x-1/2 rounded-lg border border-border bg-card shadow-[0_30px_120px_-20px_rgba(0,0,0,0.95)] outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:top-[12vh]">
          <DialogPrimitive.Title className="sr-only">Search the knowledge base</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Search events, guides, strategies, FAQ, calendar entries and the image library.
          </DialogPrimitive.Description>
          <div className="hud-corners overflow-hidden rounded-lg">
            <SearchDialogBody onClose={() => onOpenChange(false)} />
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export function SearchTypeLegend() {
  return (
    <div className="flex flex-wrap gap-2">
      {(Object.keys(typeLabels) as ContentType[]).map((type) => (
        <span key={type} className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {typeLabels[type]}
        </span>
      ))}
    </div>
  );
}
