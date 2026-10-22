"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import type { AllianceMember } from "@/lib/types";

type SortKey = "name" | "power" | "totalHeroMight" | "heroHighestMight" | "kills" | "sanctuary" | "joined";
type Direction = "asc" | "desc";

const columns: { key: SortKey; label: string; align: "left" | "right" }[] = [
  { key: "name", label: "Player", align: "left" },
  { key: "power", label: "Total Might", align: "right" },
  { key: "totalHeroMight", label: "Total Hero Might", align: "right" },
  { key: "heroHighestMight", label: "Hero Highest Might", align: "right" },
  { key: "kills", label: "Kills", align: "right" },
  { key: "sanctuary", label: "Sanctuary", align: "right" },
  { key: "joined", label: "Joined", align: "right" },
];

const numberFormat = new Intl.NumberFormat("en-GB");
const joinedFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function RosterTable({ members }: { members: AllianceMember[] }) {
  const [sort, setSort] = useState<{ key: SortKey; direction: Direction }>({
    key: "power",
    direction: "desc",
  });

  const sorted = useMemo(() => {
    const direction = sort.direction === "asc" ? 1 : -1;
    return [...members].sort((a, b) => {
      if (sort.key === "name") return a.name.localeCompare(b.name) * direction;
      if (sort.key === "joined") {
        return (new Date(a.joined).getTime() - new Date(b.joined).getTime()) * direction;
      }
      const aValue = a[sort.key];
      const bValue = b[sort.key];
      if (aValue === null && bValue === null) return a.name.localeCompare(b.name);
      if (aValue === null) return 1;
      if (bValue === null) return -1;
      return (aValue - bValue) * direction;
    });
  }, [members, sort]);

  function toggleSort(key: SortKey) {
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key, direction: key === "name" ? "asc" : "desc" },
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] border-collapse text-left">
        <caption className="sr-only">
          Savage Rebelz alliance roster with player, total might, total hero might, hero highest
          might, kills, sanctuary and joined date. Select a column header to sort. A dash marks a
          hero might stat the source does not publish for that player.
        </caption>
        <thead>
          <tr className="border-b border-border/60 bg-background/30">
            {columns.map((column) => {
              const active = sort.key === column.key;
              const Icon = !active ? ChevronsUpDown : sort.direction === "asc" ? ArrowUp : ArrowDown;
              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={
                    active ? (sort.direction === "asc" ? "ascending" : "descending") : "none"
                  }
                  className={cn(
                    "px-4 py-1 font-mono text-[9px] font-medium uppercase tracking-[0.14em]",
                    column.key === "name" && "sm:pl-5",
                    column.key === "joined" && "sm:pr-5",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleSort(column.key)}
                    className={cn(
                      "flex w-full items-center gap-1.5 py-2 uppercase tracking-[0.14em] transition-colors focus-visible:text-primary focus-visible:outline-none",
                      column.align === "right" ? "justify-end" : "justify-start",
                      active
                        ? "text-primary"
                        : "text-muted-foreground/70 hover:text-foreground",
                    )}
                  >
                    {column.label}
                    <Icon className="size-3 shrink-0" aria-hidden="true" />
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((member) => (
            <tr
              key={`${member.name}-${member.joined}`}
              className="border-b border-border/40 transition-colors last:border-0 hover:bg-secondary/30"
            >
              <th
                scope="row"
                className="px-4 py-3 text-left text-xs font-medium text-foreground sm:pl-5"
              >
                {member.name}
              </th>
              <td className="px-4 py-3 text-right font-mono text-xs tabular-nums text-foreground/90">
                {numberFormat.format(member.power)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-xs tabular-nums text-foreground/90">
                {member.totalHeroMight === null ? (
                  <span
                    className="text-muted-foreground/40"
                    title="Not published on the source player page"
                  >
                    —
                  </span>
                ) : (
                  numberFormat.format(member.totalHeroMight)
                )}
              </td>
              <td className="px-4 py-3 text-right font-mono text-xs tabular-nums text-foreground/90">
                {member.heroHighestMight === null ? (
                  <span
                    className="text-muted-foreground/40"
                    title="Not published on the source player page"
                  >
                    —
                  </span>
                ) : (
                  numberFormat.format(member.heroHighestMight)
                )}
              </td>
              <td className="px-4 py-3 text-right font-mono text-xs tabular-nums text-foreground/90">
                {numberFormat.format(member.kills)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-xs tabular-nums text-foreground/90">
                {member.sanctuary}
              </td>
              <td className="px-4 py-3 text-right font-mono text-[11px] tabular-nums text-muted-foreground sm:pr-5">
                <time dateTime={member.joined}>
                  {joinedFormat.format(new Date(member.joined))}
                </time>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
