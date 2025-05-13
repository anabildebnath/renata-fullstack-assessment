// Tailwind v4’s PostCSS plugin
import postcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    postcss(),
    autoprefixer(),
  ],
};