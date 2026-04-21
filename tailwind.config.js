/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0054A6",      // Now NIT Blue
        secondary: "#003262",    // Deeper Blue
        "nit-red": "#ED1C24",    // Restoring Red for specific highlights
        "primary-dark": "#004080",
        "secondary-dark": "#002548",
        "on-primary": "#ffffff",
        surface: "#ffffff",
        "on-surface": "#0F172A",
        "outline-variant": "#F1F5F9",
        "surface-container": "#F8FAFC",
      },
      fontFamily: {
        sans: ['Satoshi', 'sans-serif'],
        heading: ['Satoshi', 'sans-serif'],
      },
      lineHeight: {
        tight: '1.15',
        relaxed: '1.6',
      },
      keyframes: {
        "aurora-text": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
      },
      animation: {
        "aurora-text": "aurora-text 5s linear infinite",
      },
      borderRadius: {
        "sm": "0.375rem",
        "md": "0.5rem",
        "lg": "0.75rem",
        "xl": "1rem",
        "2xl": "1.5rem",
        "full": "9999px",
      },
    },
  },
  plugins: [],
}
