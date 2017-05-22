/**
 * Responsible for displaying available characters in a textarea and limiting
 * the amount that can be submitted.
 * @module elements/fields/characterCounter
 */

import $ from 'jquery';
import registerJQueryPlugin from '../../lib/register-jquery-plugin';

/**
 * Defines the default options for the a character counter
 * @type {Object}
 */
export const CHARACTER_COUNTER_OPTIONS = {
  fieldSelector: 'textarea',
  insertPosition: 'afterbegin',
};

/**
 * Defines the block name for the element injected into the DOM.
 * @type {string}
 */
export const BLOCK = 'character-counter';

/**
 * Defines the count element injected into the DOM.
 * @type {string}
 */
export const COUNT_ELEMENT = 'count';

/**
 * Defines the name of the block and count element.
 * @type {string}
 */
export const COUNT_BLOCK_ELEMENT = `${BLOCK}__${COUNT_ELEMENT}`;

/**
 * Defines the count block element selector
 * @type {string}
 */
export const COUNT_SELECTOR = `.${COUNT_BLOCK_ELEMENT}`;

/**
 * Binds the input event used to update the count.
 * @private
 * @param  {HTMLElement} el - Contains the count field
 * @param  {HTMLInputElement|HTMLTextAreaElement} field - The form field
 */
const bindInputEvent = (el, field) => {
  const countEl = el.querySelector(COUNT_SELECTOR);
  field.addEventListener('input', ({ target: { value: { length } } }) => {
    countEl.innerText = length;
  });
};

/**
 * Creates the character counter markup used to keep track of character
 * counting.
 * @private
 * @param  {string} count - The amount of characters in the field
 * @param  {string} maxLength - The maximum length for the field
 * @param  {string} [className=''] - Additional className
 * @return {string} Fully formed HTML
 */
const createCharacterCounterComponent = ({ count, maxLength, className = '' }) => `
  <span class="${BLOCK} ${className}">
    <span class="${COUNT_BLOCK_ELEMENT}">${count}</span>
    / ${maxLength}
  </span>
`;

/**
 * Responsible for providing feedback to the user with the amount of characters
 * entered alongside the amount allowed. This is achieved by the following:
 *
 * - Read in the maxlength attribute (if not provided, throws an error since
 *   without it we don't know what to do)
 * - create some HTML that illustrates how many characters are in a given area,
 *   along with the maximum amount of characters
 *
 * From the DOM side, this can take in optional parameters in the form of
 * data attributes:
 *
 * - data-character-counter-add-class-name: allows for a custom class name to
 *   be added to the feedback mechanism created within.
 * - data-character-insert-position: the insert position based the element
 *   passed in using the position values found on insertAdjacentHTML. If this
 *   doesn't exist, it'll use the one provided on wiring, and then fallback to
 *   afterbegin.
 *
 * This happens when the field (an input or textarea) first loads as well as
 * when the user starts entering in characters. Here's an example of markup
 * using all options:
 *
 * @example
 * <div class="things"
 *      data-character-counter-add-class-name="yo-dawg"
 *      data-character-counter-insert-position="beforebegin">
 *   <textarea maxlength="100"></textarea>
 * </div>
 *
 * which will yield:
 *
 * @example
 * <div class="things"
 *      data-character-counter-add-class-name="yo-dawg"
 *      data-character-counter-insert-position="beforebegin">
 *   <span class="character-counter yo-dawg">
 *     <span class="character-counter__count">0</span> / 200
 *   </span>
 *   <textarea maxlength="100"></textarea>
 * </div>
 *
 * @param {HTMLElement} el - Contains the form field
 * @param {Object} options - Configurable options
 */
export default function characterCounter(el, options = {}) {
  // The jQuery lookup is for PhantomJS because it's lame and doesn't know how
  // to read from el.dataset because it sucks at life. There, I said it.
  const {
    fieldSelector,
    insertPosition,
    characterCounterAddClassName: className = '',
    characterCounterInsertPosition: dataAttrInsertPosition,
  } = Object.assign({}, CHARACTER_COUNTER_OPTIONS, options, $(el).data());
  const field = el.querySelector(fieldSelector);
  const maxLength = field.maxLength;

  if (maxLength < 0) {
    throw new Error(`Character counter requires a max length on ${fieldSelector}`);
  }

  el.insertAdjacentHTML(dataAttrInsertPosition || insertPosition, createCharacterCounterComponent({
    className,
    count: field.value.length,
    maxLength,
  }));

  bindInputEvent(el, field);
}

registerJQueryPlugin('characterCounter', characterCounter);
