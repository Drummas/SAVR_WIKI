import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./content/**/*.{mdx,md}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        /*
         * Class/role language for the hero roster — tanks red, rangers blue,
         * warlocks green — plus the gold reserved for UR marks.
         */
        hero: {
          red: "#ff6156",
          blue: "#4fa9ff",
          green: "#34e07f",
          gold: "#f3c96b",
        },
        /* Green-family tones used across the site chrome. */
        tactical: {
          neon: "#34e07f", // wordmark highlight — primary actions
          jade: "#10b981", // secondary tone for chips and support accents
          mint: "#a7f3c4", // light tone for labels on dark surfaces
          acid: "#a3e635", // high-attention lime for warnings
          cyan: "#22d3ee", // informational tone
          sage: "#8aa79a", // muted green-grey for metadata
          moss: "#16241d", // raised surface
          gunmetal: "#141d17",
          ash: "#0e150f",
          void: "#070c09",
          coral: "#f87171", // alerts only
          blood: "#b91c1c",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Impact", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "tactical-grid":
          "linear-gradient(to right, rgba(134,180,152,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(134,180,152,0.07) 1px, transparent 1px)",
        "hero-glow":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(52,224,126,0.20), transparent 65%)",
        "card-sheen":
          "linear-gradient(135deg, rgba(255,255,255,0.045), transparent 45%)",
      },
      backgroundSize: {
        grid: "48px 48px",
        "grid-sm": "24px 24px",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(52,224,126,0.22), 0 0 32px -10px rgba(52,224,126,0.5)",
        panel: "0 24px 60px -32px rgba(0,0,0,0.9)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(400%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.5s ease-out both",
        "pulse-soft": "pulse-soft 2.8s ease-in-out infinite",
        scan: "scan 7s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
