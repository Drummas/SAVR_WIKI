import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HelpCircle, MessageSquare, ShieldQuestion } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { FaqExplorer } from "@/components/faq/faq-explorer";
import { JsonLd } from "@/components/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFaq, getFaqCategories, getSiteConfig } from "@/lib/content";
import { breadcrumbSchema, buildMetadata, faqSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "FAQ",
  description:
    "Answers to the most common Last Asylum: Plague alliance questions: events, AvA scoring, Survival Battle, heroes, resources, research and battle strategy.",
  path: "/faq/",
  keywords: ["Last Asylum FAQ", "Alliance Duel questions", "Survival Battle help"],
});

export default function FaqPage() {
  const items = getFaq();
  const categories = getFaqCategories();
  const site = getSiteConfig();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "FAQ", path: "/faq/" },
          ]),
          faqSchema(items),
        ]}
      />
      <PageHeader
        eyebrow={`Knowledge base · ${String(items.length).padStart(2, "0")} answers`}
        title="Questions from the field"
        description="Search the archive or browse by category. Answers reflect community-documented mechanics and alliance practice; live event screens remain the source of truth."
        crumbs={[{ label: "FAQ" }]}
      >
        <div className="flex flex-wrap gap-2">
          <Badge>
            <HelpCircle className="size-3" /> {categories.length} categories
          </Badge>
          <Badge variant="secondary">Instant search</Badge>
          <Badge variant="outline">Deep-linkable answers</Badge>
        </div>
      </PageHeader>

      <section className="container-page py-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <FaqExplorer items={items} categories={categories} />

          <aside className="space-y-4">
            <div className="rounded-md border border-primary/20 bg-primary/[0.035] p-4">
              <ShieldQuestion className="size-5 text-primary" />
              <p className="mt-2 font-display text-xl uppercase tracking-wide text-foreground">
                Missing an answer?
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Send the question to command with the context: event, phase, server and what you have already
                tried. Good questions become good field notes.
              </p>
              <Button asChild variant="outline" size="sm" className="mt-3 w-full">
                <a href={`mailto:${site.contactEmail}?subject=Alliance wiki FAQ question`}>
                  <MessageSquare className="size-3.5" /> Ask command
                </a>
              </Button>
            </div>

            <div className="rounded-md border border-border/70 bg-card/40 p-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/60">
                Popular starting points
              </p>
              <div className="mt-3 space-y-1.5">
                {[
                  { label: "How AvA scoring works", href: "/alliance-vs-alliance/#scoring" },
                  { label: "What an overlap window is", href: "/strategies/survival-battle-overlap/" },
                  { label: "Beginner first-week plan", href: "/guides/beginner-guide/" },
                  { label: "Event calendar", href: "/calendar/" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between gap-2 rounded-sm border border-border/50 px-2.5 py-2 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {link.label}
                    <ArrowRight className="size-3 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-warning/20 bg-warning/[0.035] p-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-warning">
                Answer confidence
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                Some answers describe community-reported mechanics that can change with patches. If an answer
                contradicts your live game, trust the game and tell leadership so the wiki can be corrected.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
