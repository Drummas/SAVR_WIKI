/**
 * Refresh the alliance roster from the public Last Asylum leaderboard.
 *
 * The site is a static export, so the page cannot scrape on request. A GitHub
 * Actions schedule runs this script at server reset (00:00 on the in-game
 * clock, UTC-2), writes `data/roster.json`, and commits the result. That commit
 * triggers the normal static deployment.
 *
 * Hero might totals are only published on each member's player page, linked
 * from the player name in the alliance list, so the script reads those pages
 * after the roster snapshot.
 *
 * Usage:
 *   node scripts/refresh-roster.mjs
 *   node scripts/refresh-roster.mjs --dry-run
 *   ROSTER_FILE=/tmp/roster.json node scripts/refresh-roster.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataFile = process.env.ROSTER_FILE ?? path.join(root, "data", "roster.json");
const dryRun = process.argv.includes("--dry-run");

const ALLIANCE_ID = "50375557";
const PAGE_URL = `https://lastasylum.gg/en/leaderboard/alliance/${ALLIANCE_ID}`;
const API_URL = `https://lastasylum.gg/api/alliance/${ALLIANCE_ID}`;
const PLAYER_URL = (id) => `https://lastasylum.gg/en/leaderboard/player/${id}`;
/** Hero might lives on each member page; fetch them sequentially and politely. */
const PLAYER_DELAY_MS = 2_000;
const RATE_LIMIT_RETRIES = 6;
const USER_AGENT =
  "SAVR-Wiki-Roster/1.0 (+https://github.com/Drummas/SAVR_WIKI; daily roster refresh)";

function fail(message) {
  console.error(`refresh-roster: ${message}`);
  process.exitCode = 1;
  throw new Error(message);
}

async function fetchJson(url) {
  let response;
  try {
    response = await fetch(url, {
      headers: { "user-agent": USER_AGENT, accept: "application/json" },
      signal: AbortSignal.timeout(25_000),
    });
  } catch (error) {
    fail(`source unavailable: ${error.message}`);
  }
  if (!response.ok) fail(`source returned HTTP ${response.status}`);
  try {
    return await response.json();
  } catch (error) {
    fail(`source did not return valid JSON: ${error.message}`);
  }
}

async function fetchPage(url, label) {
  let response;
  try {
    response = await fetch(url, {
      headers: { "user-agent": USER_AGENT, accept: "text/html" },
      signal: AbortSignal.timeout(25_000),
    });
  } catch (error) {
    fail(`${label} unavailable: ${error.message}`);
  }
  if (!response.ok) fail(`${label} returned HTTP ${response.status}`);
  return response.text();
}

/**
 * Read one labelled stat from a player page's rendered stat blocks. The source
 * only publishes hero might for players who appear on the server hero boards,
 * so a missing stat is expected and stored as null rather than failing the run.
 */
function statValue(html, label, player) {
  const blocks = html.matchAll(
    /<div[^>]*class="stat-value"[^>]*>\s*([0-9][0-9,]*)\s*<\/div>\s*<div[^>]*class="stat-label"[^>]*>\s*([^<]+?)\s*<\/div>/g,
  );
  for (const match of blocks) {
    if (match[2].trim() !== label) continue;
    const value = Number(match[1].replace(/,/g, ""));
    if (!Number.isFinite(value)) fail(`player page for ${player} has an invalid ${label}`);
    return value;
  }
  return null;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * The player pages are rate limited with a 200 response and a warning title, so
 * check the title and retry rather than storing blanks. A valid page always has
 * rendered stat blocks; anything else is treated as a transient block.
 */
async function fetchPlayerPage(member, attempt = 0) {
  const html = await fetchPage(PLAYER_URL(member.id), `player page for ${member.name}`);
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
  const blocked = /too many requests/i.test(title) || !html.includes('class="stat-value"');
  if (!blocked) return html;

  if (attempt >= RATE_LIMIT_RETRIES) {
    fail(`player page for ${member.name} stayed rate limited after ${attempt} retries`);
  }
  console.warn(
    `refresh-roster: player page for ${member.name} was rate limited; waiting 60s ` +
      `(retry ${attempt + 1}/${RATE_LIMIT_RETRIES})`,
  );
  await sleep(60_000);
  return fetchPlayerPage(member, attempt + 1);
}

function memberFrom(row, index) {
  const label = `roster row ${index + 1}`;
  if (!row || typeof row !== "object") fail(`${label} is not an object`);

  const name = typeof row.name === "string" ? row.name.trim() : "";
  if (!name) fail(`${label} has no player name`);
  const id = typeof row.id === "string" ? row.id.trim() : "";
  if (!id) fail(`${label} (${name}) has no player id`);
  if (typeof row.power !== "number" || !Number.isFinite(row.power)) {
    fail(`${label} (${name}) has no numeric power`);
  }
  if (typeof row.kills !== "number" || !Number.isFinite(row.kills)) {
    fail(`${label} (${name}) has no numeric kills`);
  }
  if (typeof row.castle !== "number" || !Number.isFinite(row.castle)) {
    fail(`${label} (${name}) has no numeric castle level`);
  }
  if (typeof row.joined !== "number" || !Number.isFinite(row.joined)) {
    fail(`${label} (${name}) has no join timestamp`);
  }

  const joined = new Date(row.joined);
  if (Number.isNaN(joined.getTime())) fail(`${label} (${name}) has an invalid join date`);

  return {
    id,
    name,
    power: row.power,
    kills: row.kills,
    sanctuary: row.castle,
    joined: joined.toISOString(),
  };
}

function formatJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

async function main() {
  const payload = await fetchJson(API_URL);

  if (String(payload.id) !== ALLIANCE_ID) {
    fail(`source returned alliance ${payload.id}, expected ${ALLIANCE_ID}`);
  }
  if (payload.disbanded) fail("source marks the alliance as disbanded");
  if (!Array.isArray(payload.roster)) fail("source layout changed: missing roster array");
  if (typeof payload.members !== "number") {
    fail("source layout changed: missing member count");
  }
  if (payload.roster.length !== payload.members) {
    fail(
      `source is incomplete: ${payload.roster.length} rows for ${payload.members} members`,
    );
  }
  if (payload.roster.length < 1) fail("source returned an empty roster");

  const asOf = new Date(payload.asOf * 1000);
  if (Number.isNaN(asOf.getTime())) fail("source has an invalid snapshot timestamp");

  const rows = payload.roster.map(memberFrom);
  const members = [];
  for (const [index, member] of rows.entries()) {
    const html = await fetchPlayerPage(member);
    const totalHeroMight = statValue(html, "Total Hero Might", member.name);
    const heroHighestMight = statValue(html, "Hero Highest Might", member.name);
    if (
      totalHeroMight !== null &&
      heroHighestMight !== null &&
      heroHighestMight > totalHeroMight
    ) {
      fail(`${member.name} has a hero highest might above their total hero might`);
    }
    members.push({
      name: member.name,
      power: member.power,
      totalHeroMight,
      heroHighestMight,
      kills: member.kills,
      sanctuary: member.sanctuary,
      joined: member.joined,
    });
    if ((index + 1) % 10 === 0) {
      console.log(`refresh-roster: read ${index + 1}/${rows.length} player pages`);
    }
    if (index < rows.length - 1) await sleep(PLAYER_DELAY_MS);
  }
  members.sort((a, b) => b.power - a.power || a.name.localeCompare(b.name));

  const next = {
    updated: new Date().toISOString().slice(0, 10),
    source: PAGE_URL,
    alliance: {
      name: String(payload.name ?? "").trim(),
      tag: String(payload.tag ?? "").trim(),
      server: Number(payload.server),
      power: Number(payload.power),
      kills: Number(payload.kills),
      members: Number(payload.members),
      asOf: asOf.toISOString(),
    },
    members,
  };

  if (!next.alliance.name) fail("source has no alliance name");

  const withTotalHeroMight = members.filter((member) => member.totalHeroMight !== null).length;
  const withHeroHighestMight = members.filter(
    (member) => member.heroHighestMight !== null,
  ).length;
  if (!withTotalHeroMight || !withHeroHighestMight) {
    fail("source player pages no longer expose hero might statistics");
  }

  console.log(
    `refresh-roster: ${members.length} members, snapshot ${asOf.toISOString()}, ` +
      `hero might published for ${withTotalHeroMight} total / ${withHeroHighestMight} highest`,
  );

  const before = fs.existsSync(dataFile) ? fs.readFileSync(dataFile, "utf8") : "";
  const after = formatJson(next);
  if (before === after) {
    console.log("refresh-roster: no changes");
    return;
  }

  if (dryRun) {
    console.log("refresh-roster: dry run, not writing");
    return;
  }

  fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  fs.writeFileSync(dataFile, after);
  console.log(`refresh-roster: wrote ${path.relative(root, dataFile)}`);
}

main().catch((error) => {
  console.error(`refresh-roster: ${error.message}`);
  process.exit(1);
});
