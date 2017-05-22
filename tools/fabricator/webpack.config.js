const resolve = require('../path-helpers').resolve;
const merge = require('webpack-merge');
const FabricatorPlugin = require('../fabricator-webpack-plugin');
const join = require('path').join;
const buildConfig = require('../webpack.build.config.js');

const helperDirs = resolve('styleguide', 'ui', 'handlebars-helpers');

function loadHandlebarsHelpers(names) {
  const obj = {};

  names.forEach(function(name) {
    obj[name] = require(join(helperDirs, name));
  });

  return obj;
}

module.exports = merge(buildConfig, {
  entry: {
    'styleguide/site/fabricator': resolve('styleguide', 'ui', 'assets', 'fabricator.js'),
    'styleguide/site/mock': resolve('styleguide', 'ui', 'assets', 'mock.js'),
    'styleguide/lib/styleguide': resolve('styleguide', 'src', 'assets', 'styleguide.js')
  },
  
  plugins: [
    new FabricatorPlugin({
      dest: resolve('styleguide/site'),
      layout: 'default',
      layouts: resolve('styleguide/ui/layouts/*'),
      layoutIncludes: [resolve('styleguide/ui/layouts/includes/*'), resolve('styleguide/src/partials/*')],
      views: resolve('styleguide/src/views/**/*'),
      materials: resolve('styleguide/src/materials/**/*'),
      data: resolve('styleguide/src/data/**/*.json'),
      docs: resolve('styleguide/src/docs/**/*.md'),
      helpers: loadHandlebarsHelpers(['json'])
    })
  ]
});
