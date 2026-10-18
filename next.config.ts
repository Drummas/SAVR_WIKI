import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    // Static export has no image optimisation server. Local art is pre-sized
    // and served from /public. Swap this off when deploying with a Vercel
    // image-optimisation runtime (see docs/DEPLOYMENT.md).
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
