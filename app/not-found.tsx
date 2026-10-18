import Link from "next/link";
import { ArrowRight, Radar, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-tactical-grid bg-grid opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
      <div className="container-page relative flex min-h-[65vh] flex-col items-center justify-center py-20 text-center">
        <span className="flex size-14 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
          <Radar className="size-6" />
        </span>
        <p className="eyebrow mt-6">Signal lost · sector 404</p>
        <h1 className="mt-3 max-w-2xl font-display text-5xl uppercase leading-[0.9] tracking-wide text-foreground sm:text-6xl">
          This file is not in the archive
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          The page may have moved, been renamed, or never existed. Re-scan the archive or return to the
          command hub.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          <Button asChild>
            <Link href="/">
              Return home <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/search/">
              <Search className="size-4" /> Search archive
            </Link>
          </Button>
        </div>
        <div className="mt-8 grid w-full max-w-xl grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { label: "Events", href: "/events/" },
            { label: "Guides", href: "/guides/" },
            { label: "AvA", href: "/alliance-vs-alliance/" },
            { label: "Calendar", href: "/calendar/" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-sm border border-border/60 bg-card/40 px-3 py-2.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
