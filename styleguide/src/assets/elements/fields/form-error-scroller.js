/**
 * Responsible for scrolling to a specific position when a form error submission
 * has occurred on a form validator.
 * @module elements/fields/formErrorScroller
 */
import isUndefined from 'lodash/isUndefined';
import $ from 'jquery';

export const ERROR_SECTION_CLASS_NAME = 'validator-error-section';

/**
 * Determines the scroll position based on the passed in configuration.
 * @private
 * @param {number} scrollPosition - Where in the page to scroll to.
 * @param {string} scrollSelector - A selector within the wrapper.
 * @returns {number|undefined} Where to scroll to when an error occurs.
 */
const resolveFormScrollPosition = (scrollPosition, scrollSelector) => {
  const $scroll = $(scrollSelector);

  if ($scroll.length) {
    return $scroll.scrollTop();
  }

  return scrollPosition;
};

/**
 * Determines the insertion position of where the error message should be
 * located within the wrapper.
 * @private
 * @param {jQuery} $wrapper - The wrapper containing the form fields
 * @param {string} insertErrorBefore - The selector used for inserting before an
 * element
 * @param {string} insertErrorAfter - The selector used for inserting after an
 * element
 * @returns {Object} The position and jQuery object where to insert the error
 */
const resolveFormErrorInsertPosition = ($wrapper, insertErrorBefore, insertErrorAfter) => {
  const errorInsertPositions = [
    {
      position: 'before',
      selector: insertErrorBefore,
    },
    {
      position: 'after',
      selector: insertErrorAfter,
    },
  ];

  const [obj = {}] = errorInsertPositions
    .map(({ position, selector }) => ({
      position,
      $el: $wrapper.find(selector),
    }))
    .filter(({ $el }) => $el.length);

  return obj;
};

/**
 * Renders an error section.
 * @private
 * @param {string} errorMessage - The error message
 * @returns {string} Rendered error section.
 */
const renderErrorSection = ({ errorMessage }) => `
  <div class="form-section ${ERROR_SECTION_CLASS_NAME}">
    <p class="form-section__error embedded-error">${errorMessage}</p>
  </div>
`;

/**
 * Handles scrolling to a specific position based on what has been provided
 * by the caller. This happens on a form level and provides the flexibility of
 * where the error should be rendered, where the page should scroll to, and the
 * message to use. If any one of these properties is missing, it will not be
 * used. Here are the available options:
 *
 * - data-validate-error-message: the error message
 * - data-validate-scroll-to-position: y-axis to scroll to
 * - data-validate-scroll-to-selector: the top part of the selector to scroll to
 * - data-validate-insert-error-before: a selector within the form where the
 *   error should be injected to before
 * - data-validate-insert-error-after: a selector within the form where the
 *   error should be injected to after
 *
 * scroll-to-position supersedes scroll-to-selector and insert-error-before will
 * supersede insert-error-after.
 *
 * Here's some example markup used for configuration purposes:
 *
 * @example
 * <form
 *   data-validate-error-message="some message"
 *   data-validate-scroll-to-position="0"
 *   data-validate-error-before=".title">
 *   <h1 class="title">I am a title</h1>
 *   <input type="text" name="name">
 *   <input type="submit" value="Submit">
 * </form>
 * @param {jQuery} $wrapper - The wrapper containing the elements
 * @param {Function} scrollTrigger - Function used for scrolling to x/y
 * coordinates.
 * @param {Object} options - Configurable options
 * @returns {boolean} Whether a scroll error has been captured.
 */
const formErrorScroller = ($wrapper, scrollTrigger, options = {}) => {
  const {
    validateErrorMessage: errorMessage,
    validateScrollToPosition: scrollPosition,
    validateScrollToSelector: scrollSelector,
    validateInsertErrorBefore: insertErrorBefore,
    validateInsertErrorAfter: insertErrorAfter,
  } = Object.assign({}, options, $wrapper.data());
  // Nuke any existing sections to remove duplicate error messages.
  $wrapper.find(`.${ERROR_SECTION_CLASS_NAME}`).remove();

  const position = resolveFormScrollPosition(scrollPosition, scrollSelector);
  const {
    position: insertPosition,
    $el: $error,
  } = resolveFormErrorInsertPosition($wrapper, insertErrorBefore, insertErrorAfter);

  // If at least one criteria is not met, don't render the message since all
  // are required for this purpose, but no crazy failures occur if this isn't
  // call on, i.e. it's an enhancement, not core functionality.
  if (!isUndefined(position) && $error && errorMessage) {
    // Since this is within our control, dynamically call on jQuery method for
    // insertion.
    $error[insertPosition](renderErrorSection({ errorMessage }));
    scrollTrigger(0, position);
    return true;
  }

  return false;
};

export default formErrorScroller;
