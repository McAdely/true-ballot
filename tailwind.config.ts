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
        // Option B: Modern Democracy Theme
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff', // Background tints
          500: '#6366f1', // Main buttons
          600: '#4f46e5', // Button hover
          700: '#4338ca', // Darker text/headers
          900: '#312e81', // Deepest background
        },
        secondary: {
          500: '#8b5cf6', // Violet
        },
        accent: {
          400: '#2dd4bf', // Teal (Success/Highlight)
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #e0e7ff 0deg, #c7d2fe 180deg, #e0e7ff 360deg)',
      },
    },
  },
  plugins: [],
};
export default config;