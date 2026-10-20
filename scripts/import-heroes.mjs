/**
 * Rebuilds data/heroes.json from the Last Asylum hero roster page.
 *
 * Usage: npm run heroes:import
 *
 * The published roster is the source of truth for ranks, roles, skills and
 * usage notes. Portraits are not downloaded here — drop the matching
 * <slug>.webp into public/images/heroes and the importer will wire it up.
 */
import fs from "node:fs";
import path from "node:path";

const SOURCE = "https://www.last-asylum.com/heroes.html";
const root = process.cwd();
const portraitDir = path.join(root, "public", "images", "heroes");

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function text(html) {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseCards(html) {
  return [...html.matchAll(/<article class="hero-profile-card[^"]*">([\s\S]*?)<\/article>/g)].map(
    (match) => {
      const card = match[1];
      const name = text((card.match(/<h3>([\s\S]*?)<\/h3>/) ?? [])[1] ?? "");
      const rank = text((card.match(/class="rank">([\s\S]*?)</) ?? [])[1] ?? "UR");
      const role = text((card.match(/class="role">([\s\S]*?)</) ?? [])[1] ?? "");
      const summary = text((card.match(/<\/p>\s*<p>([\s\S]*?)<\/p>/) ?? [])[1] ?? "");
      const bullets = [...card.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((item) => text(item[1]));
      return { name, rank, role, summary, bullets };
    },
  );
}

const CLASSES = ["Warrior", "Warlock", "Ranger"];
const ROLES = ["Tank", "Carry", "Support"];

/**
 * "Warrior / Tank" -> { archetype: "Warrior", role: "Tank" }
 *
 * The published roster is not consistent about order — Shadow reads
 * "Tank / Ranger" even though Ranger is her class — so normalise on the known
 * class and role names instead of trusting position.
 */
function splitRole(value) {
  const parts = value.split("/").map((part) => part.trim());
  const archetype = parts.find((part) => CLASSES.includes(part));
  const role = parts.find((part) => ROLES.includes(part));
  return {
    archetype: archetype ?? parts[0] ?? "Unknown",
    role: role ?? parts[1] ?? "Flex",
  };
}

function buildHero(card) {
  const { archetype, role } = splitRole(card.role);
  const slug = slugify(card.name);
  const facts = [];
  let skills = [];

  for (const bullet of card.bullets) {
    const separator = bullet.indexOf(":");
    if (separator === -1) {
      facts.push({ label: "Note", value: bullet });
      continue;
    }
    const label = bullet.slice(0, separator).trim();
    const value = bullet.slice(separator + 1).trim();
    if (/^key skills?$/i.test(label)) {
      skills = value
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
      continue;
    }
    facts.push({ label, value });
  }

  const portrait = path.join(portraitDir, `${slug}.webp`);

  return {
    slug,
    name: card.name,
    rank: card.rank,
    archetype,
    role,
    summary: card.summary,
    image: fs.existsSync(portrait) ? `/images/heroes/${slug}.webp` : undefined,
    skills,
    facts,
  };
}

const response = await fetch(SOURCE, { headers: { "user-agent": "SAVR-field-manual/1.0" } });
if (!response.ok) {
  throw new Error(`Hero roster request failed: ${response.status} ${response.statusText}`);
}

const heroes = parseCards(await response.text()).map(buildHero);
if (heroes.length === 0) {
  throw new Error("Hero roster parsed to zero cards — the source markup probably changed.");
}

const missingPortraits = heroes.filter((hero) => !hero.image).map((hero) => hero.name);

const output = {
  source: SOURCE,
  updated: new Date().toISOString().slice(0, 10),
  heroes,
};

const target = path.join(root, "data", "heroes.json");
fs.writeFileSync(target, `${JSON.stringify(output, null, 2)}\n`);

console.log(`Hero roster imported: ${heroes.length} heroes -> ${path.relative(root, target)}`);
if (missingPortraits.length) {
  console.warn(`No portrait found for: ${missingPortraits.join(", ")}`);
}
