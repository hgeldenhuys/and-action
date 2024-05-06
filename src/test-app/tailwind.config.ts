/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./app/routes/root.tsx"],
  theme: {
    variants: {
      extend: {
        backgroundColor: ["disabled"],
        cursor: ["disabled"],
      },
    },
  },
  plugins: [],
} satisfies Config;
