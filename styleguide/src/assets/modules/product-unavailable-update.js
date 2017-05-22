/**
 * Updates the "unavailable" option href
 * @module modules/linkUnavailable
 */

import $ from 'jquery';

/**
 * Value of the new option
 */
export const VALUE = 'unavailable';

/**
 * Name of attribute used to declare the new option's text
 */
export const UNAVAILABLE_ATTR = 'unavailable-text';

/**
 * Name of attribute containing the option's href
 */
export const HREF_ATTR = 'href';

/**
 * Possible HREF's for the unavailable link
 */
export const SPECIAL_ORDER = './special-order.html';
export const BACK_IN_STOCK = './back-in-stock.html';
export const CANT_FIND_YOUR_SIZE = './cant-find-your-size.html';

/**
 * HTML template containing the option
 * @private
 */
const template = ({ text, href }) =>
    `<option value="${VALUE}" data-${HREF_ATTR}="${href}">${text}</option>`;

/**
 * Gets the proper href for the conditions
 * @private
 * @param {Object} data - Object representing product info
 * @return {String} The href to add to the option
 */
const getHref = (data) => {
  const { chosen, oneSize, allInStock } = data;
  const { isOnSale } = chosen;

  // no link for only one size
  if (oneSize) {
    return '';
  }

  // when all sizes are in stock
  if (allInStock) {
    return isOnSale ? '' : SPECIAL_ORDER;
  }

  // default href based on whether all sizes are on sale
  return isOnSale ? BACK_IN_STOCK : CANT_FIND_YOUR_SIZE;
};

/**
 * Updates unavailable option
 * @param {Object} data - Object representing product info
 */
export default function updateUnavailable(data) {
  const { sizeEl } = data;
  const $sizeEl = $(sizeEl);

  // STOP if no unavailable attr
  const text = $sizeEl.data(UNAVAILABLE_ATTR);

  if (!text) { return; }

  // remove unavailable
  $sizeEl
    .find(`option[value="${VALUE}"]`)
    .remove();

  // add unavailable with proper data-href
  const href = getHref(data);

  if (href) {
    sizeEl.insertAdjacentHTML('beforeend', template({ text, href }));
  }
}
