import type { ReactNode } from "react";

import { Breadcrumbs, type Crumb } from "@/components/breadcrumbs";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  crumbs,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  crumbs: Crumb[];
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("relative overflow-hidden border-b border-border/60 pt-8 sm:pt-10", className)}>
      <div className="pointer-events-none absolute inset-0 grid-mask opacity-70" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/[0.07] blur-3xl" aria-hidden="true" />
      <div className="container-page relative pb-9 sm:pb-12">
        <Breadcrumbs items={crumbs} className="mb-7" />
        <p className="eyebrow mb-3">
          <span className="inline-block size-1.5 animate-pulse-soft rounded-full bg-primary" />
          {eyebrow}
        </p>
        <h1 className="max-w-4xl font-display text-4xl uppercase leading-[0.95] tracking-wide text-foreground sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground pretty sm:text-[15px]">
            {description}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </header>
  );
}
