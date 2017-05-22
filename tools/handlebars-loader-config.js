const path = require('path');
const fs = require('fs');
const join = require('path').join;
const Promise = require('bluebird');
Promise.promisifyAll(fs);

module.exports = handlebarsLoaderConfig;

/**
 * Responsible for any handlebars loader custom configuration when it cannot
 * be expressed via query parameters
 * @param  {Object} options - Configuration options
 * @param  {Array} options.dirs - Represents the possible directories partials
 * can exist
 * @param  {Array} options.extension - Partial extensions
 * @return {Object} Qualified config object
 */
function handlebarsLoaderConfig(options) {
  return {
    partialResolver: function(request, cb) {
      const filename = request.replace(/\./g, '/');
      const promises = options.dirs.map(function(dir) {
        const partialPath = join(dir, filename + options.extension)

        return fs.accessAsync(partialPath, fs.constants ? fs.constants.F_OK : fs.F_OK)
          .then(function() {
            return partialPath;
          })
          .catch(function() {
            return findFileByNumberedPrefix(dir, filename, options.extension);
          });
      });

      Promise
        .all(promises)
        .then(function(filenames) {
          var called = false;
          filenames.forEach(function(filename) {
            if (filename && !called) {
              called = true;
              cb(null, filename);
            }
          });
        })
    }
  };
}

function findFileByNumberedPrefix(dir, filepath, extension) {
  const parts = filepath.split(path.sep);
  const filename = parts.pop() + extension;
  parts.unshift(dir);

  const fullDir = path.join.apply(path, parts);

  return new Promise(function(resolve, reject) {
    fs.readdirAsync(fullDir).then(function(files) {
      var actual;

      files.forEach(function(file) {
        if (new RegExp('^[\\d]+\-' + filename).test(file)) {
          actual = path.join(fullDir, file);
        }
      });

      resolve(actual);
    }, function() {
      resolve();
    });
  });
}
