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
          soft: "hsl(var(--primary-soft))",
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
        /* Near-black chrome steps, retuned per theme (top bar, drawer, bands). */
        ink: "hsl(var(--ink))",
        panel: "hsl(var(--panel))",
        well: "hsl(var(--well))",
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
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
        /*
         * Chrome colours (primary, accent, surfaces, warning, success) are
         * theme tokens from styles/globals.css. Only the hero class language
         * above is fixed, because those colours encode meaning.
         */
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
          "linear-gradient(to right, rgb(var(--grid-rgb) / 0.07) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--grid-rgb) / 0.07) 1px, transparent 1px)",
        "hero-glow":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgb(var(--primary-rgb) / 0.20), transparent 65%)",
        "card-sheen":
          "linear-gradient(135deg, rgba(255,255,255,0.045), transparent 45%)",
      },
      backgroundSize: {
        grid: "48px 48px",
        "grid-sm": "24px 24px",
      },
      boxShadow: {
        glow: "0 0 0 1px rgb(var(--primary-rgb) / 0.22), 0 0 32px -10px rgb(var(--primary-rgb) / 0.5)",
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
