const merge = require('webpack-merge');
const entryPoint = require('./../webpack-helpers').entryPoint;
const buildConfig = require('./../webpack.build.config.js');

module.exports = merge(buildConfig, {
  entry: {
    'dist/chrome': entryPoint('chrome'),
    'dist/homepage': entryPoint('homepage'),
  }
});
