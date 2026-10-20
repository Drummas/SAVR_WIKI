import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";

import { JsonLd } from "@/components/json-ld";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { SearchProvider } from "@/components/search/search-provider";
import { SiteBackdrop } from "@/components/site-backdrop";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ClockProvider } from "@/components/time/clock-provider";
import { getSiteConfig } from "@/lib/content";
import { siteUrl, websiteSchema } from "@/lib/seo";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Savage Rebels (SAVR) — Last Asylum: Plague Field Manual",
    template: "%s | Savage Rebels (SAVR)",
  },
  description:
    "The Savage Rebels (SAVR) alliance knowledge base for Last Asylum: Plague. Event breakdowns, Alliance vs Alliance scoring, Survival Battle overlap windows, visual walkthroughs and coordination plans.",
  applicationName: "SAVR Field Manual",
  authors: [{ name: "Savage Rebels (SAVR)" }],
  creator: "Savage Rebels (SAVR)",
  keywords: [
    "Savage Rebels",
    "SAVR",
    "Last Asylum: Plague",
    "Last Asylum wiki",
    "Last Asylum guide",
    "Alliance Duel",
    "Alliance vs Alliance",
    "Survival Battle",
    "mobile strategy game",
    "alliance guide",
  ],
  category: "games",
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "/",
    siteName: "Savage Rebels (SAVR) — Last Asylum Field Manual",
    title: "Savage Rebels (SAVR) — Last Asylum: Plague Field Manual",
    description:
      "Events, strategies, optimisation and alliance coordination. Built mobile-first for Savage Rebels (SAVR) members.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Savage Rebels (SAVR) — Last Asylum: Plague field manual",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Savage Rebels (SAVR) — Last Asylum Field Manual",
    description: "Events, strategies, optimisation and alliance coordination.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    capable: true,
    title: "SAVR Ops",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#070c09",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const site = getSiteConfig();

  return (
    <html lang="en-GB" className={`dark ${inter.variable} ${barlow.variable}`}>
      <body className="min-h-screen font-sans pb-16 lg:pb-0">
        <SiteBackdrop />
        <ClockProvider>
          <SearchProvider>
            <a href="#main" className="skip-link">
              Skip to content
            </a>
            <SiteHeader server={site.server} />
            <main id="main" className="min-h-[60vh]">
              {children}
            </main>
            <SiteFooter />
            <MobileBottomNav />
          </SearchProvider>
        </ClockProvider>
        <JsonLd data={websiteSchema()} />
      </body>
    </html>
  );
}
