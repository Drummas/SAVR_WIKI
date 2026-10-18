# Architecture

## Design goals

- Static-first: all public pages are pre-rendered and deploy without a server.
- Content/presentation separation: routes consume typed content models, not raw files.
- Alliance-first: every feature is designed for coordination, not solo play.
- Cheap to run: no database, external search service or analytics required today.
- Ready to grow: calculators, accounts, dashboards and Discord can be added without discarding the content layer.

## Request flow

```
content/*.mdx  ──frontmatter──►  lib/content.ts  ──►  app/events/[slug]/page.tsx
data/*.json    ──JSON────────►  typed getters   ──►  calendar, gallery, FAQ, sitemap
                                           │
                                           └──► scripts/build-search-index.mjs ──► /public/search-index.json
```

At build time:

1. `scripts/build-search-index.mjs` scans every collection and writes a static text index.
2. Next.js calls `generateStaticParams` for events, guides and strategies.
3. Each page compiles its MDX body with `next-mdx-remote/rsc`, custom components and GFM tables.
4. `app/sitemap.ts`, `app/robots.ts` and `app/manifest.ts` emit SEO/PWA artifacts.
5. `output: "export"` writes everything to `out/`.

At runtime the browser only loads the search index when the user opens search, the gallery or a page that needs it. There is no API server.

## Content layer

`lib/content.ts` is the current file adapter. It:

- Reads MDX and parses frontmatter with `gray-matter`.
- Applies safe defaults so partial content never crashes a page.
- Sorts collections by `order` then title.
- Exposes typed getters (`getEvents`, `getGuides`, `getStrategies`, `getFaq`, `getCalendarEvents`, `getGallery`, `getSiteConfig`).
- Resolves related content by tags/slug where appropriate.

`lib/types.ts` is the contract. Any future database adapter must return these shapes to keep pages unchanged.

### Adding a database adapter later

1. Keep `lib/types.ts` as the domain model.
2. Implement a `ContentRepository` interface with the same getters.
3. Create a Supabase adapter that maps rows to the existing types.
4. Switch the page imports from the file adapter to the shared repository export.
5. Keep the file adapter for local preview and disaster recovery.

A simple module-level factory is enough:

```ts
export interface ContentRepository {
  getEvents(): Promise<GameEvent[]>;
  getEvent(slug: string): Promise<GameEvent | undefined>;
  // ...
}
```

The current static build uses synchronous getters. A database adapter can be async; pages are already async server components except for static `generateStaticParams` and metadata helpers. For an SSR/Supabase deployment, remove `output: "export"` and make the route helpers async.

## Data model

The included Supabase migration maps the file collections to:

- `alliances` and `alliance_members` — identity and roles
- `profiles` — display name and avatar linked to `auth.users`
- `content_items` — events, guides and strategies with a shared searchable body and a `data` JSONB field for template-specific sections
- `calendar_events`
- `gallery_images`
- `faq_items`
- `content_revisions` and `audit_logs` — editorial history

The JSONB approach keeps the current frontmatter shapes intact: an event's `schedule`, `rewards`, `walkthrough`, etc. can be stored in `data` without a schema migration for every new field. Stable query fields (title, category, status, dates, slug) remain typed columns.

## Authentication and roles

The static site is public. The future member portal should use Supabase Auth (or another OIDC provider) and the following role ladder:

| Role | Capability |
| --- | --- |
| `member` | Read private alliance data, submit contributions, personal planners |
| `captain` | Manage event notes, phase plans, moderate contributions |
| `officer` | Manage calendar, gallery, FAQ, member roster |
| `commander` | Publish content, manage roles, alliance settings |
| `admin` | Platform-level administration (multi-alliance) |

The SQL migration includes RLS helpers `is_alliance_member` and `has_alliance_role` so policies stay readable and avoid recursive policy checks.

## Future modules

The current routes and types are designed so these can be added incrementally:

### Calculators

- **Alliance contribution** — member effort vs. available stockpile.
- **Survival Battle planner** — rounds, themes and reward thresholds.
- **Event overlap** — select two live events, find intersecting actions and windows.
- **Hero upgrade** — shard cost to the next breakpoint.
- **Resource planner** — reserve floor and event budget.
- **Troop training** — batch size, queue capacity and speed-up cost.

A calculator can live at `/tools/[slug]/` as a client component. It should accept the current content data as props or query the future API. Keep calculations in `lib/calculators/` with pure functions and unit tests; do not bury formulas in JSX.

### Member portal and dashboards

- `/portal/` — profile, alliance role, saved plans, personal checklist state.
- `/portal/events/` — member-specific event assignments.
- `/portal/admin/` — contribution tables, attendance and content approvals.
- Auth-gated routes need a server runtime (Next.js SSR or Supabase edge functions), so they are intentionally outside the static export.

### Discord and notifications

- Server-side webhook service for event reminders and new content.
- Discord OAuth for role mapping.
- Push notifications via a service worker and Web Push subscription storage.
- Personal event reminders need a database and a scheduled job; do not fake them in localStorage.

### Game update tracker

- A `game_updates` table keyed by version and date.
- Link updates to affected event/guide pages.
- Show a "last verified" badge on any page whose source changed.

## Security notes

- Never expose a Supabase service-role key or Discord webhook in `NEXT_PUBLIC_*`.
- Use RLS on every table, scoped by `alliance_id`.
- Validate image uploads and keep public buckets limited to media.
- Treat CMS/GitHub collaborator access as publication access.
- Escape user-generated content. MDX from the public web is executable content; only trusted editors should be able to submit MDX or raw HTML.
- Use the official game's live screens as the source of truth; the wiki should display uncertainty rather than invent values.

## Performance

- Mostly server-rendered static HTML; client JS is limited to search, calendar, gallery, lightbox, FAQ, mobile nav and countdowns.
- Local images are pre-sized placeholders; replace with appropriately sized captures.
- Fonts are loaded with `next/font` and `display: swap`.
- Avoid adding chart libraries for simple CSS bars; the AvA page uses CSS for the comparison chart.
- The search index is loaded lazily, not on initial page load.
- Static export disables runtime image optimisation. If you deploy only to Vercel, switch it back on and re-test.

## Testing strategy for future work

- Unit tests for pure helpers (`lib/calendar.ts`, future calculators).
- Build-time validation that every content file has required fields and existing image paths.
- Playwright smoke tests for search, calendar filters, gallery lightbox and FAQ deep links.
- Accessibility checks for keyboard navigation and accordion/dialog focus management.
