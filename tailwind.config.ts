import type { Config } from 'tailwindcss';

const config: Config = {
  safelist: [
    'bg-bg-primary',
    'bg-bg-surface',
    'bg-bg-elevated',
    'text-text-primary',
    'text-text-secondary',
    'text-text-tertiary',
    'text-bg-surface',
    'border-border',
    'border-border-focus',
    'border-l-warning',
    'ring-border-focus',
    'placeholder:text-text-tertiary',
    'focus:ring-border-focus',
    'hover:border-border-focus',
    'hover:bg-bg-surface',
    'bg-text-primary',
    'hover:bg-text-primary',
  ],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--bg-primary)',
        'bg-surface': 'var(--bg-surface)',
        'bg-elevated': 'var(--bg-elevated)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        border: 'var(--border)',
        'border-focus': 'var(--border-focus)',
        'accent-blue': 'var(--accent-blue)',
        'accent-green': 'var(--accent-green)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
        success: 'var(--success)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
};

export default config;
