const resolve = require('path').resolve;
const setup = require('../karma-setup');

module.exports = setup({
  basePath: resolve(__dirname, '..', '..'),

  files: [
    'src/scripts/**/*.spec.js*',
  ],

  preprocessors: {
    'src/scripts/**/*.spec.js*': ['webpack', 'sourcemap'],
  },

  junitReporter: {
    outputFile: 'site-test-results.xml',
  }
});
