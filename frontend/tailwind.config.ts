import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1.5rem", screens: { "2xl": "1400px" } },
    extend: {
      colors: {
        background: "hsl(var(--background))", foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))", "card-foreground": "hsl(var(--card-foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        border: "hsl(var(--border))", input: "hsl(var(--input))", ring: "hsl(var(--ring))",
      },
      borderRadius: { xl: "calc(var(--radius) + 4px)", lg: "var(--radius)", md: "calc(var(--radius) - 2px)" },
      boxShadow: { soft: "0 12px 32px rgba(17, 24, 39, 0.06)", lift: "0 20px 48px rgba(17, 24, 39, 0.14)" },
      fontFamily: { sans: ["DM Sans", "Segoe UI", "ui-sans-serif", "system-ui"], display: ["Manrope", "DM Sans", "Segoe UI", "ui-sans-serif", "system-ui"] },
    },
  },
  plugins: [],
};

export default config;
