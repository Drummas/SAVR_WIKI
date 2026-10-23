"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CalendarDays, Gift, Home, Images, Radar, Search } from "lucide-react";

import { cn } from "@/lib/utils";

const advancedItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Events", href: "/events/", icon: Radar },
  { label: "Calendar", href: "/calendar/", icon: CalendarDays },
  { label: "Gallery", href: "/gallery/", icon: Images },
  { label: "Search", href: "/search/", icon: Search },
];

const beginnerItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Guides", href: "/guides/", icon: BookOpen },
  { label: "Codes", href: "/tools/gift-codes/", icon: Gift },
  { label: "Calendar", href: "/calendar/", icon: CalendarDays },
  { label: "Search", href: "/search/", icon: Search },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  function renderItems(items: typeof advancedItems) {
    return items.map((item) => {
      const active =
        item.href === "/" ? pathname === "/" : pathname.startsWith(item.href.replace(/\/$/, ""));
      const Icon = item.icon;
      return (
        <Link
          key={item.label}
          href={item.href}
          className={cn(
            "relative flex flex-1 flex-col items-center justify-center gap-1 text-[9px] font-medium uppercase tracking-wider transition-colors",
            active ? "text-primary" : "text-muted-foreground",
          )}
        >
          {active && (
            <span className="absolute top-0 h-0.5 w-6 rounded-full bg-primary shadow-[0_0_10px] shadow-primary/80" />
          )}
          <Icon className="size-[18px]" />
          {item.label}
        </Link>
      );
    });
  }

  return (
    <>
      <nav
        aria-label="Quick navigation"
        className="experience-advanced-only fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-ink/95 backdrop-blur-xl lg:hidden"
      >
        <div className="mx-auto flex h-16 max-w-md items-stretch justify-around px-1 safe-bottom">
          {renderItems(advancedItems)}
        </div>
      </nav>
      <nav
        aria-label="Beginner quick navigation"
        className="experience-beginner-only fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-ink/95 backdrop-blur-xl lg:hidden"
      >
        <div className="mx-auto flex h-16 max-w-md items-stretch justify-around px-1 safe-bottom">
          {renderItems(beginnerItems)}
        </div>
      </nav>
    </>
  );
}
