"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ImageIcon, Search, Tag, Upload, X } from "lucide-react";

import { ImageLightbox, type LightboxImage } from "@/components/lightbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "@/lib/types";

const categories = [
  "All",
  "Events",
  "Heroes",
  "Troops",
  "Buildings",
  "Research",
  "Alliance Activities",
  "Strategies",
  "Battle Reports",
] as const;

export function GalleryExplorer({ images }: { images: GalleryImage[] }) {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("All");
  const [query, setQuery] = useState("");
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("image");
    if (!id) return;
    const match = images.find((image) => image.id === id);
    if (match) {
      setActiveCategory("All");
      setActiveImage(match);
    }
  }, [images]);

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const image of images) {
      for (const tag of image.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);
  }, [images]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return images.filter((image) => {
      if (activeCategory !== "All" && image.category !== activeCategory) return false;
      if (!needle) return true;
      return `${image.title} ${image.description} ${image.category} ${image.tags.join(" ")}`
        .toLowerCase()
        .includes(needle);
    });
  }, [activeCategory, images, query]);

  const lightboxImage: LightboxImage | null = activeImage
    ? {
        src: activeImage.src,
        alt: activeImage.title,
        caption: activeImage.description,
        credit: `${activeImage.category} · ${activeImage.credit}`,
        width: activeImage.width,
        height: activeImage.height,
      }
    : null;

  return (
    <div>
      <div className="rounded-md border border-border/70 bg-card/50 p-3 sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/60" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search titles, tags, descriptions…"
              aria-label="Search image library"
              className="h-10 w-full rounded-sm border border-border/80 bg-background/60 pl-9 pr-9 text-xs text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-primary/50"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear image search"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/50">
            {filtered.length} of {images.length} images · tap to inspect
          </p>
        </div>

        <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto border-t border-border/60 pt-3">
          {categories.map((category) => {
            const count =
              category === "All"
                ? images.length
                : images.filter((image) => image.category === category).length;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-sm border px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.08em] transition-colors",
                  activeCategory === category
                    ? "border-primary/40 bg-primary/10 text-emerald-300"
                    : "border-border/60 text-muted-foreground hover:text-foreground",
                )}
              >
                {category}
                <span className="text-muted-foreground/40">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-2.5">
          <span className="inline-flex items-center gap-1 font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground/40">
            <Tag className="size-2.5" /> Tags
          </span>
          {tagCounts.map(([tag, count]) => (
            <button
              key={tag}
              type="button"
              onClick={() => setQuery(tag)}
              className="rounded-sm border border-border/50 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wide text-muted-foreground/60 transition-colors hover:border-primary/30 hover:text-primary"
            >
              {tag} <span className="text-muted-foreground/30">{count}</span>
            </button>
          ))}
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="ml-auto rounded-sm border border-primary/30 bg-primary/10 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wide text-emerald-300"
            >
              Clear filter
            </button>
          )}
        </div>
      </div>

      {filtered.length ? (
        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
          {filtered.map((image) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveImage(image)}
              className="group relative overflow-hidden rounded-md border border-border/70 bg-card/40 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-background">
                <Image
                  src={image.src}
                  alt={image.title}
                  width={image.width}
                  height={image.height}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80" />
                <Badge variant="outline" className="absolute left-2 top-2 border-white/10 bg-black/50 text-white/70 backdrop-blur">
                  {image.category}
                </Badge>
                <span className="absolute bottom-2 right-2 rounded-sm border border-white/10 bg-black/55 px-1.5 py-1 font-mono text-[8px] uppercase tracking-wider text-white/60 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                  Inspect
                </span>
              </div>
              <div className="p-2.5">
                <p className="line-clamp-1 text-[11px] font-medium text-foreground">{image.title}</p>
                <p className="mt-0.5 line-clamp-1 font-mono text-[8px] uppercase tracking-[0.08em] text-muted-foreground/45">
                  {image.tags.slice(0, 3).join(" · ")}
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-md border border-border/70 bg-card/40 p-10 text-center">
          <ImageIcon className="mx-auto size-8 text-muted-foreground/30" />
          <p className="mt-3 text-sm font-medium text-foreground">No images match that filter.</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try a different category, or clear the search and tag filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActiveCategory("All");
            }}
            className="mt-4 rounded-sm border border-primary/40 bg-primary/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-emerald-300"
          >
            Reset filters
          </button>
        </div>
      )}

      <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-md border border-primary/20 bg-primary/[0.035] p-5 sm:flex-row sm:items-center">
        <div className="flex gap-3">
          <Upload className="mt-0.5 size-4 shrink-0 text-primary" />
          <div>
            <p className="font-display text-xl uppercase tracking-wide text-foreground">
              Add field imagery
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Replace the reference placeholders with your own screenshots. Upload via the content studio and
              add a caption, category and tags.
            </p>
          </div>
        </div>
        <Link
          href="/admin/cms/"
          prefetch={false}
          className="inline-flex shrink-0 items-center gap-2 rounded-sm border border-primary/40 bg-primary/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-300 transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          Upload images <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <ImageLightbox
        image={lightboxImage}
        open={Boolean(activeImage)}
        onOpenChange={(open) => {
          if (!open) setActiveImage(null);
        }}
      />
    </div>
  );
}
