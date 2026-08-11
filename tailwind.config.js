module.exports = {
  darkMode: 'class',
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#08263a',
          light: '#0b3a57'
        },
        gold: {
          DEFAULT: '#b98b2d'
        },
        surface: '#f7f5f2'
      },
      fontFamily: {
        heading: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial']
      },
      fontSize: {
        'base-lg': '18px'
      }
    },
  },
  plugins: [],
}
