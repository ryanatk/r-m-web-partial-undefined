var $ = require('jquery');
var SELECTORS = {
  filterDD: '#plp_filter_dd',
  headerDropdown: '#plpheader_dropdown',
  filterDDItem: '.plp_filter_dd',
  pageHeader: '.rev_page_header',
  adHeader: '#arrowdown_header'
};
var CLASS_NAMES = {
  arrowDown: 'arrowdown',
  active: 'active'
};

module.exports = toggleCategoryDropdown;
module.exports.SELECTORS = SELECTORS;
module.exports.CLASS_NAMES = CLASS_NAMES;

function toggleCategoryDropdown() {
  var $filterList = $('#plp_filter_dd');
  var $dropdown = $('#plpheader_dropdown');

  $dropdown.find('.plp_filter_dd').hide();

  $dropdown.find('.rev_page_header').click(function() {
    if($('#arrowdown_header').hasClass('arrowdown')) {
      $(this).toggleClass('active');

      if($filterList.is(':hidden')) {
        $filterList.slideDown();
      } else {
        $filterList.slideUp();
      }
    }
  });
}
