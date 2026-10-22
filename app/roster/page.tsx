import type { Metadata } from "next";
import { ArrowUpRight, Crown, RefreshCw, Shield, Swords, Users } from "lucide-react";

import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { getRoster } from "@/lib/content";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Alliance Roster",
  description:
    "The full Savage Rebelz (SAVR) roster: player, power, kills, sanctuary level and join date, refreshed every day at server reset.",
  path: "/roster/",
  keywords: [
    "Savage Rebelz roster",
    "SAVR alliance members",
    "Last Asylum alliance leaderboard",
    "server 297 alliance",
  ],
});

const numberFormat = new Intl.NumberFormat("en-GB");
const compactFormat = new Intl.NumberFormat("en-GB", {
  notation: "compact",
  maximumFractionDigits: 2,
});
const joinedFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});
const updatedFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export default function RosterPage() {
  const { alliance, members, source, updated } = getRoster();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Roster", path: "/roster/" },
        ])}
      />
      <PageHeader
        eyebrow={`Alliance · ${String(members.length).padStart(2, "0")} members`}
        title="The roster"
        description="Every Savage Rebelz member on the alliance leaderboard, refreshed each day at server reset (00:00 on the in-game clock). Power and kills are lifetime totals; sanctuary is the member's current sanctuary level."
        crumbs={[{ label: "Roster" }]}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge>
            <Users className="size-3" /> {members.length} members
          </Badge>
          <Badge variant="secondary">
            <Crown className="size-3" /> {compactFormat.format(alliance.power)} power
          </Badge>
          <Badge variant="secondary">
            <Swords className="size-3" /> {compactFormat.format(alliance.kills)} kills
          </Badge>
          <Badge variant="outline">
            <RefreshCw className="size-3" /> Daily at server reset
          </Badge>
        </div>
      </PageHeader>

      <section className="container-page py-8 sm:py-10">
        <div className="rounded-md border border-border/70 bg-card/40">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border/60 px-4 py-4 sm:px-5">
            <div>
              <p className="eyebrow mb-1">Active roster</p>
              <h2 className="font-display text-2xl uppercase leading-none tracking-wide text-foreground">
                {alliance.tag} · {alliance.name}
              </h2>
            </div>
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/60">
              Updated {updatedFormat.format(new Date(`${updated}T12:00:00Z`))}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-left">
              <caption className="sr-only">
                Savage Rebelz alliance roster with player, power, kills, sanctuary and joined date
              </caption>
              <thead>
                <tr className="border-b border-border/60 bg-background/30">
                  <th
                    scope="col"
                    className="px-4 py-3 font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70 sm:px-5"
                  >
                    Player
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70"
                  >
                    Power
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70"
                  >
                    Kills
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70"
                  >
                    Sanctuary
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70 sm:px-5"
                  >
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr
                    key={`${member.name}-${member.joined}`}
                    className="border-b border-border/40 transition-colors last:border-0 hover:bg-secondary/30"
                  >
                    <th
                      scope="row"
                      className="px-4 py-3 text-left text-xs font-medium text-foreground sm:px-5"
                    >
                      {member.name}
                    </th>
                    <td className="px-4 py-3 text-right font-mono text-xs tabular-nums text-foreground/90">
                      {numberFormat.format(member.power)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs tabular-nums text-foreground/90">
                      {numberFormat.format(member.kills)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs tabular-nums text-foreground/90">
                      {member.sanctuary}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[11px] tabular-nums text-muted-foreground sm:px-5">
                      <time dateTime={member.joined}>
                        {joinedFormat.format(new Date(member.joined))}
                      </time>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-border/60 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
              <Shield className="mt-0.5 size-3.5 shrink-0 text-primary/60" aria-hidden="true" />
              Sorted by power. The source leaderboard is re-read every day at server reset; a failed
              read leaves the previous roster in place.
            </p>
            <a
              href={source}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/70 transition-colors hover:text-primary"
            >
              Leaderboard source <ArrowUpRight className="size-3" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
