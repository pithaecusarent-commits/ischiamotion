import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/page.tsx",
    "./app/[locale]/**/*.{ts,tsx}",
    "./app/en/**/*.{ts,tsx}",
    "./app/it/**/*.{ts,tsx}",
    "./components/site/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  safelist: [
    "from-green-deep",
    "from-ink",
    "from-mint",
    "from-gold",
    "from-sea",
    "via-green-mid",
    "via-green-deep",
    "via-mint",
    "to-sea",
    "to-green-mid",
    "to-green-deep",
    "to-sand"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#151512",
        cream: "#FFFDF7",
        sand: "#F6EFE2",
        "sand-dark": "#E4D8C5",
        "green-deep": "#0D2B4E",
        "green-mid": "#0097AB",
        sea: "#0097AB",
        mint: "#B0E8F0",
        gold: "#E8951A"
      },
      fontFamily: {
        sans: ["var(--font-dm)", "DM Sans", "system-ui", "sans-serif"],
        serif: ["var(--font-fraunces)", "Fraunces", "Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 18px 50px rgba(21, 21, 18, 0.10)",
        card: "0 10px 30px rgba(13, 43, 78, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
