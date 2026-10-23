import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Gift,
  HelpCircle,
  Sprout,
} from "lucide-react";

import { GuideCard } from "@/components/content/cards";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { getGuides } from "@/lib/content";
import type { Guide } from "@/lib/types";

const coreSlugs = [
  "troop-development",
  "resource-management",
  "hero-development",
  "construction-priorities",
];

const nextLinks = [
  {
    title: "Gift codes",
    href: "/tools/gift-codes/",
    icon: Gift,
    note: "Claim the free codes before your first upgrade.",
  },
  {
    title: "Event calendar",
    href: "/calendar/",
    icon: CalendarDays,
    note: "See what is running this week on the server clock.",
  },
  {
    title: "FAQ",
    href: "/faq/",
    icon: HelpCircle,
    note: "Short answers to the questions new members ask.",
  },
];

/**
 * Beginner version of /guides/. The advanced guide index stays in the DOM
 * behind .experience-advanced-only; this one replaces it when the beginner
 * layout is selected.
 */
export function BeginnerGuides() {
  const guides = getGuides();
  const beginner = guides.find((guide) => guide.slug === "beginner-guide");
  const core = coreSlugs
    .map((slug) => guides.find((guide) => guide.slug === slug))
    .filter((guide): guide is Guide => Boolean(guide));

  return (
    <>
      <PageHeader
        eyebrow="Beginner field manual"
        title="Start here"
        description="A short path through the first weeks: keep the account moving, keep the resources flowing and build one squad you can actually finish. No event spreadsheets required."
        crumbs={[{ label: "Guides" }]}
      >
        <div className="flex flex-wrap gap-2">
          <Badge>
            <Sprout className="size-3" /> Beginner path
          </Badge>
          <Badge variant="secondary">
            <BookOpen className="size-3" /> {core.length + (beginner ? 1 : 0)} starter guides
          </Badge>
          <Badge variant="outline">Advanced archive still available</Badge>
        </div>
      </PageHeader>

      <section className="container-page py-9 sm:py-10">
        {beginner && (
          <Link
            href={`/guides/${beginner.slug}/`}
            className="group relative mb-9 block overflow-hidden rounded-lg border border-primary/30 bg-gradient-to-br from-primary/[0.09] via-card/70 to-card/50 p-6 transition-colors hover:border-primary/60 sm:p-8"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full border border-primary/15" />
            <div className="pointer-events-none absolute -right-8 top-8 size-40 rounded-full border border-primary/10" />
            <div className="relative">
              <p className="eyebrow mb-3">
                <span className="inline-block size-1.5 rounded-full bg-primary" />
                Read this first
              </p>
              <h2 className="font-display text-3xl uppercase leading-none tracking-wide text-foreground sm:text-4xl">
                {beginner.title}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {beginner.summary}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="secondary">{beginner.difficulty}</Badge>
                <Badge variant="secondary">{beginner.readingTime}</Badge>
                <Badge variant="outline">{beginner.priorities.length} priorities</Badge>
              </div>
              <span className="mt-5 inline-flex items-center gap-2 rounded-sm border border-primary/40 bg-primary/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                Open the guide <ArrowRight className="size-3.5" />
              </span>
            </div>
          </Link>
        )}

        <div className="mb-6 max-w-2xl">
          <p className="eyebrow mb-2">
            <span className="inline-block size-1.5 rounded-full bg-primary" />
            The core four
          </p>
          <h2 className="font-display text-3xl uppercase leading-none tracking-wide text-foreground sm:text-4xl">
            Troops, resources, heroes, buildings
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Each file explains the decision, the order to make it in and the mistakes that cost
            resources in week one.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {core.map((guide) => (
            <GuideCard key={guide.slug} guide={guide} />
          ))}
        </div>
      </section>

      <section className="border-y border-border/60 bg-well">
        <div className="container-page py-9 sm:py-10">
          <div className="mb-6 max-w-2xl">
            <p className="eyebrow mb-2">
              <CheckCircle2 className="size-3.5" aria-hidden="true" />
              While you learn
            </p>
            <h2 className="font-display text-3xl uppercase leading-none tracking-wide text-foreground sm:text-4xl">
              Three pages worth a bookmark
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {nextLinks.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group flex items-start gap-3 rounded-md border border-border/70 bg-card/40 p-4 transition-colors hover:border-primary/40 hover:bg-card/60"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-border/60 bg-background/50 text-primary/80 transition-colors group-hover:border-primary/40 group-hover:text-primary">
                  <item.icon className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-foreground">{item.title}</span>
                    <ArrowRight
                      className="size-3.5 shrink-0 text-muted-foreground/30 transition-all group-hover:translate-x-0.5 group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-relaxed text-muted-foreground">
                    {item.note}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-9 sm:py-10">
        <div className="rounded-lg border border-border/70 bg-card/30 px-5 py-5 sm:px-6">
          <p className="font-display text-2xl uppercase leading-none tracking-wide text-foreground">
            When the basics are boring
          </p>
          <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted-foreground">
            The advanced layout adds the event breakdowns, AvA command centre, strategy briefs and
            longer-horizon planning guides. Switch whenever you like from the layout toggle in the
            header — both layouts read the same field manual.
          </p>
        </div>
      </section>
    </>
  );
}
