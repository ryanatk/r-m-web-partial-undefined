var $ = require('jquery');
var defaults = require('lodash/defaults');
var LOGOUT_URL = '/r/ajax/SignOut.jsp?mobile=true';
var METHOD = 'POST';

module.exports = logout;
module.exports.LOGOUT_URL = LOGOUT_URL;
module.exports.METHOD = METHOD;

function logout(options) {
  options = options || {};
  defaults(options, {
    reloadFunc: function() { 
        window.location.reload();
    }
  });
  return $.ajax({
      type: METHOD,
      url: LOGOUT_URL
    })
    .then(function(data) {
      var obj = $.parseJSON(data);
      if (obj.success) {
        options.reloadFunc();
      }
    });
}
