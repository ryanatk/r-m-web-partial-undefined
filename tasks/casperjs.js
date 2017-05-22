var defaultsDeep = require('lodash/defaultsDeep');
var glob = require('glob');
var spawn = require('child_process').spawn;
var Promise = require('es6-promise').Promise;
var command = './node_modules/.bin/casperjs';

module.exports = casperJsTask;

function casperJsTask(files, options) {
  options = options || {};
  defaultsDeep(options, {
    logLevel: 'info',
    includes: null,
    phantomjs: require('phantomjs-prebuilt').path
  });

  process.env.PHANTOMJS_EXECUTABLE = options.phantomjs;

  return getFiles(files)
    .then(function(files) {
      var promises = files.map(function(file) {
        return runTest(file, options);
      });

      return Promise.all(promises);
    }, function(err) {
      sendExit(err, -1);
    })
    .then(function() {
      console.log('done running tests');
    }, function(code) {
      sendExit('Tests failed, see output.', code);
    });
}

function getFiles(pattern) {
  return new Promise(function(resolve, reject) {
    glob(pattern, function(err, files) {
      if (err) return reject(err);
      resolve(files);
    });
  });
}

function runTest(file, options) {
  return new Promise(function(resolve, reject) {
    var args = [
      'test',
      '--log-level=' + options.logLevel
    ];

    if (options.includes) {
      args.push('--includes=' + options.includes);
    }

    var child = spawn(command, args.concat([file]));

    child.stdout.on('data', function(d) {
      console.log(d.toString().replace("\n", ''));
    });

    child.stderr.on('data', function(d) {
      console.error(d);
      reject(d);
    });

    child.stdout.on('close', function(code) {
      if (code) return reject(code);
      resolve();
    });
  });
}

function sendExit(message, code) {
  console.error(message);
  process.exit(code);
}
