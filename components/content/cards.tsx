import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CalendarClock,
  ChevronRight,
  Crosshair,
  Timer,
} from "lucide-react";

import { CategoryIcon } from "@/components/category-icon";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";
import type { GameEvent, Guide, Strategy } from "@/lib/types";

function difficultyVariant(difficulty: string) {
  if (difficulty === "Beginner") return "success" as const;
  if (difficulty === "Advanced") return "destructive" as const;
  return "default" as const;
}

export function EventCard({
  event,
  priority = false,
  className,
}: {
  event: GameEvent;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={`/events/${event.slug}/`}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-md border border-border/80 bg-card/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-glow",
        className,
      )}
    >
      <div className="relative aspect-[16/8] overflow-hidden bg-background">
        {event.heroImage ? (
          <Image
            src={event.heroImage}
            alt=""
            width={1600}
            height={900}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
            priority={priority}
            className="themed-art h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-tactical-grid bg-grid-sm">
            <CategoryIcon category={event.category} className="size-10 text-primary/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-black/10 to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-1.5">
          <Badge variant="default" className="bg-background/80 backdrop-blur">
            <CategoryIcon category={event.category} className="size-3" />
            {event.category}
          </Badge>
        </div>
        <div className="absolute bottom-3 right-3">
          <Badge variant={difficultyVariant(event.difficulty)} className="bg-background/80 backdrop-blur">
            {event.difficulty}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-xl uppercase leading-tight tracking-wide text-foreground transition-colors group-hover:text-primary-soft">
          {event.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {event.summary}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border/50 pt-3">
          <span className="inline-flex min-w-0 items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground/60">
            <CalendarClock className="size-3 shrink-0" />
            <span className="truncate">{event.cadence}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1 text-[10px] font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
            Open <ArrowUpRight className="size-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function GuideCard({
  guide,
  className,
}: {
  guide: Guide;
  className?: string;
}) {
  return (
    <Link
      href={`/guides/${guide.slug}/`}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-md border border-border/80 bg-card/50 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-card/80",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
        <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/70">
          <BookOpen className="size-3 text-primary/70" />
          {guide.category}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground/50">
          {guide.readingTime}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-xl uppercase leading-tight tracking-wide text-foreground group-hover:text-primary-soft">
          {guide.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{guide.summary}</p>
        <div className="mt-auto flex items-center gap-2 pt-4">
          <Badge variant={difficultyVariant(guide.difficulty)}>{guide.difficulty}</Badge>
          <span className="ml-auto flex size-7 items-center justify-center rounded-sm border border-border/60 text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary">
            <ChevronRight className="size-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function StrategyCard({
  strategy,
  index,
  className,
}: {
  strategy: Strategy;
  index?: number;
  className?: string;
}) {
  return (
    <Link
      href={`/strategies/${strategy.slug}/`}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-md border border-border/80 bg-card/50 p-4 transition-all duration-300 hover:border-primary/50 hover:bg-card/80 sm:p-5",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary/70">
          {typeof index === "number" ? `S-${String(index + 1).padStart(2, "0")}` : "Strategy"}
        </span>
        <Badge variant="outline">{strategy.category}</Badge>
      </div>
      <h3 className="mt-4 font-display text-xl uppercase leading-tight tracking-wide text-foreground group-hover:text-primary-soft">
        {strategy.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
        {strategy.summary}
      </p>
      <div className="mt-auto flex items-center justify-between gap-2 border-t border-border/50 pt-3">
        <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground/60">
          <Timer className="size-3" /> {strategy.readingTime}
        </span>
        <span className="flex items-center gap-1 text-[10px] font-medium text-primary">
          Brief <ArrowUpRight className="size-3" />
        </span>
      </div>
    </Link>
  );
}

export function UpdateRow({
  title,
  category,
  date,
  href,
}: {
  title: string;
  category: string;
  date: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 border-b border-border/50 py-3 last:border-0"
    >
      <span className="size-1.5 shrink-0 rounded-full bg-primary/70" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-medium text-foreground group-hover:text-primary">
          {title}
        </span>
        <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/60">
          {category}
        </span>
      </span>
      <span className="shrink-0 font-mono text-[9px] text-muted-foreground/50">{formatDate(date)}</span>
      <Crosshair className="size-3 shrink-0 text-muted-foreground/30 transition-colors group-hover:text-primary" />
    </Link>
  );
}
