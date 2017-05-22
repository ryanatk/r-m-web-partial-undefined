var $ = require('jquery');
var defaults = require('lodash/defaults');

module.exports = tabMenu;

function tabMenu(contentSelector, targetElsSelector, options) {
  // contentSelector = '#mens-homepage-bottom-nav .occ_box';
  // targetElsSelector = '.occ_tab a';
  var $occBox = $(contentSelector);
  var $targetEls = $(targetElsSelector);

  options = options || {}
  defaults(options, {
    selectedClassName: 'selected'
  })

  $occBox.hide();

  $targetEls.click(function(e) {
    e.preventDefault();
    var $this = $(e.target);

    if ($this.hasClass(options.selectedClassName)) {
      $this
        .removeClass(options.selectedClassName)
        .parent()
        .next()
        .slideUp();
    } else {
      $targetEls.removeClass(options.selectedClassName);
      $this.addClass(options.selectedClassName);
      $occBox.slideUp();
      $this.parent().next().slideDown();
    }
  });
}
