/** @type {import('tailwindcss').Config} */
export default {
  // This is the most important part.
  // It tells Tailwind to scan all your component files and the main HTML file for classes.
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Scans all relevant files in your src folder
  ],

  // Here, we extend Tailwind's default theme with our own custom values.
  theme: {
    extend: {
      // We define a custom 'primary' color for reuse.
      // This matches the '#6469ff' used in your buttons and links.
      colors: {
        'primary': '#6469ff',
      },
      // The image gallery cards have custom shadows that appear on hover.
      boxShadow: {
        'card': '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
        'card-hover': '0px 4px 16px 0px rgba(0, 0, 0, 0.1)',
      },
      // Define the 'Inter' font family for easy use.
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  
  plugins: [],
};