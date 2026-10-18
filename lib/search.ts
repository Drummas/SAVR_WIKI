import type { ContentType, SearchDoc } from "@/lib/types";

export interface SearchIndex {
  generatedAt: string;
  count: number;
  docs: SearchDoc[];
}

export const typeLabels: Record<ContentType, string> = {
  event: "Event",
  guide: "Guide",
  strategy: "Strategy",
  faq: "FAQ",
  calendar: "Calendar",
  image: "Image",
};

export const typeOrder: ContentType[] = [
  "event",
  "guide",
  "strategy",
  "faq",
  "calendar",
  "image",
];

function tokenize(query: string) {
  return query
    .toLowerCase()
    .normalize("NFKD")
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 1);
}

export function searchDocs(
  docs: SearchDoc[],
  query: string,
  filters?: { types?: ContentType[]; category?: string },
) {
  const tokens = tokenize(query);
  const normalizedQuery = query.trim().toLowerCase();

  const filtered = docs.filter((doc) => {
    if (filters?.types?.length && !filters.types.includes(doc.type)) return false;
    if (filters?.category && doc.category !== filters.category) return false;
    return true;
  });

  if (!tokens.length) {
    const order: Record<ContentType, number> = {
      event: 0,
      guide: 1,
      strategy: 2,
      faq: 3,
      calendar: 4,
      image: 5,
    };
    return filtered
      .map((doc) => ({ doc, score: 0 }))
      .sort((a, b) => {
        const typeDelta = order[a.doc.type] - order[b.doc.type];
        if (typeDelta !== 0) return typeDelta;
        const dateA = a.doc.date ? new Date(a.doc.date).getTime() : 0;
        const dateB = b.doc.date ? new Date(b.doc.date).getTime() : 0;
        return dateB - dateA || a.doc.title.localeCompare(b.doc.title);
      })
      .slice(0, 80);
  }

  const results: { doc: SearchDoc; score: number }[] = [];

  for (const doc of filtered) {
    const title = doc.title.toLowerCase();
    const description = doc.description.toLowerCase();
    const tags = doc.tags.join(" ").toLowerCase();
    const category = doc.category.toLowerCase();
    const content = doc.content.toLowerCase();

    let score = 0;
    let matches = 0;

    if (normalizedQuery.length > 2) {
      if (title === normalizedQuery) score += 80;
      else if (title.includes(normalizedQuery)) score += 30;
    }

    for (const token of tokens) {
      let tokenScore = 0;
      if (title.includes(token)) {
        tokenScore += title.startsWith(token) ? 26 : 18;
        matches += 1;
      }
      if (tags.includes(token)) {
        tokenScore += 9;
        matches += 1;
      }
      if (category.includes(token)) tokenScore += 5;
      if (description.includes(token)) {
        tokenScore += 5;
        matches += 1;
      }
      if (content.includes(token)) {
        tokenScore += 1.5;
        matches += 1;
      }
      score += tokenScore;
    }

    if (score > 0) {
      if (matches >= tokens.length) score += 12;
      const typeWeight: Record<ContentType, number> = {
        event: 8,
        guide: 7,
        strategy: 7,
        faq: 3,
        calendar: 1,
        image: 0,
      };
      score += typeWeight[doc.type];
      results.push({ doc, score });
    }
  }

  return results
    .sort((a, b) => b.score - a.score || a.doc.title.localeCompare(b.doc.title))
    .slice(0, 80);
}

export function excerpt(text: string, query: string, maxLength = 150) {
  if (!query.trim()) return text.slice(0, maxLength).trim();
  const lower = text.toLowerCase();
  const firstToken = tokenize(query)[0];
  if (!firstToken) return text.slice(0, maxLength).trim();
  const index = lower.indexOf(firstToken);
  if (index === -1) return text.slice(0, maxLength).trim();
  const start = Math.max(0, index - 45);
  const end = Math.min(text.length, start + maxLength);
  return `${start > 0 ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`;
}
