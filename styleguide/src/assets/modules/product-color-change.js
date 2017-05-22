/**
 * Attaches change event listener to color dropdown, firing necessary updates
 * (typically attached to '.product-option--color .product-option__select')
 * @module modules/colorChange
 */

import $ from 'jquery';
import redirectHref from '../lib/redirect-href';
import registerJQueryPlugin from '../lib/register-jquery-plugin';

// Expose the function as a jQuery plugin for ease of use
export const PLUGIN_NAME = 'colorChange';

/**
 * List of all updates made on change.
 * @param {HTMLElement} evt - The select dropdown we're attaching to
 */
export const runUpdates = ({ currentTarget }) => {
  // whether input or select, find the chosen element
  const { options, selectedIndex } = currentTarget;
  const chosen = options ? options[selectedIndex] : currentTarget;

  redirectHref(chosen);
};

/**
 * Attaches change event to select dropdown.
 * @private
 * @param {HTMLElement} dropdown - The select dropdown
 */
const attachChangeListener = dropdown => dropdown.change(evt => runUpdates(evt));

/**
 * Initializes color dropdown changes.
 * @param {HTMLElement} el - The select dropdown we're attaching to
 */
export default function colorChange(el) {
  const dropdown = $(el);

  attachChangeListener(dropdown);
}

registerJQueryPlugin(PLUGIN_NAME, colorChange);
