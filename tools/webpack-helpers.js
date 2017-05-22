var path = require('path');
var join = path.join;
var resolve = path.resolve;

module.exports = {
  rootDirectory: rootDirectory,
  scriptsDirectory: scriptsDirectory,
  distDirectory: distDirectory,
  entryPoint: entryPoint,
  containsCommandLineArg: containsCommandLineArg
};

/**
 * Resolves to the mobile directory.
 * @return {string} The full path to the mobile directory.
 */
function rootDirectory() {
  return resolve();
}

/**
 * Resolves to the scripts directory.
 * @return {string} The full path to the scripts directory.
 */
function scriptsDirectory() {
  return join(rootDirectory(), 'src', 'scripts');
}

/**
 * Resolves to the dist directory.
 * @return {string} The full path to the dist directory.
 */
function distDirectory() {
  return join(rootDirectory(), 'dist');
}

/**
 * Accepts the directory name to create the full path for an entry point.
 * @param  {string} dirName The directory name
 * @return {string} The full path to the entry point
 */
function entryPoint(dirName) {
  return join(scriptsDirectory(), 'entry-points', dirName, 'index.js');
}

/**
 * Takes in a target arg and sees if the current process.argv is contained
 * within the list.
 * @param  {string} targetArg The argument being searched on
 * @return {Boolean} Whether the arg appears in arg list
 */
function containsCommandLineArg(targetArg) {
  return process.argv.some(function(arg) {
    return targetArg === arg;
  });
};
