"use client";

import { Search } from "lucide-react";

import { useSearchDialog } from "@/components/search/search-provider";
import { cn } from "@/lib/utils";

export function SearchTrigger({
  variant = "compact",
  className,
}: {
  variant?: "compact" | "hero" | "icon";
  className?: string;
}) {
  const { openSearch } = useSearchDialog();

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={openSearch}
        aria-label="Search"
        className={cn(
          "inline-flex size-10 items-center justify-center rounded-sm border border-border bg-secondary/60 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary",
          className,
        )}
      >
        <Search className="size-4" />
      </button>
    );
  }

  if (variant === "hero") {
    return (
      <button
        type="button"
        onClick={openSearch}
        className={cn(
          "group flex w-full items-center gap-3 rounded-sm border border-border bg-background/80 px-4 py-3.5 text-left shadow-panel backdrop-blur transition-colors hover:border-primary/50 hover:bg-background sm:max-w-xl",
          className,
        )}
      >
        <Search className="size-4 shrink-0 text-primary" />
        <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground group-hover:text-foreground">
          Search events, strategies, guides, FAQ…
        </span>
        <kbd className="hidden shrink-0 rounded-sm border border-border bg-secondary px-1.5 py-1 font-mono text-[10px] text-muted-foreground sm:block">
          Ctrl K
        </kbd>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openSearch}
      aria-label="Search knowledge base"
      className={cn(
        "group inline-flex h-9 items-center gap-2 rounded-sm border border-border bg-secondary/40 px-2.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground",
        className,
      )}
    >
      <Search className="size-3.5 group-hover:text-primary" />
      <span className="hidden xl:inline">Search</span>
      <kbd className="hidden rounded-sm border border-border/80 bg-background/60 px-1 py-0.5 font-mono text-[9px] xl:inline">
        ⌘K
      </kbd>
    </button>
  );
}
