import type { Metadata } from "next";
import { Camera, Images, ShieldCheck } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { GalleryExplorer } from "@/components/gallery/gallery-explorer";
import { JsonLd } from "@/components/json-ld";
import { Badge } from "@/components/ui/badge";
import { getGallery } from "@/lib/content";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Image Library",
  description:
    "Searchable Last Asylum: Plague screenshot and artwork archive: events, heroes, troops, buildings, research, alliance activities, strategies and battle reports.",
  path: "/gallery/",
  keywords: ["screenshots", "image gallery", "battle reports", "game artwork"],
});

export default function GalleryPage() {
  const images = getGallery();
  const categories = [...new Set(images.map((image) => image.category))];

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Gallery", path: "/gallery/" },
        ])}
      />
      <PageHeader
        eyebrow={`Visual archive · ${String(images.length).padStart(2, "0")} assets`}
        title="Screenshots worth studying"
        description="Reference boards, walkthrough captures and battle reports. Filter by category, search by tag, then open any image in the zoomable lightbox."
        crumbs={[{ label: "Gallery" }]}
      >
        <div className="flex flex-wrap gap-2">
          <Badge>
            <Images className="size-3" /> {categories.length} categories
          </Badge>
          <Badge variant="secondary">
            <Camera className="size-3" /> Lightbox + zoom
          </Badge>
          <Badge variant="outline">
            <ShieldCheck className="size-3" /> Replaceable placeholders
          </Badge>
        </div>
      </PageHeader>

      <section className="container-page py-8">
        <GalleryExplorer images={images} />
      </section>
    </>
  );
}
