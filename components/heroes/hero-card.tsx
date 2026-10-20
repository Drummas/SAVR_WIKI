import Image from "next/image";
import {
  Crosshair,
  HeartPulse,
  Shield,
  Sparkles,
  Sword,
  Swords,
  type LucideIcon,
} from "lucide-react";

import type { Hero } from "@/lib/types";

const archetypeIcons: Record<string, LucideIcon> = {
  Warrior: Sword,
  Warlock: Sparkles,
  Ranger: Crosshair,
};

const roleIcons: Record<string, LucideIcon> = {
  Tank: Shield,
  Carry: Swords,
  Support: HeartPulse,
};

/**
 * Hero cheat sheet. Mirrors the printed card layout the alliance passes around
 * — rank chip, name, role line, one-line summary, key skills, then the facts
 * that decide whether the hero is worth shards — restyled for the SAVR HUD.
 */
export function HeroCard({ hero, code }: { hero: Hero; code?: string }) {
  const ArchetypeIcon = archetypeIcons[hero.archetype] ?? Sword;
  const RoleIcon = roleIcons[hero.role] ?? Crosshair;

  return (
    <article
      id={`hero-${hero.slug}`}
      className="group hud-corners relative flex h-full scroll-mt-28 flex-col overflow-hidden rounded-md border border-border/80 bg-card/50 transition-colors duration-300 hover:border-primary/45 hover:bg-card/70"
    >
      <div className="relative aspect-[5/4] shrink-0 overflow-hidden border-b border-border/50 bg-[#070f0a]">
        <div
          className="absolute inset-0 bg-tactical-grid bg-grid-sm opacity-40"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_70%_62%_at_50%_88%,rgba(52,224,126,0.18),transparent_72%)]"
          aria-hidden="true"
        />
        {hero.image ? (
          <Image
            src={hero.image}
            alt={`${hero.name} — ${hero.archetype} ${hero.role}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
            className="object-contain object-bottom drop-shadow-[0_18px_28px_rgba(0,0,0,0.55)] transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <ArchetypeIcon className="size-9 text-primary/30" />
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground/50">
              Portrait pending
            </span>
          </div>
        )}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-card/95 to-transparent"
          aria-hidden="true"
        />
        <span className="absolute left-3 top-3 flex size-8 items-center justify-center rounded-sm border border-primary/45 bg-background/80 font-mono text-[10px] font-medium tracking-[0.06em] text-emerald-300 backdrop-blur">
          {hero.rank}
        </span>
        {code && (
          <span className="absolute right-3 top-3 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground/40">
            {code}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-2xl uppercase leading-none tracking-wide text-foreground group-hover:text-emerald-100">
          {hero.name}
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
          <span className="inline-flex items-center gap-1">
            <ArchetypeIcon className="size-3" />
            {hero.archetype}
          </span>
          <span className="text-primary/35" aria-hidden="true">
            /
          </span>
          <span className="inline-flex items-center gap-1">
            <RoleIcon className="size-3" />
            {hero.role}
          </span>
        </p>

        <p className="mt-3 text-xs leading-relaxed text-muted-foreground pretty">{hero.summary}</p>

        {hero.skills.length > 0 && (
          <>
            <p className="mt-3.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/45">
              Key skills
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {hero.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-sm border border-border/70 bg-background/50 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.04em] text-emerald-200/75"
                >
                  {skill}
                </span>
              ))}
            </div>
          </>
        )}

        {hero.facts.length > 0 && (
          <dl className="mt-auto space-y-2.5 border-t border-border/50 pt-3.5">
            {hero.facts.map((fact) => (
              <div key={`${fact.label}-${fact.value}`}>
                <dt className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/45">
                  <span className="size-1 rounded-full bg-primary/50" aria-hidden="true" />
                  {fact.label}
                </dt>
                <dd className="mt-0.5 pl-3 text-[11px] leading-relaxed text-foreground/80">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </article>
  );
}
