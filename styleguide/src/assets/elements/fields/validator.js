/**
 * Responsible for performing form validation via the Constraint Validation API.
 * It provides both custom data attributes as well leverage any fields in a
 * given area (form or any container with elements) that are seen as invalid.
 * @module elements/fields/validator
 */
import $ from 'jquery';
import difference from 'lodash/difference';
import uniq from 'lodash/uniq';
import kebabCase from 'lodash/kebabCase';
import isEmail from 'validator/lib/isEmail';
import formScroller from './form-error-scroller';
import registerJQueryPlugin from '../../lib/register-jquery-plugin';

const PLUGIN_NAME = 'validator';

/**
 * Defines default options for a validator.
 * @type {Object}
 */
const VALIDATOR_OPTIONS = {
  /**
   * Allows for a form to be validated only upon submission.
   */
  validateOnlyOnSubmit: false,
  /**
   * Called when a submission is valid
   * @param {Array} validElements - An array of valid HTML elements
   */
  successCallback: validElements => validElements,
  /**
   * Called when a submission was unsuccessful
   * @param {Array} invalidElements - An array of invalid HTML elements
   */
  errorCallback: invalidElements => invalidElements,
  /**
   * Provides baseline implementation of where/how the page should scroll to
   * when an error has been found.
   * @param {number} x - The x coordinate to scroll to
   * @param {number} y - The y coordinate to scroll to
   */
  scrollTrigger: (x, y) => window.scrollTo(x, y),
  /**
   * Allows for custom scrolling when an error occurs.
   */
  useCustomFormErrorScroll: formScroller,
};

/**
 * Defines all validator related events.
 * @type {Object}
 */
export const EVENTS = {
  INVALID_SCROLL_POSITION: 'validator:invalid-scroll-position',
};

/**
 * Defines the data attribute for triggering an element.
 * @type {string}
 */
export const VALIDATE_TRIGGER = 'data-validate-trigger';


/**
 * Defines a number of custom data attributes used for validating.
 * @private
 * @type {Object}
 */
const validators = {
  /**
   * Ensures that an element is not empty. This is different from a required
   * attribute as the validation occurs on submit by the validator verses
   * natively in the browser.
   *
   * @example
   * <form>
   *   <input type="text" data-validate-not-empty="true" />
   *   <button>Submit</button>
   * </form>
   *
   * @param {jQuery} $el - Elements checked to be not empty
   * @returns {string} Value used for setting custom validity
   */
  validateNotEmpty($el) {
    if (!$el.val()) {
      return $el.attr('placeholder') || $el.attr('name') || 'invalid';
    }

    return '';
  },

  /**
   * Ensure that an element value is not set to the provided value. When it has
   * been set to the value provided, the element will be set as invalid.
   *
   * @example
   * <form>
   *   <input type="text" data-validate-not="walter" />
   *   <button>Submit</button>
   * </form>
   *
   * @param {jQuery} $el - Elements checked to be not empty
   * @param {string} dataVal - Elements checked to be not empty
   * @returns {string} Value used for setting custom validity
   */
  validateNot($el, dataVal) {
    if ($el.val() === dataVal) {
      return dataVal;
    }

    return '';
  },

  /**
   * Ensure that a valid email has been provided. The field must have a handle
   * plus domain plus some kind of tld.
   * @param {jQuery} $el - Elements checked to be a valid email
   * @returns {string} Value used for setting custom validity
   */
  validateEmail($el) {
    const val = $el.val();
    // Make sure we have a value just in case the field is not required. That
    // can be handled by another data-validate-*.
    if (!val) {
      return '';
    }

    if (!isEmail(val)) {
      return $el.attr('placeholder') || 'invalid';
    }

    return '';
  },
};

/**
 * Simple helper that will determine the top position of an element on the page.
 * @private
 * @param {HTMLElement} el - Element under question to find top position
 * @returns {number} The total distance from the top for an element
 */
const getTop = (el) => {
  const bodyTop = document.body.getBoundingClientRect().top;
  const elTop = el.getBoundingClientRect().top;
  return elTop - bodyTop;
};

/**
 * Figures out the highest elements found in the DOM based on an array of HTML
 * elements.
 * @private
 * @param {Array} invalidElements - A list of HTML elements
 * @returns {HTMLElement} Highest HTML element on the page
 */
const findHighestEl = (invalidElements) => {
  const [initial] = invalidElements;
  return invalidElements.reduce((prev, curr) =>
    (getTop(curr) < getTop(prev) ? curr : prev),
    initial,
  );
};

/**
 * Determines where in the form to scroll to when an error has been found, so
 * that the user has some context about what in the form has been filled in
 * incorrectly.
 * @private
 * @param {Array} invalidElements - A list of invalid elements
 * @param {Function} scrollTrigger - Called on to determine where to scroll to.
 */
const setInvalidScrollPosition = (invalidElements, scrollTrigger) => {
  const highestEl = findHighestEl(invalidElements);
  let yAxis = getTop(highestEl);
  const dict = {
    detail: {
      setElement: (el) => {
        yAxis = getTop(el);
      },
      setPosition: (pos) => {
        yAxis = window.scrollY + pos;
      },
      setRawPosition: (pos) => {
        yAxis = pos;
      },
    },
  };

  const evt = new CustomEvent(EVENTS.INVALID_SCROLL_POSITION, dict);
  highestEl.dispatchEvent(evt);
  scrollTrigger(0, yAxis);
};

/**
 * Validates for form field based on whether it contains a custom data
 * attribute as specified by any validators. It's purpose is to set the proper
 * validity if the field's requirements haven't been met. It will return true
 * if the element was found invalid.
 * @private
 * @see validators
 * @param {HTMLSelectElement|HTMLInputElement} el - Form element
 * @returns {boolean|undefined} Determines if element is invalid
 */
const validateField = (el) => {
  const $el = $(el);

  if ($el.is(':hidden')) {
    return false;
  }

  const dataAttrs = $el.data();
  const validatorList = Object.keys(validators);

  for (let i = 0, len = validatorList.length; i < len; i += 1) {
    const name = validatorList[i];
    const dataVal = dataAttrs[name];

    if (!!dataVal && !!validators[name]) {
      const message = validators[name]($el, dataVal, dataAttrs);
      if (message) {
        el.setCustomValidity(message);
        return true;
      }

      el.setCustomValidity('');
    }
  }

  return false;
};

/**
 * Responsible for cleaning up and ensuring that all invalid elements are
 * actually invalid and normalized.
 * @private
 * @param {Array} elements - Contains an array of possible invalid elements
 * @returns {Array} Normalized invalidates
 */
const removeExistingInvalidates = (elements) => {
  const elementsToRemove = elements.filter(element => element.checkValidity());
  const diff = difference(elements, elementsToRemove);
  return uniq(diff);
};

/**
 * Helper that determines all the elements that contain data validator
 * attributes and applies a function to interact with each element.
 * @private
 * @param {jQuery} $wrapper - Container for the form elements
 * @param {Function} fn - Called and passed along a form element
 */
const forEachFormField = ($wrapper, fn) => {
  const dataSelector = Object
    .keys(validators)
    .map(name => `[data-${kebabCase(name)}]`)
    .join(',');

  $wrapper.find(dataSelector).each(function iterateElement() {
    fn(this);
  });
};

/**
 * Performs the submit handler used for verifying the fields within an element.
 * @private
 * @param {Event} evt - DOM event
 * @param {jQuery} $wrapper - The element containing form elements
 * @param {Function} successCallback - Fired off if submission was successful
 * @param {Function} errorCallback - Fired off if submissions was unsuccessful
 * @param {Function} useCustomFormErrorScroll - Called on when an error has
 * been found
 * @param {Function} scrollTrigger - Called on to go a position on the page
 */
const submitHandler = (
    evt,
    $wrapper,
    successCallback,
    errorCallback,
    useCustomFormErrorScroll,
    scrollTrigger,
) => {
  let invalidElements = $wrapper.find(':invalid').not(':hidden').toArray();
  let validElements = [];

  forEachFormField($wrapper, (formField) => {
    const isInvalid = validateField(formField);
    if (isInvalid) {
      invalidElements = [...invalidElements, formField];
    } else {
      validElements = [...validElements, formField];
    }
  });

  invalidElements = removeExistingInvalidates(invalidElements);

  if (invalidElements.length > 0) {
    evt.preventDefault();
    errorCallback(invalidElements);
    if (!useCustomFormErrorScroll($wrapper, scrollTrigger)) {
      setInvalidScrollPosition(invalidElements, scrollTrigger);
    }
  } else {
    successCallback(validElements);
  }
};

/**
 * Determines the type of event used for refreshing. In other words, when a
 * field should be checked for validity.
 * @private
 * @param {HTMLInputElement|HTMLSelectElement} el - An element
 * @returns {string} The type of event used for determining a refresh of a field
 */
const resolveRefreshEventType = (el) => {
  switch (el.tagName.toLowerCase()) {
    case 'select':
      return 'change';
    default:
      return 'blur';
  }
};

/**
 * Based on the type of element, will apply an event listener whenever a value
 * has been finalized on the form element.
 * @private
 * @param {jQuery} $el - The form or container for form fields
 */
const listenForFieldChange = ($el) => {
  forEachFormField($el, (formField) => {
    const evtName = resolveRefreshEventType(formField);
    const callback = () => validateField(formField);
    formField.addEventListener(evtName, callback);
  });
};

/**
 * Validates fields within an element, most likely a form based on what is
 * passed in. The validation of fields is done by a couple of ways:
 *
 * 1. By using browser defaults around validity. For example, if a form element
 * is using a required attribute, has a type that uses built in validation, has
 * a patter attribute, or is controlling validity programmatically by
 * JavaScript.
 * 2. By leveraging data attributes that are coming from within. Think of these
 * attributes as additional configuration that extends the capabilities of
 * validation that isn't supported by the browser.
 * 3. A combination of two.
 *
 * Whether either of these conditions are met, they are finally triggered by
 * either a form submission or a click event applied to an element that
 * contains a data-validate-trigger attribute. This would allow for form
 * submissions to be applied to an element other than a input[type="submit"] or
 * button, in case it's needed. When any form elements are found invalid, a
 * pseudo class of invalid is set and can be styled by CSS.
 *
 * The goal of this work is to leverage as much from within the browser and
 * remove the need for as much custom work as possible.
 * @see validators
 * @see VALIDATOR_OPTIONS
 * @param {HTMLElement} el - An element containing fields used for validating
 * @param {Object} [options={}] - Options used for overriding
 */
export default function validator(el, options = {}) {
  const $el = $(el);
  const $triggers = $el.find(`[${VALIDATE_TRIGGER}]`);
  const {
    validateOnlyOnSubmit,
    successCallback,
    errorCallback,
    scrollTrigger,
    useCustomFormErrorScroll,
  } = Object.assign({}, VALIDATOR_OPTIONS, options, $el.data());

  if ($triggers.length) {
    $triggers.on('click', evt => submitHandler(
      evt,
      $el,
      successCallback,
      errorCallback,
      useCustomFormErrorScroll,
      scrollTrigger,
    ));
  }

  $el.on('submit', evt => submitHandler(
    evt,
    $el,
    successCallback,
    errorCallback,
    useCustomFormErrorScroll,
    scrollTrigger,
  ));

  if (!validateOnlyOnSubmit) {
    listenForFieldChange($el);
  }
}

registerJQueryPlugin(PLUGIN_NAME, validator);
