/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Activation du mode sombre avec classe CSS
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      colors: {
        // Couleurs personnalisées basées sur les variables CSS
        theme: {
          bg: 'rgb(var(--background))',
          'bg-secondary': 'rgb(var(--background-secondary))',
          'bg-tertiary': 'rgb(var(--background-tertiary))',
          text: 'rgb(var(--foreground))',
          'text-secondary': 'rgb(var(--foreground-secondary))',
          'text-muted': 'rgb(var(--foreground-muted))',
          border: 'rgb(var(--border))',
          'border-secondary': 'rgb(var(--border-secondary))',
          card: 'rgb(var(--card-background))',
          'card-border': 'rgb(var(--card-border))',
        }
      }
    },
  },
  plugins: [],
}