import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        ink: "#0B0B0A",      // near-black, warm
        paper: "#F7F6F3",    // warm off-white
        bone: "#EDEBE5",     // card surface
        line: "#D8D6CE",     // hairline borders
        steel: "#6E6D68",    // muted gray text
        rust: "#8A2E1E",     // reserved: sold-out / error only, used sparingly
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        card: "1.25rem",
      },
      clipPath: {
        cut: "polygon(0 0, 100% 0, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
      },
      keyframes: {
        "ring-spin": {
          to: { transform: "rotate(360deg)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "ring-spin": "ring-spin 6s linear infinite",
        "fade-up": "fade-up 0.5s ease-out forwards",
        shimmer: "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
