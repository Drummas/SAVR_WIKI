/**
 * Class colour language for the roster: Warriors read red, Rangers blue and
 * Warlocks green on the class label and the icon right before it. Roles (Tank,
 * Carry, Support) stay neutral — the class is the identity, the role is the job.
 *
 * Keep the mapping here so cards, filters and the roster dossier can never
 * drift apart.
 */
export type HeroTone = {
  /** Solid text colour, e.g. the class label and its icon. */
  text: string;
  /** Selected filter chip. */
  active: string;
  /** Unselected filter chip marker. */
  dot: string;
};

const red: HeroTone = {
  text: "text-hero-red",
  active: "border-hero-red/50 bg-hero-red/15 text-hero-red",
  dot: "bg-hero-red",
};

const blue: HeroTone = {
  text: "text-hero-blue",
  active: "border-hero-blue/50 bg-hero-blue/15 text-hero-blue",
  dot: "bg-hero-blue",
};

const green: HeroTone = {
  text: "text-hero-green",
  active: "border-hero-green/50 bg-hero-green/15 text-hero-green",
  dot: "bg-hero-green",
};

export const heroTones: Record<string, HeroTone> = {
  Warrior: red,
  Ranger: blue,
  Warlock: green,
};

const neutral: HeroTone = {
  text: "text-muted-foreground",
  active: "border-border bg-secondary text-foreground",
  dot: "bg-muted-foreground",
};

export function heroTone(name: string | undefined): HeroTone {
  return (name && heroTones[name]) || neutral;
}

/** Gold used for the UR rank chip and other top-tier marks. */
export const rankGold = {
  chip: "border-hero-gold/50 bg-hero-gold/10 text-hero-gold shadow-[0_0_14px_-5px_rgba(243,201,107,0.9)]",
};
