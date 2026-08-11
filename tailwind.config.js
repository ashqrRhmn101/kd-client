/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Primary = logo green, Secondary = logo orange
        primary: {
          50: "#eefdf3",
          100: "#d6f9e1",
          200: "#aef0c3",
          300: "#79e2a1",
          400: "#3fcb7d",
          500: "#16a34a", // main brand green
          600: "#0f8a3d",
          700: "#0d6e32",
          800: "#0e572a",
          900: "#0c4824",
        },
        secondary: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316", // main brand orange
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
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
