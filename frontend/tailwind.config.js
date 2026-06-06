/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#05070A",
        panel: "#0E141C",
        line: "#1F2A37",
        skybrand: "#38BDF8",
        skysoft: "#7DD3FC",
        skydeep: "#0284C7",
        gold: "#FACC15",
        goldsoft: "#FDE68A",
      },
      boxShadow: {
        glow: "0 18px 60px -20px rgba(56, 189, 248, 0.45)",
        "glow-soft": "0 12px 40px -16px rgba(56, 189, 248, 0.30)",
        "glow-gold": "0 18px 60px -20px rgba(250, 204, 21, 0.40)",
        inset: "inset 0 1px 0 0 rgba(255,255,255,0.04)",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #38BDF8 0%, #0EA5E9 55%, #0284C7 100%)",
        "panel-gradient":
          "linear-gradient(180deg, rgba(20,28,40,0.85) 0%, rgba(10,15,22,0.85) 100%)",
        "hero-grid":
          "linear-gradient(rgba(56,189,248,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.06) 1px, transparent 1px)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};
