/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        sora: ["Sora", "system-ui", "sans-serif"],
      },
      colors: {
        // Vivid royal blue, matched from the admin dashboard kit reference.
        primary: {
          50: "#EEF0FD",
          100: "#DCE0FB",
          200: "#B9C1F7",
          300: "#96A3F3",
          400: "#6B78F5",
          500: "#4453EA",
          600: "#2F3EE4",
          700: "#2531C4",
          800: "#1E279E",
          900: "#181F79",
          950: "#0F1450",
        },
        // Sidebar is near-black in both themes, matching the reference kit —
        // only the main content area switches between light and dark.
        ink: {
          DEFAULT: "#0B0B14",
          light: "#171826",
        },
        // Light mode surfaces
        canvas: "#F4F5FA",
        panel: "#FFFFFF",
        // Dark mode surfaces — deep space navy, matched from the "Тихий
        // режим" reference (glowing planet / cosmic dark UI).
        "canvas-dark": "#080A16",
        "panel-dark": "#10122A",
      },
    },
  },
  plugins: [],
};
