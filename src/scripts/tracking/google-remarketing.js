var $ = require('jquery');

module.exports = function(options) {
  options = options || {};

  // TODO, determine default options
  var defaultOptions = {};
  var globalOptions = window.rcProps && window.rcProps.googleTrackConversion || {};
  var params = $.extend({}, globalOptions, defaultOptions, options);

  if (!$.isEmptyObject(params)) {
    return $.getScript("//www.googleadservices.com/pagead/conversion_async.js", function(){
      if (typeof window.google_trackConversion === 'function') {
        window.google_trackConversion(params);
      }
    });
  }
};
