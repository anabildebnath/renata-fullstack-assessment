// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"], // Essential for shadcn/ui dark mode
  content: [
    './index.html',
    './pages/**/*.{js,jsx,ts,tsx}',      // If you have a pages directory
    './components/**/*.{js,jsx,ts,tsx}',// For your custom components
    './app/**/*.{js,jsx,ts,tsx}',        // If you have an app directory
    './src/**/*.{js,jsx,ts,tsx}',        // General catch-all for src
  ],
  prefix: "", // From your components.json (if you intend to use a prefix, specify it here)
  theme: {
    container: { // As per shadcn/ui docs
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: { // From your components.json and typical shadcn/ui setup
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: { // As per shadcn/ui docs
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: { // For shadcn/ui animations
        "accordion-down": {
          from: { height: "0" }, /* Use "0" instead of 0px for keyframes */
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }, /* Use "0" instead of 0px for keyframes */
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    import("tailwindcss-animate") // Essential for shadcn/ui animations
  ],
};