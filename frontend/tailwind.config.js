/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // 다크모드 지원
  theme: {
    extend: {
      colors: {
        // 다크 배경
        'dark-primary': '#1a1a1a',
        'dark-secondary': '#2d2d2d',
        'dark-gradient-start': '#1a1a1a',
        'dark-gradient-end': '#0a0a0a',

        // 악센트
        'accent-white': '#ffffff',
        'accent-light': '#f5f5f5',

        // 텍스트
        'text-primary': '#ffffff',
        'text-secondary': '#e5e5e5',
        'text-tertiary': '#a0a0a0',
        'text-muted': '#6b7280',

        // 테두리
        'border-light': '#404040',
        'border-accent': '#ffffff',
        'border-focus': '#ffffff',

        // 배경
        'bg-dark': '#1a1a1a',
        'bg-overlay': 'rgba(0, 0, 0, 0.5)',
        'bg-button': '#ffffff',
        'bg-input': 'transparent',
      },
      fontSize: {
        'timer-main': ['3.5rem', { lineHeight: '1', letterSpacing: '0.05em' }],
        'hint-label': ['1rem', { lineHeight: '1.5' }],
        'hint-count': ['0.875rem', { lineHeight: '1.5' }],
        'section-title': ['1.25rem', { lineHeight: '1.75rem' }],
        'input-text': ['1.5rem', { lineHeight: '2rem' }],
        'keypad-number': ['2rem', { lineHeight: '1' }],
        'label-small': ['0.75rem', { lineHeight: '1rem' }],
        'button-text': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '600' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '104': '26rem',
      },
      borderRadius: {
        '2xl': '1rem',
        'xl': '0.75rem',
      },
      ringColor: {
        'focus': 'rgba(255, 255, 255, 0.3)',
      },
      ringWidth: {
        'focus': '2px',
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(to bottom, #1a1a1a, #0a0a0a)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 255, 255, 0.1)',
        'inner-glow': 'inset 0 0 10px rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        sm: '2rem',
        lg: '4rem',
      },
    },
    screens: {
      'xs': '360px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}