# Deployment

The project is a static Next.js export. Any host that serves files can run it. Vercel and Cloudflare Pages are the primary targets.

## 1. Build locally first

```bash
npm install
npm run typecheck
npm run build
npm run preview
```

`npm run build` generates the search index and writes the site to `out/`. Open the preview and test:

- Home, event detail, guide detail, strategy detail
- Search dialog and full search page
- Calendar month/week/agenda, filters and countdowns
- Gallery lightbox, FAQ accordions
- Mobile navigation at a narrow viewport
- `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`

## 2. Environment

Set one public variable before building:

```
NEXT_PUBLIC_SITE_URL=https://your-final-origin.example
```

It feeds canonical URLs, sitemap entries, OpenGraph metadata and JSON-LD. Rebuild after changing it.

## 3. Vercel

1. Push the repository to GitHub.
2. In Vercel, **Add New → Project** and import the repository.
3. Framework preset: **Next.js**.
4. Build command: `npm run build`.
5. Output directory: `out`.
6. Add `NEXT_PUBLIC_SITE_URL` in Project → Settings → Environment Variables.
7. Deploy.

Because the project uses `output: "export"`, Vercel serves the static output. No server functions are required.

### Enabling Next image optimisation on Vercel only

If you do not need Cloudflare Pages compatibility, you can switch off static export:

1. Remove `output: "export"` and `images.unoptimized` from `next.config.ts`.
2. Remove `trailingSlash` if you prefer Vercel's default URLs (or keep it for consistency).
3. Re-test all metadata and image paths.

This gives you Vercel's image optimisation pipeline but breaks plain-static hosting. The default configuration is chosen for portability.

## 4. Cloudflare Pages

1. In the Cloudflare dashboard, **Workers & Pages → Create → Pages → Connect to Git**.
2. Framework preset: **Next.js (Static HTML Export)** if offered, otherwise **None**.
3. Build command: `npm run build`.
4. Build output directory: `out`.
5. Add `NEXT_PUBLIC_SITE_URL` as a production environment variable.
6. Deploy.

The site requires no Node runtime, no edge functions and no Workers adapter in its current configuration.

## 5. Decap CMS production setup

Local editing already works:

```bash
npm run dev
npm run decap
# open http://localhost:3000/admin/cms/
```

For editors to publish from the deployed site:

### A. Repository

1. Create or choose a GitHub repository containing this project.
2. Update `public/admin/cms/config.yml`:
   ```yaml
   backend:
     name: github
     repo: your-user/your-repo
     branch: main
     base_url: https://your-oauth-proxy.example.com
   ```
3. Update `site_url`, `display_url` and `logo_url`.

### B. OAuth

Decap's GitHub backend needs an OAuth proxy because GitHub OAuth requires a client secret that cannot live in the browser. Options:

- Deploy a maintained Decap OAuth provider such as `vencax/netlify-cms-github-oauth-provider` or an equivalent Cloudflare Worker.
- Use Netlify Identity + Git Gateway instead of GitHub OAuth if your team prefers that model.
- For internal use, editors can run the local backend against a checkout and push themselves.

Register a GitHub OAuth app with:

- Homepage URL: your deployed site
- Authorization callback URL: the callback URL required by your OAuth proxy (usually `https://your-proxy.example.com/callback`)

Put the OAuth proxy base URL in `backend.base_url`. Do **not** put the client secret in this repository, in `NEXT_PUBLIC_*` variables, or in browser storage.

### C. Permissions

Decap uses GitHub repository permissions. Editors need write access to the repository. Use branch protection and pull requests if you want a review step before publication.

### D. Test publishing

1. Open `/admin/cms/` on the deployed site.
2. Sign in with GitHub.
3. Edit a draft page (for example, update an FAQ tag).
4. Publish.
5. Confirm the CMS commit appears in GitHub.
6. Wait for the Vercel / Cloudflare build.
7. Open the live page on mobile and desktop.
8. Verify the change actually renders — a successful CMS save is not proof of a successful deploy.

## 6. Content uploads

Decap saves images to `public/images/uploads` and writes the public path `/images/uploads/...` into the content file. Keep that folder in Git. The generated gallery assets in `public/images/gallery` are placeholders; do not mistake them for official game imagery.

Image guidance:

- 1600 × 900 or similar 16:9 capture
- WebP or optimised PNG where possible
- Avoid personal information in player names
- Add caption, category and tags in the CMS

## 7. Rebuild triggers

Any CMS publish commits to the default branch. Vercel and Cloudflare Pages rebuild automatically. If you edit files directly, run `npm run build` and deploy the resulting `out/` directory.

Calendar updates require a rebuild because the site is static. The calendar JSON is read at build time. If you need instant in-browser calendar editing without a deploy, that is a future Supabase/member-portal feature, not part of the static build.

## 8. Custom domain and SEO

1. Add the custom domain in the host dashboard.
2. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin.
3. Rebuild.
4. Confirm:
   - `<link rel="canonical">` points to the new domain
   - `sitemap.xml` uses the new domain
   - `og.png` is reachable
   - `/robots.txt` references the correct sitemap
5. Submit the sitemap to Google Search Console if desired.

## 9. Troubleshooting

| Symptom | Check |
| --- | --- |
| Direct URLs 404 on a static host | Confirm `trailingSlash: true` and deploy the full `out/` directory |
| Search returns no results | Run `npm run build:search`; confirm `/search-index.json` exists in `out/` |
| CMS shows "config not found" | Confirm `/admin/cms/config.yml` is present in the deployed output |
| CMS cannot log in | OAuth proxy URL, callback URL, repository name and collaborator access |
| Images missing | Path is case-sensitive on Linux hosts; confirm `/images/...` paths and file extensions |
| Fonts fail at build | `next/font/google` requires network access during build; retry or swap to local fonts |
| Calendar times look shifted | Data is stored on the in-game clock (`UTC-5`) and re-labelled live. Check the visitor's clock setting (server vs local offset), `SERVER_OFFSET` in `lib/time.ts`, and the ISO string in the JSON |
| Stale page after publishing | Wait for the static build; check the host's deployment log |

## 10. Taking the site offline

Do not delete content to stop serving it. Use the hosting provider's domain/pause controls or unpublish the deployment. The repo remains the source of truth.
