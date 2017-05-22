const { resolve, shouldIncludeTestFiles } = require('./path-helpers');
const merge = require('webpack-merge');
const config = require('./webpack.common.config');

//console.log('look below');
//console.log(shouldIncludeTestFiles());

module.exports = merge(config, {
  devtool: 'inline-source-map',

  module: {
    rules: [
      
      {
        test: /\.scss$/,
        loader: 'ignore-loader',
        exclude: /node_modules/
      }
    ]
  }
});
