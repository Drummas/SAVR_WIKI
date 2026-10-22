import type { MetadataRoute } from "next";

import { getEvents, getGuides, getStrategies, getSiteConfig } from "@/lib/content";
import { absoluteUrl, siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteConfig();
  const staticRoutes = [
    { path: "/", priority: 1, changeFrequency: "weekly" as const },
    { path: "/events/", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/guides/", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/strategies/", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/alliance-vs-alliance/", priority: 0.95, changeFrequency: "weekly" as const },
    { path: "/calendar/", priority: 0.85, changeFrequency: "daily" as const },
    { path: "/tools/gift-codes/", priority: 0.6, changeFrequency: "weekly" as const },
    { path: "/gallery/", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/faq/", priority: 0.75, changeFrequency: "monthly" as const },
  ];

  const updated = new Date(`${site.updated}T12:00:00Z`);

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      lastModified: updated,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...getEvents().map((event) => ({
      url: `${siteUrl}/events/${event.slug}/`,
      lastModified: new Date(`${event.updated}T12:00:00Z`),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...getGuides().map((guide) => ({
      url: `${siteUrl}/guides/${guide.slug}/`,
      lastModified: new Date(`${guide.updated}T12:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...getStrategies().map((strategy) => ({
      url: `${siteUrl}/strategies/${strategy.slug}/`,
      lastModified: new Date(`${strategy.updated}T12:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.78,
    })),
  ];
}

export const dynamic = "force-static";
