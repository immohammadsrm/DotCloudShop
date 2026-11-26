import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-grotesk)", "Space Grotesk", "system-ui", "sans-serif"],
      },
      colors: {
        accent: {
          DEFAULT: "#f97316",
          bright: "#fb923c",
          soft: "#fdba74",
          deep: "#ea580c",
        },
        ink: {
          DEFAULT: "#0a0a0c",
          card: "#131216",
          raised: "#19171c",
        },
      },
    },
  },
  plugins: [],
};

export default config;
