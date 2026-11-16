import type { Config } from 'tailwindcss';

const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

/**
 * Eau Élégance palette
 * wine #4B0F2F · plum #8C3A62 · rose #D9A1B3 · gold #D4B06A · cream #F7EDE3
 */
const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  safelist: [
    'bg-wine', 'bg-gold', 'bg-blush', 'bg-rose', 'bg-berry', 'bg-mauve', 'bg-plum', 'bg-cream',
    'text-wine', 'text-gold', 'text-berry',
    'btn-primary', 'btn-gold', 'btn-light', 'btn-ghost',
  ],
  theme: {
    extend: {
      colors: {
        bg: v('bg'),
        surface: v('surface'),
        'surface-2': v('surface-2'),
        ink: v('ink'),
        'ink-soft': v('ink-soft'),
        wine: { DEFAULT: '#4B0F2F', deep: '#36081F', night: '#1F0512', 400: '#6E1F48' },
        plum: { DEFAULT: '#8C3A62', soft: '#A85A82' },
        rose: { DEFAULT: '#D9A1B3', soft: '#EBC9D4' },
        blush: { DEFAULT: '#F2D6DE', deep: '#E9BFCB' },
        gold: { DEFAULT: '#D4B06A', soft: '#E8D3A3', deep: '#B8923F' },
        berry: { DEFAULT: '#B8275E', deep: '#8E1A47' },
        mauve: '#EBDDE6',
        cream: '#F7EDE3',
        champagne: '#F1E3CF',
      },
      fontFamily: {
        display: ['"Cormorant Garamond Variable"', 'Georgia', 'serif'],
        sans: ['"Manrope Variable"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['clamp(3.4rem, 9vw, 8.5rem)', { lineHeight: '0.92', letterSpacing: '-0.02em' }],
        'display-xl': ['clamp(2.8rem, 6.6vw, 6rem)', { lineHeight: '0.98', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.3rem, 4.8vw, 4.4rem)', { lineHeight: '1.02', letterSpacing: '-0.015em' }],
        'display-md': ['clamp(1.8rem, 3vw, 2.7rem)', { lineHeight: '1.08', letterSpacing: '-0.01em' }],
      },
      borderRadius: { '4xl': '2rem', '5xl': '2.75rem' },
      boxShadow: {
        soft: '0 1px 2px rgb(75 15 47 / 0.06), 0 8px 24px -8px rgb(75 15 47 / 0.16)',
        lift: '0 2px 4px rgb(75 15 47 / 0.06), 0 26px 50px -18px rgb(75 15 47 / 0.35)',
        glow: '0 0 0 1px rgb(212 176 106 / 0.4), 0 12px 40px -12px rgb(212 176 106 / 0.6)',
      },
      transitionTimingFunction: { silk: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        'marquee-rev': { from: { transform: 'translateX(-50%)' }, to: { transform: 'translateX(0)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } },
        shimmer: { from: { backgroundPosition: '200% 0' }, to: { backgroundPosition: '-200% 0' } },
      },
      animation: {
        marquee: 'marquee 48s linear infinite',
        'marquee-rev': 'marquee-rev 52s linear infinite',
        float: 'float 7s ease-in-out infinite',
        shimmer: 'shimmer 6s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
