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
        // From your palette doc
        primary: '#1877F2',
        background: '#FAFBFD',
        card: '#FFFFFF',
        hover: '#F1F3F6',
        'text-primary': '#1A1A1A',
        'text-secondary': '#6E6E6E',
        'text-placeholder': '#A3A3A3',
        'border-light': '#E5E7EB',
        'ui-soft': '#F1F3F6',
        
        // Functional Colors
        'accent-success': '#2ECC71',
        'accent-warning': '#F39C12',
        'accent-error': '#E74C3C', // Was 'Error / Sold'
        'accent-gold': '#F8CF40', // Was 'Gold Soft'
      },
      // You can also add your fonts here if needed
    },
  },
  plugins: [],
};
export default config;