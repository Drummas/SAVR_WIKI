"use client";

import { useState } from "react";
import Image from "next/image";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ExternalLink, Minus, Plus, X } from "lucide-react";

import { cn } from "@/lib/utils";

export interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
  width?: number;
  height?: number;
}

export function ImageLightbox({
  image,
  open,
  onOpenChange,
}: {
  image: LightboxImage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [zoomed, setZoomed] = useState(false);

  if (!image) return null;

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(value) => {
        if (!value) setZoomed(false);
        onOpenChange(value);
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[90] bg-black/95 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed inset-x-2 top-1/2 z-[91] mx-auto max-h-[92vh] w-auto max-w-6xl -translate-y-1/2 overflow-hidden rounded-lg border border-border bg-[#09110c] shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:inset-x-6">
          <DialogPrimitive.Title className="sr-only">{image.alt}</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            {image.caption ?? "Full size image viewer"}
          </DialogPrimitive.Description>

          <div className="flex items-center justify-between gap-3 border-b border-border/70 px-3 py-2.5 sm:px-4">
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-foreground">{image.alt}</p>
              <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/60">
                Image archive · zoom and inspect
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => setZoomed((value) => !value)}
                className="inline-flex size-8 items-center justify-center rounded-sm border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                aria-label={zoomed ? "Zoom out" : "Zoom in"}
              >
                {zoomed ? <Minus className="size-3.5" /> : <Plus className="size-3.5" />}
              </button>
              <a
                href={image.src}
                target="_blank"
                rel="noreferrer"
                className="hidden size-8 items-center justify-center rounded-sm border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary sm:inline-flex"
                aria-label="Open original image in a new tab"
              >
                <ExternalLink className="size-3.5" />
              </a>
              <DialogPrimitive.Close
                className="inline-flex size-8 items-center justify-center rounded-sm border border-border text-muted-foreground transition-colors hover:border-red-500/40 hover:text-red-300"
                aria-label="Close image viewer"
              >
                <X className="size-4" />
              </DialogPrimitive.Close>
            </div>
          </div>

          <div
            className={cn(
              "relative overflow-auto bg-black/40",
              zoomed ? "max-h-[68vh] cursor-zoom-out" : "max-h-[68vh] cursor-zoom-in",
            )}
            onClick={() => setZoomed((value) => !value)}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width ?? 1600}
              height={image.height ?? 900}
              sizes="100vw"
              className={cn(
                "mx-auto h-auto w-full object-contain transition-[max-width] duration-200",
                zoomed ? "max-w-none" : "max-h-[68vh] max-w-full",
              )}
              priority
            />
          </div>

          {(image.caption || image.credit) && (
            <div className="flex flex-col gap-1 border-t border-border/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              {image.caption && (
                <p className="text-xs leading-relaxed text-muted-foreground">{image.caption}</p>
              )}
              {image.credit && (
                <p className="shrink-0 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/50">
                  {image.credit}
                </p>
              )}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
