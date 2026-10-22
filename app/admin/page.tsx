import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Camera,
  CheckCircle2,
  Database,
  ExternalLink,
  FileText,
  Images,
  Layers,
  Lock,
  Radar,
  Settings,
  ShieldCheck,
  Swords,
  Upload,
  Users,
  Wrench,
} from "lucide-react";

import { BrandWordmark } from "@/components/brand-wordmark";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getCalendarEvents,
  getEvents,
  getFaq,
  getGallery,
  getGuides,
  getSiteConfig,
  getStrategies,
} from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Admin Dashboard",
    description: "Alliance content operations dashboard.",
    path: "/admin/",
  }),
  robots: { index: false, follow: false },
};

const collections = [
  {
    name: "Event files",
    description: "Objectives, phases, rewards, checklists and visual walkthroughs.",
    href: "/admin/cms/#/collections/events",
    icon: Radar,
    accent: "text-primary",
  },
  {
    name: "Field guides",
    description: "Beginner-to-advanced progression, economy and combat manuals.",
    href: "/admin/cms/#/collections/guides",
    icon: BookOpen,
    accent: "text-teal-300",
  },
  {
    name: "Strategy briefs",
    description: "Objectives, actions, requirements, metrics and failure modes.",
    href: "/admin/cms/#/collections/strategies",
    icon: Swords,
    accent: "text-warning",
  },
  {
    name: "Event calendar",
    description: "Dates, categories, overlap links and source labels.",
    href: "/admin/cms/#/collections/calendar",
    icon: CalendarDays,
    accent: "text-primary",
  },
  {
    name: "Image library",
    description: "Upload screenshots, add captions, categories and tags.",
    href: "/admin/cms/#/collections/gallery",
    icon: Images,
    accent: "text-cyan-300",
  },
  {
    name: "FAQ archive",
    description: "Questions, answers, categories and searchable tags.",
    href: "/admin/cms/#/collections/faq",
    icon: FileText,
    accent: "text-warning",
  },
  {
    name: "Alliance identity",
    description: "Alliance name, server, links, stats and disclaimer.",
    href: "/admin/cms/#/collections/settings",
    icon: Settings,
    accent: "text-slate-300",
  },
];

export default function AdminPage() {
  const site = getSiteConfig();
  const counts = {
    events: getEvents().length,
    guides: getGuides().length,
    strategies: getStrategies().length,
    faq: getFaq().length,
    calendar: getCalendarEvents().length,
    gallery: getGallery().length,
  };

  return (
    <>
      <PageHeader
        eyebrow="Alliance command console · restricted"
        title="Content operations"
        description="Edit pages, upload screenshots, replace imagery, update event schedules and manage FAQ entries. The studio commits content to Git and triggers a rebuild — no code editing required for day-to-day updates."
        crumbs={[{ label: "Admin" }]}
      >
        <div className="flex flex-wrap gap-2">
          <Badge>
            <Lock className="size-3" /> Noindex · internal
          </Badge>
          <Badge variant="secondary">
            <Database className="size-3" /> Git-backed content
          </Badge>
          <Badge variant="outline">Decap CMS v3</Badge>
        </div>
      </PageHeader>

      <section className="container-page py-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Event files", value: counts.events, href: "/events/" },
            { label: "Field guides", value: counts.guides, href: "/guides/" },
            { label: "Strategy briefs", value: counts.strategies, href: "/strategies/" },
            { label: "Calendar entries", value: counts.calendar, href: "/calendar/" },
            { label: "FAQ answers", value: counts.faq, href: "/faq/" },
            { label: "Gallery images", value: counts.gallery, href: "/gallery/" },
            { label: "Indexed entries", value: 112, href: "/search/" },
            { label: "Server identity", value: "1", href: "/admin/cms/#/collections/settings" },
          ].map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              prefetch={stat.href.startsWith("/admin/cms") ? false : undefined}
              className="group rounded-md border border-border/70 bg-card/40 p-4 transition-colors hover:border-primary/40"
            >
              <p className="font-display text-3xl leading-none text-foreground group-hover:text-primary-soft">
                {String(stat.value).padStart(2, "0")}
              </p>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/60">
                {stat.label}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3 rounded-md border border-warning/25 bg-warning/[0.045] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <Wrench className="mt-0.5 size-4 shrink-0 text-warning" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-warning">
                One-time production setup required
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Local editing works immediately with <code className="text-primary">npm run decap</code>.
                Production publishing needs the GitHub repository and OAuth details in{" "}
                <code className="text-primary">public/admin/cms/config.yml</code>.
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="shrink-0 self-start sm:self-auto">
            <Link href="/admin/#setup">
              Setup steps <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow mb-1">Content studio</p>
            <h2 className="font-display text-2xl uppercase tracking-wide text-foreground">
              Open the editor
            </h2>
          </div>
          <Button asChild size="lg">
            {/* Decap lives in /public, so there is no RSC payload to prefetch. */}
            <Link href="/admin/cms/" prefetch={false}>
              <ExternalLink className="size-4" /> Launch Decap CMS
            </Link>
          </Button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <Link
              key={collection.name}
              href={collection.href}
              prefetch={false}
              className="group flex items-start gap-3 rounded-md border border-border/70 bg-card/40 p-4 transition-colors hover:border-primary/40"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-border bg-background/60">
                <collection.icon className={`size-4 ${collection.accent}`} />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1.5 text-sm font-medium text-foreground group-hover:text-primary-soft">
                  {collection.name}
                  <ArrowRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
                <span className="mt-1 block text-[11px] leading-relaxed text-muted-foreground">
                  {collection.description}
                </span>
              </span>
            </Link>
          ))}
        </div>

        <div id="setup" className="mt-10 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-md border border-border/70 bg-card/40 p-5">
            <p className="eyebrow mb-2">Workflow</p>
            <h2 className="font-display text-2xl uppercase tracking-wide text-foreground">
              Publish without touching code
            </h2>
            <ol className="mt-4 space-y-4">
              {[
                {
                  title: "Open the content studio",
                  copy: "Sign in with the GitHub account that has write access to the repository. Locally, run npm run decap in a second terminal.",
                },
                {
                  title: "Edit the collection",
                  copy: "Choose events, guides, strategies, calendar, gallery or FAQ. Structured fields keep pages consistent and valid.",
                },
                {
                  title: "Upload screenshots",
                  copy: "Use the image field inside a page or the gallery collection. Files land in public/images/uploads and are referenced automatically.",
                },
                {
                  title: "Review the preview",
                  copy: "Check the date, source label and verification status. Never publish an unverified schedule as confirmed.",
                },
                {
                  title: "Publish and verify",
                  copy: "The CMS commits to Git. Vercel or Cloudflare Pages rebuilds, then open the live page on mobile and desktop.",
                },
              ].map((step, index) => (
                <li key={step.title} className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-primary/40 bg-primary/10 font-mono text-[9px] text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-xs font-medium text-foreground">{step.title}</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{step.copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-4">
            <div className="rounded-md border border-border/70 bg-card/40 p-4">
              <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
                <Camera className="size-3.5" /> Screenshot standards
              </p>
              <ul className="mt-2.5 space-y-2 text-[11px] leading-relaxed text-muted-foreground">
                <li>• Capture the full event screen, not a cropped score number.</li>
                <li>• Include the phase/theme and timer where relevant.</li>
                <li>• Remove or blur player names if privacy matters.</li>
                <li>• Add a caption, category and at least three tags.</li>
                <li>• Date the capture in the credit or caption.</li>
              </ul>
            </div>
            <div className="rounded-md border border-border/70 bg-card/40 p-4">
              <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
                <Upload className="size-3.5" /> Local editing
              </p>
              <div className="mt-2 space-y-1.5 font-mono text-[10px] text-muted-foreground">
                <p>$ npm run decap</p>
                <p>$ npm run dev</p>
                <p className="text-muted-foreground/50">Open /admin/cms/ → login</p>
              </div>
              <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground/60">
                The local backend writes directly to the working tree. Commit and push when the edit is ready.
              </p>
            </div>
            <div className="rounded-md border border-border/70 bg-card/40 p-4">
              <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
                <ShieldCheck className="size-3.5" /> Roles
              </p>
              <ul className="mt-2 space-y-1.5 text-[11px] text-muted-foreground">
                <li>• Commander — publish authority</li>
                <li>• Phase captain — event notes</li>
                <li>• Archivist — screenshots and reports</li>
                <li>• Analyst — calendar and scoring data</li>
              </ul>
              <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground/50">
                Decap permissions follow GitHub repository access. For per-page roles, see the future member
                portal plan.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <div className="rounded-md border border-border/70 bg-card/40 p-5">
            <p className="eyebrow mb-2">Production setup</p>
            <h2 className="font-display text-2xl uppercase tracking-wide text-foreground">
              Decap CMS checklist
            </h2>
            <ul className="mt-3 space-y-2.5 text-xs leading-relaxed text-muted-foreground">
              {[
                "Create or use a GitHub repository for this project.",
                "Set backend.repo in public/admin/cms/config.yml.",
                "Create a GitHub OAuth app and deploy an OAuth proxy (see docs/DEPLOYMENT.md).",
                "Set backend.base_url to the proxy URL and update site_url.",
                "Invite editors as repository collaborators.",
                "Set NEXT_PUBLIC_SITE_URL in Vercel / Cloudflare Pages.",
                "Test a draft edit, publish, wait for the rebuild, then verify the live page.",
              ].map((item) => (
                <li key={item} className="flex gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary/60" />
                  {item}
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href="/admin/cms/" prefetch={false}>
                Open studio <ExternalLink className="size-3.5" />
              </Link>
            </Button>
          </div>

          <div className="rounded-md border border-border/70 bg-card/40 p-5">
            <p className="eyebrow mb-2">Roadmap</p>
            <h2 className="font-display text-2xl uppercase tracking-wide text-foreground">
              Built for what comes next
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              The content layer is separated from the presentation layer. Adding a database, accounts or
              calculators does not require rebuilding the wiki.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {[
                "Contribution calculator",
                "Survival Battle planner",
                "Event overlap calculator",
                "Hero upgrade calculator",
                "Resource planner",
                "Troop training calculator",
                "Member portal",
                "Discord integration",
                "Push notifications",
                "Update tracker",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-sm border border-border/60 bg-background/40 px-2 py-1.5 font-mono text-[9px] uppercase tracking-[0.06em] text-muted-foreground/70"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary">
                <Database className="size-3" /> Supabase schema
              </Badge>
              <Badge variant="secondary">
                <Users className="size-3" /> Roles ready
              </Badge>
              <Badge variant="secondary">
                <Layers className="size-3" /> Repository abstraction
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-md border border-primary/20 bg-primary/[0.035] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <BrandWordmark
                className="hidden h-11 w-auto shrink-0 drop-shadow-[0_0_16px_rgba(74,222,128,0.2)] sm:block"
                sizes="180px"
              />
              <div>
                <p className="font-display text-2xl uppercase tracking-wide text-foreground">
                  {site.allianceName} content owner
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {site.allianceName} ({site.callsign}) · {site.server} · Last content review{" "}
                  {site.updated}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Contact: <a className="text-primary" href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <a href={site.discordUrl} target="_blank" rel="noreferrer">
                  Discord command <ExternalLink className="size-3.5" />
                </a>
              </Button>
              <Button asChild>
                <Link href="/admin/cms/" prefetch={false}>
                  Open studio
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
