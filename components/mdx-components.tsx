import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, ListChecks } from "lucide-react";

import { Callout } from "@/components/content/callout";
import { Screenshot } from "@/components/content/screenshot";
import { HeroRosterBoard } from "@/components/heroes/hero-roster-board";
import { cn } from "@/lib/utils";

function isInternal(href?: string) {
  return !!href && (href.startsWith("/") || href.startsWith("#"));
}

function MdxLink({ href, children, className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (isInternal(href)) {
    return (
      <Link href={href ?? "#"} className={cn("text-primary", className)}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn("inline-flex items-center gap-1 text-primary", className)}
      {...props}
    >
      {children}
      <ArrowUpRight className="inline size-3" />
    </a>
  );
}

function MdxH2({ id, children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 id={id} className={cn("scroll-mt-24", className)} {...props}>
      {children}
    </h2>
  );
}

function MdxH3({ id, children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 id={id} className={cn("scroll-mt-24", className)} {...props}>
      {children}
    </h3>
  );
}

export function Step({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <li className="step-item relative border-l border-border/80 pb-8 pl-8 last:pb-0">
      <h3 className="mb-2 font-display text-xl uppercase tracking-wide text-foreground">{title}</h3>
      <div className="prose-tactical prose-sm">{children}</div>
    </li>
  );
}

export function Steps({ children }: { children: ReactNode }) {
  return <ol className="step-list my-8">{children}</ol>;
}

export function StaticChecklist({ items, title }: { items: string[]; title?: string }) {
  return (
    <div className="my-6 rounded-sm border border-border/80 bg-card/50 p-4">
      {title && (
        <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
          <ListChecks className="size-3.5" /> {title}
        </p>
      )}
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
            <span className="mt-0.5 size-3.5 shrink-0 rounded-sm border border-border bg-background" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function mdxComponents() {
  return {
    a: MdxLink,
    h2: MdxH2,
    h3: MdxH3,
    Callout,
    Screenshot,
    Steps,
    Step,
    StaticChecklist,
    HeroRoster: HeroRosterBoard,
  };
}
