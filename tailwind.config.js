/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#456FB1",
          light: "#A5BDE4",
          dark: "#1C2F4E",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "#8729B6",
          light: "#EEDAF8",
          dark: "#5C1B7C",
          foreground: "hsl(var(--secondary-foreground))",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        "gray-fa": "#FAFAFA",
        "gray-f5": "#F5F5F5",
        "gray-f0": "#F0F0F0",
        "gray-d9": "#D9D9D9",
        "gray-bf": "#BFBFBF",
        "gray-8c": "#8C8C8C",
        "gray-59": "#595959",
        "gray-43": "#434343",
        "gray-26": "#262626",
        "gray-1f": "#1F1F1F",
        "gray-14": "#141414",

        "account-first": "#82b658",
        "account-second": "#b441cd",
        "account-third": "#c47b7b",

        error: "#cd0000",
        notice: "#fd4d36",
        success: "17e100",
      },
      fontFamily: {
        sans: ["Montserrat", "Helvetica"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
