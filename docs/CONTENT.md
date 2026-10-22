# Content Guide

All content is file-based and typed. Pages are generated from filenames and frontmatter, so adding a file adds a page automatically.

## Collections

| Folder / file | Format | Route |
| --- | --- | --- |
| `content/events/*.mdx` | MDX + YAML frontmatter | `/events/{filename}/` |
| `content/guides/*.mdx` | MDX + YAML frontmatter | `/guides/{filename}/` |
| `content/strategies/*.mdx` | MDX + YAML frontmatter | `/strategies/{filename}/` |
| `content/faq/faq.json` | JSON list | `/faq/` |
| `data/heroes.json` | JSON list (generated) | `/guides/know-your-heroes/` |
| `data/calendar-events.json` | JSON list | `/calendar/` |
| `data/gallery.json` | JSON list | `/gallery/` |
| `data/gift-codes.json` | JSON object | `/tools/gift-codes/` |
| `data/site.json` | JSON object | Header, footer and metadata identity |

Filenames become URL slugs. Use lowercase, hyphenated names. Do not rename a live file without adding a redirect or updating incoming links.

## Gift codes

`data/gift-codes.json` is the page's source. The site is a static export, so the page cannot scrape at request time; instead [`.github/workflows/refresh-gift-codes.yml`](../.github/workflows/refresh-gift-codes.yml) runs [`scripts/refresh-gift-codes.mjs`](../scripts/refresh-gift-codes.mjs) at minute 0 of every hour (UTC).

What the hourly job does:

1. Fetches Last Asylum Wiki, UCNGame and Pocket Gamer. The wiki is authoritative because it publishes an explicit working list, an expired list and the date of its in-game check; the other two lag behind and still label expired codes as active, so they are reachability cross-checks only.
2. Parses the wiki's working codes and in-game check date, then refuses to write anything if the page structure has changed, the working set is implausibly small, or a code is listed as both working and expired. A failed check fails the workflow and leaves the previous list live.
3. Writes `codes` in source order, deduplicates case-insensitively and preserves any hand-added `reward` notes for codes that are still working.
4. Commits only when the working set or check date changed. The commit triggers the normal static deployment; an unchanged run makes no commit and no deploy.

GitHub's scheduled runs are best-effort and can start a few minutes late under load, but the cron is pinned to minute 0. Run the check locally before changing the script:

```bash
node scripts/refresh-gift-codes.mjs --dry-run
GIFT_CODES_FILE=./gift-codes-test.tmp.json node scripts/refresh-gift-codes.mjs
```

```json
{
  "updated": "2026-10-22",
  "checked": "2026-10-21",
  "redemptionUrl": "https://gevents.globallap.com/gamecode/index.html?gameId=440",
  "codes": [{ "code": "LA1OW9F7X" }],
  "sources": [{ "label": "…", "url": "…", "note": "In-game check, 21 October 2026" }]
}
```

Manual edits are still supported when a source cannot be fetched:

1. Check the three source pages listed in `sources`. The wiki publishes an explicit expired list; trust its newest in-game check when sources disagree.
2. Paste only working codes into `codes`, newest first, and delete anything marked expired. The page also collapses case-insensitive duplicates at read time.
3. Update `checked` (date of the in-game verification) and `updated` (date you edited the file). Both are printed on the page.
4. If the official redemption portal URL changes, update `redemptionUrl` — it is the only iPhone redemption route. The next hourly run preserves it.

Rewards are optional (`reward` on a code entry). Only add them when a source states the exact contents; otherwise the row stays clean.

## Alliance identity

`data/site.json` drives the branding everywhere (header, footer, page metadata, manifest, OpenGraph, JSON-LD):

```json
{
  "allianceName": "Savage Rebelz",
  "callsign": "SAVR",
  "server": "Server #297",
  "serverLaunch": "2026-07-26",
  "discordUrl": "https://discord.gg/…",
  "contactEmail": "command@…"
}
```

Name and callsign are rendered together as `Savage Rebelz (SAVR)`. Keep the callsign short — it is used in the header subline, hero badge and app manifest.

`serverLaunch` is the day the server opened, written as a server-clock calendar day (`YYYY-MM-DD`, midnight UTC-2). The top bar reads it as `Day 87 · OCTOBER 20, 2026`: the launch day is day 1, so a launch of `2026-07-26` reads day 1 that morning and day 87 on `2026-10-20`. The counter is computed in the browser and rolls over at server midnight, so a static build never freezes on an old day — move the date forward whenever the server relaunches.

The visual identity is separate from the text identity:

- **Alliance wordmark** — `public/brand/savr-wordmark-*` renders in the header, footer, mobile drawer, admin and OG art. Replace `assets/brand/savr-wordmark-source.jpg` with new lettering on a black background and run `npm run assets:brand`; the script knocks the background out and rebuilds the AVIF/webp set, the square crest and the app icons.
- **Game wordmark** — `public/brand/la-wordmark-*` is the Last Asylum logo in the homepage hero only. Replace `assets/brand/last-asylum-wordmark-source.png` (transparent PNG) and run `npm run assets:logo`.
- **Crest** — `public/brand/savr-mark.png` is the square badge in the hero dossier bar.
- **Icons** — `app/icon.png`, `app/apple-icon.png` and the `public/icon-*.png` files all come from the alliance artwork.

The alliance wordmark spells the callsign while the JSON supplies the full name used in prose, titles and metadata; keep the two in agreement so a rebrand updates copy and screenshots together.

## Event frontmatter

Required fields drive the event template:

```yaml
title: "Survival Battle"
summary: "One or two sentences used on cards and metadata."
category: "Survival Battle"       # one of the seven categories
difficulty: "Intermediate"        # Beginner | Intermediate | Advanced
cadence: "Daily · 6 rounds"
duration: "24 hours per cycle"
status: "community"               # verified | community | template
updated: "2026-10-18"
featured: true
order: 1
heroImage: "/images/gallery/event-survival-battle.webp"
tags: ["survival battle", "rounds", "scoring"]
```

Then the structured sections:

- `objective` (string)
- `requirements` (list)
- `schedule` (list of `{ phase, timing, note }`)
- `rewards` (list of `{ reward, amount, notes }`)
- `preparation` (list)
- `bestPractices` (list)
- `mistakes` (list)
- `advancedTips` (list)
- `checklist` (list — rendered as an interactive, device-local checklist)
- `requiredScreenshots` (list)
- `playerNotes` (list)
- `strategyRecommendations` (list)
- `walkthrough` (list of `{ title, description, image, caption, highlights }`)

The MDX body is inserted under **Overview & objective**. Use it for deeper analysis, tables and callouts. If a required list is empty, the page still builds; add "Content to be added by Alliance Leadership" rather than inventing data.

## Guide frontmatter

```yaml
title: "Hero Development"
summary: "..."
category: "Progression"
difficulty: "Intermediate"
readingTime: "14 min"
updated: "2026-10-18"
featured: true
order: 2
heroImage: "/images/gallery/hero-breakthrough.webp"
tags: ["heroes", "shards"]
overview: "The opening paragraph."
priorities: ["..."]
actions: ["..."]
resourceRequirements:
  - { item: "Hero shards", amount: "Breakpoint-dependent", priority: "Core" }
tips: ["..."]
mistakes: ["..."]
steps:
  - title: "Audit the roster"
    description: "..."
    image: "/images/gallery/hero-roster.webp"
    caption: "..."
    highlights: ["Role coverage", "Current stars"]
related: ["hero-events", "event-optimisation"]
```

`related` can reference a guide slug, event slug or strategy slug. Unknown slugs are ignored gracefully.

### Roster layout

Add `layout: "roster"` to a guide to swap the numbered guide template for the hero roster body. The page keeps the header, sidebar, tips/mistakes and related links, but drops the priorities, resource and walkthrough sections, so the MDX body leads with the roster.

## Hero roster

`data/heroes.json` powers the “Know Your Heroes” cheat sheets. It is generated, not hand-edited:

```bash
npm run heroes:import   # scrapes the published roster into data/heroes.json
npm run build:search    # also refreshes the search index (heroes become search results)
```

The importer reads `https://www.last-asylum.com/heroes.html`, splits `Warrior / Tank` into `archetype` and `role`, lifts “Key skills” into their own array, and keeps every other bullet as a `{ label, value }` fact. Portraits are wired up automatically when `public/images/heroes/{slug}.webp` exists; without one the card renders a themed “portrait pending” state.

Each hero also becomes its own search document pointing at `/guides/know-your-heroes/#hero-{slug}`, so a member can jump straight from search to a single cheat sheet.

## Strategy frontmatter

```yaml
title: "Event Optimisation"
summary: "..."
category: "Event Scoring"
difficulty: "Advanced"
readingTime: "13 min"
updated: "2026-10-18"
featured: true
order: 2
objective: "..."
actions: ["..."]
requirements: ["..."]
optimisation: ["..."]
tips: ["..."]
mistakes: ["..."]
metrics:
  - { label: "Overlap windows used", value: "3–5 / week", note: "Quality beats quantity." }
related: ["survival-battle-overlap", "alliance-vs-alliance"]
```

## FAQ JSON

```json
{
  "items": [
    {
      "id": "ava-scoring",
      "category": "Alliance vs Alliance",
      "question": "How does Alliance Duel scoring work?",
      "answer": "Plain text. Use \\n\\n for paragraphs.",
      "tags": ["ava", "scoring"]
    }
  ]
}
```

Category options are defined in the Decap config and rendered from the data. IDs must be stable and unique; they are used for deep links (`/faq/#ava-scoring`) and the search index.

## Calendar JSON

```json
{
  "events": [
    {
      "id": "ava-2026-10-19",
      "title": "Alliance Duel · Week 42",
      "start": "2026-10-19T00:00:00Z",
      "end": "2026-10-25T23:59:00Z",
      "category": "Alliance vs Alliance",
      "description": "Short planning note.",
      "phase": "Raven → Construction → Tech → Hero → Preparation → Raid",
      "source": "Community guide",
      "overlapWith": ["survival-2026-10-19"],
      "href": "/alliance-vs-alliance/"
    }
  ]
}
```

Sources: `Alliance leadership`, `In-game screen`, `Community guide`, `Planning template`. The source appears in the calendar and search results. Use `Planning template` for anything you have not verified in-game.

`start` and `end` are stored on the **in-game clock**, which runs at **UTC-2** — always write them as `YYYY-MM-DDTHH:mm:ssZ` and enter the time you see in game. The `Z` is a storage convention, not a claim that the value is UTC: `00:00Z` here is midnight on the server, i.e. 02:00 UTC. The site re-labels each value live for every visitor: the header clock chip switches between server time (`UTC-2`) and the player's own offset, and the calendar, event lists and countdowns all follow that choice. Never store a player's local time in the JSON.

The CMS datetime fields use UTC pickers (`picker_utc: true`) so the editor's own timezone cannot shift the value; what leadership picks is exactly what is saved, on the server clock. Dates can be edited for any day, including today, and a window that has already opened stays listed as live until its `end` passes.

## Gallery JSON

```json
{
  "id": "event-survival-battle",
  "title": "Survival Battle — Six-Round Board",
  "category": "Events",
  "src": "/images/gallery/event-survival-battle.webp",
  "width": 1600,
  "height": 900,
  "description": "Reference layout, not an official screenshot.",
  "tags": ["survival battle", "scoring"],
  "credit": "Alliance archive placeholder — replace with an in-game capture"
}
```

Categories: Events, Heroes, Troops, Buildings, Research, Alliance Activities, Strategies, Battle Reports.

## MDX components

The MDX body supports standard Markdown plus these custom components:

```mdx
<Callout type="warning" title="Verify before spending">
Your text here.
</Callout>

<Screenshot
  src="/images/gallery/event-survival-battle.webp"
  alt="Live event board"
  caption="Captured 18 Oct 2026."
  highlights={["Active theme", "Round timer"]}
/>

<Steps>
  <Step title="Read the board">...</Step>
  <Step title="Stage the action">...</Step>
</Steps>

<StaticChecklist items={["Confirm reset", "Post the plan"]} title="Pre-phase" />

<HeroRoster />
```

Callout types: `info`, `warning`, `danger`, `success`, `strategy`.

Screenshot without `src` renders an explicit upload placeholder with a link to the studio. Every screenshot supports a caption, annotation list and zoomable lightbox.

## Screenshot standards

1. Capture the complete event or system screen.
2. Include the timer and phase/theme when relevant.
3. Blur player names if required by alliance policy.
4. Record the date and server in the caption or credit.
5. Replace placeholder art rather than presenting it as official.
6. For walkthroughs, annotate the exact button or panel the step refers to.

## Verification labels

Every event page displays its status:

- **Verified** — checked against in-game evidence and dated.
- **Community** — structure is community-reported; values may change.
- **Template** — placeholder or unconfirmed; do not spend based on it.

When editing, do not promote a page to `verified` without a dated in-game capture. Keep the warning visible.

## SEO fields

Page titles, descriptions, canonical paths and OpenGraph images are generated from the content fields. Update `updated` when material changes. The sitemap reads the same dates.

## Adding a new event or guide

1. Copy an existing MDX file.
2. Rename it to the new slug.
3. Replace the frontmatter values.
4. Keep the required section lists if the template should feel complete.
5. Add or replace images.
6. Run `npm run build` to verify the route and search index.
7. Open the page on mobile and desktop.

## Publishing without code

Use `/admin/cms/`. The CMS fields map to the frontmatter above. For a new page, it creates the file in the right collection. The body markdown pane is available for longer prose; structured fields are safer for no-code editors.
