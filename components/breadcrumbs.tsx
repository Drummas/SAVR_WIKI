import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex flex-wrap items-center gap-1.5", className)}>
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-primary"
      >
        <Home className="size-3" />
        <span className="sr-only sm:not-sr-only">Home</span>
      </Link>
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
          <ChevronRight className="size-3 text-muted-foreground/50" />
          {item.href ? (
            <Link
              href={item.href}
              className="text-[11px] text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[11px] text-foreground/80" aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
