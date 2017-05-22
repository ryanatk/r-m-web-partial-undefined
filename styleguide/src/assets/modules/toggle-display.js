/**
 * Responsible for creating an toggleContent based on elements existing in the DOM
 * @module modules/toggleContent
 */

import $ from 'jquery';

import registerJQueryPlugin from '../lib/register-jquery-plugin';

export const PLUGIN_NAME = 'toggleDisplay';
export const CLICK_EVENT = 'click';

export const DEFAULTS = {
  speed: 500,
};

/**
 * Handles the click event when a label has been iteracted with.
 * @private
 * @param {jQuery.Event} evt - A jQuery event
 * @param {HTMLElement} currentTarget - The current target interacted with
 * @param {jQuery} $el - Containing the elements for the toggleContent
 */
const itemClickHandler = ({ currentTarget }, $el) => {
  const $toggleThis = $($el.attr('data-toggle-this'));
  if ($el.hasClass('is-active')) {
    $toggleThis.slideUp();
    $el.removeClass('is-active');
  } else {
    $toggleThis.slideDown();
    $el.addClass('is-active');
  }
};

/**
 * Applies any sort of event handlers for the toggleContent.
 * @private
 * @param {jQuery} $el - Containing the elements for the toggleContent
 * @param {Object} options - Options used for wiring up the toggleContent
 * @see DEFAULTS
 */
const applyEventHandlers = ($el, opts = {}) => {
  $el
    .on(CLICK_EVENT, evt => itemClickHandler(evt, $el, opts));
};

/**
 * Merges together all the options and the various conditions in which they
 * can be set.
 * @private
 * @param  {jQuery} $el - The container element
 * @param  {Object} [options={}] - Any options provided upon initialization
 * @return {Object} Immutable version of the options
 */
const mergeOptions = ($el, options = {}) => {
  const opts = Object.assign({}, DEFAULTS, options);
  return opts;
};

/**
 * Initializes an toggleContent based on provided parameters.
 * @param {HTMLElement} el - An element containing the elements for the
 * toggleContent
 * @param {Object} options - Options used for wiring up the toggleContent
 * @see DEFAULTS
 */
export default function toggleDisplay(el, options = {}) {
  const $el = $(el);
  const opts = mergeOptions($el, options);

  applyEventHandlers($el, opts);
}

// Expose the function as a jQuery plugin for ease of use
registerJQueryPlugin(PLUGIN_NAME, toggleDisplay);
