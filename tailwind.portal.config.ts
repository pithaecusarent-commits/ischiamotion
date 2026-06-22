import type { Config } from "tailwindcss";
import publicConfig from "./tailwind.config";

const config: Config = {
  ...publicConfig,
  content: [
    "./app/admin/**/*.{ts,tsx}",
    "./app/auth/**/*.{ts,tsx}",
    "./app/checkin/**/*.{ts,tsx}",
    "./app/renter/**/*.{ts,tsx}",
    "./components/admin/**/*.{ts,tsx}",
    "./components/auth/**/*.{ts,tsx}",
    "./components/site/SearchResults.tsx",
    "./lib/**/*.{ts,tsx}"
  ],
  corePlugins: {
    preflight: false
  }
};

export default config;
