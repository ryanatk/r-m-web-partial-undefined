/**
 * Responsible for creating an accordion based on elements existing in the DOM
 * @module modules/accordion
 */

import $ from 'jquery';
import 'jquery-colorbox';

import registerJQueryPlugin from '../lib/register-jquery-plugin';

export const PLUGIN_NAME = 'accordion';
export const CLICK_EVENT = 'click';
export const AUTO_VALUE = 'auto';
export const CHECKED_ATTR = 'checked';
export const DEFAULTS = {
  accItem: '.accordion__item',
  accContent: '.accordion__content',
  accActive: 'accordion__item--active',
  accRadio: 'js-accordion-radio',
  accLabel: '.accordion__label',
  accSpeed: 500,
  accToggle: false,
  accDataToggleAttr: 'toggle',
  onComplete: () => {},
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
  let opts = Object.assign({}, DEFAULTS, options);
  const { accDataToggleAttr } = opts;

  if ($el.data(accDataToggleAttr) === true) {
    opts = Object.assign({}, opts, { accToggle: true });
  }

  return opts;
};

/**
 * Handles any sort of defaults when the accordion is called upon.
 * @private
 * @param  {jQuery} $el - The container element
 * @param  {Object} options - Any options provided upon initialization
 * @param  {string} options.accActive - Selector representing the active
 * className
 * @param  {string} options.accContent - Selector representing the content for
 * the tab
 */
const applyDefaultsToActive = ($el, { accActive, accContent }) => {
  $(`.${accActive}`, $el)
    .find(accContent)
    .css({ height: AUTO_VALUE });
};

/**
 * Handles any sort of defaults when the accordion is using radio buttons.
 * @private
 * @param  {jQuery} $el - The container element
 * @param  {Object} options - Any options provided upon initialization
 * @param  {string} options.accActive - Selector representing the active
 * className
 * @param  {string} options.accContent - Selector representing the content for
 * the tab
 * @param  {string} options.accItem - Selector representing the tab
 * @param  {string} options.accRadio - Selector representing a radio button
 */
const applyDefaultsToRadio = ($el, { accActive, accContent, accItem, accRadio }) => {
  $(`.${accRadio}:${CHECKED_ATTR}`, $el)
    .parents(accItem)
    .addClass(accActive)
    .find(accContent)
    .css({ height: AUTO_VALUE });
};

/**
 * Closes the active tab
 * @private
 * @param  {jQuery} $parent - The parent containing the entire tab.
 * @param  {Object} options - Any options provided upon initialization
 * @param  {string} options.accActive - Selector representing the active
 * className
 * @param  {string} options.accContent - Selector representing the content for
 * the tab
 * @param  {string} options.accItem - Selector representing the tab
 * @param  {number} options.accSpeed - Speed in ms for the closing animation
 */
const closeActiveTab = ($el, { accActive, accContent, accItem, accSpeed }) => {
  $(`.${accActive}`, $el).find(accContent).stop().animate(
    { height: 0 },
    accSpeed,
    function callback() {
      $(this).removeAttr('style');
    },
  );

  $el.find(accItem).removeClass(accActive);
};

/**
 * Opens a tab and provides any DOM manipulation and styles used to show a tab.
 * @private
 * @param {jQuery} $el - Containing the elements for the accordion
 * @param {jQuery} $parent - The parent of the interacted label
 * @param  {Object} options - Any options provided upon initialization
 * @param  {string} options.accActive - Selector representing the active
 * className
 * @param  {string} options.accContent - Selector representing the content for
 * the tab
 * @param  {string} options.accRadio - Selector representing a radio button
 * @param  {number} options.accSpeed - Speed in ms for the closing animation
 * @param  {Function} options.onComplete - Called on when animation has
 * completed
 */
const openTab = ($el, $parent, { accActive, accContent, accRadio, accSpeed, onComplete }) => {
  const content = $parent.find(accContent);
  content.css({ height: AUTO_VALUE });

  const contentHeight = content.outerHeight(true);

  content.css({ height: 0 }).stop().animate(
    { height: contentHeight },
    accSpeed,
    () => {
      content.css({ height: AUTO_VALUE });

      if ($el.attr('data-resize-colorbox') === 'true') {
        $.colorbox.resize();
      }

      onComplete();
    },
  );

  $parent
    .addClass(accActive)
    .children(accRadio).prop(CHECKED_ATTR, true);
};

/**
 * Closes an existing tab that has directly been interacted with.
 * @private
 * @param  {jQuery} $parent - The parent containing the entire tab.
 * @param  {Object} options - Any options provided upon initialization
 * @param  {string} options.accActive - Selector representing the active
 * className
 * @param  {string} options.accContent - Selector representing the content for
 * the tab
 * @param  {number} options.accSpeed - Speed in ms for the closing animation
 */
const closeExistingActiveTab = ($parent, { accActive, accContent, accSpeed }) => {
  $parent.find(accContent).stop().animate(
    { height: 0 },
    accSpeed,
    function callback() {
      $(this).removeAttr('style');
      $parent.removeClass(accActive);
    },
  );
};

/**
 * Handles the click event when a label has been iteracted with.
 * @private
 * @param {jQuery.Event} evt - A jQuery event
 * @param {HTMLElement} currentTarget - The current target interacted with
 * @param {jQuery} $el - Containing the elements for the accordion
 * @param {Object} opts - Options passed along from initialization
 */
const itemClickHandler = ({ currentTarget }, $el, opts) => {
  const { accActive, accItem, accToggle } = opts;
  const $parent = $(currentTarget).closest(accItem);

  if (!$parent.hasClass(accActive)) {
    if (!accToggle) {
      closeActiveTab($el, opts);
    }

    openTab($el, $parent, opts);
  } else {
    closeExistingActiveTab($parent, opts);
  }
};

/**
 * Applies any sort of event handlers for the accordion.
 * @private
 * @param {jQuery} $el - Containing the elements for the accordion
 * @param {Object} options - Options used for wiring up the accordion
 * @see DEFAULTS
 */
const applyEventHandlers = ($el, opts = {}) => {
  const { accLabel } = opts;

  $el
    .find(accLabel)
    .on(CLICK_EVENT, evt => itemClickHandler(evt, $el, opts));
};


/**
 * Initializes an accordion based on provided parameters.
 * @param {HTMLElement} el - An element containing the elements for the
 * accordion
 * @param {Object} options - Options used for wiring up the accordion
 * @see DEFAULTS
 */
export default function accordion(el, options = {}) {
  const $el = $(el);
  const opts = mergeOptions($el, options);

  applyDefaultsToActive($el, opts);
  applyDefaultsToRadio($el, opts);
  applyEventHandlers($el, opts);
}

// Expose the function as a jQuery plugin for ease of use
registerJQueryPlugin(PLUGIN_NAME, accordion);
