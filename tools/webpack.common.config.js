const { resolve, shouldIncludeTestFiles } = require('./path-helpers');
const join = require('path').join;
const helpers = require('./webpack-helpers');

const uiAssetsDir = resolve('styleguide', 'ui', 'assets');
const srcAssetsDir = resolve('styleguide', 'src', 'assets');
const helperDirs = resolve('styleguide', 'ui', 'handlebars-helpers');
const siteScripts = resolve('src', 'scripts');
const handlebarsLoaderConfig = require('./handlebars-loader-config');

// Only include files under src/assets, but don't include any test related files.
const shouldIncludeJS = modulePath =>
  modulePath.indexOf(srcAssetsDir) > -1 && !shouldIncludeTestFiles(modulePath);

module.exports = {
  output: {
    path: resolve(),
    filename: '[name].js'
  },

  resolveLoader: {
    alias: {
      'strip-gray-matter-loader': join(__dirname, 'strip-gray-matter')
    }
  },

  resolve: {
    // The extensions of file types so webpack knows what is/isn't accepted
    // https://webpack.github.io/docs/configuration.html#resolve-extensions
    extensions: ['.js', '.scss'],
    // Shortens the lookup of a path to keyworded importing. By doing this, it
    // creates a standard for path resolution when modules are referenced.
    // https://webpack.github.io/docs/configuration.html#resolve-alias
    alias: {
      modules: join(helpers.scriptsDirectory(), 'modules'),
      vendor: join(helpers.scriptsDirectory(), 'vendor'),
      tracking: join(helpers.scriptsDirectory(), 'tracking'),
      templates: join(helpers.rootDirectory(), 'templates'),
      styleguide: join(helpers.rootDirectory(), 'styleguide', 'src', 'assets'),
      'entry-points': join(helpers.scriptsDirectory(), 'entry-points')
    }
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.js$/,
        include: shouldIncludeJS,
        loader: 'eslint-loader',
        enforce: 'pre',
        options: {
          configFile: resolve(__dirname, '.eslintrc.json'),
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [ srcAssetsDir, uiAssetsDir, siteScripts ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'handlebars-loader',
            options: handlebarsLoaderConfig({
              helperDirs: [helperDirs],
              extension: '.html',
              dirs: [
                resolve('styleguide', 'src', 'partials'),
                resolve('styleguide', 'src', 'materials', 'modules'),
                resolve('styleguide', 'src', 'materials', 'elements'),
              ],
            }),
          },

          {
            loader: 'strip-gray-matter-loader',
          },
        ],
      },
    ]
  }
};
