import type { Metadata } from "next";

import { getSiteConfig } from "@/lib/content";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://last-asylum-alliance.vercel.app";

export function absoluteUrl(path = "/") {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildMetadata({
  title,
  description,
  path,
  image = "/og.png",
  type = "website",
  keywords = [],
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  keywords?: string[];
}): Metadata {
  const site = getSiteConfig();
  return {
    title,
    description,
    keywords: [
      "Last Asylum: Plague",
      "Last Asylum wiki",
      "alliance guide",
      "Survival Battle",
      "Alliance vs Alliance",
      ...keywords,
    ],
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: `${site.allianceName} (${site.callsign}) — Last Asylum Field Manual`,
      locale: "en_GB",
      type,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: "Last Asylum: Plague alliance knowledge base",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleSchema({
  title,
  description,
  path,
  updated,
  category,
}: {
  title: string;
  description: string;
  path: string;
  updated: string;
  category: string;
}) {
  const site = getSiteConfig();
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    dateModified: updated,
    datePublished: updated,
    articleSection: category,
    inLanguage: "en-GB",
    mainEntityOfPage: absoluteUrl(path),
    author: { "@type": "Organization", name: site.allianceName },
    publisher: { "@type": "Organization", name: site.allianceName },
    image: absoluteUrl("/og.png"),
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function websiteSchema() {
  const site = getSiteConfig();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${site.allianceName} (${site.callsign}) — Last Asylum Field Manual`,
    alternateName: `${site.callsign} Alliance Knowledge Base`,
    url: absoluteUrl("/"),
    description: site.description,
    inLanguage: "en-GB",
    publisher: { "@type": "Organization", name: site.allianceName },
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/search/")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
