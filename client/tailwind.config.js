export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        foreground: "hsl(var(--foreground))",
        background: "hsl(var(--background))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
      },
      fontFamily: {
        sans:  ['Inter', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        cabin: ['Cabin', 'sans-serif'],
        instrument: ['Instrument Serif', 'serif'],
      },
    },
  },
  plugins: [],
}
