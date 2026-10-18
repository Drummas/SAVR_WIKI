import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock,
  Crosshair,
  Database,
  Flag,
  Gauge,
  Hammer,
  Layers,
  Radio,
  RefreshCw,
  Shield,
  Swords,
  Target,
  Timer,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { CategoryIcon } from "@/components/category-icon";
import { ContentSection } from "@/components/content/content-section";
import { JsonLd } from "@/components/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSiteConfig } from "@/lib/content";
import { avaSections } from "@/lib/navigation";
import { articleSchema, breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Alliance vs Alliance Command Centre",
  description:
    "The full Alliance Duel playbook: scoring categories, six-day phase plan, event overlap windows, upgrade planning, speed-up management and alliance coordination.",
  path: "/alliance-vs-alliance/",
  keywords: [
    "Alliance vs Alliance",
    "Alliance Duel scoring",
    "AvA overlap",
    "alliance coordination",
    "Last Asylum AvA",
  ],
  type: "article",
});

const scoringRows = [
  {
    phase: "Raven",
    day: "Monday",
    sources: "Raven upgrades, Raven items, Raven stamina",
    stockpile: "Raven materials, stamina",
    priority: "High",
    risk: "Opening stamina before the score window",
  },
  {
    phase: "Construction",
    day: "Tuesday",
    sources: "Build completions, construction speed-ups, building Might",
    stockpile: "Staged timers, instant finishes",
    priority: "Core",
    risk: "Timer finishing outside the phase",
  },
  {
    phase: "Tech",
    day: "Wednesday",
    sources: "Research completions, research Might, research chests",
    stockpile: "Research speed-ups, chests",
    priority: "Core",
    risk: "Starting a long node too late",
  },
  {
    phase: "Hero",
    day: "Thursday",
    sources: "Recruitment, hero shards, skill upgrades",
    stockpile: "Shards, recruitment items",
    priority: "High",
    risk: "Chasing a banner with no roster plan",
  },
  {
    phase: "Preparation",
    day: "Friday",
    sources: "Troop training, upgrades, training speed-ups",
    stockpile: "Training speed-ups, resources",
    priority: "High",
    risk: "Queue capacity and healing costs",
  },
  {
    phase: "Raid",
    day: "Saturday",
    sources: "PvP defeats, losses inflicted, combat actions",
    stockpile: "Stamina, heal speed-ups, rally readiness",
    priority: "Core",
    risk: "Uncoordinated rallies and no second wave",
  },
];

const phases = [
  {
    code: "P1",
    name: "Preparation",
    timing: "T-7 → Monday reset",
    icon: Database,
    color: "text-teal-300",
    summary:
      "Collect stockpiles, verify the live phase order and publish the written plan. No discretionary completions.",
    actions: [
      "Matchmaking eligibility and phase order confirmed",
      "Member stockpile snapshots collected",
      "Phase captains and backups assigned",
      "Spend ceilings and closer reserve published",
    ],
  },
  {
    code: "P2",
    name: "Resource accumulation",
    timing: "Monday → Thursday",
    icon: Layers,
    color: "text-lime-300",
    summary:
      "Spend inside the first three phases while protecting the reserve. Accumulate completed actions for the later, more contested phases.",
    actions: [
      "Stage long timers for Friday and Saturday",
      "Claim Survival Battle overlap actions",
      "Post a 12-hour status update with score deltas",
      "Do not empty any stockpile before Friday",
    ],
  },
  {
    code: "P3",
    name: "Overlap window",
    timing: "Daily, phase + round intersections",
    icon: Zap,
    color: "text-primary",
    summary:
      "The intersection of an Alliance Duel phase and a Survival Battle round theme. One action, two scoreboards.",
    actions: [
      "Confirm both live event screens before spending",
      "Use the cheapest action that clears both thresholds",
      "Screenshot both scoreboards before and after",
      "Stop if the action was not already in the roster plan",
    ],
  },
  {
    code: "P4",
    name: "Execution",
    timing: "Friday → Saturday final hour",
    icon: Swords,
    color: "text-red-300",
    summary:
      "Release the phase budget, run coordinated rallies and hold the closer reserve until the commander calls it.",
    actions: [
      "One caller, one target list, one channel",
      "Second wave and healing reserve ready",
      "Final-hour closer releases the reserve",
      "No discretionary upgrades after the call",
    ],
  },
  {
    code: "P5",
    name: "Reward collection",
    timing: "After the final phase → T+24h",
    icon: Trophy,
    color: "text-emerald-300",
    summary:
      "Claim, screenshot and archive. Turn the result into a conversion table and one process change for next week.",
    actions: [
      "Screenshot final score before reset",
      "Claim rewards and confirm every member received them",
      "Log points per phase and spend per phase",
      "Write one process change and assign an owner",
    ],
  },
];

const overlapWeeks = [
  {
    label: "Monday",
    ava: "Raven",
    sb: "Build / training rotation",
    overlap: "Stamina + Raven action",
    value: "Medium",
  },
  {
    label: "Tuesday",
    ava: "Construction",
    sb: "Research / build rotation",
    overlap: "Staged construction finish",
    value: "High",
  },
  {
    label: "Wednesday",
    ava: "Tech",
    sb: "Research / hero rotation",
    overlap: "Research completion",
    value: "High",
  },
  {
    label: "Thursday",
    ava: "Hero",
    sb: "Hero / Raven rotation",
    overlap: "Planned hero breakpoint",
    value: "High",
  },
  {
    label: "Friday",
    ava: "Preparation",
    sb: "Training rotation",
    overlap: "Training batch",
    value: "High",
  },
  {
    label: "Saturday",
    ava: "Raid",
    sb: "Combat rotation",
    overlap: "Rally + heal reserve",
    value: "Medium",
  },
  {
    label: "Sunday",
    ava: "Close / review",
    sb: "New cycle",
    overlap: "Documentation only",
    value: "Low",
  },
];

const dailyPlan = [
  {
    day: "Monday",
    primary: "Raven",
    action: "Spend saved Raven materials; open the week with measured pressure",
    reserve: "Keep 80% of hero and troop stockpiles",
    call: "Publish phase target before reset",
  },
  {
    day: "Tuesday",
    primary: "Construction",
    action: "Complete staged builds inside the phase; use queue fillers",
    reserve: "Keep instant finishes for the final hour",
    call: "Confirm timer completion times",
  },
  {
    day: "Wednesday",
    primary: "Tech",
    action: "Finish staged research; claim research chests inside the phase",
    reserve: "Hold research speed-ups for the closer",
    call: "Tech captain posts score delta",
  },
  {
    day: "Thursday",
    primary: "Hero",
    action: "Complete one planned breakpoint; no banner chasing",
    reserve: "Keep universal shards for next roster slot",
    call: "Check opponent score before spending",
  },
  {
    day: "Friday",
    primary: "Preparation",
    action: "Train the planned batch; keep a defence force at home",
    reserve: "Hold heal speed-ups for Raid",
    call: "Rally brief issued for Saturday",
  },
  {
    day: "Saturday",
    primary: "Raid",
    action: "Execute rallies, second wave, close with the reserve",
    reserve: "Closer releases only on commander's call",
    call: "Final-hour score updates every 10 min",
  },
  {
    day: "Sunday",
    primary: "Review",
    action: "Claim, screenshot, log and rebuild",
    reserve: "Rebuild next week's floor before reset",
    call: "Publish after-action note",
  },
];

const prepTimeline = [
  { day: "T-7", label: "Verify", detail: "Capture live rules, phase order and point preview. Update the page if it changed." },
  { day: "T-5", label: "Snapshot", detail: "Collect member stockpiles, roster gaps and speed-up counts." },
  { day: "T-3", label: "Plan", detail: "Publish phase targets, spend ceilings, captains and closer reserve." },
  { day: "T-1", label: "Freeze", detail: "No discretionary completions. Stage timers for scored windows." },
  { day: "T-0", label: "Execute", detail: "Open with measured pressure. Protect the reserve." },
  { day: "T+1", label: "Review", detail: "Archive screenshots and write one process change." },
];

const errorRows = [
  ["Completing a build or research outside its phase", "Staged timer finishing too early", "Check completion time before starting; use a filler"],
  ["Emptying stockpiles on Monday", "Early pressure mistaken for winning", "Hard spend ceiling per phase"],
  ["No named Raid caller", "Duplicate rallies and wasted stamina", "Primary and backup caller in the brief"],
  ["Punishing low-power members", "Contribution measured only by raw score", "Track scouting, logistics and reinforcement"],
  ["Changing the plan mid-event", "No authority or stop condition", "One commander, one written decision log"],
  ["Skipping the review", "Same loss repeats next week", "15-minute after-action within 24 hours"],
];

export default function AllianceVsAlliancePage() {
  const site = getSiteConfig();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Alliance vs Alliance", path: "/alliance-vs-alliance/" },
          ]),
          articleSchema({
            title: "Alliance vs Alliance Command Centre",
            description:
              "Scoring categories, overlap windows, phase plans and coordination doctrine for Alliance Duel.",
            path: "/alliance-vs-alliance/",
            updated: "2026-10-18",
            category: "Alliance vs Alliance",
          }),
        ]}
      />

      <header className="relative overflow-hidden border-b border-border/60 pt-7">
        <div className="pointer-events-none absolute inset-0 bg-tactical-grid bg-grid opacity-70" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-hero-glow" aria-hidden="true" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        <div className="container-page relative pb-10 pt-2">
          <Breadcrumbs items={[{ label: "Alliance vs Alliance" }]} className="mb-7" />
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end">
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge>
                  <Swords className="size-3" /> Command centre
                </Badge>
                <Badge variant="secondary">Community-sourced structure</Badge>
                <Badge variant="outline">Updated 18 Oct 2026</Badge>
              </div>
              <h1 className="max-w-4xl font-display text-5xl uppercase leading-[0.88] tracking-wide text-foreground sm:text-6xl lg:text-7xl">
                Win the week,
                <br />
                <span className="text-gradient-toxic">not the hour.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground pretty sm:text-base">
                Alliance Duel is six days of resource conversion. This is the full playbook: scoring map,
                five-phase plan, Survival Battle overlap windows, upgrade sequencing and the coordination
                doctrine that keeps the closer reserve alive.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button asChild>
                  <Link href="#scoring">
                    Jump to scoring <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/events/alliance-vs-alliance/">
                    Event guide <CategoryIcon category="Alliance vs Alliance" className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link href="/calendar/">
                    <CalendarDays className="size-4" /> Calendar
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Scoring days", value: "06", note: "Mon–Sat phases" },
                { label: "Plan stages", value: "05", note: "Prep → review" },
                { label: "Closer reserve", value: "10–20%", note: "Held to final hour" },
                { label: "Unplanned spend", value: "0", note: "The only target" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="hud-corners rounded-md border border-border/70 bg-card/60 p-4 backdrop-blur"
                >
                  <p className="font-display text-2xl uppercase leading-none text-emerald-200 sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-foreground/70">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground/60">{stat.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {avaSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="shrink-0 rounded-sm border border-border/70 bg-background/50 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {section.label}
              </a>
            ))}
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-sm border border-lime-500/25 bg-lime-500/[0.045] px-3.5 py-2.5 text-[11px] leading-relaxed text-lime-200/90">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
            Phase order, point values and eligibility are community-reported and version-sensitive. Verify
            both live event screens before any spend. The command centre is a decision framework, not an
            official rulebook.
          </div>
        </div>
      </header>

      <div className="container-page py-10">
        <div className="mx-auto max-w-5xl space-y-12">
          <ContentSection id="overview" index={1} title="How Alliance vs Alliance works">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: Swords,
                  title: "Six scoring days",
                  copy: "A new theme each day, reported Monday–Saturday. Each phase rewards a different stockpile.",
                },
                {
                  icon: Gauge,
                  title: "Conversion contest",
                  copy: "The winner is not the biggest account. It is the alliance that converts limited stockpiles most efficiently.",
                },
                {
                  icon: Shield,
                  title: "Reserve game",
                  copy: "The closer reserve is the option to respond to the final scoreboard. Spend it early and you lose that option.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-md border border-border/70 bg-card/40 p-4">
                  <item.icon className="size-5 text-primary" />
                  <h3 className="mt-3 font-display text-lg uppercase tracking-wide text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{item.copy}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-md border border-border/70 bg-card/30 p-5">
              <p className="eyebrow-muted mb-2">Win conditions</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-foreground">Visible</p>
                  <ul className="mt-1.5 space-y-1.5 text-[11px] text-muted-foreground">
                    <li>• Daily phase wins and accumulated duel points</li>
                    <li>• Placement / alliance reward tier</li>
                    <li>• Personal contribution ranking</li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">Invisible until later</p>
                  <ul className="mt-1.5 space-y-1.5 text-[11px] text-muted-foreground">
                    <li>• Stockpile health after the duel</li>
                    <li>• Member burnout and participation drop</li>
                    <li>• Conversion data for the next cycle</li>
                  </ul>
                </div>
              </div>
            </div>
          </ContentSection>

          <ContentSection
            id="scoring"
            index={2}
            title="Scoring categories"
            description="Community-reported phase map. Use it to allocate stockpiles, then replace the details with your live point preview."
          >
            <div className="overflow-hidden rounded-md border border-border/70">
              <div className="hidden grid-cols-[0.7fr_0.6fr_1.4fr_1fr_0.5fr] gap-3 border-b border-border bg-secondary/50 px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/70 lg:grid">
                <span>Phase</span>
                <span>Day</span>
                <span>Reported sources</span>
                <span>Stockpile</span>
                <span>Priority</span>
              </div>
              {scoringRows.map((row) => (
                <div
                  key={row.phase}
                  className="grid gap-2 border-b border-border/40 px-4 py-3.5 last:border-0 lg:grid-cols-[0.7fr_0.6fr_1.4fr_1fr_0.5fr] lg:items-start lg:gap-3"
                >
                  <div className="flex items-center justify-between gap-2 lg:block">
                    <p className="text-xs font-semibold text-foreground">{row.phase}</p>
                    <Badge variant={row.priority === "Core" ? "default" : "secondary"} className="lg:hidden">
                      {row.priority}
                    </Badge>
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground/70">
                    {row.day}
                  </p>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">{row.sources}</p>
                  <div>
                    <p className="text-[11px] text-muted-foreground">{row.stockpile}</p>
                    <p className="mt-1 text-[10px] text-red-300/70">Risk: {row.risk}</p>
                  </div>
                  <span className="hidden lg:block">
                    <Badge variant={row.priority === "Core" ? "default" : "secondary"}>
                      {row.priority}
                    </Badge>
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-sm border border-primary/20 bg-primary/[0.035] p-4">
                <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
                  <Crosshair className="size-3" /> Efficiency rule
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Spend the cheapest action that clears the next threshold. Points per speed-up matters more
                  than raw points, especially in the final hour.
                </p>
              </div>
              <div className="rounded-sm border border-border/60 bg-card/30 p-4">
                <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-foreground/70">
                  <BarChart3 className="size-3" /> Measure it
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Log points and spend per phase. Without a ledger, every plan is an opinion. A 5% efficiency
                  gain across six phases is a reliable rank improvement.
                </p>
              </div>
            </div>
          </ContentSection>

          <ContentSection
            id="phases"
            index={3}
            title="The five-phase plan"
            description="Preparation → Resource accumulation → Overlap window → Execution → Reward collection."
          >
            <div className="space-y-3">
              {phases.map((phase) => (
                <div
                  key={phase.code}
                  className="relative grid gap-4 rounded-md border border-border/70 bg-card/40 p-4 sm:grid-cols-[170px_1fr] sm:p-5"
                >
                  <div className="flex items-start gap-3 sm:block">
                    <phase.icon className={`size-5 ${phase.color}`} />
                    <div className="mt-0 sm:mt-3">
                      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/60">
                        {phase.code}
                      </p>
                      <p className="font-display text-lg uppercase leading-tight tracking-wide text-foreground">
                        {phase.name}
                      </p>
                      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-primary/60">
                        {phase.timing}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs leading-relaxed text-muted-foreground">{phase.summary}</p>
                    <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                      {phase.actions.map((action) => (
                        <li key={action} className="flex gap-2 text-[11px] text-muted-foreground">
                          <CheckCircle2 className="mt-0.5 size-3 shrink-0 text-primary/60" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </ContentSection>

          <ContentSection
            id="overlap"
            index={4}
            title="Overlap window strategy"
            description="One action, two scoreboards. The overlap is an allocation problem, not a spending permission."
          >
            <div className="rounded-md border border-primary/25 bg-gradient-to-br from-primary/[0.07] to-transparent p-5">
              <p className="eyebrow mb-2">The formula</p>
              <p className="font-display text-2xl uppercase leading-tight tracking-wide text-foreground sm:text-3xl">
                One action × two live scoreboards = overlap value
              </p>
              <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground">
                Only spend when the live event screens both reward the action, the action is already in your
                account plan, and the spend does not breach the closer reserve. If any condition fails, it is
                not an overlap — it is an excuse.
              </p>
            </div>

            <div className="mt-5 overflow-x-auto rounded-md border border-border/70">
              <table className="w-full min-w-[640px] text-left text-xs">
                <thead className="bg-secondary/50 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/70">
                  <tr>
                    <th className="px-4 py-2.5 font-normal">Day</th>
                    <th className="px-4 py-2.5 font-normal">AvA phase</th>
                    <th className="px-4 py-2.5 font-normal">Survival Battle theme</th>
                    <th className="px-4 py-2.5 font-normal">Overlap action</th>
                    <th className="px-4 py-2.5 font-normal">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {overlapWeeks.map((row) => (
                    <tr key={row.label} className="border-t border-border/40">
                      <td className="px-4 py-3 font-mono text-[10px] uppercase text-foreground/80">
                        {row.label}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{row.ava}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.sb}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.overlap}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            row.value === "High" ? "default" : row.value === "Medium" ? "secondary" : "outline"
                          }
                        >
                          {row.value}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/50">
              Template map · fill in the live themes each week
            </p>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="rounded-md border border-border/70 bg-card/40 p-4">
                <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
                  Overlap decision flow
                </p>
                <div className="space-y-2">
                  {[
                    "Do both live boards reward the action?",
                    "Is the action already in the account plan?",
                    "Is the cheapest threshold action available?",
                    "Will the spend breach the closer reserve?",
                  ].map((question, index) => (
                    <div key={question} className="flex items-start gap-2.5">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-sm border border-border bg-background font-mono text-[9px] text-primary">
                        {index + 1}
                      </span>
                      <p className="text-[11px] leading-relaxed text-muted-foreground">{question}</p>
                      <span className="ml-auto shrink-0 font-mono text-[9px] uppercase text-muted-foreground/40">
                        {index === 3 ? "stop" : "next"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-md border border-border/70 bg-card/40 p-4">
                <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
                  Weekly overlap grid
                </p>
                <div className="grid grid-cols-8 gap-1">
                  <div />
                  {overlapWeeks.map((day) => (
                    <div
                      key={day.label}
                      className="text-center font-mono text-[8px] uppercase tracking-wider text-muted-foreground/60"
                    >
                      {day.label.slice(0, 3)}
                    </div>
                  ))}
                  <div className="flex items-center font-mono text-[8px] uppercase text-muted-foreground/60">
                    AvA
                  </div>
                  {overlapWeeks.map((day) => (
                    <div
                      key={`${day.label}-ava`}
                      className="flex h-8 items-center justify-center rounded-sm border border-primary/20 bg-primary/10 font-mono text-[8px] text-emerald-300"
                    >
                      {day.ava.slice(0, 4)}
                    </div>
                  ))}
                  <div className="flex items-center font-mono text-[8px] uppercase text-muted-foreground/60">
                    SB
                  </div>
                  {overlapWeeks.map((day) => (
                    <div
                      key={`${day.label}-sb`}
                      className="flex h-8 items-center justify-center rounded-sm border border-teal-500/20 bg-teal-500/10 font-mono text-[8px] text-teal-300"
                    >
                      {day.value === "High" ? "HIGH" : "MED"}
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground/60">
                  Green = AvA phase, teal = Survival Battle theme. Both must be confirmed live before the
                  intersection counts.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 rounded-md border border-primary/20 bg-primary/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-relaxed text-muted-foreground">
                Need the full weekly method, decision tree and worked example?
              </p>
              <Button asChild size="sm">
                <Link href="/strategies/survival-battle-overlap/">
                  Open overlap strategy <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </ContentSection>

          <ContentSection
            id="planning"
            index={5}
            title="Upgrade & stockpile planning"
            description="Align queued actions with the phase that scores them. The goal is a completion inside the window, not a faster account."
          >
            <div className="overflow-x-auto rounded-md border border-border/70">
              <table className="w-full min-w-[620px] text-left text-xs">
                <thead className="bg-secondary/50 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/70">
                  <tr>
                    <th className="px-4 py-2.5 font-normal">System</th>
                    <th className="px-4 py-2.5 font-normal">Stage this</th>
                    <th className="px-4 py-2.5 font-normal">AvA phase</th>
                    <th className="px-4 py-2.5 font-normal">Do not</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Construction", "14–24h build with 1h left at phase start", "Construction", "Finish it the night before"],
                    ["Research", "Long node with a small speed-up gap", "Tech", "Start a 3-day node on Wednesday"],
                    ["Heroes", "One planned breakpoint, shards ready", "Hero", "Chase the newest banner"],
                    ["Troops", "Batch sized to queue capacity", "Preparation", "Empty healing reserve"],
                    ["Raven", "Materials and stamina held", "Raven", "Spend outside the phase"],
                    ["Combat", "Rally leads, second wave, heal reserve", "Raid", "Revenge with no objective"],
                  ].map((row) => (
                    <tr key={row[0]} className="border-t border-border/40">
                      <td className="px-4 py-3 font-medium text-foreground">{row[0]}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row[1]}</td>
                      <td className="px-4 py-3 font-mono text-[10px] uppercase text-emerald-300/70">
                        {row[2]}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground/70">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border border-border/60 bg-card/30 p-4">
                <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
                  <Timer className="size-3" /> Speed-up management
                </p>
                <ul className="mt-2 space-y-1.5 text-[11px] text-muted-foreground">
                  <li>• Keep instant finishes for the final hour.</li>
                  <li>• Never use speed-ups to clear a queue for convenience.</li>
                  <li>• Budget by phase, not by total stock.</li>
                  <li>• Log speed-ups spent per 100 points.</li>
                </ul>
              </div>
              <div className="rounded-md border border-border/60 bg-card/30 p-4">
                <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
                  <RefreshCw className="size-3" /> Reset hygiene
                </p>
                <ul className="mt-2 space-y-1.5 text-[11px] text-muted-foreground">
                  <li>• Freeze non-scoring completions at Sunday reset.</li>
                  <li>• Re-stage queues after the final phase.</li>
                  <li>• Rebuild the reserve before the next reset.</li>
                  <li>• Update the conversion table while data is fresh.</li>
                </ul>
              </div>
            </div>
          </ContentSection>

          <ContentSection
            id="coordination"
            index={6}
            title="Alliance coordination"
            description="One commander, one plan, one channel. Structure beats charisma over a six-day event."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-md border border-border/70 bg-card/40 p-4">
                <p className="eyebrow-muted mb-3">Role sheet</p>
                <div className="space-y-3">
                  {[
                    ["Commander", "Final call on allocation and the closer reserve."],
                    ["Phase captain", "Owns one phase target, score delta and final-hour spend."],
                    ["Archivist", "Captures boards, battle reports and the after-action note."],
                    ["Analyst", "Maintains the points/spend ledger and conversion table."],
                    ["Members", "Stage actions, follow the call, report results."],
                  ].map(([role, duty]) => (
                    <div key={role} className="flex gap-3">
                      <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-primary/70" />
                      <p className="text-[11px] leading-relaxed text-muted-foreground">
                        <span className="font-medium text-foreground">{role}:</span> {duty}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-md border border-border/70 bg-card/40 p-4">
                <p className="eyebrow-muted mb-3">Communication cadence</p>
                <div className="space-y-2.5">
                  {[
                    ["T-24h", "Phase plan, spend ceiling and captain posted"],
                    ["Phase open", "Target confirmed; score baseline posted"],
                    ["Mid-phase", "Score delta and one adjustment"],
                    ["Final hour", "Closer call; 10-minute updates"],
                    ["T+24h", "After-action note and conversion entry"],
                  ].map(([time, action]) => (
                    <div key={time} className="flex items-start gap-3">
                      <span className="w-16 shrink-0 font-mono text-[9px] uppercase tracking-[0.1em] text-primary/70">
                        {time}
                      </span>
                      <p className="text-[11px] leading-relaxed text-muted-foreground">{action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-md border border-border/70 bg-card/40 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="eyebrow-muted">Participation comparison</p>
                <span className="font-mono text-[9px] uppercase text-muted-foreground/50">
                  Template targets
                </span>
              </div>
              <div className="space-y-2.5">
                {[
                  ["Preparation", 90],
                  ["Raven", 65],
                  ["Construction", 80],
                  ["Tech", 80],
                  ["Hero", 70],
                  ["Raid", 95],
                ].map(([label, value]) => (
                  <div key={label as string} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 font-mono text-[9px] uppercase tracking-wide text-muted-foreground/70">
                      {label}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-mono text-[9px] text-primary/80">{value}%</span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground/50">
                Illustrative participation targets, not official thresholds. Replace with your alliance&apos;s
                own tracked attendance.
              </p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Users, title: "Build depth", copy: "Train a backup for every critical role. A single caller is a single point of failure." },
                { icon: Radio, title: "One channel", copy: "One pinned plan, one caller, one score thread. More channels create more noise." },
                { icon: Activity, title: "Measure effort", copy: "Scouting, logistics and reinforcement are contribution. Publish them." },
              ].map((item) => (
                <div key={item.title} className="rounded-sm border border-border/60 bg-card/30 p-3.5">
                  <item.icon className="size-4 text-primary" />
                  <p className="mt-2 font-display text-base uppercase tracking-wide text-foreground">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">{item.copy}</p>
                </div>
              ))}
            </div>
          </ContentSection>

          <ContentSection
            id="daily-plan"
            index={7}
            title="Daily action plan"
            description="A printable rhythm for the six scoring days, plus a Sunday reset."
          >
            <div className="space-y-2">
              {dailyPlan.map((day) => (
                <div
                  key={day.day}
                  className="grid gap-3 rounded-md border border-border/70 bg-card/40 p-4 sm:grid-cols-[92px_1fr]"
                >
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/60">
                      {day.day}
                    </p>
                    <p className="mt-0.5 font-display text-lg uppercase tracking-wide text-emerald-200">
                      {day.primary}
                    </p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-primary/60">Action</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{day.action}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-primary/60">Reserve</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{day.reserve}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-primary/60">Comms</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{day.call}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-md border border-border/70 bg-card/40 p-4">
              <p className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
                <CalendarDays className="size-3.5" /> Weekly preparation timeline
              </p>
              <div className="relative">
                <div className="absolute left-[7px] top-1 h-[calc(100%-8px)] w-px bg-border sm:left-0 sm:top-[7px] sm:h-px sm:w-full" />
                <div className="grid gap-4 sm:grid-cols-6">
                  {prepTimeline.map((item) => (
                    <div key={item.day} className="relative pl-6 sm:pl-0 sm:pt-6">
                      <span className="absolute left-0 top-1 size-3.5 rounded-full border border-primary/60 bg-background sm:left-1/2 sm:-translate-x-1/2 sm:top-0" />
                      <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-primary/70">
                        {item.day}
                      </p>
                      <p className="mt-0.5 text-xs font-medium text-foreground">{item.label}</p>
                      <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ContentSection>

          <ContentSection
            id="errors"
            index={8}
            title="Common errors & strategy cards"
            className="scroll-mb-20"
          >
            <div className="overflow-hidden rounded-md border border-border/70">
              <div className="hidden grid-cols-[1.2fr_1fr_1fr] gap-3 border-b border-border bg-secondary/50 px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/70 sm:grid">
                <span>Error</span>
                <span>Why it happens</span>
                <span>Countermeasure</span>
              </div>
              {errorRows.map((row) => (
                <div
                  key={row[0]}
                  className="grid gap-1 border-b border-border/40 px-4 py-3 last:border-0 sm:grid-cols-[1.2fr_1fr_1fr] sm:gap-3"
                >
                  <p className="text-xs font-medium text-foreground">{row[0]}</p>
                  <p className="text-[11px] text-muted-foreground">{row[1]}</p>
                  <p className="text-[11px] text-muted-foreground">{row[2]}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                {
                  icon: Target,
                  title: "Saving resource expenditure",
                  copy: "Define a floor, freeze discretionary completions, and stage timers. The stockpile is the strategy.",
                },
                {
                  icon: Users,
                  title: "Synchronising with leadership",
                  copy: "Wait for the written call. A solo spend that lands outside the plan is not initiative; it is lost coordination.",
                },
                {
                  icon: Zap,
                  title: "Using overlap windows",
                  copy: "Confirm both live boards, then spend once for two scores. If either board disagrees, do not spend.",
                },
                {
                  icon: Shield,
                  title: "Protecting the closer reserve",
                  copy: "Hold 10–20% until the final hour. The reserve is the ability to answer the opponent's last move.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="hud-corners rounded-md border border-primary/20 bg-primary/[0.035] p-4"
                >
                  <card.icon className="size-4 text-primary" />
                  <p className="mt-2 font-display text-lg uppercase tracking-wide text-foreground">
                    {card.title}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{card.copy}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Hammer, title: "Build", copy: "Staged completions, no Sunday spending." },
                { icon: Flag, title: "Score", copy: "One action, two boards, logged and verified." },
                { icon: Trophy, title: "Review", copy: "Archive, convert, improve one process." },
              ].map((item) => (
                <div key={item.title} className="rounded-sm border border-border/60 bg-card/30 p-3.5">
                  <item.icon className="size-4 text-primary/80" />
                  <p className="mt-2 font-display text-base uppercase tracking-wide text-foreground">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">{item.copy}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-md border border-primary/25 bg-gradient-to-r from-primary/[0.08] to-transparent p-5 sm:flex-row sm:items-center">
              <div>
                <p className="font-display text-2xl uppercase tracking-wide text-foreground">
                  Put the command centre to work
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {site.allianceName} · {site.server}. Publish the phase plan before Monday reset.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild>
                  <Link href="/calendar/">
                    Open event clock <Clock className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/strategies/survival-battle-overlap/">Overlap guide</Link>
                </Button>
              </div>
            </div>
          </ContentSection>
        </div>
      </div>
    </>
  );
}
