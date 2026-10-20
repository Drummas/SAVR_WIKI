/**
 * Site backdrop: the Last Asylum key art, fixed behind every page and dimmed
 * until it reads as atmosphere rather than a competing illustration. The scrim
 * keeps body copy and panels legible while the lantern still glows through.
 */
export function SiteBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[url('/images/background.webp')] bg-cover bg-[position:18%_35%] opacity-[0.45]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/85 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/45 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_45%_at_50%_-5%,rgba(52,224,126,0.10),transparent_70%)]" />
    </div>
  );
}
