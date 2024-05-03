/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}', 'node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx}',
  'node_modules/flowbite/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      spacing: {
        18: '4.5rem',
      },
      colors: {
        primaryColor: '#0099AD',
        hoverColor: '#176C88',
        pressedColor: '#105272',
        surfaceColor: '#F7FBFC',
        borderColor: '#176C88',
        primaryTextColor: '#333333',
        strokeColor: '#E5E7E9',
        labelColor: '#4D5E80',
        textFieldColor: '#9C9C9C',
        disabledColor: '#E0E0E0',
        textDisabledColor: '#7F7F80',
        backgroundColor: '#F6FAFD',
        warningColor: '#FF5656',
        infoComponentBorderColor: '#4791F2',
        infoComponentBgColor: '#E7F1FD',
        selectedSidebarMenuColor: '#E1F0F4',
        'primary-50': 'rgb(var(--primary-50))',
        'primary-100': 'rgb(var(--primary-100))',
        'primary-200': 'rgb(var(--primary-200))',
        'primary-300': 'rgb(var(--primary-300))',
        'primary-400': 'rgb(var(--primary-400))',
        'primary-500': 'rgb(var(--primary-500))',
        'primary-600': 'rgb(var(--primary-600))',
        'primary-700': 'rgb(var(--primary-700))',
        'primary-800': 'rgb(var(--primary-800))',
        'primary-900': 'rgb(var(--primary-900))',
        'primary-950': 'rgb(var(--primary-950))',
        'surface-0': 'rgb(var(--surface-0))',
        'surface-50': 'rgb(var(--surface-50))',
        'surface-100': 'rgb(var(--surface-100))',
        'surface-200': 'rgb(var(--surface-200))',
        'surface-300': 'rgb(var(--surface-300))',
        'surface-400': 'rgb(var(--surface-400))',
        'surface-500': 'rgb(var(--surface-500))',
        'surface-600': 'rgb(var(--surface-600))',
        'surface-700': 'rgb(var(--surface-700))',
        'surface-800': 'rgb(var(--surface-800))',
        'surface-900': 'rgb(var(--surface-900))',
        'surface-950': 'rgb(var(--surface-950))'
      }
    },
    fontSize: {
      xxxs: ['8px', '12px'],
      xxs: ['10px', '14px'],
      xs: ['12px', '16px'],
      sm: ['14px', '20px'],
      base: ['16px', '24px'],
      lg: ['20px', '28px'],
      xl: ['24px', '32px'],
      xxl: ['28px', '36px'],
      xxxl: ['32px', '40px']
    }
  },
  variants: {
    fill: ['hover', 'focus'],
  },
  plugins: [daisyui, require('flowbite/plugin')],
  daisyui: {
    themes: [
      'light',
      'dark'
    ]
  }
}
