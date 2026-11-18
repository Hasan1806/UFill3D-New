import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ufill: {
          primary: "#111111",      // Deep Charcoal Black
          primaryDark: "#0A0A0A",  // Deepest Neutral
          secondary: "#5401C5",    // Original Royal Violet brand accent
          secondaryHover: "#43009E",
          tertiary: "#EEEAF5",     // Subtle Tinted Mist
          tertiaryLight: "#F8F6FC",
          background: "#FAFAFA",   // Body Background Off-White
          card: "#FFFFFF",         // Pure White Cards
          cardMuted: "#F3F3F3",    // Soft Surface Neutral
          border: "#E5E5E5",       // Delicate Structural Rule
          borderDark: "#181818",   // Dark Surface Border
          text: "#252525",         // Body Text Deep Slate
          textHeading: "#111111",  // Bold Headline Neutral
          textMuted: "#696969",    // Muted Slate Text
          textDim: "#9CA3AF",      // Subtle Meta Text
          surfaceDark: "#181818",  // Technical Dark Surface
          surfaceSoft: "#F3F3F3",  // Soft Neutral Surface
          accent: "#5401C5",       // Royal Violet Accent
          accentGlow: "rgba(84, 1, 197, 0.12)",
          success: "#10B981",
          warning: "#F59E0B",
          danger: "#EF4444",
        },
      },
      fontFamily: {
        sans: [
          "'Plus Jakarta Sans'",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "'Plus Jakarta Sans'",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.025em",
        tight: "-0.015em",
        normal: "0",
        wide: "0.025em",
        wider: "0.05em",
        widest: "0.1em",
        mega: "0.2em",
      },
      boxShadow: {
        "elevation-1": "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        "elevation-2": "0 4px 16px -2px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.03)",
        "elevation-3": "0 12px 32px -4px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)",
        "glow-violet": "0 0 30px -4px rgba(84, 1, 197, 0.25)",
        "glow-subtle": "0 0 16px -2px rgba(84, 1, 197, 0.10)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-subtle": "pulse-subtle 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin 35s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
