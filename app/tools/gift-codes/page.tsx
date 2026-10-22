import type { Metadata } from "next";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Gift,
  Mail,
  RefreshCw,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

import { GiftCodeList } from "@/components/tools/gift-code-list";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { getGiftCodes, getSiteConfig } from "@/lib/content";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Gift Codes",
  description:
    "Active Last Asylum: Plague gift codes, re-checked against the source lists every hour and cleared of duplicates and expired entries, plus the Android and iPhone redemption steps.",
  path: "/tools/gift-codes/",
  keywords: [
    "Last Asylum codes",
    "Last Asylum Plague gift codes",
    "Last Asylum redeem codes",
    "Last Asylum iPhone codes",
  ],
});

const redemptionSteps = [
  {
    title: "Launch the game",
    detail: "Open Last Asylum: Plague on Android. On iPhone, skip to the portal note below.",
  },
  {
    title: "Open your profile",
    detail: "Tap your profile icon in the upper-left corner of the town screen.",
  },
  {
    title: "Open Settings",
    detail: "The profile panel lists Settings alongside the rest of your account options.",
  },
  {
    title: "Tap Gift Code",
    detail: "This opens the redemption field. If it is missing, you are on iOS — use the portal.",
  },
  {
    title: "Enter the code",
    detail: "Type or paste it exactly. Codes are case-sensitive, so avoid autocorrect and stray spaces.",
  },
  {
    title: "Confirm",
    detail: "Tap OK or Confirm. The rewards go straight to your bag, ready to claim.",
  },
];

function longDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
}

export default function GiftCodesPage() {
  const data = getGiftCodes();
  const site = getSiteConfig();
  const checkedLabel = longDate(data.checked);
  const updatedLabel = longDate(data.updated);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Gift codes", path: "/tools/gift-codes/" },
        ])}
      />
      <PageHeader
        eyebrow={`Tools · ${String(data.codes.length).padStart(2, "0")} active codes`}
        title="Gift codes, verified"
        description={`Free Last Asylum: Plague codes, re-checked against the source lists every hour and cleared of duplicates and expired entries. The newest in-game verification is dated ${checkedLabel}, so a code listed here should still redeem.`}
        crumbs={[{ label: "Gift codes" }]}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="success">
            <CheckCircle2 className="size-3" /> {data.codes.length} active
          </Badge>
          <Badge variant="secondary">
            <Clock3 className="size-3" /> Checked {checkedLabel}
          </Badge>
          <Badge variant="outline">
            <RefreshCw className="size-3" /> Hourly auto-check
          </Badge>
        </div>
      </PageHeader>

      <section className="container-page py-8 sm:py-10">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <div className="rounded-md border border-border/70 bg-card/40 p-4 sm:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="eyebrow mb-1">Active codes</p>
                  <h2 className="font-display text-2xl uppercase leading-none tracking-wide text-foreground">
                    Copy, paste, claim
                  </h2>
                </div>
                <Badge variant="outline">
                  <Gift className="size-3" /> Updated {updatedLabel}
                </Badge>
              </div>

              <GiftCodeList codes={data.codes} />
            </div>

            <section
              id="redeem"
              className="scroll-mt-28 rounded-md border border-border/70 bg-card/40 p-5"
            >
              <p className="eyebrow mb-2">Redemption</p>
              <h2 className="font-display text-2xl uppercase leading-none tracking-wide text-foreground">
                How to redeem a code
              </h2>
              <p className="mt-3 max-w-2xl text-xs leading-relaxed text-muted-foreground">
                These steps follow the redemption guide published by Pocket Gamer. The in-game route is
                the same on every Android build; the only variable is the label on the final button
                (OK or Confirm).
              </p>

              <ol className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {redemptionSteps.map((step, index) => (
                  <li
                    key={step.title}
                    className="flex gap-3 rounded-sm border border-border/50 bg-background/40 p-3"
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-primary/30 bg-primary/[0.08] font-mono text-[10px] text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-medium text-foreground">{step.title}</span>
                      <span className="mt-0.5 block text-[11px] leading-relaxed text-muted-foreground">
                        {step.detail}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>

              <div className="mt-5 rounded-sm border border-primary/25 bg-primary/[0.055] p-4">
                <div className="flex gap-3">
                  <Smartphone className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                      Playing on iPhone
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                      The in-game Gift Code button is not available on iOS. Redeem through the official
                      Globallap web portal — it is the only redemption option for iPhone players. Open
                      it in Safari, sign in or select your game account if prompted, then paste the
                      code. Android players can use either the portal or the in-game button.
                    </p>
                    <a
                      href={data.redemptionUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 break-all rounded-sm border border-primary/40 bg-background/40 px-2.5 py-2 font-mono text-[10px] text-primary transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      gevents.globallap.com/gamecode/index.html?gameId=440
                      <ArrowUpRight className="size-3 shrink-0" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <div className="rounded-md border border-border/70 bg-card/30 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0 text-primary/70" aria-hidden="true" />
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    Code failed even though it is listed here? It may have just hit its redemption cap.
                    Send the code and the exact error to command so the list can be corrected.
                  </p>
                </div>
                <a
                  href={`mailto:${site.contactEmail}?subject=Gift%20code%20report`}
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-sm border border-border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  Report a code <ArrowUpRight className="size-3" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
            <div className="rounded-md border border-primary/20 bg-primary/[0.035] p-4">
              <Clock3 className="size-5 text-primary" aria-hidden="true" />
              <p className="mt-2 font-display text-xl uppercase tracking-wide text-foreground">
                Freshness
              </p>
              <dl className="mt-2 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground/60">In-game check</dt>
                  <dd className="text-foreground/90">{checkedLabel}</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground/60">List updated</dt>
                  <dd className="text-foreground/90">{updatedLabel}</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground/60">Auto-check</dt>
                  <dd className="text-foreground/90">Every hour, on the hour</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground/60">Active codes</dt>
                  <dd className="text-foreground/90">{data.codes.length}</dd>
                </div>
              </dl>
              <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
                A scheduled check re-reads the source lists at the top of every hour. Codes expire
                without warning and some have limited redemptions, so try a few before assuming the
                list is stale; each code has its own redemption cap.
              </p>
            </div>

            <div className="rounded-md border border-border/70 bg-card/40 p-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary/70" aria-hidden="true" />
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/60">
                  Field rules
                </p>
              </div>
              <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-muted-foreground">
                <li className="flex gap-2">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary/60" />
                  Codes are case-sensitive. Copy them instead of retyping.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary/60" />
                  One code at a time; wait for the confirmation before the next.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary/60" />
                  Expired codes are removed, not hidden behind the active list.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary/60" />
                  iPhone players must use the Globallap portal linked above.
                </li>
              </ul>
            </div>

            <div className="rounded-md border border-border/70 bg-card/40 p-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/60">
                Sources
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                The active list follows the newest in-game check. An automated pass re-reads these
                lists hourly, drops expired and duplicate entries, and redeploys when the working set
                changes.
              </p>
              <ul className="mt-3 space-y-2.5">
                {data.sources.map((source) => (
                  <li key={source.url}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-start justify-between gap-2"
                    >
                      <span className="min-w-0">
                        <span className="block text-[11px] leading-snug text-foreground/90 transition-colors group-hover:text-primary">
                          {source.label}
                        </span>
                        <span className="mt-0.5 block font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground/50">
                          {source.note}
                        </span>
                      </span>
                      <ArrowUpRight
                        className="mt-0.5 size-3 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-primary"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
