import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Crosshair, Info, ShieldAlert } from "lucide-react";

import { cn } from "@/lib/utils";

const variants = {
  info: {
    icon: Info,
    label: "Intel",
    className: "border-teal-500/30 bg-teal-500/[0.055] text-teal-300",
    iconClass: "text-teal-400",
  },
  warning: {
    icon: AlertTriangle,
    label: "Warning",
    className: "border-lime-500/35 bg-lime-500/[0.06] text-lime-300",
    iconClass: "text-lime-400",
  },
  danger: {
    icon: ShieldAlert,
    label: "Alert",
    className: "border-red-500/35 bg-red-500/[0.06] text-red-300",
    iconClass: "text-red-400",
  },
  success: {
    icon: CheckCircle2,
    label: "Confirmed",
    className: "border-emerald-500/30 bg-emerald-500/[0.055] text-emerald-300",
    iconClass: "text-emerald-400",
  },
  strategy: {
    icon: Crosshair,
    label: "Strategy",
    className: "border-primary/35 bg-primary/[0.06] text-emerald-300",
    iconClass: "text-primary",
  },
} as const;

export function Callout({
  type = "info",
  title,
  children,
  className,
}: {
  type?: keyof typeof variants;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const variant = variants[type];
  const Icon = variant.icon;
  return (
    <div
      className={cn(
        "relative my-6 overflow-hidden rounded-sm border-l-2 border-y border-r border-y-border/40 border-r-border/40 px-4 py-4 sm:px-5",
        variant.className,
        className,
      )}
    >
      <div className="flex gap-3">
        <Icon className={cn("mt-0.5 size-4 shrink-0", variant.iconClass)} />
        <div className="min-w-0 flex-1">
          <p className="mb-1 font-mono text-[10px] font-medium uppercase tracking-[0.16em]">
            {title ?? variant.label}
          </p>
          <div className="text-sm leading-relaxed text-foreground/80 [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_p]:m-0 [&_p+p]:mt-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
