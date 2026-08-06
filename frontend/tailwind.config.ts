import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'DIN Round Pro', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Feather Bold', 'Nunito', 'sans-serif'],
        grotesk: ['Anton', 'sans-serif'],
        condiment: ['Condiment', 'cursive']
      },
      colors: {
        ocu: {
          red: '#CC1400',
          orange: '#FFAD33',
          yellow: '#FFEC89',
          green: '#6BAA75',
          pink: '#C28CAE',
          purple: '#967CC7',
          indigo: '#4C57A9',
          blue: '#6698CC',
          canvas: '#F8F5EC',
          surface: '#FFFFFF',
          soft: '#F3F0E8',
          ink: '#28305F',
          text: '#434967',
          muted: '#737993',
          border: '#E4E1D8'
        },
        cream: '#EFF4FF',
        neon: '#6FFF00'
      },
      boxShadow: {
        tactile: '0 4px 0 #39427F',
        'tactile-danger': '0 4px 0 #8F0E00',
        'tactile-neutral': '0 4px 0 #CFCDD0',
        card: '0 14px 40px rgba(40, 48, 95, 0.08)',
        focus: '0 0 0 4px rgba(102,152,204,0.35)'
      },
      borderRadius: {
        '4xl': '2rem'
      },
      keyframes: {
        'soft-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.72' }
        }
      },
      animation: {
        'soft-pulse': 'soft-pulse 1.6s ease-in-out infinite'
      },
      opacity: {
        6: '0.06',
        7: '0.07',
        8: '0.08',
        12: '0.12',
        14: '0.14',
        15: '0.15',
        18: '0.18',
        22: '0.22',
        24: '0.24',
        28: '0.28',
        35: '0.35',
        55: '0.55',
        72: '0.72',
        78: '0.78',
        82: '0.82',
        85: '0.85',
        88: '0.88',
        92: '0.92'
      }
    }
  },
  plugins: []
} satisfies Config;
