/**
 * Responsible for toggling a hidden form field.
 * @module elements/fields/toggleHidden
 */

/**
 * Provides default configuration
 * @type {Object}
 */
export const DEFAULT_OPTIONS = {
  fieldClassName: 'field',
  hiddenModifier: 'hidden',
};

/**
 * Toggle whether Field is Hidden
 * Also toggles disabled property of contained form elements,
 * so hidden fields are not validated by the browser
 * @param {jQueryElement} $field - Form wrapper
 * @param {boolean} shouldHide - Whether the email field should be hidden
 * @param {object} options - List of options
 * @return {jQueryElement} Field wrapper
 */
export default function toggleHidden($field, shouldHide, options = {}) {
  const { fieldClassName, hiddenModifier } = Object.assign({}, DEFAULT_OPTIONS, options);

  // set inputs to :disabled to avoid native browser form validation
  $field.find('input, select').prop('disabled', shouldHide);
  $field.toggleClass(`${fieldClassName}--${hiddenModifier}`, shouldHide);

  return $field;
}
