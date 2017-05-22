/**
 * Responsible for rendering an error within a floating label.
 * @module elements/fields/floatingError
 */

import $ from 'jquery';
import { EVENTS, TYPES } from './floating-label';
import { EVENTS as VALIDATOR_EVENTS } from './validator';

const { LOAD, BLUR, FOCUS, INVALID } = EVENTS;
export { LOAD, BLUR, FOCUS, INVALID };

const { CONTAINER, FIELD } = TYPES;
export { CONTAINER };

const { INVALID_SCROLL_POSITION } = VALIDATOR_EVENTS;
export { INVALID_SCROLL_POSITION };

const FLOATING_ERROR_OPTIONS = {
  floatingErrorContainerClassName: 'floating-label--floating-error',
  floatingErrorElement: 'p',
  floatingErrorClassName: '',
};

const KEY = Symbol('error-el');

/**
 * Creates an error element to later on be appended to the DOM.
 * @private
 * @param {string} errorElement - Name of error element to create the element
 * @param {string} className - Optional class name applied when error is present
 * @param {string} message - Message used when an error has occurred
 * @returns {Element} An element containing the floating error
 */
const createErrorEl = (errorElement, className, message) => {
  const el = document.createElement(errorElement);
  el.classList.add('floating-error');

  if (className) {
    el.classList.add(className);
  }

  el.textContent = message;
  return el;
};

/**
 * Renders an error element into the DOM.
 * @private
 * @param {HTMLElement} container - The floating label element
 * @param {string} errorElement - Name of error element to create the element
 * @param {string} className - Optional class name applied when error is present
 * @param {string} message - Message used when an error has occurred
 * @returns {HTMLElement} - The error element
 */
const renderErrorEl = (container, errorElement, className, message) => {
  const errorEl = createErrorEl(errorElement, className, message);
  container.parentNode.insertBefore(errorEl, container);
  return errorEl;
};

/**
 * Responsible for removing an error element if it exists.
 * @private
 * @param {HTMLElement} container - The floating label element
 * @param {HTMLElement} errorElement - Element containing the error
 * @param {Map} state - Contains state info around error
 * @param {string} className - className interacting with container
 */
const removeErrorEl = (container, errorElement, state, className) => {
  if (errorElement) {
    container.classList.remove(className);
    errorElement.parentNode.removeChild(errorElement);
    state.delete(KEY);
  }
};

/**
 * Sets up a listener for when an invalid formField has been found so it can
 * set the position of where to scroll to in the DOM.
 * @private
 * @param {HTMLElement} formField - The form field element
 * @param {Map} state - Contains state related data around the field
 */
const listenForInvalid = (formField, state) => {
  formField.addEventListener(INVALID_SCROLL_POSITION, ({ detail: { setElement } }) => {
    setElement(state.get(KEY));
  });
};

/**
 * Responds to any errors that occur on a floating label by providing a message
 * above the floating label.
 * @private
 * @param {string} type - Type of event
 * @param {HTMLElement} target - Element receiving the event
 * @param {HTMLElement} container - The floating label element
 * @param {Map} state - Acts as a state container
 * @param {boolean} validateOnlyOnSubmit - Instructs to only validate on submit
 * @param {string} containerClassName - Class name provided to floating label
 * if an error occurred
 * @param {string} errorElement - Name of error element to create the element
 * @param {string} className - Optional class name applied when error is present
 * @param {string} message - Message used when an error has occurred
 */
const respond = (type, target, container, state, validateOnlyOnSubmit, {
  floatingErrorContainerClassName: containerClassName,
  floatingErrorElement: errorElement,
  floatingErrorClassName: className,
  floatingErrorMessage: message,
}) => {
  const errorEl = state.get(KEY);

  switch (type) {
    case LOAD:
    case BLUR:
      if (!validateOnlyOnSubmit && container.querySelector(':invalid') === target) {
        container.classList.add(containerClassName);
        state.set(KEY, renderErrorEl(container, errorElement, className, message));
      }
      break;

    case FOCUS:
      removeErrorEl(container, errorEl, state, containerClassName);
      break;

    case INVALID:
      removeErrorEl(container, errorEl, state, containerClassName);
      container.classList.add(containerClassName);
      state.set(KEY, renderErrorEl(container, errorElement, className, message));
      break;
    default:
      break;
  }
};

/**
 * Responsible for rendering an error message when an error occurs on a floating
 * label. To avoid any weirdness with CSS positioning, the error message appears
 * outside of the floating label and is referred to as a floating error.
 *
 * In order to activate this functionality, the floating label must contain the
 * following data attribute:
 *
 * - data-floating-error-message
 *
 * Other options include:
 *
 * - `data-floating-error-element`: The name of the element used for the floating
 *   error. Defaults to a `p` (for paragraph).
 * - `data-floating-error-class-name`: An additional className added to the
 *   floating error message element. Defaults to `''`.
 * - `data-floating-container-class-name`: A className applied to the floating
 *   label container when the floating error is shown. Defaults to
 *   `floating-label--floating-error`.
 *
 * @example
 * <div class="floating-label" data-floating-error-message="Hey dummy!">
 *  <label for="dude" class="floating-label__label">Something</label>
 *  <input
 *    required
 *    id="dude"
 *    type="text"
 *    class="floating-label__input"
 *    placeholder="Enter something">
 * </div>
 * @see FLOATING_ERROR_OPTIONS
 * @param {Object} options - Configurable options
 * @returns {Function} Used to setup and respond to events from floating label
 */
const floatingError = (options = {}) => (...nodes) => {
  const [{ node: container }] = nodes.filter(({ type }) => type === CONTAINER);
  const [{ node: formField }] = nodes.filter(({ type }) => type === FIELD);
  const opts = Object.assign({}, FLOATING_ERROR_OPTIONS, options, $(container).data());
  const { floatingErrorMessage: message } = opts;

  if (message) {
    const state = new Map();

    listenForInvalid(formField, state);
    return (type, { target }, { validateOnlyOnSubmit }) =>
      respond(type, target, container, state, validateOnlyOnSubmit, opts);
  }

  return () => {};
};

export default floatingError;
