/**
 * Responsible for the interacting with the rating scale which allows a user to
 * select a rating for a given product
 * @module modules/rating-scale/ratingScale
 */
import $ from 'jquery';
import findIndex from 'lodash/findIndex';
import registerJQueryPlugin from '../../lib/register-jquery-plugin';

/**
 * Defines the defaults around the rating scale.
 * @type {Object}
 */
export const RATING_SCALE_OPTIONS = {
  titleSelector: 'h2',
  block: 'rating-scale-field',
  inputElement: 'input',
  labelElement: 'label',
  filledModifier: 'filled',
};

/**
 * Will apply class names to the block, input, and label based on the
 * operation, i.e. add/remove.
 * @private
 * @param {HTMLElement} el - Contains the star ratings
 * @param {String} op - The operation applied to the class name
 * @param {String} block - Block name containing the rating
 * @param {String} inputElement - Input element name with the rating value
 * @param {String} labelElement - Label element name with the rating content
 * @param {String} filledModifier - The filled modifier name
 */
const updateField = (el, op, block, inputElement, labelElement, filledModifier) => {
  el.classList[op](`${block}--${filledModifier}`);

  const inputBlockElement = `${block}__${inputElement}`;
  el
    .querySelector(`.${inputBlockElement}`)
    .classList[op](`${inputBlockElement}--${filledModifier}`);

  const labelBlockElement = `${block}__${labelElement}`;
  el
    .querySelector(`.${labelBlockElement}`)
    .classList[op](`${labelBlockElement}--${filledModifier}`);
};

/**
 * Removes filled CSS class names.
 * @private
 * @param {HTMLElement} el - Contains the star ratings
 * @param {String} block - Block name containing the rating
 * @param {String} inputElement - Input element name with the rating value
 * @param {String} labelElement - Label element name with the rating content
 * @param {String} filledModifier - The filled modifier name
 */
const removeFilledClassNames = (el, block, inputElement, labelElement, filledModifier) =>
  updateField(el, 'remove', block, inputElement, labelElement, filledModifier);

/**
 * Adds filled CSS class names.
 * @private
 * @param {HTMLElement} el - Contains the star ratings
 * @param {String} block - Block name containing the rating
 * @param {String} inputElement - Input element name with the rating value
 * @param {String} labelElement - Label element name with the rating content
 * @param {String} filledModifier - The filled modifier name
 */
const addFilledClassNames = (el, block, inputElement, labelElement, filledModifier) =>
  updateField(el, 'add', block, inputElement, labelElement, filledModifier);

/**
 * Will apply the filled modifier to any elements considered to be filled.
 * @private
 * @param {HTMLElement} wrap - Contains the star ratings
 * @param {HTMLElement} target - The block interacted with
 * @param {String} block - Block name containing the rating
 * @param {String} inputElement - Input element name with the rating value
 * @param {String} labelElement - Label element name with the rating content
 * @param {String} filledModifier - The filled modifier name
 */
const applyFilledState = (wrap, target, block, inputElement, labelElement, filledModifier) => {
  const sections = Array.from(wrap.querySelectorAll(`.${block}`));
  const selectedIndex = findIndex(sections, blockEl => blockEl === target);

  sections.some((field, index) => {
    if (index > selectedIndex) {
      return true;
    }

    addFilledClassNames(field, block, inputElement, labelElement, filledModifier);
    return false;
  });
};

/**
 * Updates the title based on the element interacted with.
 * @private
 * @param {Event} e - Event object
 * @param {HTMLElement} titleEl - The title element
 */
const updateTitle = (e, titleEl) => {
  /* eslint-disable no-param-reassign */
  const { ratingText } = e.currentTarget.dataset;

  if (ratingText) {
    titleEl.textContent = ratingText;
  }
  /* eslint-enable no-param-reassign */
};

/**
 * Removes all filled modifiers.
 * @private
 * @param {HTMLElement} el - Contains the star ratings
 * @param {String} block - Block name containing the rating
 * @param {String} inputElement - Input element name with the rating value
 * @param {String} labelElement - Label element name with the rating content
 * @param {String} filledModifier - The filled modifier name
 */
const resetFilled = (el, block, inputElement, labelElement, filledModifier) => {
  Array.from(el.querySelectorAll(`.${block}`)).forEach((field) => {
    removeFilledClassNames(field, block, inputElement, labelElement, filledModifier);
  });
};

/**
 * Responsible for the basic interactivity around the fit rating scale. It
 * expects a set of radio inputs that represents the rating from the form. It
 * assumes the following DOM structure with defaults provided:
 *
 * @example
 * <fieldset>
 *   <legend>Some Title</legend>
 *   <div class="rating-scale-field" data-rating-text="So Lame">
 *     <input type="radio" name="rating-scale" value="1" id="1-star"
 *     class="rating-scale-field__input">
 *     <label for="1-star" class="rating-scale-field__label icon">1 Star</label>
 *   </div>
 *   <div class="rating-scale-field" data-rating-text="Sorta Stoked">
 *     <input type="radio" name="rating-scale" value="2" id="2-star"
 *     class="rating-scale-field__input">
 *     <label for="2-star" class="rating-scale-field__label icon">2 Star</label>
 *   </div>
 *   <div class="rating-scale-field" data-rating-text="Totally Stoked">
 *     <input type="radio" name="rating-scale" value="3" id="3-star"
 *     class="rating-scale-field__input">
 *     <label for="3-star" class="rating-scale-field__label icon">3 Star</label>
 *   </div>
 *   <div class="rating-scale-field" data-rating-text="Mind Blown">
 *     <input type="radio" name="rating-scale" value="4" id="4-star"
 *     class="rating-scale-field__input">
 *     <label for="4-star" class="rating-scale-field__label icon">4 Star</label>
 *   </div>
 * </fieldset>
 *
 * Whenever a star rating has been interacted with, it'll do the following:
 *
 * - Apply filled class names to all .rating-scale-field that appear before the
 *   selected choice
 * - Will update the title of the section based on the data-rating-text
 *   attribute
 * - Will naturally select the input as the value
 *
 * @see RATING_SCALE_OPTIONS
 * @param {HTMLElement} wrap - Contains the star ratings
 * @param {Object} options - Configurable options
 */
export default function ratingScale(wrap, options = {}) {
  const {
    block,
    inputElement,
    labelElement,
    filledModifier,
    titleSelector,
  } = Object.assign({}, RATING_SCALE_OPTIONS, options);
  const titleEl = wrap.querySelector(titleSelector);

  $(wrap).on('click', `.${block}`, (e) => {
    const input = e.currentTarget.querySelector(`.${block}__${inputElement}`);
    if (input !== e.target) {
      return;
    }

    resetFilled(wrap, block, inputElement, labelElement, filledModifier);

    updateTitle(e, titleEl);

    applyFilledState(wrap, e.currentTarget, block, inputElement, labelElement, filledModifier);
  });
}

registerJQueryPlugin('ratingScale', ratingScale);
