/**
 * Responsible for truncating text with the intention that the full text can be
 * expanded when interacted by the user
 * @module modules/truncate
 */
import $ from 'jquery';
import registerJQueryPlugin from '../lib/register-jquery-plugin';

// Expose the function as a jQuery plugin for ease of use
export const PLUGIN_NAME = 'truncate';

/**
 * Defines the class name responsible for truncating
 * @type {string}
 */
export const TRUNCATE_CLASS = 'u-truncate';

/**
 * Defines the modifier name responsible showing truncated text
 * @type {string}
 */
export const SHOW_MODIFIER = 'show';

/**
 * Defines the data attribute for the button's toggle text
 * @type {string}
 */
export const BTN_TOGGLE_ATTR = 'toggle';

/**
 * Defines the default options for truncating
 * @namespace
 * @param {string} truncateShowMore - default text for "show more" toggle button
 * @param {string} truncateShowLess - default text for "show less" toggle button
 */
const DEFAULT_OPTIONS = {
  truncateShowMore: 'more',
  truncateShowLess: 'less',
};

/**
 * Adds "more|less" button when content is long enough to truncate
 *
 * HTML example, including required and optional data attributes
 * <p data-truncate="true"
 *    data-truncate-show-more="{{#more}}{{.}}{{else}}more{{/more}}"
 *    data-truncate-show-less="{{#less}}{{.}}{{else}}less{{/less}}"
 *    data-truncate-lines="4">
 *   I've moved on, I've moved on. And I'm in the dating pool, so...
 *   But it's funny, you know, I love having clothes made for me but, I don't know, ladies, you
 *   have this situation, but no matter what you're buying, in a store you always hear "wear it
 *   with jeans." I don't care what I'm buying -- "Oh, wear it with jeans." One time, this lady
 *   said to me, "You know, if you're going to a rock concert..." I go, "A rock concert?!"
 *   That's hilarious to me. Me at a rock concert. Ok. Wear it with jeans. Jeans. Pay attention
 *   from now on.
 * </p>
 *
 * @param {HTMLElement} el - The element whose content we're truncating
 * @see DEFAULT_OPTIONS
 */
export default function truncate(el, options = {}) {
  const $el = $(el);
  const {
    truncateShowMore,
    truncateShowLess,
    truncateLines,
  } = Object.assign({}, DEFAULT_OPTIONS, options, el.dataset);

  // get initial height
  const initialHeight = $el.height();

  // truncate, adding helper & optional modifier
  $el.addClass(TRUNCATE_CLASS);
  if (truncateLines) {
    $el.addClass(`${TRUNCATE_CLASS}--${truncateLines}`);
  }

  // get new height
  const newHeight = $el.height();

  // when truncating changed height, add toggle button
  if (initialHeight > newHeight) {
    // create toggle button
    const $toggleBtn = $(`
      <button class="truncate-toggle-button link link--bold u-margin--center" data-${BTN_TOGGLE_ATTR}="${truncateShowLess}">
        ${truncateShowMore}
      </button>
    `);

    // attach click event to toggle button
    $toggleBtn.on('click', () => {
      // show/hide truncated content
      $el.toggleClass(`${TRUNCATE_CLASS}--${SHOW_MODIFIER}`);

      // toggle button text
      const text = $toggleBtn.text();

      $toggleBtn
        .text($toggleBtn.data(BTN_TOGGLE_ATTR))
        .data(BTN_TOGGLE_ATTR, text);
    });

    // append toggle button
    $el.after($toggleBtn);
  }
}

registerJQueryPlugin(PLUGIN_NAME, truncate);
