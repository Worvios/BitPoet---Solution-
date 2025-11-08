import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import typography from '@tailwindcss/typography';

const colorVar = (variableName: string) => `rgb(var(${variableName}) / <alpha-value>)`;

const config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './sanity/**/*.{ts,tsx}',
    './locales/**/*.json'
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: colorVar('--color-background'),
        surface: colorVar('--color-surface'),
        'surface-muted': colorVar('--color-surface-muted'),
        'surface-strong': colorVar('--color-surface-strong'),
        foreground: colorVar('--color-foreground'),
        muted: colorVar('--color-foreground-muted'),
        subtle: colorVar('--color-foreground-subtle'),
        'foreground-muted': colorVar('--color-foreground-muted'),
        'foreground-subtle': colorVar('--color-foreground-subtle'),
        border: colorVar('--color-border'),
        ring: colorVar('--color-ring'),
        accent: {
          DEFAULT: colorVar('--color-accent-1'),
          1: colorVar('--color-accent-1'),
          2: colorVar('--color-accent-2')
        },
        success: colorVar('--color-success'),
        danger: colorVar('--color-danger')
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui'],
        display: ['var(--font-display)', 'system-ui']
      },
      typography: () => ({
        DEFAULT: {
          css: {
            color: 'rgb(var(--color-foreground))',
            a: {
              color: 'rgb(var(--color-accent-1))',
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': {
                color: 'rgb(var(--color-accent-2))'
              }
            },
            h1: { color: 'rgb(var(--color-foreground))' },
            h2: { color: 'rgb(var(--color-foreground))' },
            h3: { color: 'rgb(var(--color-foreground))' },
            h4: { color: 'rgb(var(--color-foreground))' },
            strong: { color: 'rgb(var(--color-foreground))' },
            blockquote: {
              color: 'rgb(var(--color-foreground-muted))',
              borderLeftColor: 'rgb(var(--color-accent-1) / 0.4)'
            },
            code: { color: 'rgb(var(--color-accent-1))' },
            hr: { borderColor: 'rgb(var(--color-border))' }
          }
        },
        invert: {
          css: {
            color: 'rgb(var(--color-foreground))',
            a: {
              color: 'rgb(var(--color-accent-2))',
              '&:hover': {
                color: 'rgb(var(--color-accent-1))'
              }
            },
            h1: { color: 'rgb(var(--color-foreground))' },
            h2: { color: 'rgb(var(--color-foreground))' },
            h3: { color: 'rgb(var(--color-foreground))' },
            h4: { color: 'rgb(var(--color-foreground))' },
            strong: { color: 'rgb(var(--color-foreground))' },
            blockquote: {
              color: 'rgb(var(--color-foreground-muted))',
              borderLeftColor: 'rgb(var(--color-accent-2) / 0.4)'
            },
            code: { color: 'rgb(var(--color-accent-2))' },
            hr: { borderColor: 'rgb(var(--color-border))' }
          }
        }
      }),
      keyframes: {
        'gradient-move': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        }
      },
      animation: {
        'gradient-move': 'gradient-move 12s ease infinite'
      }
    }
  },
  plugins: [
    typography,
    plugin(({ addUtilities }) => {
      addUtilities({
        '.text-foreground': { color: 'rgb(var(--color-foreground))' },
        '.text-muted': { color: 'rgb(var(--color-foreground-muted))' },
        '.text-subtle': { color: 'rgb(var(--color-foreground-subtle))' },
        '.bg-surface': { backgroundColor: 'rgb(var(--color-surface))' },
        '.bg-surface-muted': { backgroundColor: 'rgb(var(--color-surface-muted))' },
        '.bg-surface-strong': { backgroundColor: 'rgb(var(--color-surface-strong))' },
        '.border-border': { borderColor: 'rgb(var(--color-border))' },
        '.border-strong': { borderColor: 'rgb(var(--color-surface-strong))' },
        '.glass-panel': {
          backgroundColor: 'rgb(var(--color-surface) / 0.72)',
          borderColor: 'rgb(var(--color-border) / 0.5)',
          backdropFilter: 'blur(18px) saturate(140%)',
          WebkitBackdropFilter: 'blur(18px) saturate(140%)'
        }
      });
    })
  ]
} satisfies Config;

export default config;
