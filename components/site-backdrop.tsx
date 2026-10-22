/**
 * Site backdrop: the Last Asylum key art, fixed behind every page and dimmed
 * until it reads as atmosphere rather than a competing illustration. The scrim
 * keeps body copy and panels legible while the lantern still glows through.
 *
 * The art is green in the source file. `--art-filter` (per theme) hue-shifts it
 * so it belongs to the active palette; the logo and class colours are separate
 * assets and are never filtered.
 */
export function SiteBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="themed-art absolute inset-0 bg-[url('/images/background.webp')] bg-cover bg-[position:18%_35%] opacity-[0.45]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/85 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/45 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_45%_at_50%_-5%,rgb(var(--primary-rgb)_/_0.10),transparent_70%)]" />
    </div>
  );
}
