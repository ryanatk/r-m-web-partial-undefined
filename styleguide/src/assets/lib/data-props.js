/**
 * Responsible for setting up data attributes that have required fields.
 * @module lib/dataProps
 */
import $ from 'jquery';
import merge from 'lodash/merge';
import has from 'lodash/has';

/**
 * Provides a way of pulling in data attributes on an element, while providing
 * sensible defaults and required fields.
 * @param {HTMLElement|jQuery|string} el - The element containing the data attrs
 * @param {Object} [defaults={}] - Any applied default fields
 * @param {Array} [required=[]] - Represents any fields that are required
 * @return {Object} Data from the element and defaults
 */
export default function dataProps(el, defaults = {}, required = []) {
  const data = merge({}, defaults, $(el).data());

  required.forEach((path) => {
    if (!has(data, path)) {
      throw new Error(`${path} was not found as a data attr`);
    }
  });

  return data;
}
