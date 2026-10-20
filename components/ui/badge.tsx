import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] transition-colors",
  {
    variants: {
      variant: {
        default: "border-primary/30 bg-primary/10 text-emerald-300",
        secondary: "border-border bg-secondary text-muted-foreground",
        outline: "border-border/80 bg-transparent text-muted-foreground",
        destructive: "border-red-500/30 bg-red-500/10 text-red-300",
        success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
        muted: "border-white/5 bg-white/[0.03] text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * A `<span>`, not a `<div>`: badges sit inside paragraphs all over the site,
 * and a block element in a `<p>` breaks hydration on every page that has one.
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
