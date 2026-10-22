export type EventCategory =
  | "Survival Battle"
  | "Alliance vs Alliance"
  | "State Events"
  | "Plague Events"
  | "Doomsday Challenge"
  | "Resource Events"
  | "Hero Events";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type ContentType =
  | "event"
  | "guide"
  | "hero"
  | "strategy"
  | "faq"
  | "calendar"
  | "image";

export interface BaseContent {
  slug: string;
  title: string;
  summary: string;
  updated: string;
  tags: string[];
  featured: boolean;
  order: number;
  heroImage?: string;
}

export interface SchedulePhase {
  phase: string;
  timing: string;
  note?: string;
}

export interface RewardRow {
  reward: string;
  amount: string;
  notes?: string;
}

export interface WalkthroughStep {
  title: string;
  description: string;
  image?: string;
  caption?: string;
  highlights: string[];
}

export interface GameEvent extends BaseContent {
  category: EventCategory;
  difficulty: Difficulty;
  cadence: string;
  duration: string;
  status: "verified" | "community" | "template";
  objective: string;
  requirements: string[];
  schedule: SchedulePhase[];
  rewards: RewardRow[];
  preparation: string[];
  bestPractices: string[];
  mistakes: string[];
  advancedTips: string[];
  checklist: string[];
  requiredScreenshots: string[];
  playerNotes: string[];
  strategyRecommendations: string[];
  walkthrough: WalkthroughStep[];
  body: string;
}

export interface ResourceRequirement {
  item: string;
  amount: string;
  priority: "Core" | "High" | "Optional";
}

export interface GuideStep {
  title: string;
  description: string;
  image?: string;
  caption?: string;
  highlights: string[];
}

export interface Guide extends BaseContent {
  category: string;
  difficulty: Difficulty;
  readingTime: string;
  /** `roster` swaps the numbered guide template for the hero roster body. */
  layout: "standard" | "roster";
  overview: string;
  priorities: string[];
  actions: string[];
  resourceRequirements: ResourceRequirement[];
  tips: string[];
  mistakes: string[];
  steps: GuideStep[];
  related: string[];
  body: string;
}

export interface HeroFact {
  label: string;
  value: string;
}

export interface Hero {
  slug: string;
  name: string;
  rank: string;
  archetype: string;
  role: string;
  summary: string;
  image?: string;
  skills: string[];
  facts: HeroFact[];
}

export interface Strategy extends BaseContent {
  category: string;
  difficulty: Difficulty;
  readingTime: string;
  objective: string;
  actions: string[];
  requirements: string[];
  optimisation: string[];
  tips: string[];
  mistakes: string[];
  metrics: { label: string; value: string; note?: string }[];
  related: string[];
  body: string;
}

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  tags: string[];
}

export type CalendarCategory =
  | "Alliance Events"
  | "Survival Battle"
  | "Alliance vs Alliance"
  | "State Events"
  | "Resource Events"
  | "Hero Events"
  | "Plague Events";

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  category: CalendarCategory;
  description: string;
  phase?: string;
  source: "Alliance leadership" | "In-game screen" | "Community guide" | "Planning template";
  overlapWith?: string[];
  href?: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  category:
    | "Events"
    | "Heroes"
    | "Troops"
    | "Buildings"
    | "Research"
    | "Alliance Activities"
    | "Strategies"
    | "Battle Reports";
  src: string;
  width: number;
  height: number;
  description: string;
  tags: string[];
  credit: string;
}

export interface SearchDoc {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  content: string;
  date?: string;
}

export interface SiteConfig {
  allianceName: string;
  callsign: string;
  server: string;
  /** Launch day on the server clock (`YYYY-MM-DD`); counts as day 1. */
  serverLaunch: string;
  tagline: string;
  description: string;
  discordUrl: string;
  contactEmail: string;
  updated: string;
  stats: { label: string; value: string }[];
  disclaimer: string;
}

export interface GiftCode {
  code: string;
  /** Optional reward summary when a source states it. */
  reward?: string;
}

export interface GiftCodeSource {
  label: string;
  url: string;
  note: string;
}

export interface GiftCodeConfig {
  /** Date the page content was last edited (`YYYY-MM-DD`). */
  updated: string;
  /** Date every remaining code was last confirmed redeemable. */
  checked: string;
  redemptionUrl: string;
  codes: GiftCode[];
  sources: GiftCodeSource[];
}

export interface AllianceMember {
  name: string;
  power: number;
  /** Total might of every hero combined; null when the source does not publish it. */
  totalHeroMight: number | null;
  /** Might of the member's strongest single hero; null when the source does not publish it. */
  heroHighestMight: number | null;
  kills: number;
  /** The source calls this a castle; the page calls it a sanctuary. */
  sanctuary: number;
  /** ISO timestamp of when the member joined the alliance. */
  joined: string;
}

export interface AllianceRoster {
  /** Date the roster was last scraped (`YYYY-MM-DD`). */
  updated: string;
  /** Public leaderboard page the data was read from. */
  source: string;
  alliance: {
    name: string;
    tag: string;
    server: number;
    power: number;
    kills: number;
    members: number;
    /** ISO timestamp of the source snapshot. */
    asOf: string;
  };
  members: AllianceMember[];
}
