import type { Metadata } from "next";
import { Database, Search as SearchIcon } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { SearchPageClient } from "@/components/search/search-page-client";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Search the Archive",
    description:
      "Instant local search across every Last Asylum: Plague event, guide, strategy, FAQ, calendar entry and image in the Savage Reign (SAVR) alliance wiki.",
    path: "/search/",
  }),
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <>
      <PageHeader
        eyebrow="Local index · instant results"
        title="Search the archive"
        description="No page reloads, no external search service. Query every event brief, guide, strategy, FAQ answer, calendar entry and image description in the Savage Reign (SAVR) knowledge base."
        crumbs={[{ label: "Search" }]}
      >
        <div className="flex flex-wrap gap-2">
          <Badge>
            <SearchIcon className="size-3" /> Instant results
          </Badge>
          <Badge variant="secondary">
            <Database className="size-3" /> 100+ indexed entries
          </Badge>
          <Badge variant="outline">Keyboard: Ctrl / ⌘ + K</Badge>
        </div>
      </PageHeader>

      <section className="container-page py-8">
        <SearchPageClient />
      </section>
    </>
  );
}
