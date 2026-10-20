import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const galleryDir = path.join(process.cwd(), "public", "images", "gallery");
const publicDir = path.join(process.cwd(), "public");
fs.mkdirSync(galleryDir, { recursive: true });

/* Green-family tones: each category stays distinguishable on the SAVR theme. */
const accents = {
  Events: "#34e07f",
  Heroes: "#a3e635",
  Troops: "#5eead4",
  Buildings: "#86efac",
  Research: "#22d3ee",
  "Alliance Activities": "#10b981",
  Strategies: "#bef264",
  "Battle Reports": "#f87171",
};

const images = [
  {
    id: "event-survival-battle",
    title: "Survival Battle",
    subtitle: "Six-round scoring board",
    category: "Events",
    motif: "radar",
    code: "EVT-001",
  },
  {
    id: "event-ava-overlap",
    title: "Alliance Duel",
    subtitle: "Overlap window schematic",
    category: "Events",
    motif: "timeline",
    code: "EVT-002",
  },
  {
    id: "event-elixir-scramble",
    title: "Elixir Scramble",
    subtitle: "30-minute map control",
    category: "Events",
    motif: "map",
    code: "EVT-003",
  },
  {
    id: "full-moon-night",
    title: "Full Moon Night",
    subtitle: "Limited-time task and exchange",
    category: "Events",
    motif: "radar",
    code: "EVT-004",
  },
  {
    id: "doomsday-challenge",
    title: "Doomsday Challenge",
    subtitle: "Verification placeholder",
    category: "Events",
    motif: "chart",
    code: "EVT-005",
  },
  {
    id: "resource-salvage",
    title: "Salvage Surge",
    subtitle: "Resource accumulation board",
    category: "Events",
    motif: "bars",
    code: "EVT-006",
  },
  {
    id: "hero-recruitment",
    title: "Recruitment Protocol",
    subtitle: "Shard and banner planning",
    category: "Events",
    motif: "nodes",
    code: "EVT-007",
  },
  {
    id: "hero-roster",
    title: "Hero Roster",
    subtitle: "Role and investment matrix",
    category: "Heroes",
    motif: "squad",
    code: "HER-001",
  },
  {
    id: "hero-breakthrough",
    title: "Hero Breakthrough",
    subtitle: "Shard and skill route",
    category: "Heroes",
    motif: "nodes",
    code: "HER-002",
  },
  {
    id: "troop-counter-matrix",
    title: "Troop Counter Matrix",
    subtitle: "Line-up decision board",
    category: "Troops",
    motif: "grid",
    code: "TRP-001",
  },
  {
    id: "troop-training-queue",
    title: "Training Queue",
    subtitle: "Batch and speed-up plan",
    category: "Troops",
    motif: "bars",
    code: "TRP-002",
  },
  {
    id: "sanctuary-layout",
    title: "Sanctuary Layout",
    subtitle: "Sector and production grid",
    category: "Buildings",
    motif: "base",
    code: "BLD-001",
  },
  {
    id: "construction-priority",
    title: "Construction Priority",
    subtitle: "Queue stacking order",
    category: "Buildings",
    motif: "stack",
    code: "BLD-002",
  },
  {
    id: "research-economy",
    title: "Research: Economy",
    subtitle: "Production branch route",
    category: "Research",
    motif: "tree",
    code: "RND-001",
  },
  {
    id: "research-combat",
    title: "Research: Combat",
    subtitle: "Battle branch route",
    category: "Research",
    motif: "tree",
    code: "RND-002",
  },
  {
    id: "alliance-muster",
    title: "Alliance Muster",
    subtitle: "Rally and online window board",
    category: "Alliance Activities",
    motif: "radar",
    code: "ALN-001",
  },
  {
    id: "falcon-quest-window",
    title: "Falcon Quest",
    subtitle: "Claim synchronisation",
    category: "Alliance Activities",
    motif: "timeline",
    code: "ALN-002",
  },
  {
    id: "event-overlap-value-map",
    title: "Overlap Value Map",
    subtitle: "Stack actions, not calendars",
    category: "Strategies",
    motif: "map",
    code: "STR-001",
  },
  {
    id: "scoring-flow",
    title: "Scoring Flow",
    subtitle: "From stockpile to points",
    category: "Strategies",
    motif: "flow",
    code: "STR-002",
  },
  {
    id: "f2p-spend-ladder",
    title: "F2P Spend Ladder",
    subtitle: "Value per resource unit",
    category: "Strategies",
    motif: "bars",
    code: "STR-003",
  },
  {
    id: "battle-report-delta",
    title: "Battle Report",
    subtitle: "Read the damage delta",
    category: "Battle Reports",
    motif: "chart",
    code: "BTR-001",
  },
  {
    id: "rally-join-window",
    title: "Rally Timing",
    subtitle: "Join window and travel time",
    category: "Battle Reports",
    motif: "timeline",
    code: "BTR-002",
  },
];

function motifMarkup(kind, accent) {
  const stroke = accent;
  const dim = "rgba(148,163,184,0.25)";
  switch (kind) {
    case "radar":
      return `
        <g transform="translate(1050,430)" fill="none" stroke="${stroke}" stroke-width="2" opacity="0.8">
          <circle r="230" stroke="${dim}" />
          <circle r="170" stroke="${dim}" />
          <circle r="110" stroke="${dim}" />
          <circle r="48" />
          <circle r="14" fill="${stroke}" stroke="none" />
          <path d="M-230 0H230M0 -230V230" stroke="${dim}" />
          <path d="M0 0L170 -112" stroke-width="3" />
          <path d="M0 0L-128 -136" stroke-dasharray="8 10" />
          <path d="M0 0L-70 176" stroke-dasharray="8 10" />
          <circle cx="170" cy="-112" r="7" fill="${stroke}" stroke="none" />
          <circle cx="-128" cy="-136" r="5" fill="${stroke}" stroke="none" opacity="0.7" />
        </g>
        <g transform="translate(1150,280)" fill="${stroke}" font-family="monospace" font-size="15" opacity="0.8">
          <text>SCAN 07</text>
          <text y="24">RANGE 240</text>
        </g>`;
    case "timeline":
      return `
        <g transform="translate(760,300)">
          <line x1="0" y1="140" x2="640" y2="140" stroke="${dim}" stroke-width="2" />
          ${[0, 1, 2, 3, 4, 5, 6]
            .map(
              (i) => `
            <line x1="${i * 100}" y1="92" x2="${i * 100}" y2="188" stroke="${dim}" />
            <circle cx="${i * 100}" cy="140" r="${i === 2 || i === 4 ? 10 : 5}" fill="${i === 2 || i === 4 ? stroke : dim}" />`,
            )
            .join("")}
          <rect x="190" y="90" width="220" height="42" fill="${stroke}" opacity="0.18" stroke="${stroke}" />
          <text x="200" y="117" fill="${stroke}" font-family="monospace" font-size="16">OVERLAP WINDOW</text>
          <text x="0" y="240" fill="${dim}" font-family="monospace" font-size="14">DAY 1</text>
          <text x="300" y="240" fill="${dim}" font-family="monospace" font-size="14">DAY 4</text>
          <text x="580" y="240" fill="${dim}" font-family="monospace" font-size="14">DAY 7</text>
        </g>`;
    case "map":
      return `
        <g transform="translate(940,420)" fill="none" stroke="${stroke}" stroke-width="2" opacity="0.85">
          <path d="M-210 -160L-60 -210L80 -140L230 -180L190 10L250 160L80 220L-80 160L-230 190Z" stroke="${dim}" />
          <path d="M-60 -210L-20 -40L190 10M-230 190L-80 100L80 220M-20 -40L-80 100L80 -140L190 10" stroke="${dim}" stroke-dasharray="7 9" />
          <circle cx="-20" cy="-40" r="18" fill="${stroke}" stroke="none" />
          <circle cx="190" cy="10" r="10" fill="${stroke}" stroke="none" opacity="0.7" />
          <circle cx="-80" cy="100" r="14" stroke-width="4" />
          <circle cx="80" cy="-140" r="7" fill="${stroke}" stroke="none" opacity="0.6" />
        </g>
        <g transform="translate(805,220)" fill="${stroke}" font-family="monospace" font-size="14" opacity="0.75">
          <text>SECTOR 04 // CONTESTED</text>
          <text y="22">3 ALLIANCE PINS ACTIVE</text>
        </g>`;
    case "squad":
      return `
        <g transform="translate(1080,420)" opacity="0.9">
          ${[
            [-170, -40, 0.38],
            [0, -120, 0.68],
            [170, -40, 0.5],
            [-90, 110, 0.28],
            [90, 110, 0.55],
          ]
            .map(
              ([x, y, o]) => `
            <g transform="translate(${x},${y})">
              <path d="M0 -86L62 -52V34L0 78L-62 34V-52Z" fill="${stroke}" opacity="${o * 0.18}" stroke="${stroke}" stroke-width="2" />
              <circle cx="0" cy="-18" r="20" fill="none" stroke="${stroke}" stroke-width="3" opacity="${o + 0.25}" />
              <path d="M-32 50C-30 8 -16 -4 0 -4C16 -4 30 8 32 50" fill="none" stroke="${stroke}" stroke-width="3" opacity="${o + 0.25}" />
            </g>`,
            )
            .join("")}
        </g>`;
    case "nodes":
      return `
        <g transform="translate(1040,420)" fill="none" stroke="${stroke}" stroke-width="2">
          <path d="M0 -160L150 -60L100 120L-80 160L-160 -20Z" stroke="${dim}" stroke-dasharray="6 9" />
          <path d="M0 -160V20M0 20L150 -60M0 20L100 120M0 20L-80 160M0 20L-160 -20" stroke="${dim}" />
          <circle cx="0" cy="20" r="44" fill="${stroke}" opacity="0.18" />
          <circle cx="0" cy="20" r="20" fill="${stroke}" stroke="none" />
          ${[
            [0, -160],
            [150, -60],
            [100, 120],
            [-80, 160],
            [-160, -20],
          ]
            .map(
              ([x, y]) =>
                `<circle cx="${x}" cy="${y}" r="10" fill="#0b0f12" stroke="${stroke}" stroke-width="3" />`,
            )
            .join("")}
        </g>`;
    case "grid":
      return `
        <g transform="translate(970,230)" opacity="0.9">
          ${[0, 1, 2]
            .map(
              (row) =>
                [0, 1, 2]
                  .map(
                    (col) => `
                <rect x="${col * 150}" y="${row * 150}" width="126" height="126" fill="${stroke}" opacity="${
                  (row + col) % 3 === 0 ? 0.24 : 0.06
                }" stroke="${stroke}" stroke-width="1.5" />
                <path d="M${col * 150 + 24} ${row * 150 + 98}L${col * 150 + 100} ${row * 150 + 28}" stroke="${stroke}" stroke-width="3" opacity="0.65" />
                <path d="M${col * 150 + 80} ${row * 150 + 98}L${col * 150 + 100} ${row * 150 + 28}" stroke="${stroke}" stroke-width="3" opacity="0.65" />`,
                  )
                  .join(""),
            )
            .join("")}
        </g>`;
    case "bars":
      return `
        <g transform="translate(850,520)">
          ${[210, 330, 160, 390, 260, 430]
            .map(
              (height, i) => `
            <rect x="${i * 100}" y="${-height}" width="58" height="${height}" fill="${stroke}" opacity="${0.25 + i * 0.1}" />
            <line x1="${i * 100}" y1="0" x2="${i * 100 + 58}" y2="0" stroke="${dim}" />`,
            )
            .join("")}
          <line x1="0" y1="-460" x2="640" y2="-460" stroke="${dim}" stroke-dasharray="5 7" />
          <text x="0" y="-478" fill="${stroke}" font-family="monospace" font-size="14" opacity="0.8">VALUE / HOUR</text>
        </g>`;
    case "base":
      return `
        <g transform="translate(990,400)" fill="none" stroke="${stroke}" stroke-width="2" opacity="0.9">
          <path d="M-280 120L-140 -160H140L280 120Z" stroke="${dim}" />
          <path d="M-210 60H210M-250 120H250" stroke="${dim}" />
          <rect x="-100" y="-70" width="200" height="130" fill="${stroke}" opacity="0.12" />
          <rect x="-100" y="-70" width="200" height="130" />
          <path d="M-100 -70L0 -130L100 -70M0 -130V-190" stroke-width="3" />
          <rect x="-40" y="-10" width="36" height="70" fill="${stroke}" opacity="0.5" />
          <rect x="10" y="-10" width="50" height="36" fill="${stroke}" opacity="0.25" />
          <circle cx="-210" cy="80" r="22" stroke-dasharray="5 5" />
          <circle cx="220" cy="80" r="22" stroke-dasharray="5 5" />
        </g>`;
    case "stack":
      return `
        <g transform="translate(920,310)" opacity="0.9">
          ${[0, 1, 2, 3]
            .map(
              (i) => `
            <g transform="translate(${i * 46},${i * 52})">
              <path d="M0 0H330L360 30V160H0Z" fill="${stroke}" opacity="${0.08 + i * 0.07}" stroke="${stroke}" stroke-width="1.5" />
              <rect x="26" y="28" width="180" height="12" fill="${stroke}" opacity="0.45" />
              <rect x="26" y="54" width="120" height="8" fill="${dim}" />
            </g>`,
            )
            .join("")}
        </g>`;
    case "tree":
      return `
        <g transform="translate(900,360)" fill="none" stroke="${stroke}" stroke-width="2" opacity="0.9">
          <path d="M0 200V-120M0 120H160M0 40H-160M160 40H300M-160 40H-300M0 -60H160M0 -120H-160" stroke="${dim}" />
          <circle cx="0" cy="200" r="20" fill="${stroke}" stroke="none" />
          <circle cx="160" cy="120" r="12" fill="${stroke}" stroke="none" opacity="0.8" />
          <circle cx="-160" cy="40" r="12" fill="${stroke}" stroke="none" opacity="0.6" />
          <circle cx="300" cy="40" r="12" fill="${stroke}" stroke="none" opacity="0.8" />
          <circle cx="-300" cy="40" r="12" fill="${stroke}" stroke="none" opacity="0.45" />
          <circle cx="160" cy="-60" r="12" fill="${stroke}" stroke="none" opacity="0.65" />
          <circle cx="-160" cy="-120" r="12" fill="${stroke}" stroke="none" opacity="0.45" />
          <rect x="-54" y="104" width="108" height="32" fill="#0b0f12" stroke="${stroke}" opacity="0.9" />
        </g>`;
    case "flow":
      return `
        <g transform="translate(780,270)" opacity="0.9">
          ${["STOCKPILE", "TRIGGER", "SCORE", "CLAIM"]
            .map(
              (label, i) => `
            <g transform="translate(${i * 170},0)">
              <path d="M0 0H130L150 20V110H0Z" fill="${stroke}" opacity="0.09" stroke="${stroke}" stroke-width="1.5" />
              <text x="18" y="46" fill="${stroke}" font-family="monospace" font-size="15">${label}</text>
              <rect x="18" y="64" width="80" height="8" fill="${stroke}" opacity="0.3" />
            </g>
            ${i < 3 ? `<path d="M${i * 170 + 154} 56H${i * 170 + 184}" stroke="${stroke}" stroke-width="2" />` : ""}`,
            )
            .join("")}
          <path d="M590 56H650V200H40V130" stroke="${stroke}" stroke-dasharray="6 8" fill="none" />
        </g>`;
    case "chart":
    default:
      return `
        <g transform="translate(820,420)" fill="none" stroke="${stroke}" stroke-width="2" opacity="0.9">
          <path d="M0 160V-140M0 160H520" stroke="${dim}" />
          <path d="M0 40L80 -20L150 90L240 -90L330 20L420 -110L520 -30" stroke="${stroke}" stroke-width="3" />
          <path d="M0 90L80 30L150 120L240 -20L330 90L420 -40L520 30" stroke="${dim}" stroke-dasharray="6 8" />
          ${[0, 1, 2, 3, 4, 5, 6]
            .map(
              (i) =>
                `<line x1="${i * 86}" y1="160" x2="${i * 86}" y2="170" stroke="${dim}" />`,
            )
            .join("")}
          <circle cx="420" cy="-110" r="8" fill="${stroke}" stroke="none" />
        </g>`;
  }
}

function artworkSvg(image) {
  const accent = accents[image.category] ?? "#34e07f";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0c1115" />
        <stop offset="0.55" stop-color="#080b0d" />
        <stop offset="1" stop-color="#121417" />
      </linearGradient>
      <radialGradient id="glow" cx="0.72" cy="0.45" r="0.6">
        <stop offset="0" stop-color="${accent}" stop-opacity="0.20" />
        <stop offset="1" stop-color="${accent}" stop-opacity="0" />
      </radialGradient>
      <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M48 0H0V48" fill="none" stroke="#94a3b8" stroke-opacity="0.055" stroke-width="1" />
      </pattern>
      <pattern id="noise" width="7" height="7" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="0.7" fill="#94a3b8" opacity="0.09" />
      </pattern>
    </defs>
    <rect width="1600" height="900" fill="url(#bg)" />
    <rect width="1600" height="900" fill="url(#grid)" />
    <rect width="1600" height="900" fill="url(#glow)" />
    <rect width="1600" height="900" fill="url(#noise)" />
    <path d="M0 72H1600" stroke="#94a3b8" stroke-opacity="0.12" />
    <path d="M0 760H1600" stroke="#94a3b8" stroke-opacity="0.12" />
    <g font-family="'Arial Narrow', Arial, sans-serif">
      <text x="64" y="48" fill="${accent}" font-family="monospace" font-size="15" letter-spacing="4">FIELD IMAGE // ${image.code}</text>
      <text x="1536" y="48" fill="#94a3b8" font-family="monospace" font-size="13" letter-spacing="3" text-anchor="end">${image.category.toUpperCase()}</text>
      <text x="64" y="700" fill="#f5f2ec" font-size="74" font-weight="700" letter-spacing="2">${image.title.toUpperCase()}</text>
      <text x="66" y="748" fill="#9aa4ad" font-family="monospace" font-size="20" letter-spacing="1">${image.subtitle.toUpperCase()}</text>
      <text x="1536" y="880" fill="#5c6872" font-family="monospace" font-size="12" letter-spacing="2" text-anchor="end">REFERENCE PLACEHOLDER · REPLACE WITH IN-GAME CAPTURE</text>
      <text x="64" y="880" fill="#5c6872" font-family="monospace" font-size="12" letter-spacing="2">SAVAGE REBELS // SAVR OPS</text>
    </g>
    <g stroke="${accent}" stroke-opacity="0.8">
      <path d="M64 88h34M64 88v34" fill="none" />
      <path d="M1536 720h-34M1536 720v34" fill="none" />
    </g>
    ${motifMarkup(image.motif, accent)}
    <g opacity="0.55" font-family="monospace" font-size="11" fill="#65717b">
      <text x="64" y="836">LAT 00.000 / LON 00.000</text>
      <text x="260" y="836">SOURCE: ALLIANCE ARCHIVE</text>
      <text x="510" y="836">STATUS: AWAITING UPLOAD</text>
    </g>
  </svg>`;
}

for (const image of images) {
  const svg = artworkSvg(image);
  await sharp(Buffer.from(svg))
    .webp({ quality: 88 })
    .toFile(path.join(galleryDir, `${image.id}.webp`));
  fs.writeFileSync(path.join(galleryDir, `${image.id}.svg`), svg);
}

const siteConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "site.json"), "utf8"));
const wordmarkFile = path.join(process.cwd(), "assets", "brand", "savr-wordmark.png");
const wordmarkData = fs.existsSync(wordmarkFile)
  ? `data:image/png;base64,${fs.readFileSync(wordmarkFile).toString("base64")}`
  : null;
const brandGreen = "#4ade80";

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#080c0a" />
      <stop offset="1" stop-color="#12181a" />
    </linearGradient>
    <radialGradient id="glow" cx="0.78" cy="0.24" r="0.72">
      <stop offset="0" stop-color="${brandGreen}" stop-opacity="0.22" />
      <stop offset="1" stop-color="${brandGreen}" stop-opacity="0" />
    </radialGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0V40" fill="none" stroke="#94a3b8" stroke-opacity="0.08" />
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)" />
  <rect width="1200" height="630" fill="url(#glow)" />
  <rect width="1200" height="630" fill="url(#grid)" />
  ${
    wordmarkData
      ? `<image xlink:href="${wordmarkData}" href="${wordmarkData}" x="64" y="46" width="380" height="132" preserveAspectRatio="xMinYMin meet" />`
      : `<text x="64" y="150" fill="#f5f2ec" font-family="monospace" font-size="72" font-weight="700">${siteConfig.callsign}</text>`
  }
  <g font-family="'Arial Narrow', Arial, sans-serif">
    <text x="64" y="248" fill="${brandGreen}" font-family="monospace" font-size="15" letter-spacing="4">${siteConfig.allianceName.toUpperCase()} (${siteConfig.callsign}) // ALLIANCE KNOWLEDGE BASE</text>
    <text x="64" y="342" fill="#f5f2ec" font-size="80" font-weight="700">LAST ASYLUM:</text>
    <text x="64" y="424" fill="${brandGreen}" font-size="80" font-weight="700">PLAGUE</text>
    <text x="64" y="478" fill="#c3c9cf" font-size="23" letter-spacing="2">EVENTS · STRATEGIES · OPTIMISATION · COORDINATION</text>
    <path d="M64 512H800" stroke="${brandGreen}" stroke-opacity="0.55" />
    <text x="64" y="552" fill="#9aa4ad" font-family="monospace" font-size="16" letter-spacing="2">SURVIVAL BATTLE · ALLIANCE VS ALLIANCE · STATE OPS</text>
    <text x="64" y="592" fill="#5c6872" font-family="monospace" font-size="13" letter-spacing="2">FAN-MADE · VERIFY LIVE EVENT DATA IN-GAME</text>
    <circle cx="1000" cy="330" r="150" fill="none" stroke="${brandGreen}" stroke-opacity="0.28" stroke-width="2" />
    <circle cx="1000" cy="330" r="105" fill="none" stroke="${brandGreen}" stroke-opacity="0.18" stroke-width="2" />
    <circle cx="1000" cy="330" r="52" fill="${brandGreen}" opacity="0.16" stroke="${brandGreen}" />
    <path d="M1000 180V480M850 330H1150" stroke="${brandGreen}" stroke-opacity="0.22" />
    <path d="M1000 330L1100 270" stroke="${brandGreen}" stroke-width="3" />
    <circle cx="1100" cy="270" r="7" fill="${brandGreen}" />
  </g>
</svg>`;

await sharp(Buffer.from(ogSvg)).png().toFile(path.join(publicDir, "og.png"));

// Keep the public svg light: reference the published wordmark instead of
// embedding the whole base64 master used for rendering.
const ogSvgPublic = wordmarkData
  ? ogSvg.replace(
      /<image[^>]*\/>/,
      '<image xlink:href="brand/savr-wordmark.webp" href="brand/savr-wordmark.webp" x="64" y="46" width="380" height="132" preserveAspectRatio="xMinYMin meet" />',
    )
  : ogSvg;
fs.writeFileSync(path.join(publicDir, "og.svg"), ogSvgPublic);

console.log(`Generated ${images.length} gallery images, og.png and og.svg`);
