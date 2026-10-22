"use client";

import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  Crosshair,
  HelpCircle,
  ImageIcon,
  Radar,
  Swords,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { excerpt, typeLabels } from "@/lib/search";
import { cn } from "@/lib/utils";
import type { ContentType, SearchDoc } from "@/lib/types";

export const searchTypeIcons: Record<ContentType, LucideIcon> = {
  event: Radar,
  guide: BookOpen,
  hero: Swords,
  strategy: Crosshair,
  faq: HelpCircle,
  calendar: CalendarDays,
  image: ImageIcon,
};

function Highlight({ text, query }: { text: string; query: string }) {
  const tokens = query
    .trim()
    .split(/\s+/)
    .filter((token) => token.length > 1)
    .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  if (!tokens.length) return <>{text}</>;

  const parts = text.split(new RegExp(`(${tokens.join("|")})`, "gi"));
  return (
    <>
      {parts.map((part, index) =>
        tokens.some((token) => new RegExp(`^${token}$`, "i").test(part)) ? (
          <mark key={index} className="rounded-sm bg-primary/20 px-0.5 text-primary-soft">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function SearchResultRow({
  doc,
  query,
  onSelect,
  compact = false,
}: {
  doc: SearchDoc;
  query: string;
  onSelect?: () => void;
  compact?: boolean;
}) {
  const Icon = searchTypeIcons[doc.type];
  return (
    <Link
      href={doc.url}
      onClick={onSelect}
      className={cn(
        "group flex gap-3 rounded-sm border border-transparent px-3 py-3 transition-colors hover:border-border hover:bg-secondary/60",
        compact ? "items-start" : "items-start sm:gap-4",
      )}
    >
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-sm border border-border bg-background/60 text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="line-clamp-1 text-sm font-medium text-foreground group-hover:text-primary-soft">
            <Highlight text={doc.title} query={query} />
          </span>
          <Badge variant="outline" className="shrink-0">
            {typeLabels[doc.type]}
          </Badge>
        </span>
        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
          <Highlight text={excerpt(doc.description || doc.content, query, compact ? 120 : 170)} query={query} />
        </span>
        <span className="mt-1.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/60">
          {doc.category}
        </span>
      </span>
    </Link>
  );
}
