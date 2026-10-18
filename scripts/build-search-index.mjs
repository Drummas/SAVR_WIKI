import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const root = process.cwd();
const docs = [];

function stripMarkdown(input) {
  return input
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readFolder(folder) {
  const dir = path.join(root, "content", folder);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => {
      const parsed = matter(fs.readFileSync(path.join(dir, file), "utf8"));
      return {
        slug: file.replace(/\.mdx?$/, ""),
        data: parsed.data,
        body: parsed.content,
      };
    });
}

for (const { slug, data, body } of readFolder("events")) {
  const fields = [
    data.summary,
    data.objective,
    ...(data.tags ?? []),
    ...(data.preparation ?? []),
    ...(data.bestPractices ?? []),
    ...(data.mistakes ?? []),
    ...(data.advancedTips ?? []),
    ...(data.checklist ?? []),
    ...(data.playerNotes ?? []),
    ...(data.strategyRecommendations ?? []),
    ...(data.walkthrough ?? []).map((step) => `${step.title} ${step.description}`),
  ];
  docs.push({
    id: `event-${slug}`,
    type: "event",
    title: data.title ?? slug,
    description: data.summary ?? "",
    url: `/events/${slug}/`,
    category: data.category ?? "Events",
    tags: data.tags ?? [],
    content: stripMarkdown([...fields, body].filter(Boolean).join(" ")).slice(0, 6000),
    date: data.updated,
  });
}

for (const { slug, data, body } of readFolder("guides")) {
  const fields = [
    data.summary,
    data.overview,
    ...(data.tags ?? []),
    ...(data.priorities ?? []),
    ...(data.actions ?? []),
    ...(data.tips ?? []),
    ...(data.mistakes ?? []),
    ...(data.steps ?? []).map((step) => `${step.title} ${step.description}`),
    ...(data.resourceRequirements ?? []).map((row) => `${row.item} ${row.amount} ${row.priority}`),
  ];
  docs.push({
    id: `guide-${slug}`,
    type: "guide",
    title: data.title ?? slug,
    description: data.summary ?? "",
    url: `/guides/${slug}/`,
    category: data.category ?? "Guides",
    tags: data.tags ?? [],
    content: stripMarkdown([...fields, body].filter(Boolean).join(" ")).slice(0, 6000),
    date: data.updated,
  });
}

for (const { slug, data, body } of readFolder("strategies")) {
  const fields = [
    data.summary,
    data.objective,
    ...(data.tags ?? []),
    ...(data.actions ?? []),
    ...(data.requirements ?? []),
    ...(data.optimisation ?? []),
    ...(data.tips ?? []),
    ...(data.mistakes ?? []),
    ...(data.metrics ?? []).map((row) => `${row.label} ${row.value} ${row.note ?? ""}`),
  ];
  docs.push({
    id: `strategy-${slug}`,
    type: "strategy",
    title: data.title ?? slug,
    description: data.summary ?? "",
    url: `/strategies/${slug}/`,
    category: data.category ?? "Strategies",
    tags: data.tags ?? [],
    content: stripMarkdown([...fields, body].filter(Boolean).join(" ")).slice(0, 6000),
    date: data.updated,
  });
}

const faqPath = path.join(root, "content", "faq", "faq.json");
if (fs.existsSync(faqPath)) {
  const faq = JSON.parse(fs.readFileSync(faqPath, "utf8"));
  for (const item of faq.items ?? []) {
    docs.push({
      id: `faq-${item.id}`,
      type: "faq",
      title: item.question,
      description: item.answer,
      url: `/faq/#${item.id}`,
      category: item.category ?? "FAQ",
      tags: item.tags ?? [],
      content: stripMarkdown(`${item.question} ${item.answer}`).slice(0, 4000),
    });
  }
}

const calendarPath = path.join(root, "data", "calendar-events.json");
if (fs.existsSync(calendarPath)) {
  const calendar = JSON.parse(fs.readFileSync(calendarPath, "utf8"));
  for (const event of calendar.events ?? []) {
    docs.push({
      id: `calendar-${event.id}`,
      type: "calendar",
      title: event.title,
      description: event.description,
      url: `/calendar/?event=${encodeURIComponent(event.id)}`,
      category: event.category,
      tags: [event.category, event.source, event.phase ?? ""].filter(Boolean),
      content: stripMarkdown(
        `${event.title} ${event.description} ${event.phase ?? ""} ${event.category} ${event.source}`,
      ).slice(0, 2000),
      date: event.start,
    });
  }
}

const galleryPath = path.join(root, "data", "gallery.json");
if (fs.existsSync(galleryPath)) {
  const gallery = JSON.parse(fs.readFileSync(galleryPath, "utf8"));
  for (const image of gallery.images ?? []) {
    docs.push({
      id: `image-${image.id}`,
      type: "image",
      title: image.title,
      description: image.description,
      url: `/gallery/?image=${encodeURIComponent(image.id)}`,
      category: image.category,
      tags: image.tags ?? [],
      content: stripMarkdown(
        `${image.title} ${image.description} ${image.category} ${(image.tags ?? []).join(" ")}`,
      ).slice(0, 2000),
    });
  }
}

const output = {
  generatedAt: new Date().toISOString(),
  count: docs.length,
  docs,
};

const publicDir = path.join(root, "public");
fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, "search-index.json"), JSON.stringify(output));

console.log(`Search index built: ${docs.length} documents`);
