/**
 * Responsible for applying validation upon a radio group so that it can hook
 * into Constraint Validation API.
 * @module radioGroupValidator
 */
import find from 'lodash/find';
import registerJQueryPlugin from '../../lib/register-jquery-plugin';
import { EVENTS } from './validator';

const INPUT_GROUP_OPTIONS = {
  errorClassName: '',
  inputSelector: 'input',
  errorPosition: 'afterbegin',
};

/**
 * CSS class name used for embedding an error.
 * @type {string}
 */
export const EMBEDDED_ERROR_CLASS_NAME = 'embedded-error';

/**
 * Responsible for taking any registered event listeners and releasing them
 * from memory.
 * @private
 * @param {HTMLInputElement} input - A radio input
 * @param {Array<Object>} listeners - event listeners to be removed
 */
const removeInputListeners = (input, listeners) => {
  listeners.forEach(({ evt, handler }) => {
    input.removeEventListener(evt, handler);
  });
};

/**
 * Responsible for removing the error message.
 * @private
 * @param {HTMLElement} wrap - Container element
 */
const removeError = (wrap) => {
  const errorEl = wrap.querySelector(`.${EMBEDDED_ERROR_CLASS_NAME}`);
  errorEl.parentNode.removeChild(errorEl);
};

/**
 * Responsible for building the element for the error.
 * @private
 * @param {string} errorClassName - CSS class name for the error
 * @param {string} errorMessage - The error message
 */
const renderError = ({ errorClassName, errorMessage }) =>
  `<p class="${errorClassName} ${EMBEDDED_ERROR_CLASS_NAME}">${errorMessage}</p>`;

/**
 * Responsible for figuring out where the error message should be rendered in
 * the DOM.
 * @private
 * @param {Object} dataset - dataset of an HTML
 * @returns {Object} The position and selector used for inserting the error
 */
const determineInsertSelector = (dataset) => {
  const {
    radioGroupInsertErrorBefore: insertBeforeSelector,
    radioGroupInsertErrorAfter: insertAfterSelector,
  } = dataset;

  const selectors = [
    {
      position: 'beforebegin',
      insertSelector: insertBeforeSelector,
    },
    {
      position: 'afterend',
      insertSelector: insertAfterSelector,
    },
  ];

  return find(selectors, ({ position, insertSelector }) => {
    if (insertSelector) {
      return { position, insertSelector };
    }

    return false;
  }) || {};
};

/**
 * Responsible for seeing if any radio inputs are invalid and if so, to allow
 * for error messaging to be displayed. Once a change event has occurred, the
 * error goes away and will allow for any additional validation to be picked up
 * and allow the cycle to repeat itself.
 *
 * The error message and where it's located is configurable based on data
 * attributes on the element passed in. By default, if no position has been
 * provided, it'll write the error message as the first child of the wrap.
 * Here are the supported position values:
 *
 * - data-radio-group-insert-error-before
 * - data-radio-group-insert-error-after
 *
 * Where the value is a selector within the element passed in. Here's an
 * example:
 *
 * @example
 * <div data-radio-group-error-message="Yeah,well, that's just, like, your opinion, man"
 *      data-radio-group-insert-error-before=".title">
 *   <h2 class="title">I am a title or something</h2>
 *   <input type="radio" name="characters" value="dude" required>
 *   <input type="radio" name="characters" value="walter" required>
 *   <input type="radio" name="characters" value="donny" required>
 *   <button type="submit">Submit</button>
 * </div>
 *
 * @see INPUT_GROUP_OPTIONS
 * @param {HTMLElement} wrap - Element containing the inputs
 * @param {Object} options - Configurable options
 */
export default function radioGroupValidator(wrap, options = {}) {
  const {
    inputSelector,
    errorClassName,
    errorPosition,
  } = Object.assign({}, INPUT_GROUP_OPTIONS, options);
  const { dataset } = wrap;
  const { radioGroupErrorMessage: errorMessage } = dataset;
  const { position = errorPosition, insertSelector } = determineInsertSelector(dataset);
  const insertionEl = insertSelector ? wrap.querySelector(insertSelector) : wrap;
  const { INVALID_SCROLL_POSITION } = EVENTS;

  let errorShown = false;
  let listeners = [];

  Array.from(wrap.querySelectorAll(inputSelector)).forEach((input) => {
    let invalidHandler;
    let changeHandler;
    let positionHandler;

    input.addEventListener('invalid', invalidHandler = () => {
      if (!errorShown) {
        errorShown = true;
        insertionEl.insertAdjacentHTML(position, renderError({ errorClassName, errorMessage }));
      }
    });

    input.addEventListener(
      INVALID_SCROLL_POSITION,
      positionHandler = ({ detail: { setElement } }) => {
        setElement(wrap);
      },
    );

    input.addEventListener('change', changeHandler = () => {
      if (errorShown) {
        errorShown = false;
        removeError(wrap);
        removeInputListeners(input, listeners);
      }
    });

    listeners = [...listeners,
      { evt: 'invalid', handler: invalidHandler },
      { evt: 'change', handler: changeHandler },
      { evt: INVALID_SCROLL_POSITION, handler: positionHandler },
    ];
  });
}

registerJQueryPlugin('radioGroupValidator', radioGroupValidator);
