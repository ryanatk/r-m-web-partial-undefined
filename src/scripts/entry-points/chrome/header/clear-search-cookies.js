var $ = require('jquery');
var cookie = require('js-cookie');
var COOKIE_NAMES = ['searchBrandFilterByRevolveR1', 'searchDepartmentFilterByRevolveR1', 'searchColourFilterByRevolveR1', 'searchCategoryFilterByRevolveR1'];

module.exports = clearSearchCookies;
module.exports.COOKIE_NAMES = COOKIE_NAMES;

function clearSearchCookies(selector) {
  $(selector).on('click', function() {
    COOKIE_NAMES.forEach(function(name) {
      cookie.set(name, '');
    });
  });
}
