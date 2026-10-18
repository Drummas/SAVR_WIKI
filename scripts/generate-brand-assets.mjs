/**
 * Builds the Savage Reign (SAVR) brand assets from the supplied artwork.
 *
 * Source: assets/brand/savr-wordmark-source.jpg (green neon "SAVR" lettering
 * with a crown, on a solid black background).
 *
 * Outputs:
 *   public/brand/savr-wordmark-420.avif / -840.avif  transparent wordmark (primary)
 *   public/brand/savr-wordmark.webp                   webp fallback, 420px wide
 *   public/brand/savr-mark.png                       square "S" emblem / crest
 *   public/icon-192.png             PWA icon
 *   public/icon-512.png             PWA icon
 *   public/favicon-32.png           legacy favicon
 *   app/icon.png                    Next.js metadata icon
 *   app/apple-icon.png              iOS home-screen icon
 *   assets/brand/savr-wordmark.png  full-resolution transparent master (OG art)
 *
 * Run with `npm run assets:brand` after replacing the source image.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const source = path.join(root, "assets", "brand", "savr-wordmark-source.jpg");
const publicBrand = path.join(root, "public", "brand");
const publicDir = path.join(root, "public");
const assetBrand = path.join(root, "assets", "brand");
const appDir = path.join(root, "app");

for (const dir of [publicBrand, assetBrand]) {
  fs.mkdirSync(dir, { recursive: true });
}

const GREEN = "#4ade80";

/** Slice a raw RGBA buffer. */
function cropRaw(raw, info, left, top, width, height) {
  const out = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    const srcStart = ((top + y) * info.width + left) * 4;
    raw.copy(out, y * width * 4, srcStart, srcStart + width * 4);
  }
  return { data: out, info: { width, height, channels: 4 } };
}

function alphaBbox(raw, width, height, threshold = 5) {
  let x0 = width;
  let y0 = height;
  let x1 = -1;
  let y1 = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (raw[(y * width + x) * 4 + 3] > threshold) {
        if (x < x0) x0 = x;
        if (y < y0) y0 = y;
        if (x > x1) x1 = x;
        if (y > y1) y1 = y;
      }
    }
  }
  return { x0, y0, x1, y1 };
}

// ---------------------------------------------------------------------------
// 1. Knock the black background out of the wordmark.
// ---------------------------------------------------------------------------
const { data: rgb, info } = await sharp(source)
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const rgba = Buffer.alloc(info.width * info.height * 4);
for (let i = 0; i < info.width * info.height; i += 1) {
  const r = rgb[i * 3];
  const g = rgb[i * 3 + 1];
  const b = rgb[i * 3 + 2];
  const alpha = Math.max(r, g, b);
  const o = i * 4;
  if (alpha <= 6) {
    rgba[o] = 0;
    rgba[o + 1] = 0;
    rgba[o + 2] = 0;
    rgba[o + 3] = 0;
    continue;
  }
  // Un-premultiply so the neon glow keeps its colour over dark surfaces.
  const scale = 255 / alpha;
  rgba[o] = Math.min(255, Math.round(r * scale));
  rgba[o + 1] = Math.min(255, Math.round(g * scale));
  rgba[o + 2] = Math.min(255, Math.round(b * scale));
  rgba[o + 3] = alpha;
}

const box = alphaBbox(rgba, info.width, info.height);
const pad = 6;
const cropLeft = Math.max(0, box.x0 - pad);
const cropTop = Math.max(0, box.y0 - pad);
const cropWidth = Math.min(info.width - cropLeft, box.x1 - box.x0 + pad * 2);
const cropHeight = Math.min(info.height - cropTop, box.y1 - box.y0 + pad * 2);

const wordmark = cropRaw(rgba, info, cropLeft, cropTop, cropWidth, cropHeight);
const wordmarkPng = await sharp(wordmark.data, { raw: wordmark.info })
  .png({ compressionLevel: 9 })
  .toBuffer();

fs.writeFileSync(path.join(assetBrand, "savr-wordmark.png"), wordmarkPng);

// AVIF keeps the neon glow crisp at a fraction of the webp weight.
for (const width of [420, 840]) {
  await sharp(wordmarkPng)
    .resize({ width })
    .avif({ quality: 60, effort: 6 })
    .toFile(path.join(publicBrand, `savr-wordmark-${width}.avif`));
}

await sharp(wordmarkPng)
  .resize({ width: 420 })
  .webp({ quality: 84, alphaQuality: 90, effort: 6 })
  .toFile(path.join(publicBrand, "savr-wordmark.webp"));

// ---------------------------------------------------------------------------
// 2. Square "S" emblem for the alliance crest / app icon.
// ---------------------------------------------------------------------------
const emblemSource = cropRaw(rgba, info, 24, 8, 560, 560);
const emblemPng = await sharp(emblemSource.data, { raw: emblemSource.info })
  .png()
  .toBuffer();

const emblemMaster = await sharp(emblemPng)
  .resize({ width: 384, height: 384, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9 })
  .toBuffer();

fs.writeFileSync(path.join(assetBrand, "savr-mark.png"), emblemMaster);

// The crest is shown at ~44px, so 192px is generous — palettising it keeps the
// file in single-digit KB without visible banding.
const emblem = await sharp(emblemMaster)
  .resize({ width: 192, height: 192, fit: "contain" })
  .png({ palette: true, colors: 128, compressionLevel: 9 })
  .toBuffer();
fs.writeFileSync(path.join(publicBrand, "savr-mark.png"), emblem);

// ---------------------------------------------------------------------------
// 3. App icons: dark plate + green halo + emblem.
// ---------------------------------------------------------------------------
const iconBackground = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
  <defs>
    <radialGradient id="bg" cx="50%" cy="44%" r="62%">
      <stop offset="0" stop-color="#0e1a12" />
      <stop offset="0.62" stop-color="#070c0a" />
      <stop offset="1" stop-color="#040607" />
    </radialGradient>
    <radialGradient id="halo" cx="50%" cy="46%" r="42%">
      <stop offset="0" stop-color="${GREEN}" stop-opacity="0.24" />
      <stop offset="1" stop-color="${GREEN}" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bg)" />
  <rect width="512" height="512" fill="url(#halo)" />
  <path d="M256 26 470 150v212L256 486 42 362V150L256 26Z" fill="none" stroke="${GREEN}" stroke-opacity="0.14" stroke-width="3" />
  <path d="M256 74 430 174v164L256 438 82 338V174L256 74Z" fill="none" stroke="${GREEN}" stroke-opacity="0.07" stroke-width="2" />
</svg>`;

const iconPlate = await sharp(Buffer.from(iconBackground)).png().toBuffer();
const emblemSmall = await sharp(emblemMaster)
  .resize({ width: 330, height: 330, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .toBuffer();

const icon512 = await sharp(iconPlate)
  .composite([{ input: emblemSmall, gravity: "centre" }])
  .png({ palette: true, colors: 64, compressionLevel: 9 })
  .toBuffer();

fs.writeFileSync(path.join(publicDir, "icon-512.png"), icon512);
fs.writeFileSync(path.join(appDir, "icon.png"), icon512);

for (const [file, size] of [
  [path.join(publicDir, "icon-192.png"), 192],
  [path.join(appDir, "apple-icon.png"), 180],
  [path.join(publicDir, "favicon-32.png"), 32],
]) {
  await sharp(icon512)
    .resize({ width: size, height: size, fit: "cover" })
    .png({ palette: true, colors: 64, compressionLevel: 9 })
    .toFile(file);
}

const legacyIcon = path.join(appDir, "icon.svg");
if (fs.existsSync(legacyIcon)) fs.rmSync(legacyIcon);

const wordmarkKb = Math.round(fs.statSync(path.join(publicBrand, "savr-wordmark-420.avif")).size / 1024);
console.log(
  `Brand assets: wordmark ${cropWidth}x${cropHeight} (420px avif ${wordmarkKb} KB), emblem, icons`,
);
