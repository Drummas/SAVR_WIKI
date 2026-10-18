"use client";

import { useEffect, useMemo, useState } from "react";
import { HelpCircle, Search, X } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { FAQItem } from "@/lib/types";

export function FaqExplorer({
  items,
  categories,
}: {
  items: FAQItem[];
  categories: string[];
}) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const match = items.find((item) => item.id === hash);
    if (match) {
      setOpenItems([match.id]);
      window.setTimeout(() => {
        document.getElementById(`faq-item-${match.id}`)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 200);
    }
  }, [items]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      if (category !== "All" && item.category !== category) return false;
      if (!needle) return true;
      return `${item.question} ${item.answer} ${item.tags.join(" ")} ${item.category}`
        .toLowerCase()
        .includes(needle);
    });
  }, [category, items, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, FAQItem[]>();
    for (const item of filtered) {
      const list = map.get(item.category) ?? [];
      list.push(item);
      map.set(item.category, list);
    }
    return [...map.entries()];
  }, [filtered]);

  return (
    <div>
      <div className="rounded-md border border-border/70 bg-card/50 p-3 sm:p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/60" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ask the archive: heroes, AvA, resources, raids…"
            aria-label="Search frequently asked questions"
            className="h-10 w-full rounded-sm border border-border/80 bg-background/60 pl-9 pr-9 text-xs text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-primary/50"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear FAQ search"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto border-t border-border/60 pt-3">
          {["All", ...categories].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={cn(
                "shrink-0 rounded-sm border px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.08em] transition-colors",
                category === item
                  ? "border-primary/40 bg-primary/10 text-emerald-300"
                  : "border-border/60 text-muted-foreground hover:text-foreground",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/50">
        {filtered.length} of {items.length} answers
        {query && ` · matching “${query}”`}
      </p>

      {filtered.length ? (
        <div className="mt-3 space-y-7">
          {grouped.map(([group, groupItems]) => (
            <section key={group} aria-labelledby={`faq-group-${group}`}>
              <div className="mb-2 flex items-center gap-3">
                <h2
                  id={`faq-group-${group}`}
                  className="font-display text-xl uppercase tracking-wide text-foreground"
                >
                  {group}
                </h2>
                <Badge variant="outline">{groupItems.length}</Badge>
                <span className="h-px flex-1 bg-border/60" />
              </div>
              <div className="overflow-hidden rounded-md border border-border/70 bg-card/40 px-4">
                <Accordion
                  type="multiple"
                  value={openItems}
                  onValueChange={setOpenItems}
                  className="divide-y-0"
                >
                  {groupItems.map((item) => (
                    <AccordionItem
                      key={item.id}
                      value={item.id}
                      id={`faq-item-${item.id}`}
                      className="scroll-mt-24"
                    >
                      <AccordionTrigger className="gap-3 text-[13px]">
                        <span className="flex items-start gap-3">
                          <HelpCircle className="mt-0.5 size-3.5 shrink-0 text-primary/60" />
                          <span>{item.question}</span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pl-7">
                        <p className="whitespace-pre-line">{item.answer}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-1.5">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-sm border border-border/60 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wide text-muted-foreground/50"
                            >
                              {tag}
                            </span>
                          ))}
                          <a
                            href={`#${item.id}`}
                            className="ml-auto font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground/40 hover:text-primary"
                          >
                            Link
                          </a>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-md border border-border/70 bg-card/40 p-10 text-center">
          <HelpCircle className="mx-auto size-8 text-muted-foreground/30" />
          <p className="mt-3 text-sm font-medium text-foreground">No answer in the archive yet.</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try a shorter question, or send it to command so leadership can add it.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
            className="mt-4 rounded-sm border border-primary/40 bg-primary/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-emerald-300"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
