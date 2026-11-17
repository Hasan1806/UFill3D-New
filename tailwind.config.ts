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
          primary: "#11152E",      // Midnight Navy
          primaryDark: "#0B0E20",  // Deepest Navy
          secondary: "#6258F5",    // Electric Periwinkle
          secondaryHover: "#5044E4",
          tertiary: "#E9E8FF",     // Soft Lavender
          tertiaryLight: "#F4F3FF",
          background: "#F8F9FC",   // Porcelain White
          card: "#FFFFFF",
          cardMuted: "#F3F5FA",
          border: "#E2E6F2",
          borderDark: "#23294C",
          text: "#11152E",         // Dark Navy
          textMuted: "#5D6582",    // Slate Navy
          textDim: "#8E96B2",      // Light Navy Slate
          accent: "#6258F5",
          accentGlow: "rgba(98, 88, 245, 0.15)",
          success: "#10B981",
          warning: "#F59E0B",
          danger: "#EF4444",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "var(--font-display)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
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
        "elevation-1": "0 2px 8px -2px rgba(17, 21, 46, 0.05), 0 1px 3px -1px rgba(17, 21, 46, 0.03)",
        "elevation-2": "0 8px 24px -4px rgba(17, 21, 46, 0.08), 0 4px 8px -2px rgba(17, 21, 46, 0.04)",
        "elevation-3": "0 20px 48px -8px rgba(17, 21, 46, 0.12), 0 8px 16px -4px rgba(17, 21, 46, 0.06)",
        "glow-purple": "0 0 35px -5px rgba(98, 88, 245, 0.35)",
        "glow-subtle": "0 0 20px -3px rgba(98, 88, 245, 0.15)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-subtle": "pulse-subtle 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
