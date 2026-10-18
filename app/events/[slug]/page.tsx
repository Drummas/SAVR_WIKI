import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  Camera,
  CheckCircle2,
  Crosshair,
  ListChecks,
  ShieldAlert,
  Swords,
  Timer,
  Trophy,
} from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { CategoryIcon } from "@/components/category-icon";
import { ContentSection } from "@/components/content/content-section";
import { EventCard } from "@/components/content/cards";
import { InteractiveChecklist } from "@/components/content/interactive-checklist";
import { Screenshot } from "@/components/content/screenshot";
import { Walkthrough } from "@/components/content/walkthrough";
import { ContentSidebar } from "@/components/content-sidebar";
import { JsonLd } from "@/components/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mdxComponents } from "@/components/mdx-components";
import { getEvent, getEvents, getRelatedEvents, getSiteConfig } from "@/lib/content";
import { articleSchema, breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import type { Difficulty } from "@/lib/types";

export function generateStaticParams() {
  return getEvents().map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return {};
  return buildMetadata({
    title: `${event.title} — Event Guide`,
    description: event.summary,
    path: `/events/${event.slug}/`,
    image: event.heroImage ?? "/og.png",
    type: "article",
    keywords: [event.category, ...event.tags, event.difficulty],
  });
}

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <Badge variant={difficulty === "Beginner" ? "success" : difficulty === "Advanced" ? "destructive" : "default"}>
      {difficulty}
    </Badge>
  );
}

function StatusNote({ status }: { status: "verified" | "community" | "template" }) {
  if (status === "verified") {
    return (
      <div className="flex items-start gap-2 rounded-sm border border-emerald-500/25 bg-emerald-500/[0.045] px-3 py-2.5 text-xs text-emerald-200">
        <CheckCircle2 className="mt-0.5 size-3.5 shrink-0" />
        Verified against in-game evidence by Alliance Leadership. Still re-check before each cycle.
      </div>
    );
  }
  if (status === "template") {
    return (
      <div className="flex items-start gap-2 rounded-sm border border-lime-500/25 bg-lime-500/[0.045] px-3 py-2.5 text-xs text-lime-200">
        <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
        Template / unverified. Replace the placeholders with live event data before spending resources.
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2 rounded-sm border border-teal-500/25 bg-teal-500/[0.045] px-3 py-2.5 text-xs text-teal-200">
      <ShieldAlert className="mt-0.5 size-3.5 shrink-0" />
      Community-sourced structure. Timings, point values and rewards are version-sensitive — verify in-game.
    </div>
  );
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

  const related = getRelatedEvents(event, 3);
  const site = getSiteConfig();
  const sidebarItems = getEvents().map((item) => ({
    label: item.title,
    href: `/events/${item.slug}/`,
    meta: item.difficulty === "Advanced" ? "ADV" : item.difficulty === "Beginner" ? "BGN" : "INT",
  }));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Events", path: "/events/" },
            { name: event.title, path: `/events/${event.slug}/` },
          ]),
          articleSchema({
            title: event.title,
            description: event.summary,
            path: `/events/${event.slug}/`,
            updated: event.updated,
            category: event.category,
          }),
        ]}
      />

      <header className="relative overflow-hidden border-b border-border/60 pt-7">
        <div className="pointer-events-none absolute inset-0 grid-mask opacity-60" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-20 -top-24 size-80 rounded-full bg-primary/[0.08] blur-3xl" aria-hidden="true" />
        <div className="container-page relative pb-9">
          <Breadcrumbs
            items={[
              { label: "Events", href: "/events/" },
              { label: event.title },
            ]}
            className="mb-6"
          />
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge>
                  <CategoryIcon category={event.category} className="size-3" />
                  {event.category}
                </Badge>
                <DifficultyBadge difficulty={event.difficulty} />
                <Badge variant="secondary">{event.cadence}</Badge>
              </div>
              <h1 className="max-w-3xl font-display text-4xl uppercase leading-[0.94] tracking-wide text-foreground sm:text-5xl lg:text-6xl">
                {event.title}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground pretty sm:text-[15px]">
                {event.summary}
              </p>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/70">
                <span className="inline-flex items-center gap-1.5">
                  <Timer className="size-3 text-primary/70" /> {event.duration}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarClock className="size-3 text-primary/70" /> Updated {formatDate(event.updated)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Swords className="size-3 text-primary/70" /> {site.allianceName}
                </span>
              </div>
            </div>
            <Screenshot
              src={event.heroImage}
              alt={`${event.title} reference board`}
              caption={`${event.title} visual reference. Replace with a current capture from your server.`}
              code="EVENT-HERO"
              priority
              className="my-0"
            />
          </div>
          <div className="mt-6">
            <StatusNote status={event.status} />
          </div>
        </div>
      </header>

      <div className="container-page py-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] xl:gap-12">
          <ContentSidebar title="Event files" items={sidebarItems} />

          <article className="min-w-0">
            <ContentSection
              index={1}
              title="Overview & objective"
              description="What this event is actually asking your account to do."
            >
              <div className="rounded-md border border-border/70 bg-card/50 p-4 sm:p-5">
                <p className="eyebrow-muted mb-2">Mission objective</p>
                <p className="text-sm leading-relaxed text-foreground/85">{event.objective}</p>
              </div>
              {event.body && (
                <div className="prose-tactical mt-6">
                  <MDXRemote
                    source={event.body}
                    components={mdxComponents()}
                    options={{
                      mdxOptions: {
                        remarkPlugins: [remarkGfm],
                        rehypePlugins: [rehypeSlug],
                      },
                    }}
                  />
                </div>
              )}
            </ContentSection>

            <ContentSection
              index={2}
              title="Participation & schedule"
              description="Requirements, phase timings and the windows that matter."
              className="mt-10"
            >
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-md border border-border/70 bg-card/50 p-4">
                  <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                    <Crosshair className="size-3.5" /> Participation requirements
                  </p>
                  <ul className="space-y-2.5">
                    {event.requirements.map((item) => (
                      <li key={item} className="flex gap-2.5 text-xs leading-relaxed text-muted-foreground">
                        <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary/70" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="overflow-hidden rounded-md border border-border/70 bg-card/50">
                  <p className="border-b border-border/60 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                    Schedule
                  </p>
                  <div className="divide-y divide-border/40">
                    {event.schedule.map((phase) => (
                      <div key={phase.phase} className="px-4 py-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-xs font-medium text-foreground">{phase.phase}</p>
                          <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-emerald-300/80">
                            {phase.timing}
                          </span>
                        </div>
                        {phase.note && (
                          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                            {phase.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ContentSection>

            <ContentSection
              index={3}
              title="Rewards"
              description="What the event pays, and which parts are guaranteed versus ranking-dependent."
              className="mt-10"
            >
              <div className="overflow-hidden rounded-md border border-border/70 bg-card/50">
                <div className="hidden grid-cols-[1.2fr_0.6fr_1.6fr] gap-3 border-b border-border/60 px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/60 sm:grid">
                  <span>Reward</span>
                  <span>Amount</span>
                  <span>Notes</span>
                </div>
                {event.rewards.map((reward) => (
                  <div
                    key={`${reward.reward}-${reward.amount}`}
                    className="grid gap-1 border-b border-border/40 px-4 py-3 last:border-0 sm:grid-cols-[1.2fr_0.6fr_1.6fr] sm:gap-3"
                  >
                    <p className="flex items-center gap-2 text-xs font-medium text-foreground">
                      <Trophy className="size-3 text-primary/60 sm:hidden" />
                      {reward.reward}
                    </p>
                    <p className="pl-5 font-mono text-[10px] uppercase tracking-wide text-emerald-300/80 sm:pl-0">
                      {reward.amount}
                    </p>
                    <p className="pl-5 text-[11px] leading-relaxed text-muted-foreground sm:pl-0">
                      {reward.notes}
                    </p>
                  </div>
                ))}
              </div>
            </ContentSection>

            <ContentSection
              index={4}
              title="Recommended preparation"
              description="The work that happens before the window opens."
              className="mt-10"
            >
              <ol className="space-y-2.5">
                {event.preparation.map((item, index) => (
                  <li
                    key={item}
                    className="flex gap-3 rounded-sm border border-border/50 bg-card/30 px-3.5 py-3 text-xs leading-relaxed text-muted-foreground"
                  >
                    <span className="font-mono text-[10px] text-primary/70">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </ContentSection>

            <ContentSection index={5} title="Best practices & common mistakes" className="mt-10">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-emerald-500/20 bg-emerald-500/[0.025] p-4">
                  <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-300">
                    <CheckCircle2 className="size-3.5" /> Run it this way
                  </p>
                  <ul className="space-y-2.5">
                    {event.bestPractices.map((item) => (
                      <li key={item} className="flex gap-2.5 text-xs leading-relaxed text-muted-foreground">
                        <span className="mt-1.5 size-1 shrink-0 rounded-full bg-emerald-400/70" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-md border border-red-500/20 bg-red-500/[0.025] p-4">
                  <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-red-300">
                    <AlertTriangle className="size-3.5" /> Do not do this
                  </p>
                  <ul className="space-y-2.5">
                    {event.mistakes.map((item) => (
                      <li key={item} className="flex gap-2.5 text-xs leading-relaxed text-muted-foreground">
                        <span className="mt-1.5 size-1 shrink-0 rounded-full bg-red-400/70" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ContentSection>

            <ContentSection
              index={6}
              title="Advanced tips"
              description="Higher-leverage plays once the basics are stable."
              className="mt-10"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {event.advancedTips.map((item, index) => (
                  <div
                    key={item}
                    className="rounded-sm border border-primary/15 bg-primary/[0.025] p-3.5"
                  >
                    <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.14em] text-primary/70">
                      Tip {String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="text-xs leading-relaxed text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </ContentSection>

            <ContentSection
              index={7}
              title="Visual walkthrough"
              description="Tap any reference image to inspect it full size. Replace placeholders with real captures."
              className="mt-10"
            >
              <Walkthrough steps={event.walkthrough} />
            </ContentSection>

            <ContentSection
              index={8}
              title="Event checklist"
              description="Tap to track your own readiness. Progress is stored on this device only."
              className="mt-10"
            >
              <div className="grid gap-4 xl:grid-cols-[1fr_0.85fr]">
                <InteractiveChecklist items={event.checklist} storageKey={event.slug} />
                <div className="rounded-md border border-border/70 bg-card/40 p-4">
                  <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                    <Camera className="size-3.5" /> Required screenshots
                  </p>
                  <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
                    Capture these before and after the event so the next plan is based on evidence. Upload
                    them through the content studio.
                  </p>
                  <ul className="space-y-2">
                    {event.requiredScreenshots.map((item) => (
                      <li key={item} className="flex gap-2 text-[11px] leading-relaxed text-muted-foreground">
                        <ListChecks className="mt-0.5 size-3 shrink-0 text-primary/60" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                    <Link href="/admin/cms/" prefetch={false}>
                      Open content studio <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </ContentSection>

            <ContentSection index={9} title="Player notes & strategy" className="mt-10">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/60">
                    Player notes
                  </p>
                  <div className="space-y-2">
                    {event.playerNotes.map((note) => (
                      <div
                        key={note}
                        className="rounded-sm border-l-2 border-teal-500/40 bg-teal-500/[0.04] px-3 py-2.5 text-xs leading-relaxed text-muted-foreground"
                      >
                        {note}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/60">
                    Strategy recommendations
                  </p>
                  <div className="space-y-2">
                    {event.strategyRecommendations.map((recommendation) => (
                      <div
                        key={recommendation}
                        className="rounded-sm border-l-2 border-primary/40 bg-primary/[0.04] px-3 py-2.5 text-xs leading-relaxed text-muted-foreground"
                      >
                        {recommendation}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ContentSection>

            <ContentSection index={10} title="Related intel" className="mt-10">
              <div className="grid gap-3 sm:grid-cols-3">
                <Link
                  href="/strategies/survival-battle-overlap/"
                  className="group rounded-md border border-border/70 bg-card/40 p-4 transition-colors hover:border-primary/40"
                >
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-primary/70">
                    Strategy
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground group-hover:text-emerald-100">
                    Overlap window plan
                  </p>
                </Link>
                <Link
                  href="/alliance-vs-alliance/"
                  className="group rounded-md border border-border/70 bg-card/40 p-4 transition-colors hover:border-primary/40"
                >
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-primary/70">
                    Command centre
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground group-hover:text-emerald-100">
                    Alliance vs Alliance
                  </p>
                </Link>
                <Link
                  href="/calendar/"
                  className="group rounded-md border border-border/70 bg-card/40 p-4 transition-colors hover:border-primary/40"
                >
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-primary/70">
                    Timing
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground group-hover:text-emerald-100">
                    Event calendar
                  </p>
                </Link>
              </div>

              {related.length > 0 && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {related.map((item) => (
                    <EventCard key={item.slug} event={item} />
                  ))}
                </div>
              )}
            </ContentSection>

            <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-md border border-primary/20 bg-primary/[0.04] p-5 sm:flex-row sm:items-center">
              <div>
                <p className="font-display text-xl uppercase tracking-wide text-foreground">
                  Found a better line?
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Send screenshots and corrections to {site.contactEmail}. Field data beats theory.
                </p>
              </div>
              <Button asChild>
                <a href={`mailto:${site.contactEmail}?subject=${encodeURIComponent(`${event.title} field report`)}`}>
                  Submit intel <ArrowRight className="size-4" />
                </a>
              </Button>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
