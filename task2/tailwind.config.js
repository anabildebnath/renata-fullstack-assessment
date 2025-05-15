import animate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        background:   'hsl(var(--background))',
        foreground:   'hsl(var(--foreground))',
        primary:      'hsl(var(--primary))',
        secondary:    'hsl(var(--secondary))',
        destructive:  'hsl(var(--destructive))',
        muted:        'hsl(var(--muted))',
        accent:       'hsl(var(--accent))',
        card:         'hsl(var(--card))',
        popover:      'hsl(var(--popover))',
        border:       'hsl(var(--border))',
        input:        'hsl(var(--input))',
        ring:         'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [animate],
}
