import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

import type {
  BaseContent,
  CalendarEvent,
  Difficulty,
  EventCategory,
  FAQItem,
  GalleryImage,
  GameEvent,
  GiftCodeConfig,
  Guide,
  GuideStep,
  ResourceRequirement,
  RewardRow,
  SchedulePhase,
  SiteConfig,
  Strategy,
  WalkthroughStep,
} from "@/lib/types";

const root = process.cwd();
const contentRoot = path.join(root, "content");

function readJson<T>(relativePath: string): T {
  const file = path.join(root, relativePath);
  return JSON.parse(fs.readFileSync(file, "utf8")) as T;
}

function string(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function number(value: unknown, fallback = 99): number {
  return typeof value === "number" ? value : fallback;
}

function bool(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function difficulty(value: unknown): Difficulty {
  return value === "Beginner" || value === "Intermediate" || value === "Advanced"
    ? value
    : "Intermediate";
}

function eventStatus(value: unknown): GameEvent["status"] {
  return value === "verified" || value === "template" ? value : "community";
}

function eventCategory(value: unknown): EventCategory {
  const allowed: EventCategory[] = [
    "Survival Battle",
    "Alliance vs Alliance",
    "State Events",
    "Plague Events",
    "Doomsday Challenge",
    "Resource Events",
    "Hero Events",
  ];
  return allowed.includes(value as EventCategory)
    ? (value as EventCategory)
    : "State Events";
}

function schedule(value: unknown): SchedulePhase[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((row): row is Record<string, unknown> => !!row && typeof row === "object")
    .map((row) => ({
      phase: string(row.phase, "Phase"),
      timing: string(row.timing, "TBC"),
      note: string(row.note) || undefined,
    }));
}

function rewards(value: unknown): RewardRow[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((row): row is Record<string, unknown> => !!row && typeof row === "object")
    .map((row) => ({
      reward: string(row.reward, "Reward"),
      amount: string(row.amount, "TBC"),
      notes: string(row.notes) || undefined,
    }));
}

function walkthrough(value: unknown): WalkthroughStep[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((row): row is Record<string, unknown> => !!row && typeof row === "object")
    .map((row) => ({
      title: string(row.title, "Step"),
      description: string(row.description, "Content to be added by Alliance Leadership."),
      image: string(row.image) || undefined,
      caption: string(row.caption) || undefined,
      highlights: stringArray(row.highlights),
    }));
}

function guideSteps(value: unknown): GuideStep[] {
  return walkthrough(value).map(({ title, description, image, caption, highlights }) => ({
    title,
    description,
    image,
    caption,
    highlights,
  }));
}

function resourceRows(value: unknown): ResourceRequirement[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((row): row is Record<string, unknown> => !!row && typeof row === "object")
    .map((row) => ({
      item: string(row.item, "Resource"),
      amount: string(row.amount, "TBC"),
      priority:
        row.priority === "Core" || row.priority === "High" || row.priority === "Optional"
          ? row.priority
          : "High",
    }));
}

function baseFrom(slug: string, data: Record<string, unknown>): BaseContent {
  return {
    slug,
    title: string(data.title, slug),
    summary: string(data.summary, "Content to be added by Alliance Leadership."),
    updated: string(data.updated, "2026-10-18"),
    tags: stringArray(data.tags),
    featured: bool(data.featured),
    order: number(data.order),
    heroImage: string(data.heroImage) || undefined,
  };
}

function readMdxFolder(folder: string): { slug: string; data: Record<string, unknown>; body: string }[] {
  const dir = path.join(contentRoot, folder);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const parsed = matter(raw);
      return {
        slug: file.replace(/\.mdx?$/, ""),
        data: parsed.data as Record<string, unknown>,
        body: parsed.content.trim(),
      };
    });
}

let eventCache: GameEvent[] | null = null;
let guideCache: Guide[] | null = null;
let strategyCache: Strategy[] | null = null;

export function getEvents(): GameEvent[] {
  if (eventCache) return eventCache;
  eventCache = readMdxFolder("events")
    .map(({ slug, data, body }) => ({
      ...baseFrom(slug, data),
      category: eventCategory(data.category),
      difficulty: difficulty(data.difficulty),
      cadence: string(data.cadence, "Verify in-game"),
      duration: string(data.duration, "TBC"),
      status: eventStatus(data.status),
      objective: string(data.objective, "Content to be added by Alliance Leadership."),
      requirements: stringArray(data.requirements),
      schedule: schedule(data.schedule),
      rewards: rewards(data.rewards),
      preparation: stringArray(data.preparation),
      bestPractices: stringArray(data.bestPractices),
      mistakes: stringArray(data.mistakes),
      advancedTips: stringArray(data.advancedTips),
      checklist: stringArray(data.checklist),
      requiredScreenshots: stringArray(data.requiredScreenshots),
      playerNotes: stringArray(data.playerNotes),
      strategyRecommendations: stringArray(data.strategyRecommendations),
      walkthrough: walkthrough(data.walkthrough),
      body,
    }))
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  return eventCache;
}

export function getEvent(slug: string): GameEvent | undefined {
  return getEvents().find((event) => event.slug === slug);
}

export function getGuides(): Guide[] {
  if (guideCache) return guideCache;
  guideCache = readMdxFolder("guides")
    .map(({ slug, data, body }) => ({
      ...baseFrom(slug, data),
      category: string(data.category, "Core Systems"),
      difficulty: difficulty(data.difficulty),
      readingTime: string(data.readingTime, "8 min"),
      layout: data.layout === "roster" ? ("roster" as const) : ("standard" as const),
      overview: string(data.overview, "Content to be added by Alliance Leadership."),
      priorities: stringArray(data.priorities),
      actions: stringArray(data.actions),
      resourceRequirements: resourceRows(data.resourceRequirements),
      tips: stringArray(data.tips),
      mistakes: stringArray(data.mistakes),
      steps: guideSteps(data.steps),
      related: stringArray(data.related),
      body,
    }))
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  return guideCache;
}

export function getGuide(slug: string): Guide | undefined {
  return getGuides().find((guide) => guide.slug === slug);
}

export function getStrategies(): Strategy[] {
  if (strategyCache) return strategyCache;
  strategyCache = readMdxFolder("strategies")
    .map(({ slug, data, body }) => ({
      ...baseFrom(slug, data),
      category: string(data.category, "Alliance Play"),
      difficulty: difficulty(data.difficulty),
      readingTime: string(data.readingTime, "10 min"),
      objective: string(data.objective, "Content to be added by Alliance Leadership."),
      actions: stringArray(data.actions),
      requirements: stringArray(data.requirements),
      optimisation: stringArray(data.optimisation),
      tips: stringArray(data.tips),
      mistakes: stringArray(data.mistakes),
      metrics: Array.isArray(data.metrics)
        ? data.metrics
            .filter((row): row is Record<string, unknown> => !!row && typeof row === "object")
            .map((row) => ({
              label: string(row.label, "Metric"),
              value: string(row.value, "TBC"),
              note: string(row.note) || undefined,
            }))
        : [],
      related: stringArray(data.related),
      body,
    }))
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  return strategyCache;
}

export function getStrategy(slug: string): Strategy | undefined {
  return getStrategies().find((strategy) => strategy.slug === slug);
}

let faqCache: FAQItem[] | null = null;

export function getFaq(): FAQItem[] {
  if (faqCache) return faqCache;
  const data = readJson<{ items: FAQItem[] }>("content/faq/faq.json");
  faqCache = (data.items ?? []).map((item, index) => ({
    ...item,
    id: item.id || `faq-${index + 1}`,
    tags: Array.isArray(item.tags) ? item.tags : [],
  }));
  return faqCache;
}

export function getFaqCategories(): string[] {
  return [...new Set(getFaq().map((item) => item.category))];
}

let calendarCache: CalendarEvent[] | null = null;

export function getCalendarEvents(): CalendarEvent[] {
  if (calendarCache) return calendarCache;
  const data = readJson<{ events: CalendarEvent[] }>("data/calendar-events.json");
  calendarCache = (data.events ?? []).sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );
  return calendarCache;
}

let giftCodeCache: GiftCodeConfig | null = null;

/**
 * Gift codes follow the newest in-game check. The scheduled workflow writes
 * the data file hourly; this loader still collapses duplicates defensively so
 * a hand edit cannot render the same code twice.
 */
export function getGiftCodes(): GiftCodeConfig {
  if (giftCodeCache) return giftCodeCache;
  const data = readJson<GiftCodeConfig>("data/gift-codes.json");
  const seen = new Set<string>();
  const codes = (data.codes ?? []).filter((entry) => {
    if (!entry || typeof entry.code !== "string") return false;
    const normalized = entry.code.trim().toLowerCase();
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
  giftCodeCache = { ...data, codes };
  return giftCodeCache;
}

let galleryCache: GalleryImage[] | null = null;

export function getGallery(): GalleryImage[] {
  if (galleryCache) return galleryCache;
  const data = readJson<{ images: GalleryImage[] }>("data/gallery.json");
  galleryCache = data.images ?? [];
  return galleryCache;
}

let siteCache: SiteConfig | null = null;

export function getSiteConfig(): SiteConfig {
  if (siteCache) return siteCache;
  siteCache = readJson<SiteConfig>("data/site.json");
  return siteCache;
}

export function getAllSlugs() {
  return {
    events: getEvents().map((event) => event.slug),
    guides: getGuides().map((guide) => guide.slug),
    strategies: getStrategies().map((strategy) => strategy.slug),
  };
}

export function getRelatedEvents(current: GameEvent, limit = 3): GameEvent[] {
  return getEvents()
    .filter((event) => event.slug !== current.slug)
    .sort((a, b) => {
      const scoreA = a.tags.filter((tag) => current.tags.includes(tag)).length;
      const scoreB = b.tags.filter((tag) => current.tags.includes(tag)).length;
      return scoreB - scoreA;
    })
    .slice(0, limit);
}
