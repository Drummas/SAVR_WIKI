"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, ChevronDown, Crosshair, Search } from "lucide-react";

import { cn } from "@/lib/utils";

export interface SidebarItem {
  label: string;
  href: string;
  meta?: string;
}

function ItemList({ items, pathname }: { items: SidebarItem[]; pathname: string }) {
  return (
    <nav className="flex flex-col gap-0.5" aria-label="Section navigation">
      {items.map((item) => {
        const base = item.href.replace(/\/$/, "");
        const active =
          pathname === base ||
          pathname === `${base}/` ||
          (base !== "" && pathname.startsWith(`${base}/`));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-start justify-between gap-2 rounded-sm border-l border-transparent py-2 pl-3 pr-2 text-xs transition-colors",
              active
                ? "border-primary bg-primary/[0.06] text-primary-soft"
                : "text-muted-foreground hover:border-border hover:bg-secondary/50 hover:text-foreground",
            )}
          >
            <span className="leading-snug">{item.label}</span>
            {item.meta && (
              <span className="shrink-0 font-mono text-[9px] text-muted-foreground/50">
                {item.meta}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function ContentSidebar({
  title = "Intel index",
  items,
}: {
  title?: string;
  items: SidebarItem[];
}) {
  const pathname = usePathname();

  return (
    <>
      <details className="group mb-6 rounded-sm border border-border/70 bg-card/40 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3">
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
            <Crosshair className="size-3.5" /> {title}
          </span>
          <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
        </summary>
        <div className="border-t border-border/60 px-2 py-2">
          <ItemList items={items} pathname={pathname} />
        </div>
      </details>

      <aside className="hidden lg:block">
        <div className="sticky top-[86px]">
          <div className="hud-corners rounded-md border border-border/70 bg-card/50 p-4">
            <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
              <Crosshair className="size-3.5" /> {title}
            </p>
            <ItemList items={items} pathname={pathname} />
          </div>

          <div className="mt-3 rounded-md border border-border/70 bg-card/40 p-4">
            <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground/60">
              Quick access
            </p>
            <div className="grid gap-1.5">
              <Link
                href="/calendar/"
                className="flex items-center gap-2 rounded-sm border border-border/60 px-2.5 py-2 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                <CalendarDays className="size-3.5" /> Event calendar
              </Link>
              <Link
                href="/search/"
                className="flex items-center gap-2 rounded-sm border border-border/60 px-2.5 py-2 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                <Search className="size-3.5" /> Search archive
              </Link>
            </div>
          </div>

          <div className="mt-3 border-l border-primary/30 px-4 py-2">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground/60">
              Field rule
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              The live event screen always overrides this wiki.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
