import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#0D0F14",
        "base-light": "#131620",
        primary: "#00D9FF",
        "bio-green": "#39FF14",
        danger: "#FF6B35",
        safe: "#00FFA3",
        neutral: "#8892A4",
        "sticky-yellow": "#FFFE8A",
        "panel-bg": "rgba(255,255,255,0.03)",
        "panel-border": "rgba(255,255,255,0.06)",
        "stitch-border": "rgba(0,217,255,0.3)",
      },
      fontFamily: {
        serif: ['"Instrument Serif"', "Georgia", "serif"],
        mono: ['"DM Mono"', "Menlo", "monospace"],
        inter: ['"Inter"', "sans-serif"],
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        pulse_glow: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.08)", opacity: "0.7" },
        },
        pencil_draw: {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        countup: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        scanline: "scanline 0.6s ease-in-out",
        "pulse-glow": "pulse_glow 2s ease-in-out infinite",
        "pencil-draw": "pencil_draw 2s ease forwards",
        float: "float 3s ease-in-out infinite",
        countup: "countup 0.5s ease-out forwards",
        blink: "blink 1s step-end infinite",
      },
      backdropBlur: {
        panel: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
