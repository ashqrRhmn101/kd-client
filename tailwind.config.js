/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff7ed",
          100: "#ffedd5",
          400: "#fb923c",
          500: "#f97316", // primary brand orange
          600: "#ea580c",
          700: "#c2410c",
        },
        ink: {
          900: "#111827",
        },
      },
      fontFamily: {
        sans: ["Hind Siliguri", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
