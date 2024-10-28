/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',                 // Fichier d'accueil
    './pages/**/*.html',            // Tous les fichiers HTML dans le dossier 'pages'
    './src/**/*.js',                // Tous les fichiers JavaScript dans le dossier 'src'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4A90E2',         // Couleur principale : bleu moderne
        secondary: '#F5A623',       // Couleur secondaire : orange doux
        dark: '#333333',            // Couleur sombre pour le texte ou les backgrounds
        light: '#F7F7F7',           // Couleur de fond claire
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'], // Police par défaut
      },
    },
  },
  plugins: [],
}
