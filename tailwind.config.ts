import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lavender: {
          50: "#F7F6FD",
          100: "#EFEDFA",
          200: "#E3E0F7",
          300: "#D3CEF2",
        },
        ink: {
          900: "#1B1B2F",
          700: "#3A3A4D",
          500: "#6E6E85",
          400: "#9797AA",
        },
        primary: {
          50: "#EAEBFD",
          100: "#D6D8FB",
          400: "#5865F2",
          500: "#3D4CEA",
          600: "#2F3ED6",
          700: "#2531A8",
        },
        gold: {
          100: "#FCEFD1",
          400: "#F5B942",
          500: "#F0A825",
          600: "#D98F16",
        },
        blush: {
          100: "#F6E2E2",
          200: "#F0D2D3",
        },
      },
      keyframes: {
      float: {
        "0%, 100%": { transform: "translateY(0px)" },
        "50%": { transform: "translateY(-12px)" },
      },
    },
    animation: {
      float: "float 6s ease-in-out infinite",
    },
      fontFamily: {
        sans: ["var(--font-jakarta)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
        "4xl": "2.25rem",
      },
      boxShadow: {
        soft: "0 12px 30px -12px rgba(61, 76, 234, 0.18)",
        card: "0 8px 24px -10px rgba(27, 27, 47, 0.10)",
        pop: "0 20px 45px -18px rgba(61, 76, 234, 0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
