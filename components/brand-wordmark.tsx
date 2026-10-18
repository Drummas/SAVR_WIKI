import { cn } from "@/lib/utils";
import siteConfig from "@/data/site.json";

/**
 * The Savage Reign wordmark.
 *
 * Generated from the alliance artwork by `npm run assets:brand` — AVIF first
 * (crisp neon edges, ~25–55 KB) with a webp fallback. Height, not width, drives
 * the layout so every placement keeps the original lettering proportions.
 */
export function BrandWordmark({
  className,
  sizes = "(min-width: 1024px) 140px, 110px",
  alt = `${siteConfig.allianceName} (${siteConfig.callsign})`,
}: {
  className?: string;
  sizes?: string;
  alt?: string;
}) {
  return (
    <picture>
      <source
        type="image/avif"
        srcSet="/brand/savr-wordmark-420.avif 420w, /brand/savr-wordmark-840.avif 840w"
        sizes={sizes}
      />
      <img
        src="/brand/savr-wordmark.webp"
        alt={alt}
        width={840}
        height={292}
        decoding="async"
        className={cn("block h-8 w-auto select-none", className)}
      />
    </picture>
  );
}
