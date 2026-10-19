"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronDown, Menu, Search, X } from "lucide-react";

import siteConfig from "@/data/site.json";
import { BrandMark } from "@/components/brand-mark";
import { CategoryIcon } from "@/components/category-icon";
import { SearchTrigger } from "@/components/search/search-trigger";
import { ClockControls } from "@/components/time/clock-controls";
import { ClockMenu } from "@/components/time/clock-menu";
import { useClock } from "@/components/time/clock-provider";
import { LiveClock } from "@/components/time/live-clock";
import { eventCategories, primaryNav } from "@/lib/navigation";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  const base = href.replace(/\/$/, "");
  return pathname === base || pathname === `${base}/` || pathname.startsWith(`${base}/`);
}

export function SiteHeader({ server }: { server: string }) {
  const pathname = usePathname();
  const clock = useClock();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navItems = primaryNav.filter((item) => item.label !== "Home");

  return (
    <>
      <div className="hidden border-b border-border/50 bg-[#060b08] lg:block">
        <div className="container-page flex h-8 items-center justify-between font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground/70">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-primary/80">
              <span className="size-1 animate-pulse-soft rounded-full bg-primary" />
              {siteConfig.callsign} field manual
            </span>
            <span className="h-3 w-px bg-border" />
            <span>{server}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden xl:inline">Fan-made · verify live event data</span>
            <span className="hidden h-3 w-px bg-border xl:block" />
            <ClockMenu />
            <span className="h-3 w-px bg-border" />
            <Link href="/admin/" className="transition-colors hover:text-primary">
              Admin
            </Link>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="container-page flex h-[62px] items-center justify-between gap-3">
          <Link
            href="/"
            aria-label={`${siteConfig.allianceName} (${siteConfig.callsign}) home`}
            className="shrink-0"
          >
            <BrandMark />
          </Link>

          <nav className="hidden items-center lg:flex" aria-label="Primary navigation">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label} className="group relative">
                  <Link
                    href={item.href}
                    data-active={isActive(pathname, item.href)}
                    className="nav-link uppercase tracking-wide"
                  >
                    {item.label}
                    <ChevronDown className="size-3 transition-transform group-hover:rotate-180" />
                  </Link>
                  <div className="invisible absolute left-0 top-full z-50 w-[520px] translate-y-1 pt-3 opacity-0 transition-all duration-150 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="hud-corners rounded-lg border border-border bg-popover p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]">
                      <div className="grid grid-cols-2 gap-1">
                        {eventCategories.map((category) => {
                          const child = item.children?.find((entry) => entry.label === category);
                          return (
                            <Link
                              key={category}
                              href={child?.href ?? "/events/"}
                              className="group/item flex items-start gap-2.5 rounded-sm px-3 py-2.5 transition-colors hover:bg-secondary"
                            >
                              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-sm border border-border bg-background/60 text-muted-foreground transition-colors group-hover/item:border-primary/40 group-hover/item:text-primary">
                                <CategoryIcon category={category} className="size-3.5" />
                              </span>
                              <span>
                                <span className="block text-xs font-medium text-foreground">
                                  {category}
                                </span>
                                <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground/60">
                                  Event file
                                </span>
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                      <Link
                        href="/events/"
                        className="mt-1 flex items-center justify-between rounded-sm border-t border-border/60 px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-primary transition-colors hover:bg-primary/5"
                      >
                        All event intelligence <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  data-active={isActive(pathname, item.href)}
                  className={cn(
                    "nav-link uppercase tracking-wide",
                    item.label === "Alliance vs Alliance" && "xl:px-2",
                  )}
                >
                  <span className="xl:hidden">
                    {item.label === "Alliance vs Alliance" ? "AvA" : item.label}
                  </span>
                  <span className="hidden xl:inline">{item.label}</span>
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            <SearchTrigger />
            <Link
              href="/calendar/"
              className="hidden h-9 items-center rounded-sm border border-primary/40 bg-primary/10 px-3 font-mono text-[10px] uppercase tracking-[0.12em] text-emerald-300 transition-colors hover:bg-primary hover:text-primary-foreground xl:inline-flex"
            >
              Event clock
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex size-9 items-center justify-center rounded-sm border border-border bg-secondary/40 text-muted-foreground lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-4" />
            </button>
          </div>
        </div>
      </header>

      <DialogPrimitive.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content className="fixed inset-y-0 right-0 z-[71] flex w-[min(92vw,380px)] flex-col border-l border-border bg-[#0a120e] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right">
            <DialogPrimitive.Title className="sr-only">
              {siteConfig.allianceName} navigation
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              Browse events, guides, strategies, AvA, calendar, gallery and FAQ.
            </DialogPrimitive.Description>
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3.5">
              <Link href="/" onClick={() => setMobileOpen(false)}>
                <BrandMark />
              </Link>
              <DialogPrimitive.Close
                className="inline-flex size-9 items-center justify-center rounded-sm border border-border text-muted-foreground"
                aria-label="Close menu"
              >
                <X className="size-4" />
              </DialogPrimitive.Close>
            </div>

            <div className="no-scrollbar flex-1 overflow-y-auto px-4 py-4">
              <div className="mb-5 rounded-sm border border-border bg-background/60 p-3">
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
                  Event clock
                </p>
                <LiveClock size="md" className="mt-1.5" />
                <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground/60">
                  {clock.nowMs
                    ? `${clock.formatWeekday(clock.nowMs)} · ${clock.formatDate(clock.nowMs)}`
                    : "\u00a0"}
                </p>
                <ClockControls className="mt-3" compact />
              </div>

              <Link
                href="/search/"
                onClick={() => setMobileOpen(false)}
                className="mb-5 flex items-center gap-2 rounded-sm border border-border bg-secondary/40 px-3 py-3 text-sm text-muted-foreground"
              >
                <Search className="size-4 text-primary" />
                Search the archive
                <span className="ml-auto font-mono text-[9px] uppercase tracking-widest text-muted-foreground/50">
                  /
                </span>
              </Link>

              <p className="eyebrow-muted mb-2">Navigation</p>
              <nav className="flex flex-col" aria-label="Mobile navigation">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center justify-between border-b border-border/50 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                      isActive(pathname, item.href) && "text-primary",
                    )}
                  >
                    {item.label}
                    <span aria-hidden="true" className="font-mono text-xs text-muted-foreground/50">
                      →
                    </span>
                  </Link>
                ))}
              </nav>

              <p className="eyebrow-muted mb-2 mt-6">Event files</p>
              <div className="grid grid-cols-1 gap-1">
                {primaryNav[1]?.children?.map((child) => (
                  <Link
                    key={child.label}
                    href={child.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 rounded-sm px-2 py-2 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <CategoryIcon category={child.label} className="size-3.5 text-primary/70" />
                    {child.label}
                  </Link>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2">
                <Link
                  href="/admin/"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-sm border border-border px-3 py-2.5 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:border-primary/40 hover:text-primary"
                >
                  Admin
                </Link>
                <Link
                  href="/calendar/"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-sm border border-primary/40 bg-primary/10 px-3 py-2.5 text-center font-mono text-[10px] uppercase tracking-widest text-emerald-300"
                >
                  Event clock
                </Link>
              </div>
            </div>

            <div className="border-t border-border/70 px-4 py-3 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/50">
              {siteConfig.allianceName} · {siteConfig.callsign} · Fan-made
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
