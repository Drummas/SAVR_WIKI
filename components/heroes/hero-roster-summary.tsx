import { ArrowUpRight, Shield, Sparkles, Swords } from "lucide-react";

import { getHeroRosterMeta, getHeroes } from "@/lib/heroes";
import { formatDate } from "@/lib/utils";

/** Header dossier panel shown instead of a hero screenshot on roster guides. */
export function HeroRosterSummary() {
  const heroes = getHeroes();
  const meta = getHeroRosterMeta();

  const classes = [...new Set(heroes.map((hero) => hero.archetype))];
  const roles = [...new Set(heroes.map((hero) => hero.role))].map((role) => ({
    role,
    count: heroes.filter((hero) => hero.role === role).length,
  }));

  return (
    <div className="hud-corners rounded-md border border-border/80 bg-card/60 p-4">
      <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-primary">Roster file</p>
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/50">
          {String(meta.count).padStart(2, "0")} active
        </span>
      </div>

      <dl className="mt-3 space-y-3">
        <div>
          <dt className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/45">
            <Sparkles className="size-3 text-primary/60" /> Classes
          </dt>
          <dd className="mt-1 text-xs text-foreground/80">{classes.join(" · ")}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/45">
            <Swords className="size-3 text-primary/60" /> Roles
          </dt>
          <dd className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-foreground/80">
            {roles.map((entry) => (
              <span key={entry.role} className="tabular-nums">
                {entry.role} <span className="text-primary/70">{entry.count}</span>
              </span>
            ))}
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/45">
            <Shield className="size-3 text-primary/60" /> Source
          </dt>
          <dd className="mt-1">
            <a
              href={meta.source}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:text-emerald-300"
            >
              Published hero roster
              <ArrowUpRight className="size-3" />
            </a>
          </dd>
        </div>
      </dl>

      <p className="mt-4 border-t border-border/50 pt-3 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/50">
        Imported {formatDate(meta.updated)} · verify in game
      </p>
    </div>
  );
}
