const resolve = require('path').resolve;
const setup = require('../karma-setup');

module.exports = setup({
  basePath: resolve(__dirname, '..', '..'),

  files: [
    'styleguide/src/assets/test-index.js',
    'styleguide/src/materials/elements/favorite-buttons/*.html',
    'styleguide/src/materials/modules/modals/**/*.html',
    'styleguide/src/materials/modules/*.html',
  ],

  preprocessors: {
    'styleguide/src/assets/test-index.js': ['webpack', 'sourcemap'],
    'styleguide/src/materials/elements/favorite-buttons/*.html': ['html2js'],
    'styleguide/src/materials/modules/modals/*.html': ['html2js'],
    'styleguide/src/materials/modules/*.html': ['html2js'],
  },

  junitReporter: {
    outputFile: 'fabricator-test-results.xml',
  },
});
