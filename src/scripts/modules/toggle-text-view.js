/**
 * Creates a Toggle text if text is longer than expected
 * @module toggleTextView
 */

//import $ from 'jquery';

//import registerJQueryPlugin from '../lib/register-jquery-plugin';

var $ = require('jquery');
var registerJQueryPlugin = require('modules/register-jquery-plugin');

//export const PLUGIN_NAME = 'toggleTextView';
//export const CLICK_EVENT = 'click';

//export const DEFAULTS = {};

var PLUGIN_NAME = 'toggleTextView';
var CLICK_EVENT = 'click';

var DEFAULTS = {
  
};


// Expose the function as a jQuery plugin for ease of use
registerJQueryPlugin(PLUGIN_NAME, toggleTextView);

/**
 * Initializes an toggleContent based on provided parameters.
 * @param {HTMLElement} el - An element containing the elements for the
 * toggleContent
 * @param {Object} options - Options used for wiring up the toggleContent
 * @see DEFAULTS
 */
//export default function toggleTextView(el, options = {}) {
function toggleTextView(el, options) {
  options = options || {};
  var $el = $(el);
  var opts = mergeOptions($el, options)
  init($el, opts);
  applyEventHandlers($el, opts);
}

/**
 * Merges together all the options and the various conditions in which they
 * can be set.
 * @param  {jQuery} $el - The container element
 * @param  {Object} [options={}] - Any options provided upon initialization
 * @return {Object} Immutable version of the options
 */
var mergeOptions = function ($el, options) {
  options = options || {};
  var opts = Object.assign({}, DEFAULTS, options);
  return opts;
};

/**
 * Applies any sort of event handlers for the toggleContent.
 * @param {jQuery} $el - Containing the elements for the toggleContent
 * @param {Object} options - Options used for wiring up the toggleContent
 * @see DEFAULTS
 */
 
var applyEventHandlers = function($el) {
  //opts = opts || {};
  $el.find('.js-view-more').on(CLICK_EVENT, function(evt) {
    return viewMore(evt, $el, $(this))
  });

  $el.find('.js-view-less').on(CLICK_EVENT, function(evt) {
    return viewLess(evt, $el, $(this))
  });
};

function init($this){
    var showChar = $this.data('character-shown');
    var content = $this.html();
    var shownContent = content.substr(0, showChar);
    var restOfContent = content.substr(showChar, content.length - showChar);
    var html = '<span>' + shownContent + '</span><button class="js-view-more u-text-md"> &hellip;<span class="link link--light">more</span></button><span class="js-more u-hide">' + restOfContent + '</span><button class="js-view-less u-hide link u-color--grey u-text-md"> less</button>';
    if( content.length > showChar) {
        $this.html(html);
    }
}
function viewMore(evt, $this, button) {
    $this.find('.js-more').removeClass('u-hide');
    $this.find('.js-view-less').removeClass('u-hide');
    button.addClass('u-hide');
}
function viewLess(evt, $this, button) { 
    $this.find('.js-more').addClass('u-hide');
    $this.find('.js-view-more').removeClass('u-hide');
    button.addClass('u-hide');
}
