const merge = require('webpack-merge');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const opn = require('opn');

const config = require('./webpack.config');

module.exports = merge(config, {
  devtool: 'eval-source-map',
  
  plugins: [
    new WebpackNotifierPlugin(),
    
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      proxy: 'http://localhost:8080/',
      open: false,
    }, {
      callback: function() {
        opn('http://localhost:3000/styleguide/site');
      }
    }),
  ]
});
