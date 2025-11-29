import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1877F2",
          foreground: "#FFFFFF",
        },
        background: "#FAFBFD",
        card: "#FFFFFF",
        hover: "#F1F3F6",
        text: {
          primary: "#1A1A1A",
          secondary: "#6E6E6E",
          placeholder: "#A3A3A3",
        },
        border: {
          light: "#E5E7EB",
        },
        ui: {
          soft: "#F1F3F6",
        },
        accent: {
          success: "#2ECC71",
          warning: "#F39C12",
          error: "#E74C3C",
          gold: "#F8CF40",
          "gold-light": "#FFCE38",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
