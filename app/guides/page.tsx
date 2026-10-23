import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Compass, Crosshair, Layers } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { GuideCard } from "@/components/content/cards";
import { BeginnerGuides } from "@/components/guides/beginner-guides";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/json-ld";
import { getGuides } from "@/lib/content";
import { getHeroes } from "@/lib/heroes";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Field Guides",
  description:
    "Beginner-to-advanced Last Asylum: Plague guides for heroes, troops, resources, construction and research priorities.",
  path: "/guides/",
  keywords: ["beginner guide", "hero guide", "resource guide", "research priorities"],
});

export default function GuidesPage() {
  const guides = getGuides();
  const beginner = guides.find((guide) => guide.slug === "beginner-guide");
  const core = guides.filter((guide) =>
    ["hero-development", "troop-development", "resource-management"].includes(guide.slug),
  );
  const heroGuide = guides.find((guide) => guide.slug === "know-your-heroes");
  const heroes = getHeroes();
  const advanced = guides.filter((guide) =>
    ["construction-priorities", "research-priorities", "advanced-player-progression"].includes(
      guide.slug,
    ),
  );

  return (
    <>
      <div className="experience-advanced-only">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides/" },
        ])}
      />
      <PageHeader
        eyebrow={`Field manuals · ${String(guides.length).padStart(2, "0")} guides`}
        title="Build the account behind the alliance"
        description="No event strategy survives a broken economy. These guides cover the foundations — queue uptime, squad direction, resource discipline and the progression choices that compound."
        crumbs={[{ label: "Guides" }]}
      >
        <div className="flex flex-wrap gap-2">
          <Badge>
            <BookOpen className="size-3" /> Beginner to advanced
          </Badge>
          <Badge variant="secondary">Mobile walkthroughs</Badge>
          <Badge variant="outline">Practical checklists</Badge>
        </div>
      </PageHeader>

      <section className="container-page py-10">
        {beginner && (
          <Link
            href={`/guides/${beginner.slug}/`}
            className="group relative mb-10 block overflow-hidden rounded-lg border border-primary/30 bg-gradient-to-br from-primary/[0.09] via-card/70 to-card/50 p-6 transition-colors hover:border-primary/60 sm:p-8"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full border border-primary/15" />
            <div className="pointer-events-none absolute -right-8 top-8 size-40 rounded-full border border-primary/10" />
            <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="eyebrow mb-3">
                  <span className="inline-block size-1.5 rounded-full bg-primary" />
                  Start here · foundation
                </p>
                <h2 className="font-display text-3xl uppercase leading-none tracking-wide text-foreground sm:text-4xl">
                  {beginner.title}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {beginner.summary}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary">{beginner.difficulty}</Badge>
                  <Badge variant="secondary">{beginner.category}</Badge>
                  <Badge variant="secondary">{beginner.readingTime}</Badge>
                  <Badge variant="outline">{beginner.priorities.length} priorities</Badge>
                </div>
              </div>
              <span className="inline-flex items-center gap-2 self-start rounded-sm border border-primary/40 bg-primary/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                Open guide <ArrowRight className="size-3.5" />
              </span>
            </div>
          </Link>
        )}

        <SectionHeading
          eyebrow="Core progression"
          title="The three engines"
          description="Heroes, troops and resources. Build one direction in each before chasing event scores."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {core.map((guide) => (
            <GuideCard key={guide.slug} guide={guide} />
          ))}
        </div>

        {heroGuide && (
          <div className="mt-10 overflow-hidden rounded-lg border border-border/70 bg-card/40">
            <div className="grid gap-5 border-b border-border/50 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="eyebrow mb-2">
                  <span className="inline-block size-1.5 rounded-full bg-primary" />
                  Hero intel
                </p>
                <h3 className="font-display text-3xl uppercase leading-none tracking-wide text-foreground">
                  {heroGuide.title}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {heroGuide.summary}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary">{heroes.length} cheat sheets</Badge>
                  <Badge variant="secondary">{heroGuide.difficulty}</Badge>
                  <Badge variant="secondary">{heroGuide.readingTime}</Badge>
                </div>
              </div>
              <Link
                href={`/guides/${heroGuide.slug}/`}
                className="inline-flex items-center gap-2 self-start rounded-sm border border-primary/40 bg-primary/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Open the roster <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <div className="flex flex-wrap gap-1.5 p-4 sm:p-5">
              {heroes.map((hero) => (
                <Link
                  key={hero.slug}
                  href={`/guides/${heroGuide.slug}/#hero-${hero.slug}`}
                  className="rounded-sm border border-border/60 bg-background/40 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {hero.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="border-y border-border/60 bg-well">
        <div className="container-page py-10">
          <SectionHeading
            eyebrow="Long-horizon planning"
            title="Priorities that compound"
            description="Construction, research and advanced account strategy. Slow choices with the biggest long-term effect."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {advanced.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-10">
        <SectionHeading
          eyebrow="How to use this section"
          title="Read, apply, report back"
          description="Guides are living documents. Start with the basics, test one change for a week, then send the result to leadership."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Compass,
              title: "Choose one change",
              copy: "Do not rebuild everything at once. Pick a single queue, roster or spending habit and change only that.",
            },
            {
              icon: Layers,
              title: "Run it for a week",
              copy: "Measure queue uptime, event points or battle results before and after. Anecdotes are not evidence.",
            },
            {
              icon: Crosshair,
              title: "Report the result",
              copy: "Send the before/after screenshot to leadership. If the change works, it becomes doctrine.",
            },
          ].map((step) => (
            <div key={step.title} className="rounded-md border border-border/70 bg-card/40 p-5">
              <step.icon className="size-5 text-primary" />
              <h3 className="mt-4 font-display text-xl uppercase tracking-wide text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{step.copy}</p>
            </div>
          ))}
        </div>
      </section>
      </div>

      <div className="experience-beginner-only">
        <BeginnerGuides />
      </div>
    </>
  );
}
