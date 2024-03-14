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
          50: "#edf9ff",
          100: "#e4f6ff",
          200: "#c8edff",
          300: "#4cc6fe",
          400: "#44b2e5",
          500: "#3d9ecb",
          600: "#3995bf",
          700: "#2e7798",
          800: "#225972",
          900: "#1b4559"
        },
        pink: {
          50: "#ffeff4",
          100: "#ffe7ee",
          200: "#ffcddc",
          300: "#fe5d8f",
          400: "#e55481",
          500: "#cb4a72",
          600: "#bf466b",
          700: "#983856",
          800: "#722a40",
          900: "#592132"
        }
      },
      fontFamily: {
        fredoka: "var(--font-fredoka)",
        baloo: "var(--font-baloo)"
      }
    },
  },
  plugins: [],
};
