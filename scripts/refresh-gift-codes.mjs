/**
 * Refresh the gift-code list from the source that publishes an in-game check.
 *
 * The site is a static export, so the page cannot scrape on request. A GitHub
 * Actions schedule runs this script at the top of every hour instead: it reads
 * the working and expired lists, writes `data/gift-codes.json` only when the
 * working set changed, and the commit triggers the normal static deployment.
 *
 * The wiki's in-game check is authoritative. UCNGame and Pocket Gamer are
 * fetched as reachability cross-checks, but they lag behind and still label
 * expired codes as active, so their lists must not resurrect a code.
 *
 * Usage:
 *   node scripts/refresh-gift-codes.mjs
 *   node scripts/refresh-gift-codes.mjs --dry-run
 *   GIFT_CODES_FILE=/tmp/gift-codes.json node scripts/refresh-gift-codes.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataFile = process.env.GIFT_CODES_FILE ?? path.join(root, "data", "gift-codes.json");
const dryRun = process.argv.includes("--dry-run");

const SOURCES = {
  wiki: "https://lastasylum.gg/en/codes",
  ucngame: "https://ucngame.com/codes/last-asylum-codes/",
  pocketgamer: "https://www.pocketgamer.com/last-asylum-plague/codes/",
};

const USER_AGENT =
  "SAVR-Wiki-Gift-Codes/1.0 (+https://github.com/Drummas/SAVR_WIKI; hourly code refresh)";

const MONTHS = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
};

function fail(message) {
  console.error(`refresh-gift-codes: ${message}`);
  process.exitCode = 1;
  throw new Error(message);
}

async function fetchText(name, url, { required = false } = {}) {
  try {
    const response = await fetch(url, {
      headers: { "user-agent": USER_AGENT, accept: "text/html" },
      signal: AbortSignal.timeout(25_000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } catch (error) {
    const message = `${name} unavailable: ${error.message}`;
    if (required) fail(message);
    console.warn(`refresh-gift-codes: ${message} (cross-check skipped)`);
    return null;
  }
}

/** Codes between two HTML markers, in source order, deduplicated case-insensitively. */
function codesBetween(html, startMarker, endMarker) {
  const start = html.indexOf(startMarker);
  if (start === -1) fail(`source layout changed: missing "${startMarker}"`);
  const from = start + startMarker.length;
  const end = endMarker ? html.indexOf(endMarker, from) : -1;
  const segment = html.slice(from, end === -1 ? undefined : end);
  const seen = new Set();
  const codes = [];
  for (const match of segment.matchAll(/<code class="code-key">([^<]+)<\/code>/g)) {
    const code = match[1].trim();
    const key = code.toLowerCase();
    if (!code || seen.has(key)) continue;
    seen.add(key);
    codes.push(code);
  }
  return codes;
}

function parseCheckedDate(html) {
  const match = html.match(/Checked:\s*([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/);
  if (!match) fail("source layout changed: missing in-game check date");
  const month = MONTHS[match[1].toLowerCase()];
  if (!month) fail(`unrecognised month "${match[1]}" in check date`);
  const day = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    fail(`invalid in-game check date "${match[0]}"`);
  }
  return date.toISOString().slice(0, 10);
}

function readCurrent() {
  return JSON.parse(fs.readFileSync(dataFile, "utf8"));
}

function formatJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

async function main() {
  const current = readCurrent();

  const [wiki, ucngame, pocketgamer] = await Promise.all([
    fetchText("Last Asylum Wiki", SOURCES.wiki, { required: true }),
    fetchText("UCNGame", SOURCES.ucngame),
    fetchText("Pocket Gamer", SOURCES.pocketgamer),
  ]);

  const active = codesBetween(wiki, "<h2>Working codes</h2>", '<details class="code-old">');
  const expired = codesBetween(wiki, '<details class="code-old">', "</details>");
  const checked = parseCheckedDate(wiki);

  if (active.length < 3) fail(`refusing to publish only ${active.length} working code(s)`);
  if (expired.length === 0) fail("refusing to publish: expired section parsed empty");

  const activeKeys = new Set(active.map((code) => code.toLowerCase()));
  const expiredKeys = new Set(expired.map((code) => code.toLowerCase()));
  const overlap = [...activeKeys].filter((code) => expiredKeys.has(code));
  if (overlap.length) fail(`source lists the same code as working and expired: ${overlap.join(", ")}`);

  console.log(`refresh-gift-codes: ${active.length} working, ${expired.length} expired`);
  console.log(`refresh-gift-codes: in-game check dated ${checked}`);
  if (ucngame) console.log(`refresh-gift-codes: UCNGame reachable (${ucngame.length} bytes)`);
  if (pocketgamer) {
    console.log(`refresh-gift-codes: Pocket Gamer reachable (${pocketgamer.length} bytes)`);
  }

  // Preserve any reward summaries that were added by hand for codes still working.
  const existing = new Map(
    (current.codes ?? []).map((entry) => [String(entry.code).toLowerCase(), entry]),
  );
  const codes = active.map((code) => existing.get(code.toLowerCase()) ?? { code });

  const checkedLabel = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${checked}T12:00:00Z`));
  const sources = (current.sources ?? []).map((source) =>
    source.url?.includes("lastasylum.gg")
      ? { ...source, note: `In-game check, ${checkedLabel}` }
      : source,
  );

  const next = {
    ...current,
    updated:
      JSON.stringify(codes) === JSON.stringify(current.codes ?? []) &&
      checked === current.checked
        ? current.updated
        : new Date().toISOString().slice(0, 10),
    checked,
    codes,
    sources,
  };

  const before = formatJson(current);
  const after = formatJson(next);

  if (before === after) {
    console.log("refresh-gift-codes: no changes");
    return;
  }

  const delta = active.length - (current.codes?.length ?? 0);
  console.log(
    `refresh-gift-codes: ${delta >= 0 ? "+" : ""}${delta} codes, updated ${current.updated} -> ${next.updated}`,
  );

  if (dryRun) {
    console.log("refresh-gift-codes: dry run, not writing");
    return;
  }

  fs.writeFileSync(dataFile, after);
}

main().catch((error) => {
  console.error(`refresh-gift-codes: ${error.message}`);
  process.exit(1);
});
