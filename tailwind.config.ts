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
          DEFAULT: "#C6A962",
          foreground: "#FFFFFF",
          light: "#E8D5A3",
          dark: "#A68B45",
        },
        background: "#FDFBF7",
        card: "#FFFFFF",
        hover: "#F7F3EC",
        dark: {
          DEFAULT: "#0A0A0A",
          light: "#1A1A1A",
          medium: "#111111",
        },
        text: {
          primary: "#1A1A1A",
          secondary: "#6B6B6B",
          placeholder: "#A3A3A3",
          muted: "#999999",
        },
        border: {
          light: "#E8E4DC",
          gold: "#C6A962",
        },
        ui: {
          soft: "#F7F3EC",
          ivory: "#FDFBF7",
        },
        accent: {
          success: "#2ECC71",
          warning: "#F39C12",
          error: "#E74C3C",
          gold: "#C6A962",
          "gold-light": "#E8D5A3",
          champagne: "#F5E6CC",
        },
      },
      fontFamily: {
        sans: ["'Inter'", "sans-serif"],
        serif: ["'Playfair Display'", "Georgia", "serif"],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C6A962 0%, #E8D5A3 50%, #C6A962 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0A0A0A 0%, #1A1A1A 100%)',
        'hero-overlay': 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.7) 100%)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.8s ease-out forwards',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(198, 169, 98, 0.4)' },
          '50%': { boxShadow: '0 0 20px 10px rgba(198, 169, 98, 0)' },
        },
      },
      letterSpacing: {
        'ultra-wide': '0.25em',
        'luxe': '0.15em',
      },
    },
  },
  plugins: [],
};
export default config;
