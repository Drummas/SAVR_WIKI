"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Camera, Expand, ImagePlus, Upload } from "lucide-react";

import { ImageLightbox } from "@/components/lightbox";
import { cn } from "@/lib/utils";

export function Screenshot({
  src,
  alt,
  caption,
  highlights = [],
  code,
  priority = false,
  className,
}: {
  src?: string;
  alt?: string;
  caption?: string;
  highlights?: string[];
  code?: string;
  priority?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const label = alt ?? caption ?? "Alliance screenshot";

  if (!src) {
    return (
      <figure
        className={cn(
          "my-6 overflow-hidden rounded-md border border-dashed border-border bg-card/40",
          className,
        )}
      >
        <div className="relative flex aspect-[16/9] flex-col items-center justify-center gap-3 bg-tactical-grid bg-grid p-6 text-center">
          <span className="absolute left-3 top-3 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground/50">
            {`${code ?? "IMG-SLOT"} // awaiting upload`}
          </span>
          <span className="flex size-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
            <Camera className="size-5" />
          </span>
          <div>
            <p className="font-display text-lg uppercase tracking-wide text-foreground">
              Screenshot required
            </p>
            <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-muted-foreground">
              {caption ?? "Content to be added by Alliance Leadership."}
            </p>
          </div>
          <Link
            href="/admin/cms/"
            prefetch={false}
            className="inline-flex items-center gap-2 rounded-sm border border-primary/40 bg-primary/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-emerald-300 transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <Upload className="size-3" /> Upload via studio
          </Link>
        </div>
        <figcaption className="flex items-center gap-2 border-t border-border/60 px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/60">
          <ImagePlus className="size-3" /> Replace with an in-game capture from your server
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className={cn("my-6 overflow-hidden rounded-md border border-border/80 bg-card/50", className)}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block w-full overflow-hidden bg-black/30 text-left"
        aria-label={`Open ${label} in full size`}
      >
        <Image
          src={src}
          alt={label}
          width={1600}
          height={900}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 820px"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.015]"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70" />
        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-sm border border-white/10 bg-black/55 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-white/70 backdrop-blur">
          <Camera className="size-2.5 text-primary" /> Visual reference
        </span>
        <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-sm border border-white/10 bg-black/60 px-2 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-white/80 backdrop-blur transition-colors group-hover:border-primary/40 group-hover:text-primary">
          <Expand className="size-3" /> Inspect
        </span>
      </button>

      {(caption || highlights.length > 0) && (
        <figcaption className="border-t border-border/60 px-4 py-3.5">
          {caption && (
            <p className="text-xs leading-relaxed text-muted-foreground">{caption}</p>
          )}
          {highlights.length > 0 && (
            <div className="mt-3">
              <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-primary/80">
                Annotations
              </p>
              <ul className="grid gap-1.5 sm:grid-cols-2">
                {highlights.map((highlight, index) => (
                  <li key={highlight} className="flex gap-2 text-[11px] text-muted-foreground">
                    <span className="font-mono text-[9px] text-primary/70">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </figcaption>
      )}

      <ImageLightbox
        image={{ src, alt: label, caption, credit: "Alliance archive · verify against live game data" }}
        open={open}
        onOpenChange={setOpen}
      />
    </figure>
  );
}
