/**
 * Responsible for having an item disappear when interacting with a target
 * @module modules/vanish/vanish
 */
import $ from 'jquery';
import registerJQueryPlugin from '../../lib/register-jquery-plugin';

/**
 * Defines the defaults around the disappear module.
 * @type {Object}
 */
const DISAPPEAR_DEFAULTS = {
  vanishHiddenClassName: 'vanish--hide',
  vanishTarget: '.vanish__action',
  vanishRemoveDelay: 500,
};

/**
 * Will destroy and resolve the removal of the container element.
 * @private
 * @param {jQuery} $el - The container element
 * @param {number} delay - Time in milliseconds to remove the element
 * @param {Function} resolve - Function determining when removal has completed
 */
const remove = ($el, delay, resolve) => {
  setTimeout(() => {
    $el.remove();
    resolve();
  }, delay);
};

/**
 * Responsible for removing an element/container based on interacting with an
 * a child element within said container. This is done by either looking to a
 * data attribute called data-vanish-target which contains a selector with the
 * elements that should trigger this behavior. It includes other data
 * attributes such as:
 *
 * - data-vanish-hidden-class-name: The class name applied when the target
 *   has been interacted with.
 * - data-vanish-remove-delay: The amount of time in milliseconds the element
 *   should be removed from the DOM.
 *
 * @see DISAPPEAR_DEFAULTS
 * @param {HTMLElement} el - The container element to potentially be removed
 * @param {Object} options - Any configurable options
 * @returns {Promise}
 */
export default function vanish(el, options = {}) {
  const $el = $(el);
  const {
    vanishTarget: target,
    vanishHiddenClassName: hideClassName,
    vanishRemoveDelay: removeDelay,
  } = Object.assign({}, DISAPPEAR_DEFAULTS, options, $el.data());

  return new Promise((resolve) => {
    $el.on('click', target, (e) => {
      e.preventDefault();

      $el
        .addClass(hideClassName)
        .on('transitionend', () => remove($el, removeDelay, resolve));
    });
  });
}

registerJQueryPlugin('vanish', vanish);
