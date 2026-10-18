import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function ContentSection({
  id,
  index,
  title,
  description,
  children,
  className,
}: {
  id?: string;
  index?: number | string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-24 border-t border-border/60 pt-8 first:border-t-0 first:pt-0", className)}
    >
      <div className="mb-5 flex items-start gap-3">
        {index !== undefined && (
          <span className="mt-1 font-mono text-[10px] tracking-[0.12em] text-primary/60">
            {String(index).padStart(2, "0")}
          </span>
        )}
        <div>
          <h2 className="font-display text-2xl uppercase tracking-wide text-foreground sm:text-[28px]">
            {title}
          </h2>
          {description && (
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}
