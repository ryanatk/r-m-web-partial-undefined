/* eslint import/prefer-default-export: 0 */
/**
 * Responsible for any DOM related helpers
 * @module test/helpers/dom
 */

/**
 * Takes a list of icons and converts them over to valid data attributes to be
 * consumed for HTML.
 * @param {Array} attrs - List of icons
 * @param {String} prefix - the prefix or name used to identify or namespace
 * prior to an icon being referenced, i.e. data-${prefix}-icon-name
 * @returns {string} Data attributes with a reference to icons
 */
export const iconsToDataAttrs = (attrs, { prefix = 'dude' } = {}) =>
  attrs
    .map(({ name }) => `data-${prefix}-${name}="${name}"`)
    .join(' ');
