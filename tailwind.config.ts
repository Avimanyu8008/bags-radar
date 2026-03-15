import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        radar: {
          bg: "#030712",
          panel: "#111827",
          border: "#1f2937",
          muted: "#9ca3af"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(31, 41, 55, 0.8), 0 20px 40px rgba(0, 0, 0, 0.35)"
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)"
      }
    }
  },
  plugins: []
};

export default config;
