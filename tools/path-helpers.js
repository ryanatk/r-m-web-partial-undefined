const path = require('path');
const endsWith = require('lodash/endsWith');

module.exports = {
  resolve: resolve,
  shouldIncludeTestFiles: shouldIncludeTestFiles,
};

function resolve() {
  const args = Array.prototype.slice.call(arguments);
  const paths = [].concat([__dirname, '..'], args);
  return path.resolve.apply(path, paths);
}

/**
 * Checks to see if the file under question is test related, i.e. if it ends
 * with .spec.js, since it's a test file or contains src/assets/tests, since
 * it's a test helper of some kind.
 * @param {string} modulePath - Full module path.
 * @returns {boolean} Whether the file under question is test related.
 */
function shouldIncludeTestFiles(modulePath) {
  return endsWith(modulePath, '.spec.js') || modulePath.indexOf(resolve('styleguide','src', 'assets', 'test')) > -1;
}
