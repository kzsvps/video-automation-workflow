import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F2F4F9",
        surface: "#FFFFFF",
        "surface-hover": "#F8F9FC",
        border: "#E3E7F1",
        primary: {
          DEFAULT: "#6366f1",
          light: "#818cf8",
          dark: "#4f46e5",
        },
        accent: {
          DEFAULT: "#0891b2",
          light: "#06b6d4",
        },
        text: {
          primary: "#0F172A",
          secondary: "#374151",
          muted: "#9CA3AF",
        },
        success: "#16a34a",
        warning: "#d97706",
        danger: "#dc2626",
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans TC", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
        "gradient-card": "linear-gradient(135deg, #FFFFFF 0%, #F8F9FC 100%)",
      },
      boxShadow: {
        "card": "0 1px 3px rgba(15,23,42,0.07), 0 1px 2px rgba(15,23,42,0.04)",
        "card-hover": "0 4px 12px rgba(15,23,42,0.10), 0 2px 4px rgba(15,23,42,0.05)",
        "modal": "0 20px 60px rgba(15,23,42,0.15), 0 8px 20px rgba(15,23,42,0.08)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
