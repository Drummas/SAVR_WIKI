"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Home, Images, Radar, Search } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { label: "Home", href: "/", icon: Home },
  { label: "Events", href: "/events/", icon: Radar },
  { label: "Calendar", href: "/calendar/", icon: CalendarDays },
  { label: "Gallery", href: "/gallery/", icon: Images },
  { label: "Search", href: "/search/", icon: Search },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Quick navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-[#071009]/95 backdrop-blur-xl lg:hidden"
    >
      <div className="mx-auto flex h-16 max-w-md items-stretch justify-around px-1 safe-bottom">
        {items.map((item) => {
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
                <span className="absolute top-0 h-0.5 w-6 rounded-full bg-primary shadow-[0_0_10px_rgba(52,224,126,0.8)]" />
              )}
              <Icon className="size-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
