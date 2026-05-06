/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f7ff",
          100: "#e0efff",
          500: "#1976d2",
          600: "#1565c0",
          700: "#0d47a1",
        },
      },
    },
  },
  plugins: [],
  // Disable conflicting preflight to avoid MUI style conflicts
  corePlugins: {
    preflight: false,
  },
};
