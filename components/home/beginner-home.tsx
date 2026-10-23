import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Compass,
  Gift,
  HelpCircle,
  Shield,
  Sprout,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getFaq, getGiftCodes, getGuides, getRoster } from "@/lib/content";
import type { FAQItem, Guide } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const starterSlugs = [
  "beginner-guide",
  "troop-development",
  "resource-management",
  "hero-development",
  "construction-priorities",
];

const questionIds = ["resources-cap", "heroes-target", "events-verify"];

/**
 * Beginner home. Deliberately quieter than the advanced dashboard: one clear
 * next step, a short reading path and the four things a new player opens every
 * day. It renders alongside the advanced home; CSS reveals the active layout.
 */
export function BeginnerHome() {
  const guides = getGuides();
  const starters = starterSlugs
    .map((slug) => guides.find((guide) => guide.slug === slug))
    .filter((guide): guide is Guide => Boolean(guide));
  const beginner = guides.find((guide) => guide.slug === "beginner-guide");
  const codes = getGiftCodes();
  const roster = getRoster();
  const faq = getFaq();
  const questions = questionIds
    .map((id) => faq.find((item) => item.id === id))
    .filter((item): item is FAQItem => Boolean(item));

  const usefulNow = [
    {
      title: "Gift codes",
      href: "/tools/gift-codes/",
      icon: Gift,
      note: `${codes.codes.length} working codes, re-checked hourly`,
    },
    {
      title: "Event calendar",
      href: "/calendar/",
      icon: CalendarDays,
      note: "See this week's windows before you spend",
    },
    {
      title: "The roster",
      href: "/roster/",
      icon: Users,
      note: `Meet the ${roster.members.length} Savage Rebelz members`,
    },
    {
      title: "Questions",
      href: "/faq/",
      icon: HelpCircle,
      note: `${faq.length} answers from the alliance`,
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60">
        <div
          className="pointer-events-none absolute inset-0 bg-tactical-grid bg-grid opacity-40"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_20%_-10%,rgb(var(--primary-rgb)/0.14),transparent_65%)]"
          aria-hidden="true"
        />

        <div className="container-page relative py-10 sm:py-14 lg:py-20">
          <div className="grid gap-9 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
            <div>
              <p className="eyebrow mb-4">
                <Sprout className="size-3.5" aria-hidden="true" />
                Beginner field manual
              </p>
              <h1 className="display-hero max-w-[46rem] text-[2.6rem] text-foreground sm:text-[3.3rem] lg:text-[4rem]">
                New to Last Asylum?
                <span className="mt-1 block text-gradient-brand">Start with the basics.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground pretty sm:text-base">
                The first week is not about winning events. Keep your queues busy, join an active
                alliance and pick one squad. Everything else can wait until those three habits are
                running.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <Button asChild size="lg">
                  <Link href="/guides/beginner-guide/">
                    Read the beginner guide <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/guides/">
                    <BookOpen className="size-4" /> Browse starter guides
                  </Link>
                </Button>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/50 pt-4 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/60">
                <span className="inline-flex items-center gap-1.5">
                  <Shield className="size-3 text-primary/70" aria-hidden="true" />
                  {beginner?.readingTime ?? "12 min"} read
                </span>
                <span>Your first seven days</span>
                {beginner && <span>Updated {formatDate(beginner.updated)}</span>}
              </div>
            </div>

            <div className="rounded-lg border border-primary/25 bg-card/50 p-5 shadow-panel">
              <p className="eyebrow mb-1">Week one checklist</p>
              <h2 className="font-display text-2xl uppercase leading-none tracking-wide text-foreground">
                Four habits to start
              </h2>
              <ul className="mt-4 space-y-3">
                {[
                  "Keep builder, research and training queues full.",
                  "Join the alliance and read the pinned plan.",
                  "Raise production and storage in even steps.",
                  "Pick one hero squad and protect your shards.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-xs leading-relaxed text-muted-foreground">
                    <CheckCircle2
                      className="mt-0.5 size-3.5 shrink-0 text-primary/80"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-border/50 pt-3 font-mono text-[8px] uppercase leading-relaxed tracking-[0.1em] text-muted-foreground/50">
                Verify live event screens in-game — timings and rewards vary by server
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-10 lg:py-14">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow mb-2">
              <span className="inline-block size-1.5 rounded-full bg-primary" />
              Reading path
            </p>
            <h2 className="font-display text-3xl uppercase leading-none tracking-wide text-foreground sm:text-4xl">
              Read these guides first
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Five short files in this order. They cover everything that compounds before event
              strategy starts to matter.
            </p>
          </div>
          <Link
            href="/guides/"
            className="inline-flex shrink-0 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-primary transition-colors hover:text-primary-soft"
          >
            All guides <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <ol className="overflow-hidden rounded-lg border border-border/70 bg-card/40">
          {starters.map((guide, index) => (
            <li key={guide.slug} className="border-b border-border/50 last:border-0">
              <Link
                href={`/guides/${guide.slug}/`}
                className="group flex items-start gap-4 px-4 py-4 transition-colors hover:bg-secondary/40 sm:items-center sm:px-5"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-sm border border-primary/25 bg-primary/[0.07] font-mono text-[10px] text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-display text-xl uppercase leading-tight tracking-wide text-foreground transition-colors group-hover:text-primary-soft">
                      {guide.title}
                    </span>
                    <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground/50">
                      {guide.difficulty} · {guide.readingTime}
                    </span>
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                    {guide.summary}
                  </span>
                </span>
                <ArrowRight
                  className="mt-2 size-4 shrink-0 text-muted-foreground/30 transition-all group-hover:translate-x-0.5 group-hover:text-primary sm:mt-0"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-border/60 bg-well">
        <div className="container-page py-10 lg:py-14">
          <div className="mb-6 max-w-2xl">
            <p className="eyebrow mb-2">
              <Compass className="size-3.5" aria-hidden="true" />
              Useful right now
            </p>
            <h2 className="font-display text-3xl uppercase leading-none tracking-wide text-foreground sm:text-4xl">
              Things you will open daily
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              No reading required. These are the pages new members come back to.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {usefulNow.map((item) => (
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

      <section className="container-page py-10 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="eyebrow mb-2">
              <HelpCircle className="size-3.5" aria-hidden="true" />
              Straight answers
            </p>
            <h2 className="font-display text-3xl uppercase leading-none tracking-wide text-foreground sm:text-4xl">
              Questions new players ask
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Short answers from the alliance FAQ. The full archive is searchable and categorised.
            </p>
            <Link
              href="/faq/"
              className="mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-primary transition-colors hover:text-primary-soft"
            >
              All questions <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="divide-y divide-border/50 overflow-hidden rounded-lg border border-border/70 bg-card/40">
            {questions.map((item) => (
              <div key={item.id} className="p-4 sm:p-5">
                <Link
                  href={`/faq/#faq-item-${item.id}`}
                  className="group flex items-start gap-2"
                >
                  <HelpCircle
                    className="mt-0.5 size-3.5 shrink-0 text-primary/70"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                    {item.question}
                  </span>
                </Link>
                <p className="mt-1.5 pl-5 text-xs leading-relaxed text-muted-foreground">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page pb-12">
        <div className="rounded-lg border border-border/70 bg-card/30 px-5 py-5 sm:px-6">
          <p className="font-display text-2xl uppercase leading-none tracking-wide text-foreground">
            That is enough to start
          </p>
          <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted-foreground">
            The advanced layout holds the event breakdowns, AvA plans and long-horizon strategy. Leave
            it alone for now; switch to it from the layout toggle in the header whenever you are ready.
          </p>
        </div>
      </section>
    </>
  );
}
