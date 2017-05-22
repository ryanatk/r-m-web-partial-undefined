/**
 * Responsible initiating a floating label and sending events down to any
 * callers or extended functionality.
 * @module floatingLabel
 */
import property from 'lodash/property';

/**
 * Defines default options for a floating LABEL
 * @type {Object}
 */
const FLOATING_LABEL_OPTIONS = {
  block: 'floating-label',
  fieldElements: ['input', 'select', 'textarea'],
  labelElement: 'label',
  callers: [],
};

/**
 * Defines the different types of supported events.
 * @type {Object}
 */
export const EVENTS = {
  FOCUS: 'focus',
  BLUR: 'blur',
  INVALID: 'invalid',
  INPUT: 'input',
  LOAD: 'load',
};

/**
 * Defines the types associated to the elements within a floating label. It
 * uses Symbol as the value so that unique values can be used without caring
 * about conflicts values. Think of this similar to an Enum or an IOTA.
 * @enum
 * @type {Object}
 */
export const TYPES = {
  CONTAINER: Symbol('container'),
  LABEL: Symbol('label'),
  FIELD: Symbol('field'),
};

/**
 * Creates a FIELD based on the block and optionally supplied element.
 * @private
 * @param {Symbol} type - Uniquely identify a type of FIELD
 * @param {HTMLElement} container - Contains the child elements
 * @param {string} block - The block name
 * @param {string|null} [element=null] - The element name
 * @returns {Object} The name and node representing the FIELD.
 */
const createField = (type, container, block, element = null) => {
  if (element) {
    const name = `${block}__${element}`;
    return { type, name, node: container.querySelector(`.${name}`) };
  }

  return { type, name: block, node: container };
};

/**
 * Negotiates and resolves the form FIELD within the CONTAINER. There are a
 * number of possible element names that can be used, so this will ensure that
 * the supported element names correlate to what is in the DOM.
 * @private
 * @param {HTMLElement} container - Contains the form FIELD element
 * @param {string} block - The block name
 * @param {Array} fieldElements = Possible elements names
 * @returns {Object} The name and node representing the form FIELD.
 */
const createFormField = (container, block, fieldElements) => {
  const [field, ...otherFields] = fieldElements
    .map(element => createField(TYPES.FIELD, container, block, element))
    .filter(({ node }) => node);

  if (otherFields.length) {
    throw new Error('Floating label only supports one field in a container');
  }

  if (!field) {
    throw new Error('No form field node found in a floating label');
  }

  return field;
};

/**
 * Provides additional data that can be used from the consumer side of the
 * floating label. Think of this as extra data that isn't part of the event.
 * @private
 * @param {HTMLElement} fieldElement - The form field element
 * @returns {Object} Data to be passed along to the event.
 */
const buildAdditionalData = (fieldElement) => {
  const { validateOnlyOnSubmit } = property('form.dataset')(fieldElement) || {};
  return {
    validateOnlyOnSubmit: !!validateOnlyOnSubmit,
  };
};

/**
 * Creates an event listener and passes back all the necessary properties
 * needed for clean up.
 * @private
 * @param {string} eventName - The name of the event
 * @param {HTMLElement} node - Element receiving the event
 * @param {Array} listeners - The listeners or callers provided from the outside
 * @param {Function} [fn=e => e] - Allow for internal hooking in of the callback
 * @returns {Object} Properties containing event information
 */
const addListener = (eventName, node, listeners, fn = e => e) => {
  let handler;
  const data = buildAdditionalData(node);
  node.addEventListener(eventName, handler = (e) => {
    fn(e);
    listeners.forEach(listener => listener && listener(eventName, e, data));
  });

  return { node, eventName, handler };
};

/**
 * Removes all events applied to a single floating LABEL.
 * @private
 * @param {Object} listeners - Info about each element
 */
const removeListeners = (listeners) => {
  listeners.forEach(({ node, eventName, handler }) =>
    node.removeEventListener(eventName, handler),
  );
};

/**
 * Fires off a load event denoting that the element has loaded.
 * @private
 * @param {HTMLElement} fieldNode - The element receiving the event
 */
const fireLoadEvent = (fieldNode) => {
  const evt = new Event(EVENTS.LOAD);
  fieldNode.dispatchEvent(evt);
};

/**
 * Responsible for setting up any caller that needs to hook into the floating
 * LABEL. The goal of this work is to:
 *
 * - Offload responsibility of the interaction so any floating LABEL
 *   functionality can scale horizontally.
 * - Decrease the amount of event bound to the DOM by calling on the listener
 *   provided by the callers.
 * - Consolidate all events for ease of clean up.
 *
 * As part of the setup, a number of requirements are needed for a floating
 * LABEL include:
 *
 * - A CONTAINER element (the one passed in)
 * - A LABEL element
 * - Some kinda of form FIELD element
 *
 * Once all the requirements have been met, floating label will interact with
 * "callers", which serve the following purposes:
 *
 * - Accept the output of elements
 * - Respond to any events dictated by floating label by forwarding along the
 *   event name followed by the event on the form field
 *
 * To do so, a caller is a function where the returned function acts as the
 * responder. In it's simplest form, a caller is a function that returns a
 * function, where the first function passes along all the "nodes" or elements
 * defined in TYPES and the second function (or inner function) it used for
 * listening to/responding to events.
 *
 * @example
 * const myCaller = (blockElement, labelElement, fieldFormElement) => (type, evt) => {
 *   switch(type) {
 *     case 'FOCUS':
 *       blockElement.classList.add('i-do-focus-things');
 *     case 'BLUR':
 *       blockElement.classList.remove('i-do-focus-things');
 *       blockElement.classList.add('i-do-blur-things');
 *   };
 * };
 *
 * floatingLabel($el, {
 *   callers: [myCaller]
 * });
 *
 * @see TYPES
 * @see FLOATING_LABEL_OPTIONS
 * @param {HTMLElement} container - The element containing the LABEL and FIELD
 * @param {Object} options - Options used for overriding
 * @returns {Object} Properties used for interacting after the initial call
 */
export default function floatingLabel(container, options = {}) {
  const {
    block,
    fieldElements,
    labelElement,
    callers,
  } = Object.assign({}, FLOATING_LABEL_OPTIONS, options);
  const formField = createFormField(container, block, fieldElements);
  const label = createField(TYPES.LABEL, container, block, labelElement);

  if (!label.node) {
    throw new Error(`No field found in a floating label for ${label.name}`);
  }

  const elements = [
    createField(TYPES.CONTAINER, container, block),
    label,
    formField,
  ];

  const { FOCUS, BLUR, INVALID, INPUT, LOAD } = EVENTS;
  const listeners = callers.map(caller => caller(...elements));
  const { node: fieldNode } = formField;
  const focusListener = addListener(FOCUS, fieldNode, listeners, ({ target }) => target.setCustomValidity(''));
  const blurListener = addListener(BLUR, fieldNode, listeners);
  const invalidListener = addListener(INVALID, fieldNode, listeners);
  const inputListener = addListener(INPUT, fieldNode, listeners);
  const loadListener = addListener(LOAD, fieldNode, listeners);
  const eventListeners = [
    focusListener,
    blurListener,
    invalidListener,
    inputListener,
    loadListener,
  ];

  // At this point all the necessary elements are in the DOM so we communicate
  // to any subscribers that the floating label functionality has loaded.
  fireLoadEvent(fieldNode);

  return {
    removeListeners: () => removeListeners(eventListeners),
  };
}
