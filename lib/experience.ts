/**
 * Reader experience registry.
 *
 * The site ships two layouts over the same content:
 *
 *   beginner   a lighter home page and guide hub for players in their first weeks
 *   advanced   the full event, strategy and planning field manual
 *
 * The active layout is written to `<html data-experience="…">`, which CSS uses
 * to reveal the matching sections. It is device-local (localStorage) because the
 * site is a static export with no server to read a cookie from, and a matching
 * inline script in the root layout applies the saved value before first paint.
 */
export const EXPERIENCES = [
  {
    id: "beginner",
    label: "Beginner",
    description: "Starter guides and the first-week basics",
  },
  {
    id: "advanced",
    label: "Advanced",
    description: "Event intel, strategies and planning tools",
  },
] as const;

export type ExperienceId = (typeof EXPERIENCES)[number]["id"];

export const DEFAULT_EXPERIENCE: ExperienceId = "advanced";

export const EXPERIENCE_STORAGE_KEY = "savr.experience";

/** How long the "you can switch any time" hint stays on screen. */
export const EXPERIENCE_HINT_DURATION = 3600;

export function isExperienceId(value: unknown): value is ExperienceId {
  return EXPERIENCES.some((experience) => experience.id === value);
}
