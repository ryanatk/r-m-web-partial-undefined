const join = require('path').join;
const merge = require('lodash/merge');
const webpackConfig = require('./webpack.test.config.js');

module.exports = function(overrides) {
  return function(config) {
    config.set(merge({

      frameworks: ['mocha', 'fixture', 'jquery-2.1.0', 'sinon'],

      exclude: [
        '**/*.sw*'
      ],

      reporters: ['mocha', 'coverage'],

      coverageReporter: {
        dir: process.env.CIRCLE_ARTIFACTS || 'coverage',
        reporters: [
          { type: 'html', subdir: 'report-html' },
          { type: 'lcov', subdir: 'report-lcov' }
        ]
      },

      port: 9876,

      colors: true,

      logLevel: config.LOG_INFO,

      autoWatch: true,

      browsers: ['Chrome', 'PhantomJS'],

      singleRun: false,

      concurrency: Infinity,

      webpack: webpackConfig,

      webpackMiddleware: {
        stats: 'errors-only'
      },

      junitReporter: {
        outputDir: join(process.env.CIRCLE_TEST_REPORTS || '', 'junit'),
        useBrowserName: false
      }
    }, overrides));
  };
};
