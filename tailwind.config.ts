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
        brand: {
          50: "#f0f4ff",
          100: "#e0ebff",
          200: "#c7d9ff",
          300: "#a3bfff",
          400: "#7a99ff",
          500: "#5a7fff",
          600: "#4163e8",
          700: "#3549cc",
          800: "#2e3da8",
          900: "#1e2761",
          950: "#141832",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(90,127,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(90,127,255,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
    },
  },
  plugins: [],
};
export default config;
