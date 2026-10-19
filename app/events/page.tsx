import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, Crosshair, ShieldAlert } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { SectionHeading } from "@/components/section-heading";
import { EventCard } from "@/components/content/cards";
import { CategoryIcon } from "@/components/category-icon";
import { JsonLd } from "@/components/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ZonedTime } from "@/components/time/zoned-time";
import { getCalendarEvents, getEvents } from "@/lib/content";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { nowOnServerClock } from "@/lib/time";
import { formatDateShort } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Event Guides",
  description:
    "Every Last Asylum: Plague event broken into objectives, schedules, rewards, preparation, common mistakes and visual walkthroughs.",
  path: "/events/",
  keywords: ["event guide", "event schedule", "Survival Battle", "Alliance Duel", "plague events"],
});

export default function EventsPage() {
  const events = getEvents();
  // Calendar values are on the in-game clock, which runs five hours behind GMT.
  const now = nowOnServerClock();
  const upcoming = getCalendarEvents()
    .filter((event) => new Date(event.end ?? event.start).getTime() >= now)
    .slice(0, 5);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Events", path: "/events/" },
        ])}
      />
      <PageHeader
        eyebrow={`Event intelligence · ${String(events.length).padStart(2, "0")} files`}
        title="Every event, decoded"
        description="Objectives, scored actions, reward structures and the preparation work that happens before the window opens. Every page carries a verification status — check it before committing stockpiles."
        crumbs={[{ label: "Events" }]}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="success">7 event categories</Badge>
          <Badge variant="secondary">Community-sourced where noted</Badge>
          <Badge variant="outline">Mobile-ready walkthroughs</Badge>
        </div>
      </PageHeader>

      <section className="container-page py-10">
        <div className="mb-8 flex gap-3 rounded-md border border-lime-500/20 bg-lime-500/[0.04] p-4">
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-lime-400" />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-lime-300">
              Verification rule
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Live event screens override this wiki. Schedules and point values change by server, season and
              version. Start every cycle by capturing the current rules — it takes 30 seconds and prevents the
              most expensive mistakes.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {events.map((event, index) => (
            <EventCard key={event.slug} event={event} priority={index < 2} />
          ))}

          <Link
            href="/alliance-vs-alliance/"
            className="group relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-md border border-primary/30 bg-gradient-to-br from-primary/[0.12] via-card/60 to-card/40 p-5 transition-colors hover:border-primary/60"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full border border-primary/20" />
            <div className="pointer-events-none absolute -right-4 top-4 size-24 rounded-full border border-primary/10" />
            <div>
              <Badge>
                <Crosshair className="size-3" /> Command centre
              </Badge>
              <h2 className="mt-4 font-display text-2xl uppercase leading-tight tracking-wide text-foreground">
                Alliance vs Alliance
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Scoring categories, five-phase timeline, overlap diagrams, daily action plans and the full
                optimisation playbook.
              </p>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
              Open command centre <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </section>

      <section className="border-y border-border/60 bg-[#09110c]">
        <div className="container-page py-10">
          <SectionHeading
            eyebrow="Next windows"
            title="Upcoming operations"
            description="Planning snapshot from the alliance calendar, shown on the server clock or your own offset. Confirm the live event screen before acting."
            href="/calendar/"
            linkLabel="Full calendar"
          />
          <div className="grid gap-3 lg:grid-cols-2">
            {upcoming.map((event) => (
              <Link
                key={event.id}
                href={event.href ?? "/calendar/"}
                className="group flex items-center gap-4 rounded-md border border-border/70 bg-card/40 p-4 transition-colors hover:border-primary/40"
              >
                <div className="flex size-11 shrink-0 flex-col items-center justify-center rounded-sm border border-border bg-background/60">
                  <span className="font-display text-lg leading-none text-foreground">
                    {new Date(event.start).getUTCDate().toString().padStart(2, "0")}
                  </span>
                  <span className="mt-0.5 font-mono text-[8px] uppercase text-muted-foreground">
                    {new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" }).format(
                      new Date(event.start),
                    )}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground group-hover:text-emerald-100">
                    {event.title}
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground/60">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-2.5" /> <ZonedTime value={event.start} />
                    </span>
                    <span className="text-primary/50">·</span>
                    <span>{event.category}</span>
                  </p>
                </div>
                <span className="hidden shrink-0 items-center gap-1 font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground/50 sm:flex">
                  <CategoryIcon category={event.category} className="size-3" />
                  {formatDateShort(event.start)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-md border border-border/70 bg-card/40 p-5">
            <p className="eyebrow mb-2">New members</p>
            <h2 className="font-display text-2xl uppercase tracking-wide text-foreground">
              Start with the basics
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Read the Beginner Guide and the Resource Management briefing before your first event week. The
              fastest account growth comes from queue uptime and one clear squad direction.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/guides/beginner-guide/">
                Beginner guide <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="rounded-md border border-border/70 bg-card/40 p-5">
            <p className="eyebrow mb-2">Event clock</p>
            <h2 className="font-display text-2xl uppercase tracking-wide text-foreground">
              Plan the week in one place
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              The calendar shows monthly and weekly views, countdown timers, category filters and overlap
              indicators. Use it to find the windows that stack two scoreboards.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/calendar/">
                <CalendarDays className="size-4" /> Event calendar
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
