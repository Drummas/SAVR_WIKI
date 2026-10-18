"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Search, SearchX, SlidersHorizontal, X } from "lucide-react";

import { SearchResultRow } from "@/components/search/search-results";
import { useSearchIndex } from "@/components/search/use-search-index";
import { searchDocs, typeLabels, typeOrder } from "@/lib/search";
import { cn } from "@/lib/utils";
import type { ContentType } from "@/lib/types";

const quickSearches = [
  "Alliance Duel scoring",
  "overlap window",
  "hero shards",
  "Survival Battle themes",
  "resource reserve",
  "rally timing",
];

export function SearchPageClient() {
  const { index, loading, error } = useSearchIndex();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<ContentType | "all">("all");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get("q");
    if (initialQuery) setQuery(initialQuery);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (query) params.set("q", query);
    else params.delete("q");
    const next = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    window.history.replaceState(null, "", next);
  }, [query]);

  const categories = useMemo(() => {
    if (!index) return [];
    return [...new Set(index.docs.map((doc) => doc.category))].sort();
  }, [index]);

  const typeCounts = useMemo(() => {
    const counts: Partial<Record<ContentType, number>> = {};
    for (const doc of index?.docs ?? []) counts[doc.type] = (counts[doc.type] ?? 0) + 1;
    return counts;
  }, [index]);

  const results = useMemo(
    () =>
      index
        ? searchDocs(index.docs, query, {
            types: type === "all" ? undefined : [type],
            category: category === "all" ? undefined : category,
          })
        : [],
    [category, index, query, type],
  );

  return (
    <div>
      <div className="rounded-md border border-border/70 bg-card/50 p-3 sm:p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-primary" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search events, guides, strategies, FAQ, calendar and images…"
            aria-label="Search the knowledge base"
            autoFocus
            className="h-12 w-full rounded-sm border border-border/80 bg-background/70 pl-10 pr-10 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-primary/50"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-col gap-2 border-t border-border/60 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="no-scrollbar flex gap-1 overflow-x-auto">
            <button
              type="button"
              onClick={() => setType("all")}
              className={cn(
                "shrink-0 rounded-sm border px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.08em] transition-colors",
                type === "all"
                  ? "border-primary/40 bg-primary/10 text-emerald-300"
                  : "border-border/60 text-muted-foreground hover:text-foreground",
              )}
            >
              All {index ? index.count : ""}
            </button>
            {typeOrder.map((contentType) => (
              <button
                key={contentType}
                type="button"
                onClick={() => setType(contentType)}
                className={cn(
                  "shrink-0 rounded-sm border px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.08em] transition-colors",
                  type === contentType
                    ? "border-primary/40 bg-primary/10 text-emerald-300"
                    : "border-border/60 text-muted-foreground hover:text-foreground",
                )}
              >
                {typeLabels[contentType]}{" "}
                <span className="text-muted-foreground/40">{typeCounts[contentType] ?? 0}</span>
              </button>
            ))}
          </div>

          <label className="inline-flex shrink-0 items-center gap-2 rounded-sm border border-border/70 bg-background/40 px-2 py-1.5">
            <SlidersHorizontal className="size-3 text-muted-foreground/60" />
            <span className="sr-only">Filter by category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="max-w-[190px] bg-transparent font-mono text-[9px] uppercase tracking-[0.06em] text-muted-foreground outline-none"
            >
              <option value="all">All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/50">
          Try:
        </span>
        {quickSearches.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setQuery(item)}
            className="rounded-sm border border-border/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.06em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {loading ? (
          <div className="flex items-center justify-center gap-2 rounded-md border border-border/70 bg-card/40 py-16 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin text-primary" /> Loading local index…
          </div>
        ) : error ? (
          <div className="rounded-md border border-red-500/20 bg-red-500/[0.035] p-6 text-center">
            <SearchX className="mx-auto size-7 text-red-300/60" />
            <p className="mt-2 text-sm text-foreground">Search index unavailable.</p>
            <p className="mt-1 text-xs text-muted-foreground">{error}</p>
          </div>
        ) : (
          <>
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/50">
                {results.length} result{results.length === 1 ? "" : "s"}
                {query && ` · “${query}”`}
                {!query && " · browsing latest intelligence"}
              </p>
              {(type !== "all" || category !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setType("all");
                    setCategory("all");
                  }}
                  className="font-mono text-[9px] uppercase tracking-[0.1em] text-primary hover:text-emerald-300"
                >
                  Clear filters
                </button>
              )}
            </div>

            {results.length ? (
              <div className="rounded-md border border-border/70 bg-card/30 p-1.5">
                {results.map(({ doc }) => (
                  <SearchResultRow key={doc.id} doc={doc} query={query} />
                ))}
              </div>
            ) : (
              <div className="rounded-md border border-border/70 bg-card/40 px-5 py-14 text-center">
                <SearchX className="mx-auto size-8 text-muted-foreground/30" />
                <p className="mt-3 text-sm font-medium text-foreground">No matches in the archive.</p>
                <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
                  Try a shorter term, a category name, or a system like “research”. The local index searches
                  full article text, not only titles.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-8 flex flex-col items-start justify-between gap-3 rounded-md border border-border/70 bg-card/40 p-4 sm:flex-row sm:items-center">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Looking for a specific phase or event timing? The calendar includes every scheduled window.
        </p>
        <Link
          href="/calendar/"
          className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-primary hover:text-emerald-300"
        >
          Open calendar <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
