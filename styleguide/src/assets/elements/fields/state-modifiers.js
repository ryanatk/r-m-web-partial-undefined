/**
 * Responsible for applying classes in the form of modifiers to a floating
 * label based on the current state, i.e. filled, invalid, selected, and so on.
 * @module elements/fields/stateModifiers
 */
import { EVENTS, TYPES } from './floating-label';

export { EVENTS, TYPES };

/**
 * Defines default options for state modifiers
 * @type {Object}
 */
const DEFAULT_STATE_MODIFIERS = {
  filledModifier: 'filled',
  invalidModifier: 'invalid',
  selectedModifier: 'selected',
  suppressErrorModifier: 'suppress-error',
};

/**
 * Adds modifier CSS class names to any of the elements.
 * @private
 * @param {Array} nodes - An array of objects containing a name and element
 * @param {...string} modifiers - Modifier names
 */
const addClassNames = (nodes, ...modifiers) => {
  nodes.forEach(({ name, node }) => {
    modifiers.forEach((modifierName) => {
      node.classList.add(`${name}--${modifierName}`);
    });
  });
};

/**
 * Removes modifier CSS class names to any of the elements.
 * @private
 * @param {Array} nodes - An array of objects containing a name and element
 * @param {...string} modifiers - Modifier names
 */
const removeClassNames = (nodes, ...modifiers) => {
  nodes.forEach(({ name, node }) => {
    modifiers.forEach((modifierName) => {
      node.classList.remove(`${name}--${modifierName}`);
    });
  });
};

/**
 * Ran whenever a FIELD is in a completed state, i.e. when the page first loads
 * or when a blur event occurred.
 * @private
 * @param {Array} nodes - An array of objects containing a name and element
 * @param {HTMLElement} target - The element receiving the event
 * @param {boolean} shouldApplyInvalid - Allow for applying invalid modifiers
 * @param {string} selected - The selected modifier value
 * @param {string} filled - The filled modifier value
 * @param {string} invalid - The invalid modifier value
 * @param {string} suppressError - The suppress error modifier value
 */
const completed = (nodes, target, shouldApplyInvalid, {
  selected,
  filled,
  invalid,
  suppressError,
}) => {
  const [{ node: container }] = nodes.filter(({ type }) => type === TYPES.CONTAINER);
  removeClassNames(nodes, selected, filled, invalid, suppressError);

  // Denotes that within a floating label there is an error
  if (container.querySelector(':invalid') === target) {
    // Make sure to apply an invalid error if instructed to apply an invalid
    // modifier
    if (shouldApplyInvalid) {
      addClassNames(nodes, invalid);
    } else {
      // Otherwise, we are looking to suppress an error. Since the browser has
      // built in invalidity, we apply this class to ensure that the default
      // browser invalid behavior gets overridden.
      addClassNames(nodes, suppressError);
    }
  }

  if (target.value) {
    addClassNames(nodes, filled);
  }
};

/**
 * Responds to any event based on the type of event.
 * @private
 * @param {string} type - The type of event, i.e. focus, blur
 * @param {HTMLElement} target - The element receiving the event
 * @param {Array} nodes - An array of objects containing a name and element
 * @param {boolean} validateOnlyOnSubmit - Instructs to only validate on submit
 * @param {Object} modifiers - Contains modifier names
 */
const respond = (type, target, nodes, { validateOnlyOnSubmit }, modifiers) => {
  const { FOCUS, BLUR, INVALID } = EVENTS;
  const { selected, filled, invalid, suppressError } = modifiers;

  switch (type) {
    case FOCUS:
      addClassNames(nodes, selected);
      removeClassNames(nodes, filled, invalid, suppressError);
      break;
    case BLUR:
      completed(nodes, target, !validateOnlyOnSubmit, modifiers);
      break;
    case INVALID:
      removeClassNames(nodes, suppressError);
      addClassNames(nodes, invalid);
      break;
    default:
      break;
  }
};

/**
 * Responsible for initializing state modifiers. More specifically, it'll apply
 * any modifiers (i.e. CSS class names in form of BEM) when the page first
 * loads. For example, when a page initially loads and an element is invalid,
 * it'll apply any modifiers. It'll do the same when responding to events based
 * on user interaction.
 * @private
 * @see DEFAULT_STATE_MODIFIERS
 * @param {Array} nodes - An array of objects containing a name and element
 * @param {Object} options - Options initially passed in
 * @returns {Function} - Used for firing off events
 */
const initialize = (nodes, options = {}) => {
  const {
    filledModifier: filled,
    invalidModifier: invalid,
    selectedModifier: selected,
    suppressErrorModifier: suppressError,
  } = Object.assign({}, DEFAULT_STATE_MODIFIERS, options);

  const modifiers = { filled, invalid, selected, suppressError };
  const [{ node: formField }] = nodes.filter(({ type }) => type === TYPES.FIELD);

  completed(nodes, formField, true, modifiers);

  return (type, { target }, data) => respond(type, target, nodes, data, modifiers);
};

/**
 * Provides modifiers, i.e. CSS class names in the form of BEM to a block and
 * two child block elements. These elements are coming from the nodes.
 * @see DEFAULT_STATE_MODIFIERS
 * @param options
 */
const stateModifiers = (options = {}) => (...nodes) => initialize(nodes, options);

export default stateModifiers;
