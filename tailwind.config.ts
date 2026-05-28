import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-fraunces)"],
        body: ["var(--font-dm-sans)"],
      },
      colors: {
        bg: "#111114",
        surface: "#1a1a20",
        border: "#2a2a34",
        accent: "#f0b429",
        "accent-dim": "#a87c1a",
        "text-primary": "#f0ede8",
        "text-secondary": "#8b8a9b",
        "text-muted": "#4a4a5a",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "flip-front": "flipFront 0.4s ease forwards",
        "flip-back": "flipBack 0.4s ease forwards",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
