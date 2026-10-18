import siteConfig from "@/data/site.json";
import { BrandWordmark } from "@/components/brand-wordmark";
import { cn } from "@/lib/utils";

const heights = {
  sm: "h-7",
  md: "h-9",
  lg: "h-12",
  xl: "h-16",
} as const;

export function BrandMark({
  className,
  compact = false,
  size = "md",
}: {
  className?: string;
  compact?: boolean;
  size?: keyof typeof heights;
}) {
  return (
    <span className={cn("flex min-w-0 flex-col items-start gap-1.5", className)}>
      <BrandWordmark
        className={cn(heights[size], "drop-shadow-[0_0_14px_rgba(74,222,128,0.22)]")}
        sizes={
          size === "xl" ? "(min-width: 640px) 320px, 260px" : "(min-width: 1024px) 150px, 120px"
        }
      />
      {!compact && (
        <span className="whitespace-nowrap font-mono text-[7.5px] uppercase leading-none tracking-[0.22em] text-muted-foreground/70">
          {siteConfig.allianceName} · Last Asylum Ops
        </span>
      )}
    </span>
  );
}

/** Square "S" crest used where the full wordmark would not fit. */
export function BrandCrest({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-emerald-400/25 bg-[#07100b]",
        className,
      )}
    >
      <img
        src="/brand/savr-mark.png"
        alt=""
        aria-hidden="true"
        width={192}
        height={192}
        className="size-full select-none object-contain p-0.5"
      />
    </span>
  );
}
