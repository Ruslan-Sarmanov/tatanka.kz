import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        leather: {
          50: "#faf6f1",
          100: "#f0e4d6",
          200: "#e0c6a8",
          300: "#cda476",
          400: "#b8814f",
          500: "#8b5a2b", // основной бренд-цвет
          600: "#6f4622",
          700: "#54341a",
          800: "#3a2412",
          900: "#241608",
        },
      },
      fontFamily: {
        display: ["Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
