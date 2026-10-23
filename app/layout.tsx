import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";

import { ExperienceProvider } from "@/components/experience/experience-provider";
import { JsonLd } from "@/components/json-ld";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { SearchProvider } from "@/components/search/search-provider";
import { SiteBackdrop } from "@/components/site-backdrop";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ClockProvider } from "@/components/time/clock-provider";
import { getSiteConfig } from "@/lib/content";
import { EXPERIENCE_STORAGE_KEY, EXPERIENCES } from "@/lib/experience";
import { siteUrl, websiteSchema } from "@/lib/seo";
import { DEFAULT_THEME, THEMES, THEME_STORAGE_KEY } from "@/lib/themes";
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
    default: "Savage Rebelz (SAVR) — Last Asylum: Plague Field Manual",
    template: "%s | Savage Rebelz (SAVR)",
  },
  description:
    "The Savage Rebelz (SAVR) alliance knowledge base for Last Asylum: Plague. Event breakdowns, Alliance vs Alliance scoring, Survival Battle overlap windows, visual walkthroughs and coordination plans.",
  applicationName: "SAVR Field Manual",
  authors: [{ name: "Savage Rebelz (SAVR)" }],
  creator: "Savage Rebelz (SAVR)",
  keywords: [
    "Savage Rebelz",
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
    siteName: "Savage Rebelz (SAVR) — Last Asylum Field Manual",
    title: "Savage Rebelz (SAVR) — Last Asylum: Plague Field Manual",
    description:
      "Events, strategies, optimisation and alliance coordination. Built mobile-first for Savage Rebelz (SAVR) members.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Savage Rebelz (SAVR) — Last Asylum: Plague field manual",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Savage Rebelz (SAVR) — Last Asylum Field Manual",
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
  themeColor: "#120d18",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/**
 * Applies the saved palette before the body paints, so a visitor who chose
 * Aurora never sees a frame of Vivid. Kept inline and dependency-free on
 * purpose; the provider reconciles the rest after hydration.
 */
const themeScript = `(function(){try{var ids=${JSON.stringify(
  THEMES.map((theme) => theme.id),
)};var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(ids.indexOf(t)<0){t="${DEFAULT_THEME}";}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme="${DEFAULT_THEME}";}})();`;

/**
 * Applies the saved beginner/advanced layout before the body paints. With no
 * saved value the attribute stays off, which CSS treats as the advanced
 * layout; the provider then opens the first-visit chooser.
 */
const experienceScript = `(function(){try{var ids=${JSON.stringify(
  EXPERIENCES.map((experience) => experience.id),
)};var v=localStorage.getItem("${EXPERIENCE_STORAGE_KEY}");if(ids.indexOf(v)>=0){document.documentElement.dataset.experience=v;}}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const site = getSiteConfig();

  return (
    <html
      lang="en-GB"
      data-theme={DEFAULT_THEME}
      suppressHydrationWarning
      className={`dark ${inter.variable} ${barlow.variable}`}
    >
      <body className="min-h-screen font-sans pb-16 lg:pb-0">
        <script id="savr-theme" dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script id="savr-experience" dangerouslySetInnerHTML={{ __html: experienceScript }} />
        <SiteBackdrop />
        <ThemeProvider>
          <ClockProvider>
            <SearchProvider>
              <ExperienceProvider>
                <a href="#main" className="skip-link">
                  Skip to content
                </a>
                <SiteHeader server={site.server} />
                <main id="main" className="min-h-[60vh]">
                  {children}
                </main>
                <SiteFooter />
                <MobileBottomNav />
              </ExperienceProvider>
            </SearchProvider>
          </ClockProvider>
        </ThemeProvider>
        <JsonLd data={websiteSchema()} />
      </body>
    </html>
  );
}
