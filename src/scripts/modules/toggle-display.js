/**
 * Responsible for creating an toggleContent based on elements existing in the DOM
 * @module toggleContent
 */

var $ = require('jquery');
var registerJQueryPlugin = require('modules/register-jquery-plugin');

var PLUGIN_NAME = 'toggleDisplay';
var CLICK_EVENT = 'click';
var ACTIVE_CLASS = 'is-active';

var DEFAULTS = {
  speed: 500
};

module.exports = toggleDisplay;
$.extend(module.exports, {
  PLUGIN_NAME: PLUGIN_NAME,
  CLICK_EVENT: CLICK_EVENT
});

// Expose the function as a jQuery plugin for ease of use
registerJQueryPlugin(PLUGIN_NAME, toggleDisplay);

/**
 * Initializes an toggleContent based on provided parameters.
 * @param {HTMLElement} el - An element containing the elements for the
 * toggleContent
 * @param {Object} options - Options used for wiring up the toggleContent
 * @see DEFAULTS
 */
function toggleDisplay(el, options) {
  options = options || {};
  var $el = $(el);
  var opts = mergeOptions($el, options)

  applyEventHandlers($el, opts);
}

/**
 * Merges together all the options and the various conditions in which they
 * can be set.
 * @param  {jQuery} $el - The container element
 * @param  {Object} [options={}] - Any options provided upon initialization
 * @return {Object} Immutable version of the options
 */
function mergeOptions($el, options) {
  options = options || {};
  var opts = Object.assign({}, DEFAULTS, options);
  return opts;
}


/**
 * Applies any sort of event handlers for the toggleContent.
 * @param {jQuery} $el - Containing the elements for the toggleContent
 * @param {Object} options - Options used for wiring up the toggleContent
 * @see DEFAULTS
 */
function applyEventHandlers($el, opts) {
  opts = opts || {};

  $el
    .on(CLICK_EVENT, function(evt){
      itemClickHandler(evt, $el, opts)
    });
}

/**
 * Handles the click event when a label has been iteracted with.
 * @param {jQuery.Event} evt - A jQuery event
 * @param {HTMLElement} currentTarget - The current target interacted with
 * @param {jQuery} $el - Containing the elements for the toggleContent
 * @param {Object} opts - Options passed along from initialization
 */
function itemClickHandler(e, $el) {
  var $toggleThis = $($el.attr('data-toggle-this'));
  if($el.hasClass(ACTIVE_CLASS)) {
    $toggleThis.slideUp();
    $toggleThis.removeClass(ACTIVE_CLASS);
    $el.removeClass(ACTIVE_CLASS);
  } else {
    $toggleThis.slideDown();
    $toggleThis.addClass(ACTIVE_CLASS);
    $el.addClass(ACTIVE_CLASS);
  }
}
