import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Crosshair,
  ExternalLink,
  ListChecks,
  Package,
  ShieldAlert,
  Timer,
} from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContentSection } from "@/components/content/content-section";
import { Screenshot } from "@/components/content/screenshot";
import { ContentSidebar } from "@/components/content-sidebar";
import { JsonLd } from "@/components/json-ld";
import { mdxComponents } from "@/components/mdx-components";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getEvent, getGuide, getGuides, getSiteConfig, getStrategy } from "@/lib/content";
import { articleSchema, breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return getGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return buildMetadata({
    title: guide.title,
    description: guide.summary,
    path: `/guides/${guide.slug}/`,
    image: guide.heroImage ?? "/og.png",
    type: "article",
    keywords: [guide.category, ...guide.tags, guide.difficulty],
  });
}

function RelatedLink({ slug }: { slug: string }) {
  const guide = getGuide(slug);
  if (guide) {
    return (
      <Link
        href={`/guides/${guide.slug}/`}
        className="group flex items-center justify-between gap-3 rounded-sm border border-border/60 bg-card/40 px-3.5 py-3 transition-colors hover:border-primary/40"
      >
        <span>
          <span className="block font-mono text-[9px] uppercase tracking-[0.14em] text-primary/60">
            Guide
          </span>
          <span className="mt-0.5 block text-xs text-foreground group-hover:text-emerald-100">
            {guide.title}
          </span>
        </span>
        <ArrowRight className="size-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
      </Link>
    );
  }
  const event = getEvent(slug);
  if (event) {
    return (
      <Link
        href={`/events/${event.slug}/`}
        className="group flex items-center justify-between gap-3 rounded-sm border border-border/60 bg-card/40 px-3.5 py-3 transition-colors hover:border-primary/40"
      >
        <span>
          <span className="block font-mono text-[9px] uppercase tracking-[0.14em] text-primary/60">
            Event
          </span>
          <span className="mt-0.5 block text-xs text-foreground group-hover:text-emerald-100">
            {event.title}
          </span>
        </span>
        <ArrowRight className="size-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
      </Link>
    );
  }
  const strategy = getStrategy(slug);
  if (strategy) {
    return (
      <Link
        href={`/strategies/${strategy.slug}/`}
        className="group flex items-center justify-between gap-3 rounded-sm border border-border/60 bg-card/40 px-3.5 py-3 transition-colors hover:border-primary/40"
      >
        <span>
          <span className="block font-mono text-[9px] uppercase tracking-[0.14em] text-primary/60">
            Strategy
          </span>
          <span className="mt-0.5 block text-xs text-foreground group-hover:text-emerald-100">
            {strategy.title}
          </span>
        </span>
        <ArrowRight className="size-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
      </Link>
    );
  }
  return null;
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const site = getSiteConfig();
  const sidebarItems = getGuides().map((item) => ({
    label: item.title,
    href: `/guides/${item.slug}/`,
    meta: item.readingTime.replace(" min", "m"),
  }));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides/" },
            { name: guide.title, path: `/guides/${guide.slug}/` },
          ]),
          articleSchema({
            title: guide.title,
            description: guide.summary,
            path: `/guides/${guide.slug}/`,
            updated: guide.updated,
            category: guide.category,
          }),
        ]}
      />

      <header className="relative overflow-hidden border-b border-border/60 pt-7">
        <div className="pointer-events-none absolute inset-0 grid-mask opacity-60" aria-hidden="true" />
        <div className="container-page relative pb-9">
          <Breadcrumbs
            items={[{ label: "Guides", href: "/guides/" }, { label: guide.title }]}
            className="mb-6"
          />
          <div className="grid gap-8 lg:grid-cols-[1.45fr_1fr] lg:items-start">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge>
                  <BookOpen className="size-3" /> {guide.category}
                </Badge>
                <Badge
                  variant={
                    guide.difficulty === "Beginner"
                      ? "success"
                      : guide.difficulty === "Advanced"
                        ? "destructive"
                        : "default"
                  }
                >
                  {guide.difficulty}
                </Badge>
                <Badge variant="secondary">
                  <Timer className="size-3" /> {guide.readingTime}
                </Badge>
              </div>
              <h1 className="font-display text-4xl uppercase leading-[0.94] tracking-wide text-foreground sm:text-5xl lg:text-6xl">
                {guide.title}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground pretty sm:text-[15px]">
                {guide.summary}
              </p>
              <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/60">
                Updated {formatDate(guide.updated)} · {site.allianceName}
              </p>
            </div>
            <Screenshot
              src={guide.heroImage}
              alt={`${guide.title} visual reference`}
              caption="Reference visual. Replace with your own annotated capture."
              code="GUIDE-HERO"
              priority
              className="my-0"
            />
          </div>
        </div>
      </header>

      <div className="container-page py-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] xl:gap-12">
          <ContentSidebar title="Field guides" items={sidebarItems} />

          <article className="min-w-0">
            <ContentSection index={1} title="Overview">
              <p className="text-sm leading-relaxed text-foreground/85">{guide.overview}</p>
              {guide.body && (
                <div className="prose-tactical mt-6">
                  <MDXRemote
                    source={guide.body}
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
              title="Priorities & recommended actions"
              description="What to do first, and what to deliberately ignore."
              className="mt-10"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-primary/20 bg-primary/[0.03] p-4">
                  <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                    <Crosshair className="size-3.5" /> Priorities
                  </p>
                  <ol className="space-y-2.5">
                    {guide.priorities.map((priority, index) => (
                      <li key={priority} className="flex gap-2.5 text-xs leading-relaxed text-muted-foreground">
                        <span className="font-mono text-[10px] text-primary/60">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {priority}
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="rounded-md border border-border/70 bg-card/40 p-4">
                  <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/80">
                    <ListChecks className="size-3.5" /> Recommended actions
                  </p>
                  <ul className="space-y-2.5">
                    {guide.actions.map((action) => (
                      <li key={action} className="flex gap-2.5 text-xs leading-relaxed text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 size-3 shrink-0 text-emerald-400/70" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ContentSection>

            <ContentSection
              index={3}
              title="Resource requirements"
              description="A planning estimate, not a shopping list. Confirm current costs in-game."
              className="mt-10"
            >
              <div className="overflow-hidden rounded-md border border-border/70 bg-card/50">
                <div className="hidden grid-cols-[1.4fr_1fr_0.6fr] gap-3 border-b border-border/60 px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/60 sm:grid">
                  <span>Resource</span>
                  <span>Requirement</span>
                  <span>Priority</span>
                </div>
                {guide.resourceRequirements.map((row) => (
                  <div
                    key={row.item}
                    className="grid gap-1 border-b border-border/40 px-4 py-3 last:border-0 sm:grid-cols-[1.4fr_1fr_0.6fr] sm:items-center sm:gap-3"
                  >
                    <p className="flex items-center gap-2 text-xs font-medium text-foreground">
                      <Package className="size-3 text-primary/60 sm:hidden" />
                      {row.item}
                    </p>
                    <p className="pl-5 text-xs text-muted-foreground sm:pl-0">{row.amount}</p>
                    <p className="pl-5 sm:pl-0">
                      <Badge
                        variant={
                          row.priority === "Core"
                            ? "default"
                            : row.priority === "High"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {row.priority}
                      </Badge>
                    </p>
                  </div>
                ))}
              </div>
            </ContentSection>

            <ContentSection
              index={4}
              title="Visual examples"
              description="Step-by-step reference captures. Tap any image to inspect it full size."
              className="mt-10"
            >
              {guide.steps.length ? (
                <div className="space-y-7">
                  {guide.steps.map((step, index) => (
                    <div key={`${step.title}-${index}`}>
                      <div className="mb-3 flex items-start gap-3">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-sm border border-primary/40 bg-primary/10 font-mono text-[10px] text-primary">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <h3 className="font-display text-lg uppercase tracking-wide text-foreground">
                            {step.title}
                          </h3>
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      </div>
                      <div className="sm:pl-11">
                        <Screenshot
                          src={step.image}
                          alt={step.title}
                          caption={step.caption}
                          highlights={step.highlights}
                          code={`STEP-${String(index + 1).padStart(2, "0")}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Screenshot caption="Visual examples to be added by Alliance Leadership." />
              )}
            </ContentSection>

            <ContentSection index={5} title="Tips & common mistakes" className="mt-10">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-emerald-500/20 bg-emerald-500/[0.025] p-4">
                  <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-300">
                    <CheckCircle2 className="size-3.5" /> Tips & tricks
                  </p>
                  <ul className="space-y-2.5">
                    {guide.tips.map((tip) => (
                      <li key={tip} className="flex gap-2.5 text-xs leading-relaxed text-muted-foreground">
                        <span className="mt-1.5 size-1 shrink-0 rounded-full bg-emerald-400/70" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-md border border-red-500/20 bg-red-500/[0.025] p-4">
                  <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-red-300">
                    <ShieldAlert className="size-3.5" /> Common mistakes
                  </p>
                  <ul className="space-y-2.5">
                    {guide.mistakes.map((mistake) => (
                      <li key={mistake} className="flex gap-2.5 text-xs leading-relaxed text-muted-foreground">
                        <span className="mt-1.5 size-1 shrink-0 rounded-full bg-red-400/70" />
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ContentSection>

            {guide.related.length > 0 && (
              <ContentSection index={6} title="Continue the briefing" className="mt-10">
                <div className="grid gap-2 sm:grid-cols-2">
                  {guide.related.map((relatedSlug) => (
                    <RelatedLink key={relatedSlug} slug={relatedSlug} />
                  ))}
                </div>
              </ContentSection>
            )}

            <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-md border border-primary/20 bg-primary/[0.04] p-5 sm:flex-row sm:items-center">
              <div>
                <p className="font-display text-xl uppercase tracking-wide text-foreground">
                  Put it into practice
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Pair this guide with the event clock and the alliance spend plan.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild>
                  <Link href="/calendar/">
                    Open calendar <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/alliance-vs-alliance/">
                    AvA command <ExternalLink className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
