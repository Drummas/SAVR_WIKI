import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Savage Rebelz (SAVR) — Last Asylum: Plague Field Manual",
    short_name: "SAVR Ops",
    description:
      "The Savage Rebelz (SAVR) alliance knowledge base for Last Asylum: Plague. Events, strategies, optimisation and coordination.",
    start_url: "/",
    display: "standalone",
    background_color: "#120d18",
    theme_color: "#120d18",
    orientation: "portrait-primary",
    categories: ["games", "education", "reference"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

export const dynamic = "force-static";
