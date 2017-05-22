/**
 * Responsible for setting up page specific properties. These properties are
 * intended to be used for environment specific properties such as URLs or
 * values that are used throughout multiple pages.
 * @module lib/props
 */
import isUndefined from 'lodash/isUndefined';
import property from 'lodash/property';
import clone from 'lodash/clone';

let props = window.rcProps || {};

/**
 * Responsible for overriding the existing store.
 * @param {Object} obj - Values used for replacing the store
 */
export const updateStore = (obj) => {
  props = obj;
};

/**
 * Responsible for clearing or wiping out a store.
 */
export const clearStore = () => {
  props = {};
};

/**
 * Responsible for obtaining a value from a store of properties. It will accept
 * a defaultValue if no value is found in the store. To ensure safety in
 * obtaining a value, the name takes a string in dot notation in order of
 * object nesting.
 *
 * @example
 * get('character');
 * get('character.bowls.onShabbos');
 * get('character.bowls.onShabbos', true);
 * @param {string} name - Property name looked up
 * @param {string} defaultValue - Provided if no property exists
 * @return {*} The value coming from the store
 */
export const get = (name, defaultValue) => {
  if (isUndefined(name)) {
    throw new Error('A property name is required when getting a property value');
  }

  const value = property(name)(props);
  if (!isUndefined(value)) {
    return clone(value);
  }

  return defaultValue;
};

/**
 * Responsible for setting a value in the store. In most cases, properties
 * will already be predefined, but this exists in case any properties need to
 * set dynamically or on demand. It will ensure that values overridden are
 * intentional by providing a flag.
 * @param {string} name - Property name used for setting
 * @param {*} value - The value of the property
 * @param {boolean} [override=false] - Allows a property to be overriden
 */
export const set = (name, value, override = false) => {
  if (isUndefined(name)) {
    throw new Error('A property name is required when setting a property');
  }

  if (isUndefined(value)) {
    throw new Error('A property value is required when setting a property');
  }

  const existingValue = get(name);
  if (!isUndefined(existingValue) && !override) {
    throw new Error('Cannot override an existing property. If this is intentional, then pass the override flag.');
  }

  props[name] = value;
};
