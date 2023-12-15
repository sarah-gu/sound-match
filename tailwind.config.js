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
      black: "#011627",
      "dark-blue": "#22333B",
      tan: "#faedcd",
      brown: "#d4a373",
      "card-color-selected": "#7FD1B9",
      white: "#F8F8F8",
      "card-color-matched": "#4281A4",
      "card-color-unselected": "#011627",
      cream: "#fefae0",
      purple: "#cdb4db",
      pink: "#ffc8dd",
      "dark-pink": "#ffafcc",
      "light-blue": "#bde0fe",
      blue: "#a2d2ff",
    },
  },

  plugins: [],
};
