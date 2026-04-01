/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50:  '#f3f7f5',
          100: '#e4eee8',
          200: '#c8ddd2',
          300: '#a1c4b0',
          400: '#74a687',
          500: '#528a68',
          600: '#3e6e52',
          700: '#335843',
          800: '#2b4737',
          900: '#243b2e',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      typography: (theme) => ({
        stone: {
          css: {
            '--tw-prose-body': theme('colors.stone[700]'),
            '--tw-prose-headings': theme('colors.stone[900]'),
            '--tw-prose-bold': theme('colors.stone[900]'),
            '--tw-prose-links': theme('colors.sage[600]'),
            '--tw-prose-bullets': theme('colors.stone[400]'),
            '--tw-prose-counters': theme('colors.stone[400]'),
            '--tw-prose-hr': theme('colors.stone[200]'),
            '--tw-prose-quotes': theme('colors.stone[600]'),
            '--tw-prose-quote-borders': theme('colors.sage[300]'),
            '--tw-prose-code': theme('colors.stone[800]'),
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
