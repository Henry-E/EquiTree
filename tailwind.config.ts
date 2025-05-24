import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FDFCFA",
        lavenderMist: "#F8F5FF",
        iris: "#8B7FB8",
        sageMint: "#A8D5BA",
        charcoal: "#3A3A3C",
        dustyPlum: "#8B7B8B",
        emerald: "#6FCFA7",
        peachPink: "#FFB5A7",
        grayDiv: "#F0EFF4",
        background: "var(--background)",
        foreground: "var(--foreground)",
        chainlink: "#375BD2",
        filecoin: "#0090FF",
      },
      keyframes: {
        glowBlue: {
          '0%, 100%': { boxShadow: '0 0 0 rgba(55,91,210,0)' },
          '50%': { boxShadow: '0 0 10px rgba(55,91,210,0.5)' },
        },
      },
      animation: {
        'glow-blue': 'glowBlue 2s ease-in-out infinite',
        'pulse-logo': 'pulse 1s infinite',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],
        header: ['var(--font-dm-sans)', 'ui-sans-serif'],
        mono: ['var(--font-space-grotesk)', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
