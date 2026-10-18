export const eventCategories = [
  "Survival Battle",
  "Alliance vs Alliance",
  "State Events",
  "Plague Events",
  "Doomsday Challenge",
  "Resource Events",
  "Hero Events",
] as const;

export const calendarCategories = [
  "Alliance Events",
  "Survival Battle",
  "Alliance vs Alliance",
  "State Events",
  "Resource Events",
  "Hero Events",
  "Plague Events",
] as const;

export interface NavItem {
  label: string;
  href: string;
  description?: string;
  children?: NavItem[];
}

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Events",
    href: "/events/",
    description: "Every recurring event, scored and broken down",
    children: eventCategories.map((category) => ({
      label: category,
      href: `/events/${category.toLowerCase().replaceAll(" ", "-").replaceAll("vs", "vs")}/`,
    })),
  },
  { label: "Guides", href: "/guides/" },
  { label: "Strategies", href: "/strategies/" },
  { label: "Alliance vs Alliance", href: "/alliance-vs-alliance/" },
  { label: "Calendar", href: "/calendar/" },
  { label: "Gallery", href: "/gallery/" },
  { label: "FAQ", href: "/faq/" },
];

export const footerNav = [
  {
    heading: "Intel",
    links: [
      { label: "Event guides", href: "/events/" },
      { label: "Field guides", href: "/guides/" },
      { label: "Strategy hub", href: "/strategies/" },
      { label: "AvA command", href: "/alliance-vs-alliance/" },
    ],
  },
  {
    heading: "Tools",
    links: [
      { label: "Event calendar", href: "/calendar/" },
      { label: "Image library", href: "/gallery/" },
      { label: "Search archive", href: "/search/" },
      { label: "FAQ", href: "/faq/" },
    ],
  },
  {
    heading: "Alliance",
    links: [
      { label: "Admin dashboard", href: "/admin/" },
      { label: "Content studio", href: "/admin/cms/" },
      { label: "Contribute a guide", href: "/admin/#contributing" },
      { label: "Contact command", href: "/admin/#contact" },
    ],
  },
];

export const avaSections = [
  { id: "overview", label: "How AvA works" },
  { id: "scoring", label: "Scoring categories" },
  { id: "phases", label: "Five-phase plan" },
  { id: "overlap", label: "Overlap windows" },
  { id: "planning", label: "Upgrade planning" },
  { id: "coordination", label: "Alliance coordination" },
  { id: "daily-plan", label: "Daily action plan" },
  { id: "errors", label: "Common errors" },
] as const;

export const guideCategories = [
  "Core Systems",
  "Progression",
  "Economy",
  "Combat",
  "Advanced Play",
] as const;

export const strategyCategories = [
  "Alliance Play",
  "Event Scoring",
  "Resource Economy",
  "Combat",
  "Free to Play",
] as const;
