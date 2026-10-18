import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Crosshair, Layers, Target } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { SectionHeading } from "@/components/section-heading";
import { StrategyCard } from "@/components/content/cards";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/json-ld";
import { getStrategies } from "@/lib/content";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Strategy Hub",
  description:
    "Alliance growth, free-to-play discipline, event optimisation, battle planning and the Survival Battle overlap plan.",
  path: "/strategies/",
  keywords: ["alliance strategy", "event optimisation", "free to play", "battle planning"],
});

export default function StrategiesPage() {
  const strategies = getStrategies();
  const featured = strategies.find((strategy) => strategy.slug === "survival-battle-overlap");

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Strategies", path: "/strategies/" },
        ])}
      />
      <PageHeader
        eyebrow={`Strategy hub · ${String(strategies.length).padStart(2, "0")} briefs`}
        title="Plans that survive contact"
        description="A strategy is not a wish list. These briefs define the objective, the actions, the stop conditions and the data to capture after the event."
        crumbs={[{ label: "Strategies" }]}
      >
        <div className="flex flex-wrap gap-2">
          <Badge>
            <Crosshair className="size-3" /> Overlap-first
          </Badge>
          <Badge variant="secondary">Alliance coordination</Badge>
          <Badge variant="outline">F2P tested</Badge>
        </div>
      </PageHeader>

      {featured && (
        <section className="container-page py-10">
          <Link
            href={`/strategies/${featured.slug}/`}
            className="group relative block overflow-hidden rounded-lg border border-primary/30 bg-gradient-to-br from-primary/[0.1] via-card/70 to-card/40 p-6 transition-colors hover:border-primary/60 sm:p-8 lg:p-10"
          >
            <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full border border-primary/15" />
            <div className="pointer-events-none absolute -right-10 top-10 size-56 rounded-full border border-primary/10" />
            <div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="eyebrow mb-3">
                  <span className="inline-block size-1.5 rounded-full bg-primary" />
                  Featured strategy · event scoring
                </p>
                <h2 className="font-display text-3xl uppercase leading-[0.95] tracking-wide text-foreground sm:text-4xl lg:text-5xl">
                  {featured.title}
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {featured.summary}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {featured.metrics.slice(0, 3).map((metric) => (
                    <Badge key={metric.label} variant="secondary">
                      {metric.label}: {metric.value}
                    </Badge>
                  ))}
                </div>
              </div>
              <span className="inline-flex items-center gap-2 self-start rounded-sm border border-primary/40 bg-primary/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-300 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                Read the plan <ArrowRight className="size-3.5" />
              </span>
            </div>
          </Link>
        </section>
      )}

      <section className="container-page pb-10">
        <SectionHeading
          eyebrow="All briefs"
          title="Choose the next lever"
          description="Every brief follows the same shape: objective, actions, requirements, optimisation, metrics and failure modes."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {strategies.map((strategy, index) => (
            <StrategyCard key={strategy.slug} strategy={strategy} index={index} />
          ))}
        </div>
      </section>

      <section className="border-y border-border/60 bg-[#09110c]">
        <div className="container-page py-10">
          <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
            <div className="rounded-md border border-primary/20 bg-primary/[0.035] p-6">
              <p className="eyebrow mb-3">AvA command centre</p>
              <h2 className="font-display text-3xl uppercase tracking-wide text-foreground">
                The full Alliance vs Alliance playbook
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Scoring categories, five-phase timeline, overlap diagrams, upgrade planning, speed-up
                management, daily action plans and visual strategy cards — in one command page.
              </p>
              <Link
                href="/alliance-vs-alliance/"
                className="mt-5 inline-flex items-center gap-2 rounded-sm bg-primary px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-emerald-400"
              >
                Enter command centre <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {[
                {
                  icon: Target,
                  title: "Set one objective",
                  copy: "Rank target, milestone floor, or development week. Pick one before choosing a strategy.",
                },
                {
                  icon: Layers,
                  title: "Protect the reserve",
                  copy: "A strategy that spends the closer budget at midday is not aggressive; it is unplanned.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-md border border-border/70 bg-card/40 p-4">
                  <item.icon className="size-4 text-primary" />
                  <p className="mt-3 font-display text-lg uppercase tracking-wide text-foreground">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
