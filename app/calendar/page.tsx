import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, Info, Zap } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { CalendarExplorer } from "@/components/calendar/calendar-explorer";
import { EventClockPanel } from "@/components/time/event-clock-panel";
import { JsonLd } from "@/components/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCalendarEvents } from "@/lib/content";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { nowOnServerClock, serverTodayKey } from "@/lib/time";

export const metadata: Metadata = buildMetadata({
  title: "Event Calendar",
  description:
    "Monthly, weekly and agenda views of Alliance Duel phases, Survival Battle cycles, state events, plague windows and resource events. Filter, countdown and find overlap windows.",
  path: "/calendar/",
  keywords: ["event calendar", "Alliance Duel schedule", "Survival Battle timing", "event overlap"],
});

export default function CalendarPage() {
  const events = getCalendarEvents();
  const upcoming = events
    .filter((event) => new Date(event.end ?? event.start).getTime() >= nowOnServerClock())
    .slice(0, 10);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Calendar", path: "/calendar/" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Last Asylum: Plague alliance event calendar",
            itemListElement: upcoming.map((event, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: event.title,
              url: `https://last-asylum-alliance.vercel.app/calendar/?event=${event.id}`,
            })),
          },
        ]}
      />
      <PageHeader
        eyebrow="Event clock · alliance planning"
        title="See the whole week before you spend"
        description="Monthly, weekly and agenda views of the alliance event cycle. Filter by category, inspect overlaps, and count down to the next scored window."
        crumbs={[{ label: "Calendar" }]}
      >
        <div className="flex flex-wrap gap-2">
          <Badge>
            <CalendarDays className="size-3" /> {events.length} planning entries
          </Badge>
          <Badge variant="secondary">
            <Zap className="size-3" /> Overlap indicators
          </Badge>
          <Badge variant="outline">
            <Clock className="size-3" /> Server time or your own offset
          </Badge>
        </div>
      </PageHeader>

      <section className="container-page py-6">
        <EventClockPanel className="mb-5" />

        <div className="mb-5 flex flex-col gap-3 rounded-md border border-border/70 bg-card/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2.5">
            <Info className="mt-0.5 size-4 shrink-0 text-teal-400" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Calendar entries are stored on the in-game clock and re-labelled live in the timezone you
              choose above. They are planning aids, not official schedules — confirm the live event tab
              before committing resources.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="shrink-0 self-start sm:self-auto">
            {/* Decap is a static page in /public, not an app route: prefetching it would 404. */}
            <Link href="/admin/cms/" prefetch={false}>
              Update calendar <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
        <CalendarExplorer events={events} initialDate={serverTodayKey()} />
      </section>
    </>
  );
}
