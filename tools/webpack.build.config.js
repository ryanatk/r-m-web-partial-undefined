const SVGStore = require('webpack-svgstore-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const config = require('./webpack.common.config');
const resolve = require('./path-helpers').resolve;
const join = require('path').join;

module.exports = merge(config, {
  module: {
    rules: [
      {
        test: /\.scss$/,
        include: [
          resolve('styleguide', 'src', 'assets'),
          resolve('styleguide', 'ui', 'assets'),
          resolve('src', 'scss'),
        ],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          // https://github.com/webpack-contrib/sass-loader/issues/351
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                precision: 8
              },
            },
            {
              loader: 'sass-loader',
              // TODO: Enable sass source maps when things are not broken. More
              // specifically, it appears when using & inside of a selector,
              // source maps appear to be breaking> Here's a reference to the
              // issue:
              // https://github.com/webpack-contrib/sass-loader/issues/351
              // This shouldn't be a show stopper, but it's a nice to have so
              // that CSS can be cleanly mapped to the file, but for debugging
              // purposes, what is in place should get the job done.
              // options: {
              //   sourceMap: true,
              // },
            },
          ],
        }),
      }, {
        test: /\.svg$/,
        loader: 'svg-url-loader',
        include: resolve('styleguide','src', 'assets', 'svg', 'backgrounds'),
      }
    ],
  },

  plugins: [
    new ExtractTextPlugin('[name].css'),

    new SVGStore(
      [ resolve('styleguide', 'src', 'assets', 'svg', 'icons', '*.svg') ],
      join('styleguide', 'lib'),
      {
        name: 'sprite.svg'
      }
    )
  ],
  // Instructs webpack of any required modules that already exist on the window
  // or globally.
  // https://webpack.github.io/docs/configuration.html#externals
  externals: {
    // jQuery already exists on the window since Optimizely is depending on it.
    // Therefore, there is no need for jQuery to be part of the bundled output.
    jquery: 'jQuery'
  }
});
