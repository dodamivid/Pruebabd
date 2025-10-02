/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta principal
        primary: {
          50:  "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed", // Botones / énfasis
          700: "#6d28d9", // Marca
          800: "#5b21b6",
          900: "#4c1d95",
        },
        accent: {
          50:  "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
        },
        success: { 500: "#10b981", 600: "#059669" },
        warning: { 500: "#f59e0b", 600: "#d97706" },
        danger:  { 500: "#ef4444", 600: "#dc2626" },

        // Neutrales suaves para UI
        neutral: {
          25:  "#fafafa",
          50:  "#f6f7fb",
          100: "#eef1f6",
          200: "#e2e6ef",
          300: "#cfd6e3",
          400: "#a8b1c2",
          500: "#7a8396",
          600: "#5c6475",
          700: "#424a59",
          800: "#2f3746",
          900: "#1e2430",
        },
      },
      fontFamily: {
        // Opcional: cambia la fuente si quieres
        display: ["Inter", "system-ui", "Segoe UI", "Roboto", "sans-serif"],
        body: ["Inter", "system-ui", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 12px rgba(25, 28, 45, 0.06)",
        card: "0 8px 30px rgba(25, 28, 45, 0.08)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(.22,.61,.36,1)",
      },
    },
  },
  plugins: [],
}
