var $ = require('jquery');
var logout = require('modules/logout');

module.exports = function(selector) {
  $(selector).on('click', function(e) {
    e.preventDefault();
    logout();
  });
};
