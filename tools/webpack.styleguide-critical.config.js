var webpack = require('webpack');
var cloneDeep = require('lodash/cloneDeep');
var buildConfig = require('./webpack.build.config');
var helpers = require('./webpack-helpers');

// It's a bit overkill, but clone the build config to ensure that it doesn't get
// mutated.
var config = cloneDeep(buildConfig);
// Override the entry object since all we really need is a single bundle.
config.entry = {
  'dist/styleguide-critical': helpers.entryPoint('styleguide-critical')
};

// Since we aren't worried about code splitting, we can remove the chunk plugin.
// This will speed up builds, ensure the proper bundles are being created, and
// prevent any sort of overriding when more than one webpack build is being ran.
config.plugins = config.plugins.filter(function(plugin) {
  return !(plugin instanceof webpack.optimize.CommonsChunkPlugin);
});

// Finally, export this badboy so webpack can do its thang.
module.exports = config;
