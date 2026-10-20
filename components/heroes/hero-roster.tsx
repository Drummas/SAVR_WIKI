"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import { HeroCard } from "@/components/heroes/hero-card";
import { heroTone, type HeroTone } from "@/lib/hero-tones";
import { cn } from "@/lib/utils";
import type { Hero } from "@/lib/types";

const ALL = "All";

function FilterChip({
  active,
  count,
  tone,
  onClick,
  children,
}: {
  active: boolean;
  count?: number;
  tone?: HeroTone;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] transition-colors",
        active
          ? (tone?.active ?? "border-primary/50 bg-primary/15 text-emerald-300")
          : "border-border/70 bg-background/40 text-muted-foreground hover:border-primary/30 hover:text-foreground",
      )}
    >
      {!active && tone && (
        <span className={cn("size-1.5 rounded-full", tone.dot)} aria-hidden="true" />
      )}
      {children}
      {typeof count === "number" && (
        <span
          className={cn(
            "text-[8px] tabular-nums",
            active ? (tone ? "opacity-70" : "text-emerald-300/70") : "text-muted-foreground/50",
          )}
        >
          {String(count).padStart(2, "0")}
        </span>
      )}
    </button>
  );
}

/**
 * Roster board for the "Know your heroes" guide. Filters stay local so the
 * page itself can remain a static export.
 */
export function HeroRoster({ heroes }: { heroes: Hero[] }) {
  const [archetype, setArchetype] = useState(ALL);
  const [role, setRole] = useState(ALL);
  const [query, setQuery] = useState("");

  const archetypes = useMemo(
    () => [ALL, ...getUniques(heroes.map((hero) => hero.archetype))],
    [heroes],
  );
  const roles = useMemo(() => [ALL, ...getUniques(heroes.map((hero) => hero.role))], [heroes]);

  const codes = useMemo(
    () =>
      new Map(
        heroes.map((hero, index) => [hero.slug, `H-${String(index + 1).padStart(2, "0")}`]),
      ),
    [heroes],
  );

  const filtered = useMemo(() => {
    const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return heroes.filter((hero) => {
      if (archetype !== ALL && hero.archetype !== archetype) return false;
      if (role !== ALL && hero.role !== role) return false;
      if (!tokens.length) return true;
      const haystack = [
        hero.name,
        hero.rank,
        hero.archetype,
        hero.role,
        hero.summary,
        ...hero.skills,
        ...hero.facts.map((fact) => `${fact.label} ${fact.value}`),
      ]
        .join(" ")
        .toLowerCase();
      return tokens.every((token) => haystack.includes(token));
    });
  }, [heroes, archetype, role, query]);

  const isFiltered = archetype !== ALL || role !== ALL || query.trim().length > 0;

  // Search results and the guides index deep-link to #hero-{slug}. The browser
  // resolves the hash before the roster has settled, so re-run the scroll once
  // mounted to land the card below the sticky header and its scroll margin.
  useEffect(() => {
    const target = window.location.hash.replace(/^#/, "");
    if (!target) return;
    const timer = window.setTimeout(() => {
      const card = document.getElementById(target);
      if (!card) return;
      const header = document.querySelector("header")?.getBoundingClientRect().height ?? 63;
      window.scrollTo({
        top: card.getBoundingClientRect().top + window.scrollY - header - 16,
        behavior: "auto",
      });
    }, 120);
    return () => window.clearTimeout(timer);
  }, []);

  function reset() {
    setArchetype(ALL);
    setRole(ALL);
    setQuery("");
  }

  return (
    <div className="not-prose my-7">
      <div className="rounded-md border border-border/80 bg-card/40 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[15rem] flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/60" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a hero, skill or unlock route"
              aria-label="Search the hero roster"
              className="h-9 w-full rounded-sm border border-border bg-background/60 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/50">
              {String(filtered.length).padStart(2, "0")} / {String(heroes.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={reset}
              disabled={!isFiltered}
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-sm border px-2.5 font-mono text-[9px] uppercase tracking-[0.12em] transition-colors",
                isFiltered
                  ? "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  : "border-border/40 text-muted-foreground/30",
              )}
            >
              <X className="size-3" />
              Reset
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/40 pt-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground/45">
              Class
            </span>
            {archetypes.map((option) => (
              <FilterChip
                key={option}
                active={archetype === option}
                tone={option === ALL ? undefined : heroTone(option)}
                count={
                  option === ALL
                    ? heroes.length
                    : heroes.filter((hero) => hero.archetype === option).length
                }
                onClick={() => setArchetype(option)}
              >
                {option}
              </FilterChip>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground/45">
              Role
            </span>
            {roles.map((option) => (
              <FilterChip
                key={option}
                active={role === option}
                count={
                  option === ALL ? heroes.length : heroes.filter((hero) => hero.role === option).length
                }
                onClick={() => setRole(option)}
              >
                {option}
              </FilterChip>
            ))}
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((hero) => (
            <HeroCard key={hero.slug} hero={hero} code={codes.get(hero.slug)} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-md border border-dashed border-border bg-card/30 p-8 text-center">
          <p className="font-display text-xl uppercase tracking-wide text-foreground">
            No hero matches that filter
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Try a class, a role, or a skill name such as &ldquo;shield&rdquo;.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-4 inline-flex items-center gap-1.5 rounded-sm border border-primary/40 bg-primary/10 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-emerald-300 hover:bg-primary hover:text-primary-foreground"
          >
            <X className="size-3" />
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

function getUniques(values: string[]) {
  return [...new Set(values)];
}
