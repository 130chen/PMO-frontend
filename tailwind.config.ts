import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'PingFang SC',
          'Microsoft YaHei',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          soft: 'hsl(var(--primary-soft))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          soft: 'hsl(var(--success-soft))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          soft: 'hsl(var(--warning-soft))',
        },
        danger: {
          DEFAULT: 'hsl(var(--danger))',
          soft: 'hsl(var(--danger-soft))',
        },
      },
      borderRadius: {
        xl: '20px',
        '2xl': '24px',
        '3xl': '28px',
      },
      boxShadow: {
        soft: '0 2px 10px -2px rgb(15 23 42 / 0.06), 0 1px 2px -1px rgb(15 23 42 / 0.04)',
        menu: '0 16px 40px -12px rgb(15 23 42 / 0.14), 0 4px 12px -4px rgb(15 23 42 / 0.08)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        drawerIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 220ms ease-out',
        drawerIn: 'drawerIn 260ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
      maxWidth: {
        content: '1440px',
      },
    },
  },
  plugins: [],
} satisfies Config
