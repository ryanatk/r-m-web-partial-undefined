var $ = require('jquery');
require('../vendor/jquery.smartbanner');

module.exports = function(localOptions) {
  var defaultOptions = {appendToSelector : '#home'};
  var globalOptions = window.rcProps && window.rcProps.smartBanner || {};
  localOptions = localOptions || {};
  return $.smartbanner($.extend(true, defaultOptions, globalOptions, localOptions));
};
