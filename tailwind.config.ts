import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#052044',
        success: '#16a34a',
        cyan: '#22d3ee',
        border: 'hsl(var(--border))'
      },
      borderRadius: {
        lg: '12px',
        md: '8px'
      },
      fontFamily: {
        sans: ['var(--font-outfit)']
      }
    }
  },
  plugins: []
};

export default config;
