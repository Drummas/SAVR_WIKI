import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import {
  ArrowRight,
  CheckCircle2,
  Crosshair,
  Gauge,
  ListChecks,
  ShieldAlert,
  Target,
  Timer,
} from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContentSection } from "@/components/content/content-section";
import { ContentSidebar } from "@/components/content-sidebar";
import { JsonLd } from "@/components/json-ld";
import { mdxComponents } from "@/components/mdx-components";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getEvent, getGuide, getSiteConfig, getStrategies, getStrategy } from "@/lib/content";
import { articleSchema, breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return getStrategies().map((strategy) => ({ slug: strategy.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const strategy = getStrategy(slug);
  if (!strategy) return {};
  return buildMetadata({
    title: strategy.title,
    description: strategy.summary,
    path: `/strategies/${strategy.slug}/`,
    image: strategy.heroImage ?? "/og.png",
    type: "article",
    keywords: [strategy.category, ...strategy.tags, "alliance strategy"],
  });
}

function resolveRelated(slug: string) {
  const strategy = getStrategy(slug);
  if (strategy)
    return { label: strategy.title, href: `/strategies/${strategy.slug}/`, type: "Strategy" };
  const guide = getGuide(slug);
  if (guide) return { label: guide.title, href: `/guides/${guide.slug}/`, type: "Guide" };
  const event = getEvent(slug);
  if (event) return { label: event.title, href: `/events/${event.slug}/`, type: "Event" };
  if (slug === "alliance-vs-alliance")
    return { label: "Alliance vs Alliance", href: "/alliance-vs-alliance/", type: "Command centre" };
  return null;
}

export default async function StrategyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const strategy = getStrategy(slug);
  if (!strategy) notFound();

  const site = getSiteConfig();
  const sidebarItems = getStrategies().map((item) => ({
    label: item.title,
    href: `/strategies/${item.slug}/`,
    meta: item.readingTime.replace(" min", "m"),
  }));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Strategies", path: "/strategies/" },
            { name: strategy.title, path: `/strategies/${strategy.slug}/` },
          ]),
          articleSchema({
            title: strategy.title,
            description: strategy.summary,
            path: `/strategies/${strategy.slug}/`,
            updated: strategy.updated,
            category: strategy.category,
          }),
        ]}
      />

      <header className="relative overflow-hidden border-b border-border/60 pt-7">
        <div className="pointer-events-none absolute inset-0 grid-mask opacity-60" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-20 top-0 size-72 rounded-full bg-primary/[0.06] blur-3xl" aria-hidden="true" />
        <div className="container-page relative pb-9">
          <Breadcrumbs
            items={[{ label: "Strategies", href: "/strategies/" }, { label: strategy.title }]}
            className="mb-6"
          />
          <div className="max-w-4xl">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge>
                <Crosshair className="size-3" /> {strategy.category}
              </Badge>
              <Badge
                variant={
                  strategy.difficulty === "Beginner"
                    ? "success"
                    : strategy.difficulty === "Advanced"
                      ? "destructive"
                      : "default"
                }
              >
                {strategy.difficulty}
              </Badge>
              <Badge variant="secondary">
                <Timer className="size-3" /> {strategy.readingTime}
              </Badge>
            </div>
            <h1 className="font-display text-4xl uppercase leading-[0.94] tracking-wide text-foreground sm:text-5xl lg:text-6xl">
              {strategy.title}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground pretty sm:text-[15px]">
              {strategy.summary}
            </p>
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/60">
              Strategy brief · Updated {formatDate(strategy.updated)} · {site.allianceName}
            </p>
          </div>

          {strategy.metrics.length > 0 && (
            <div className="mt-7 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {strategy.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-sm border border-border/70 bg-card/50 px-3.5 py-3"
                >
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/60">
                    {metric.label}
                  </p>
                  <p className="mt-1 font-display text-xl uppercase tracking-wide text-primary-soft">
                    {metric.value}
                  </p>
                  {metric.note && (
                    <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground/70">
                      {metric.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="container-page py-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] xl:gap-12">
          <ContentSidebar title="Strategy files" items={sidebarItems} />

          <article className="min-w-0">
            <ContentSection index={1} title="Objective">
              <div className="rounded-md border border-primary/20 bg-primary/[0.035] p-4">
                <p className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                  <Target className="size-3.5" /> Mission
                </p>
                <p className="text-sm leading-relaxed text-foreground/85">{strategy.objective}</p>
              </div>
              {strategy.body && (
                <div className="prose-tactical mt-6">
                  <MDXRemote
                    source={strategy.body}
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
              title="Recommended actions"
              className="mt-10"
            >
              <div className="grid gap-2 sm:grid-cols-2">
                {strategy.actions.map((action, index) => (
                  <div
                    key={action}
                    className="flex gap-3 rounded-sm border border-border/60 bg-card/40 p-3.5"
                  >
                    <span className="font-mono text-[10px] text-primary/60">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-xs leading-relaxed text-muted-foreground">{action}</p>
                  </div>
                ))}
              </div>
            </ContentSection>

            <ContentSection index={3} title="Requirements" className="mt-10">
              <ul className="space-y-2">
                {strategy.requirements.map((requirement) => (
                  <li key={requirement} className="flex gap-2.5 text-xs leading-relaxed text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary/60" />
                    {requirement}
                  </li>
                ))}
              </ul>
            </ContentSection>

            <ContentSection
              index={4}
              title="Optimisation methods"
              description="Measured improvements, not just more activity."
              className="mt-10"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {strategy.optimisation.map((item, index) => (
                  <div key={item} className="rounded-sm border border-border/60 bg-card/30 p-3.5">
                    <p className="mb-1 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-primary/70">
                      <Gauge className="size-3" /> Optimisation {String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="text-xs leading-relaxed text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </ContentSection>

            <ContentSection index={5} title="Tips & failure modes" className="mt-10">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-primary/20 bg-primary/[0.025] p-4">
                  <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                    <ListChecks className="size-3.5" /> Field tips
                  </p>
                  <ul className="space-y-2.5">
                    {strategy.tips.map((tip) => (
                      <li key={tip} className="flex gap-2.5 text-xs leading-relaxed text-muted-foreground">
                        <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary/70" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-md border border-red-500/20 bg-red-500/[0.025] p-4">
                  <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-red-300">
                    <ShieldAlert className="size-3.5" /> Common errors
                  </p>
                  <ul className="space-y-2.5">
                    {strategy.mistakes.map((mistake) => (
                      <li key={mistake} className="flex gap-2.5 text-xs leading-relaxed text-muted-foreground">
                        <span className="mt-1.5 size-1 shrink-0 rounded-full bg-red-400/70" />
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ContentSection>

            {strategy.related.length > 0 && (
              <ContentSection index={6} title="Related intel" className="mt-10">
                <div className="grid gap-2 sm:grid-cols-2">
                  {strategy.related.map((relatedSlug) => {
                    const related = resolveRelated(relatedSlug);
                    if (!related) return null;
                    return (
                      <Link
                        key={relatedSlug}
                        href={related.href}
                        className="group flex items-center justify-between gap-3 rounded-sm border border-border/60 bg-card/40 px-3.5 py-3 transition-colors hover:border-primary/40"
                      >
                        <span>
                          <span className="block font-mono text-[9px] uppercase tracking-[0.14em] text-primary/60">
                            {related.type}
                          </span>
                          <span className="mt-0.5 block text-xs text-foreground group-hover:text-primary-soft">
                            {related.label}
                          </span>
                        </span>
                        <ArrowRight className="size-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
                      </Link>
                    );
                  })}
                </div>
              </ContentSection>
            )}

            <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-md border border-border/70 bg-card/40 p-5 sm:flex-row sm:items-center">
              <div>
                <p className="font-display text-xl uppercase tracking-wide text-foreground">
                  Apply it this week
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Map the next window on the event calendar, then brief your phase captain.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild>
                  <Link href="/calendar/">
                    Plan the week <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/alliance-vs-alliance/">AvA command</Link>
                </Button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
