/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        cyan: {
          50: "#e6f9fc",
          100: "#d9f5fa",
          200: "#b0ebf5",
          300: "#01bede",
          400: "#01abc8",
          500: "#0198b2",
          600: "#018fa7",
          700: "#017285",
          800: "#005564",
          900: "#00434e"
        },
        pink: {
          50: "#ffe3e8",
          100: "#ffdde3",
          200: "#ffd6dd",
          300: "#ffc0cb",
          400: "#d9a3ad",
          500: "#ba8c94",
          600: "#594347",
          700: "#403033",
          800: "#1c1516",
          900: "#1a1111"
        }
      },
    },
  },
  plugins: [],
};
