import Link from "next/link";
import { ArrowUpRight, Mail, MessageSquare, ShieldCheck } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { footerNav } from "@/lib/navigation";
import { getSiteConfig } from "@/lib/content";

export function SiteFooter() {
  const site = getSiteConfig();
  return (
    <footer className="relative mt-20 border-t border-border/60 bg-ink">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_2fr]">
          <div>
            <Link
              href="/"
              aria-label={`${site.allianceName} (${site.callsign}) home`}
            >
              <BrandMark size="lg" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A mobile-first field manual for {site.allianceName} ({site.callsign}). Events,
              scoring, overlap windows and the boring coordination work that wins alliance weeks.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={site.discordUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-border bg-secondary/40 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                <MessageSquare className="size-3.5" /> Discord
              </a>
              <a
                href={`mailto:${site.contactEmail}`}
                className="inline-flex items-center gap-2 rounded-sm border border-border bg-secondary/40 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                <Mail className="size-3.5" /> Contact command
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerNav.map((group) => (
              <div key={group.heading}>
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/80">
                  {group.heading}
                </p>
                <ul className="space-y-2">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        prefetch={false}
                        className="text-xs text-muted-foreground transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-sm border border-border/60 bg-background/50 p-4">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary/70" />
            <p className="text-[11px] leading-relaxed text-muted-foreground/80">{site.disclaimer}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-border/50 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground/50">
            © {new Date().getFullYear()} {site.allianceName} ({site.callsign}) · Field manual v1.0
          </p>
          <div className="flex items-center gap-4 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/50">
            <Link href="/admin/" className="transition-colors hover:text-primary">
              Content studio
            </Link>
            <span className="text-primary/60">{site.server}</span>
            <Link
              href="https://37games.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 transition-colors hover:text-primary"
            >
              Publisher <ArrowUpRight className="size-2.5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
