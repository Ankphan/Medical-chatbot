import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Scans all files in src folder
    "./app/**/*.{js,ts,jsx,tsx}", // For app router (if applicable)
    "./pages/**/*.{js,ts,jsx,tsx}", // If pages folder exists
    "./components/**/*.{js,ts,jsx,tsx}", // Components folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
