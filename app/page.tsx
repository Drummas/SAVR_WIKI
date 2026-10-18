import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Boxes,
  CalendarDays,
  Camera,
  Crosshair,
  Database,
  FlaskConical,
  Radar,
  Shield,
  Sparkles,
  Swords,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

import { BrandCrest } from "@/components/brand-mark";
import { BrandWordmark } from "@/components/brand-wordmark";
import { SectionHeading } from "@/components/section-heading";
import { EventCard, StrategyCard, UpdateRow } from "@/components/content/cards";
import { NextOps } from "@/components/home/next-ops";
import { SearchTrigger } from "@/components/search/search-trigger";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getCalendarEvents,
  getEvents,
  getGallery,
  getGuides,
  getSiteConfig,
  getStrategies,
} from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

const pageTitle = "Savage Reign (SAVR) — Last Asylum: Plague Alliance Knowledge Base";

const baseMetadata = buildMetadata({
  title: pageTitle,
  description:
    "Events, strategies, optimisation and alliance coordination for Last Asylum: Plague. Survival Battle guides, Alliance vs Alliance scoring, event overlap planning, hero and resource development for Savage Reign (SAVR).",
  path: "/",
  keywords: [
    "Savage Reign",
    "SAVR",
    "alliance knowledge base",
    "Last Asylum events",
    "game wiki",
  ],
});

export const metadata: Metadata = {
  ...baseMetadata,
  title: { absolute: pageTitle },
};

const quickNav = [
  {
    label: "Event Guides",
    href: "/events/",
    icon: Radar,
    note: "7 event files",
  },
  {
    label: "Alliance vs Alliance",
    href: "/alliance-vs-alliance/",
    icon: Swords,
    note: "Command centre",
  },
  {
    label: "Survival Battle",
    href: "/events/survival-battle/",
    icon: Target,
    note: "Round scoring",
  },
  {
    label: "Hero Development",
    href: "/guides/hero-development/",
    icon: Shield,
    note: "Breakpoints",
  },
  {
    label: "Resource Planning",
    href: "/guides/resource-management/",
    icon: Boxes,
    note: "Reserve-first",
  },
  {
    label: "Strategy Hub",
    href: "/strategies/",
    icon: Crosshair,
    note: "6 briefs",
  },
  {
    label: "Event Calendar",
    href: "/calendar/",
    icon: CalendarDays,
    note: "Live windows",
  },
];

const focusModules = [
  {
    title: "Survival Battle",
    href: "/events/survival-battle/",
    image: "/images/gallery/event-survival-battle.webp",
    label: "Event file",
    copy: "Six four-hour rounds. Map the themes, protect the AvA reserve and stop losing scored actions outside their window.",
    icon: Radar,
  },
  {
    title: "Hero Development",
    href: "/guides/hero-development/",
    image: "/images/gallery/hero-breakthrough.webp",
    label: "Field guide",
    copy: "Build a squad, not a collection. Plan the next breakpoint before another banner separates you from your shards.",
    icon: Shield,
  },
  {
    title: "Resource Planning",
    href: "/guides/resource-management/",
    image: "/images/gallery/resource-salvage.webp",
    label: "Field guide",
    copy: "Reserve-first budgeting: keep production running, avoid overflow and never spend the floor before Alliance Duel.",
    icon: Boxes,
  },
];

export default function HomePage() {
  const site = getSiteConfig();
  const events = getEvents();
  const guides = getGuides();
  const strategies = getStrategies();
  const calendar = getCalendarEvents();
  const gallery = getGallery();

  const featuredEvents = events.slice(0, 3);
  const featuredStrategies = strategies.slice(0, 3);
  const updates = [
    ...events.map((event) => ({
      title: event.title,
      category: `Event · ${event.category}`,
      date: event.updated,
      href: `/events/${event.slug}/`,
    })),
    ...guides.map((guide) => ({
      title: guide.title,
      category: `Guide · ${guide.category}`,
      date: guide.updated,
      href: `/guides/${guide.slug}/`,
    })),
    ...strategies.map((strategy) => ({
      title: strategy.title,
      category: `Strategy · ${strategy.category}`,
      date: strategy.updated,
      href: `/strategies/${strategy.slug}/`,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  const avaEvent = events.find((event) => event.slug === "alliance-vs-alliance");
  const survivalGuide = strategies.find((strategy) => strategy.slug === "survival-battle-overlap");
  const initialDate = new Date().toISOString().slice(0, 10);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="pointer-events-none absolute inset-0 bg-tactical-grid bg-grid opacity-70" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-hero-glow" aria-hidden="true" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 scanline opacity-40" aria-hidden="true" />

        <div className="container-page relative pb-10 pt-10 sm:pt-14 lg:pb-14 lg:pt-16">
          <div className="grid gap-9 lg:grid-cols-[1.45fr_0.9fr] lg:items-end">
            <div className="animate-fade-up">
              <div className="mb-5 flex items-center gap-3.5">
                <BrandWordmark
                  className="h-12 w-auto drop-shadow-[0_0_22px_rgba(74,222,128,0.28)] sm:h-14"
                  sizes="(min-width: 640px) 280px, 230px"
                />
                <span className="hidden h-10 w-px bg-border/80 sm:block" aria-hidden="true" />
                <span className="hidden font-mono text-[8px] uppercase leading-[1.7] tracking-[0.2em] text-muted-foreground/60 sm:block">
                  {site.allianceName}
                  <br />
                  Alliance field manual
                </span>
              </div>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <Badge>
                  <span className="size-1.5 animate-pulse-soft rounded-full bg-primary" />
                  Field manual · v1.0
                </Badge>
                <Badge variant="secondary">{site.server}</Badge>
                <Badge variant="outline">Fan-made · verify in-game</Badge>
              </div>
              <h1 className="display-hero max-w-[52rem] text-[2.7rem] text-foreground sm:text-[3.4rem] lg:text-[4.3rem] xl:text-[4.9rem]">
                Last Asylum: Plague
                <span className="mt-1 block text-gradient-toxic">Alliance Knowledge Base</span>
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground pretty sm:text-lg">
                Events, Strategies, Optimisation, and Alliance Coordination
              </p>
              <p className="mt-3 max-w-xl text-xs leading-relaxed text-muted-foreground/80 sm:text-sm">
                The central intelligence hub for {site.allianceName} ({site.callsign}). Stop guessing
                event windows. Start converting one action into two scoreboards.
              </p>

              <div className="mt-6 sm:mt-7">
                <SearchTrigger variant="hero" />
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button asChild size="lg">
                  <Link href="/events/">
                    Open event guides <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/alliance-vs-alliance/">
                    <Swords className="size-4" /> AvA command centre
                  </Link>
                </Button>
              </div>

              <div className="mt-8 grid max-w-xl grid-cols-2 gap-x-6 gap-y-3 border-t border-border/60 pt-5 sm:grid-cols-4">
                {site.stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="font-display text-2xl leading-none text-foreground">{stat.value}</p>
                    <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-muted-foreground/60">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <NextOps events={calendar} initialDate={initialDate} />
              <div className="mt-2 flex items-center justify-between px-1 font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground/40">
                <span className="inline-flex items-center gap-1">
                  <span className="size-1 rounded-full bg-emerald-400" /> Calendar synced
                </span>
                <span>Times UTC · verify live</span>
              </div>
            </div>
          </div>

          <div className="mt-9 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-7">
            {quickNav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group flex items-center gap-2.5 rounded-sm border border-border/60 bg-card/40 px-3 py-2.5 transition-colors hover:border-primary/40 hover:bg-card/70 lg:flex-col lg:items-start lg:gap-2 lg:px-3.5 lg:py-3"
              >
                <item.icon className="size-4 shrink-0 text-primary/70 transition-colors group-hover:text-primary" />
                <span className="min-w-0">
                  <span className="block truncate text-[11px] font-medium text-foreground/90">
                    {item.label}
                  </span>
                  <span className="mt-0.5 hidden font-mono text-[8px] uppercase tracking-[0.08em] text-muted-foreground/50 lg:block">
                    {item.note}
                  </span>
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-3 flex flex-col gap-3 rounded-md border border-primary/25 bg-gradient-to-r from-primary/[0.08] via-card/40 to-transparent px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <BrandCrest className="size-11" />
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted-foreground/60">
                  Alliance dossier
                </p>
                <p className="font-display text-lg uppercase leading-none tracking-wide text-foreground">
                  {site.allianceName}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-x-5 gap-y-2 sm:flex sm:items-center sm:gap-6">
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-muted-foreground/50">
                  Callsign
                </p>
                <p className="mt-0.5 font-mono text-[11px] text-foreground/90">{site.callsign}</p>
              </div>
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-muted-foreground/50">
                  Server
                </p>
                <p className="mt-0.5 font-mono text-[11px] text-foreground/90">{site.server}</p>
              </div>
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-muted-foreground/50">
                  Comms
                </p>
                <a
                  href={site.discordUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-0.5 inline-block font-mono text-[11px] text-primary transition-colors hover:text-emerald-300"
                >
                  Discord →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-11 lg:py-14">
        <SectionHeading
          eyebrow="Featured event intelligence"
          title="Know the window. Own the window."
          description="Every event broken into objective, schedule, rewards, preparation, mistakes, advanced tips and a visual walkthrough."
          href="/events/"
          linkLabel="All events"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredEvents.map((event, index) => (
            <EventCard key={event.slug} event={event} priority={index === 0} />
          ))}
        </div>
      </section>

      <section className="border-y border-border/60 bg-[#08100b]">
        <div className="container-page py-11 lg:py-14">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
            <div className="relative overflow-hidden rounded-lg border border-primary/25 bg-gradient-to-br from-primary/[0.1] via-card/60 to-card/30 p-6 sm:p-8">
              <div className="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full border border-primary/15" />
              <div className="pointer-events-none absolute -right-2 top-10 size-40 rounded-full border border-primary/10" />
              <div className="relative">
                <p className="eyebrow mb-3">
                  <span className="inline-block size-1.5 rounded-full bg-primary" />
                  Flagship command centre
                </p>
                <h2 className="font-display text-3xl uppercase leading-[0.95] tracking-wide text-foreground sm:text-4xl lg:text-5xl">
                  Alliance vs Alliance
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  Six scoring days, five planning phases and one closer reserve. Get the full scoring map,
                  overlap diagrams, upgrade sequencing and daily action plan.
                </p>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  {[
                    { value: "06", label: "Scoring days" },
                    { value: "05", label: "Plan phases" },
                    { value: "10–20%", label: "Closer reserve" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-sm border border-border/60 bg-background/40 p-2.5">
                      <p className="font-display text-xl leading-none text-emerald-200">{stat.value}</p>
                      <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.1em] text-muted-foreground/60">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {["Raven", "Construction", "Tech", "Hero", "Preparation", "Raid"].map((phase, index) => (
                    <span
                      key={phase}
                      className="rounded-sm border border-border/60 bg-background/40 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.08em] text-muted-foreground/70"
                    >
                      <span className="text-primary/60">{String(index + 1).padStart(2, "0")}</span>{" "}
                      {phase}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <Button asChild>
                    <Link href="/alliance-vs-alliance/">
                      Enter command centre <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  {avaEvent && (
                    <Button asChild variant="outline">
                      <Link href={`/events/${avaEvent.slug}/`}>Event brief</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="relative overflow-hidden rounded-lg border border-border/70 bg-card/50">
                <Image
                  src="/images/gallery/event-ava-overlap.webp"
                  alt="Alliance Duel overlap reference board"
                  width={1600}
                  height={900}
                  sizes="(max-width: 1024px) 100vw, 460px"
                  className="h-44 w-full object-cover opacity-90 sm:h-52"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08100b] via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-primary/80">
                    Overlap doctrine
                  </p>
                  <p className="mt-1 font-display text-xl uppercase tracking-wide text-foreground">
                    One action. Two scoreboards.
                  </p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
                <Link
                  href="/strategies/survival-battle-overlap/"
                  className="group rounded-lg border border-border/70 bg-card/40 p-4 transition-colors hover:border-primary/40"
                >
                  <Zap className="size-4 text-primary" />
                  <p className="mt-2 font-display text-lg uppercase tracking-wide text-foreground">
                    Overlap plan
                  </p>
                  <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
                    Weekly map, decision tree and worked example.
                  </p>
                </Link>
                <Link
                  href="/events/survival-battle/"
                  className="group rounded-lg border border-border/70 bg-card/40 p-4 transition-colors hover:border-primary/40"
                >
                  <Radar className="size-4 text-primary" />
                  <p className="mt-2 font-display text-lg uppercase tracking-wide text-foreground">
                    Survival Battle
                  </p>
                  <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
                    Six rounds, themes and reward thresholds.
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-11 lg:py-14">
        <SectionHeading
          eyebrow="Build the account behind the events"
          title="Three levers that compound"
          description="Event strategy is downstream of account strategy. Fix the squad, the reserve and the queue before chasing another leaderboard."
          href="/guides/"
          linkLabel="All field guides"
        />
        <div className="grid gap-4 md:grid-cols-3">
          {focusModules.map((module) => (
            <Link
              key={module.title}
              href={module.href}
              className="group relative flex min-h-[300px] flex-col overflow-hidden rounded-md border border-border/80 bg-card/40 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50"
            >
              <Image
                src={module.image}
                alt=""
                width={1600}
                height={900}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="absolute inset-0 h-full w-full object-cover opacity-35 transition-all duration-700 group-hover:scale-105 group-hover:opacity-45"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070c09] via-[#070c09]/80 to-[#070c09]/20" />
              <div className="relative flex flex-1 flex-col justify-between p-5">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-white/10 bg-black/30 backdrop-blur">
                    {module.label}
                  </Badge>
                  <module.icon className="size-4 text-primary/70" />
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-primary/70">
                    {module.title === "Resource Planning" ? "Economy" : "Progression"}
                  </p>
                  <h3 className="mt-1 font-display text-2xl uppercase leading-none tracking-wide text-foreground">
                    {module.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{module.copy}</p>
                  <span className="mt-4 inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
                    Open file <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-border/60 bg-[#08100b]">
        <div className="container-page py-11 lg:py-14">
          <SectionHeading
            eyebrow="Strategy hub"
            title="Plans with stop conditions"
            description="Every brief defines the objective, the actions, the metrics and the failure modes. No wish lists."
            href="/strategies/"
            linkLabel="All strategy briefs"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredStrategies.map((strategy, index) => (
              <StrategyCard key={strategy.slug} strategy={strategy} index={index} />
            ))}
          </div>
          {survivalGuide && (
            <div className="mt-4 flex flex-col items-start justify-between gap-3 rounded-md border border-primary/20 bg-primary/[0.035] px-4 py-3.5 sm:flex-row sm:items-center">
              <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">Featured:</span> {survivalGuide.summary}
              </p>
              <Link
                href={`/strategies/${survivalGuide.slug}/`}
                className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-primary hover:text-emerald-300"
              >
                Read overlap strategy <ArrowRight className="size-3.5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="container-page py-11 lg:py-14">
        <SectionHeading
          eyebrow="Event clock"
          title="The week at a glance"
          description="Seven days of windows, categories and countdowns. Open the full calendar for monthly and weekly views."
          href="/calendar/"
          linkLabel="Open calendar"
        />
        <NextOps events={calendar} initialDate={initialDate} variant="section" />
      </section>

      <section className="border-t border-border/60 bg-[#071009]">
        <div className="container-page py-11 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <SectionHeading
                eyebrow="Recent updates"
                title="Fresh from the archive"
                description="The latest event, guide and strategy revisions. Every page is dated."
                href="/search/"
                linkLabel="Search everything"
                className="mb-4"
              />
              <div className="rounded-md border border-border/70 bg-card/30 px-4">
                {updates.map((update) => (
                  <UpdateRow key={update.href} {...update} />
                ))}
              </div>
            </div>

            <div>
              <SectionHeading
                eyebrow="Visual archive"
                title="Screenshots worth studying"
                description="Reference boards and walkthrough captures. Replace placeholders with your own field data."
                href="/gallery/"
                linkLabel="Image library"
                className="mb-4"
              />
              <div className="grid grid-cols-2 gap-2">
                {gallery.slice(0, 4).map((image) => (
                  <Link
                    key={image.id}
                    href={`/gallery/?image=${image.id}`}
                    className="group relative overflow-hidden rounded-md border border-border/70"
                  >
                    <Image
                      src={image.src}
                      alt={image.title}
                      width={image.width}
                      height={image.height}
                      sizes="(max-width: 768px) 50vw, 260px"
                      className="aspect-[16/10] w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <p className="font-mono text-[7px] uppercase tracking-[0.12em] text-primary/80">
                        {image.category}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-[11px] font-medium text-white/90">
                        {image.title}
                      </p>
                    </div>
                    <span className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-sm border border-white/10 bg-black/40 text-white/60 backdrop-blur transition-colors group-hover:text-primary">
                      <Camera className="size-3" />
                    </span>
                  </Link>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  href="/alliance-vs-alliance/"
                  className="group flex items-center gap-2 rounded-sm border border-border/60 bg-card/30 px-3 py-2.5 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  <Swords className="size-3.5 text-primary/70" /> AvA command
                </Link>
                <Link
                  href="/faq/"
                  className="group flex items-center gap-2 rounded-sm border border-border/60 bg-card/30 px-3 py-2.5 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  <BookOpen className="size-3.5 text-primary/70" /> FAQ archive
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-11 lg:py-14">
        <div className="relative overflow-hidden rounded-lg border border-primary/25 bg-gradient-to-br from-primary/[0.09] via-card/60 to-card/30 p-6 sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-20 -top-24 size-80 rounded-full border border-primary/15" />
          <div className="pointer-events-none absolute -right-4 top-8 size-44 rounded-full border border-primary/10" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="eyebrow mb-3">
                <Sparkles className="size-3" /> Field contribution
              </p>
              <h2 className="font-display text-3xl uppercase leading-none tracking-wide text-foreground sm:text-4xl">
                Better data makes a better alliance
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Found a screenshot, a better route or a schedule correction? Send it to command. The content
                studio lets leadership update pages, images and event windows without touching code.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="secondary">
                  <Users className="size-3" /> {site.allianceName} ({site.callsign})
                </Badge>
                <Badge variant="outline">
                  <Database className="size-3" /> File-based content
                </Badge>
                <Badge variant="outline">
                  <FlaskConical className="size-3" /> Supabase-ready architecture
                </Badge>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <a href={`mailto:${site.contactEmail}?subject=Alliance wiki contribution`}>
                  Submit intel <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/">Admin dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page pb-12">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { icon: Trophy, title: "Maximise rewards", copy: "Guaranteed milestones before rank prestige.", href: "/strategies/free-to-play-guide/" },
            { icon: Users, title: "Coordinate the alliance", copy: "Roles, cadence and contribution paths.", href: "/strategies/alliance-growth/" },
            { icon: CalendarDays, title: "Plan the week", copy: "Monthly, weekly and agenda views.", href: "/calendar/" },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group flex items-start gap-3 rounded-md border border-border/60 bg-card/30 p-4 transition-colors hover:border-primary/40"
            >
              <item.icon className="mt-0.5 size-4 shrink-0 text-primary/70" />
              <span>
                <span className="block text-xs font-medium text-foreground group-hover:text-primary">
                  {item.title}
                </span>
                <span className="mt-0.5 block text-[10px] leading-relaxed text-muted-foreground">
                  {item.copy}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
