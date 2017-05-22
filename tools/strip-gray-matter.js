const matter = require('gray-matter');

module.exports = function(source) {
  this.cacheable && this.cacheable();
  return matter(source).content;
};
