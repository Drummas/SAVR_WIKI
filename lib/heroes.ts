import fs from "node:fs";
import path from "node:path";

import type { Hero, HeroFact } from "@/lib/types";

interface HeroRosterFile {
  source: string;
  updated: string;
  heroes: Hero[];
}

const rosterPath = path.join(process.cwd(), "data", "heroes.json");

let cache: HeroRosterFile | null = null;

function strings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function facts(value: unknown): HeroFact[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((row): row is Record<string, unknown> => !!row && typeof row === "object")
    .map((row) => ({
      label: typeof row.label === "string" ? row.label : "Note",
      value: typeof row.value === "string" ? row.value : "",
    }))
    .filter((row) => row.value.length > 0);
}

function readRoster(): HeroRosterFile {
  if (cache) return cache;
  const raw = JSON.parse(fs.readFileSync(rosterPath, "utf8")) as Record<string, unknown>;
  const heroes = (Array.isArray(raw.heroes) ? raw.heroes : [])
    .filter((row): row is Record<string, unknown> => !!row && typeof row === "object")
    .map((row) => ({
      slug: typeof row.slug === "string" ? row.slug : "",
      name: typeof row.name === "string" ? row.name : "Unknown hero",
      rank: typeof row.rank === "string" ? row.rank : "UR",
      archetype: typeof row.archetype === "string" ? row.archetype : "Flex",
      role: typeof row.role === "string" ? row.role : "Flex",
      summary: typeof row.summary === "string" ? row.summary : "",
      image: typeof row.image === "string" ? row.image : undefined,
      skills: strings(row.skills),
      facts: facts(row.facts),
    }))
    .filter((hero) => hero.slug.length > 0);

  cache = {
    source: typeof raw.source === "string" ? raw.source : "",
    updated: typeof raw.updated === "string" ? raw.updated : "2026-10-19",
    heroes,
  };
  return cache;
}

export function getHeroes(): Hero[] {
  return readRoster().heroes;
}

export function getHeroRosterMeta(): { source: string; updated: string; count: number } {
  const roster = readRoster();
  return { source: roster.source, updated: roster.updated, count: roster.heroes.length };
}

/** Archetypes in source order, so the filter row stays stable as the roster grows. */
export function getHeroArchetypes(): string[] {
  return [...new Set(getHeroes().map((hero) => hero.archetype))];
}

export function getHeroRoles(): string[] {
  return [...new Set(getHeroes().map((hero) => hero.role))];
}

export function getHero(slug: string): Hero | undefined {
  return getHeroes().find((hero) => hero.slug === slug);
}
