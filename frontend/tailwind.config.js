// tailwind.config.js
module.exports = {
  darkMode: 'class', // enable class-based dark mode
  content: [
    './index.html',
    './src/**/*.{js,ts,tsx,jsx,html}',
  ],
  theme: {
    extend: {
      colors: {
        // custom dark palette (optional)
        darkBg: '#1A1A1A',
        darkSurface: '#2C2C2C',
        darkText: '#F5F5F5',
      },
    },
  },
  plugins: [],
};
