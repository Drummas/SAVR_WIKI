/**
 * Builds the Last Asylum wordmark used in the homepage hero.
 *
 * Source: assets/brand/last-asylum-wordmark-source.png (the game's painted
 * "LOST ASYLUM" lettering on a transparent background).
 *
 * Outputs:
 *   public/brand/la-wordmark-245.avif  header-sized rendition
 *   public/brand/la-wordmark-490.avif  hero-sized rendition (primary)
 *   public/brand/la-wordmark.webp      webp fallback, 490px wide
 *
 * This is deliberately separate from `generate-brand-assets.mjs`, which builds
 * the alliance's own SAVR wordmark, crest and app icons. The game logo is only
 * used where the guide refers to Last Asylum itself.
 *
 * Run with `npm run assets:logo` after replacing the source image.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const source = path.join(root, "assets", "brand", "last-asylum-wordmark-source.png");
const publicBrand = path.join(root, "public", "brand");
const assetBrand = path.join(root, "assets", "brand");

if (!fs.existsSync(source)) {
  console.log(`Logo assets: no source at ${path.relative(root, source)} — skipped`);
  process.exit(0);
}

for (const dir of [publicBrand, assetBrand]) {
  fs.mkdirSync(dir, { recursive: true });
}

/** Trim transparent padding so the lettering keeps its proportions. */
const trimmed = await sharp(source)
  .trim({ threshold: 8 })
  .png({ compressionLevel: 9 })
  .toBuffer({ resolveWithObject: true });

fs.writeFileSync(path.join(assetBrand, "la-wordmark.png"), trimmed.data);

for (const width of [245, 490]) {
  await sharp(trimmed.data)
    .resize({ width })
    .avif({ quality: 62, effort: 6 })
    .toFile(path.join(publicBrand, `la-wordmark-${width}.avif`));
}

const webp = await sharp(trimmed.data)
  .resize({ width: 490 })
  .webp({ quality: 88, alphaQuality: 92, effort: 6 })
  .toFile(path.join(publicBrand, "la-wordmark.webp"));

console.log(
  `Logo assets: wordmark ${trimmed.info.width}x${trimmed.info.height} (webp ${Math.round(webp.size / 1024)} KB)`,
);
