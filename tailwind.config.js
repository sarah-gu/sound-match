/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors: {
      black: "#0A0908",
      "dark-blue": "#22333B",
      tan: "#faedcd",
      brown: "#d4a373",
      "card-color-selected": "#a3b18a",
      white: "#F8F8F8",
      "card-color-matched": "#283618",
      "card-color-unselected": "#606c38",
      cream: "#fefae0",
    },
  },

  plugins: [],
};
