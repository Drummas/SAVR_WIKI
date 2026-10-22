/**
 * Palette registry.
 *
 * The token contract lives in `styles/globals.css` under
 * `[data-theme="…"]`; this file only carries the presentation metadata the
 * switcher needs and the id that gets written to `<html data-theme>`.
 *
 * `chrome` is the browser UI colour (the `theme-color` meta tag) and should
 * match that theme's page background, otherwise mobile Chrome paints a
 * mismatched bar above the site.
 *
 * Hero class colours and UR gold are intentionally not part of a theme.
 */
export const THEMES = [
  {
    id: "vivid",
    label: "Vivid",
    description: "Tangerine and magenta",
    swatches: ["#fa8c2d", "#f0449c", "#120d18"],
    chrome: "#120d18",
  },
  {
    id: "aurora",
    label: "Aurora",
    description: "Azure and violet",
    swatches: ["#4898fe", "#8b5cf6", "#0d0b1b"],
    chrome: "#0d0b1b",
  },
  {
    id: "green",
    label: "Neon",
    description: "Spring green and emerald",
    swatches: ["#34e07f", "#10b981", "#070d0a"],
    chrome: "#070d0a",
  },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export const DEFAULT_THEME: ThemeId = "vivid";

export const THEME_STORAGE_KEY = "savr.theme";

export function isThemeId(value: unknown): value is ThemeId {
  return THEMES.some((theme) => theme.id === value);
}
