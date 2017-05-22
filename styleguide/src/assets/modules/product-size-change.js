/**
 * Attaches change event listener to size dropdown, firing necessary updates
 * (typically attached to '.product-option--size .product-option__select')
 * @module modules/sizeChange
 */

import $ from 'jquery';
import registerJQueryPlugin from '../lib/register-jquery-plugin';
import updatePrice from './product-price-update';
import showNotification from './product-notification-show';
import updateCTA from './product-cta-update';
import updateDeliveryDate from './delivery-date-update';
import redirectHref from '../lib/redirect-href';
import updateUnavailable from './product-unavailable-update';
import createProductData, { updateChosenData } from '../lib/create-product-data';

// Expose the function as a jQuery plugin for ease of use
export const PLUGIN_NAME = 'sizeChange';

/**
 * Attaches change event to select dropdown.
 * @private
 * @param {Object} data - Object containing relevant data about the product
 * @param {Function} updateFunc - Function to update the page
 */
const attachChangeListener = (data, updateFunc) => $(data.sizeEl).change(() => {
  updateFunc(data);
});

/**
 * Helper to get chosen size
 * @param {HTMLElement} sizeEl - Size Element
 * @return {Object} Chosen size data
 */
export const getChosen = (sizeEl) => {
  // whether input or select, find the chosen element
  const { options, selectedIndex } = sizeEl;

  return options ? options[selectedIndex] : sizeEl;
};

/**
 * Callback function to update the page.
 * @private
 * @param {Object} data - Object containing relevant data about the product
 */
function update(data) {
  const chosen = getChosen(data.sizeEl);
  updateChosenData(data, chosen);

  // run updates
  redirectHref(chosen);
  updatePrice(data);
  showNotification(data);
  updateCTA(data);
  updateDeliveryDate(data);
  updateUnavailable(data);
}

/**
 * @namespace
 * @param {Function} update - Function fired to update page on size change
 */
const DEFAULT_OPTIONS = {
  update,
};

/**
 * Initializes size changes.
 * @param {HTMLElement} el - The select dropdown we're attaching to
 * @see DEFAULT_OPTIONS
 */
export default function sizeChange(el, options = {}) {
  const combinedOptions = Object.assign({}, DEFAULT_OPTIONS, options);
  const { update: updateFunc } = combinedOptions;
  const data = createProductData(el, combinedOptions);

  attachChangeListener(data, updateFunc);
}

registerJQueryPlugin(PLUGIN_NAME, sizeChange);
