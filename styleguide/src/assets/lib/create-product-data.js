/**
 * Creates an object including all relevant data for a product
 * Also allows for updates when a new option is chosen
 * @module lib/createProductData
 */

import $ from 'jquery';
import { PRICE, REGULAR_PRICE, PRODUCT_BLOCK } from '../lib/constants/pdp';

const PRICE_ATTR = `data-${PRICE}`;
const REGULAR_PRICE_ATTR = `data-${REGULAR_PRICE}`;

/**
 * @namespace
 * @property {String} wrapBlockClass - Class of wrap HTML Element
 */
const DEFAULT_OPTIONS = {
  wrapBlockClass: PRODUCT_BLOCK,
};

/**
 * Helper function to determine if an option has an attr
 * @private
 * @param {HTMLElement} option - The select option element
 * @param {String} attr - The attribute we're checking for
 */
const hasAttr = (option, attr) =>
  !!(option.getAttribute(attr) && option.getAttribute(attr) !== 'false');

/**
 * Helper function to determine if any options have an attr
 * @private
 * @param {NodeList} options - List of select options
 * @param {Function} comparison - Callback function to evaluate the comparison
 * @param {String} attr - The attribute we're comparing
 * @return {Boolean} Whether comparison was successful on any options
 */
const any = (options, comparison, attr) => {
  let len = options.length;

  while (len) {
    len -= 1;
    const option = options[len];
    if (option.value !== 'unavailable'
     && comparison(option, attr)) {
      return true;
    }
  }
  return false;
};

/**
 * Helper function to determine if all options have an attr
 * @private
 * @param {NodeList} options - List of select options
 * @param {Function} comparison - Callback function to evaluate the comparison
 * @param {String} attr - The attribute we're comparing
 * @return {Boolean} Whether comparison was successful on all options
 */
const all = (options, comparison, attr) => {
  let len = options.length;

  while (len) {
    len -= 1;
    const option = options[len];
    if (option.value !== 'unavailable'
     && !comparison(option, attr)) {
      return false;
    }
  }
  return true;
};

/**
 * Helper function to determine if option is on sale
 * @private
 * @param {HTMLElement} option - Option for which we're comparing price
 * @param {String} regularPrice - The item's regular price
 * @return {Boolean} Whether price is less than regualarPrice
 */
const isOnSale = (option, regularPrice) => {
  const price = option.getAttribute(PRICE_ATTR);

  return parseFloat(price) < parseFloat(regularPrice);
};

/**
 * Helper function to get product data attributes
 * @private
 * @param {HTMLElement} option - The select option element
 * @param {String} attr - The attribute we're checking for
 * @return {String|Boolean} The attribute value (or existence)
 */
const getAttr = (option, attr) => {
  const val = option.getAttribute(`data-${attr}`) || false;
  return (val && val !== 'false') ? (val === 'true') || val || true : false;
};

/**
 * Updates product data object whenever chosen option is changed
 * @param {Object} product - The product's data object
 * @param {HTMLElement} chosen - The chosen option
 */
export const updateChosenData = (product, chosen) => {
  const price = getAttr(chosen, PRICE);
  const regularPrice = getAttr(chosen, REGULAR_PRICE) || price;
  Object.assign(product, { chosen: {
    el: chosen,
    'delivery-date': getAttr(chosen, 'delivery-date'),
    'sample-defect': getAttr(chosen, 'sample-defect'),
    'final-sale': getAttr(chosen, 'final-sale'),
    'one-left': getAttr(chosen, 'one-left'),
    preorder: getAttr(chosen, 'preorder'),
    oos: getAttr(chosen, 'oos'),
    unavailable: getAttr(chosen, 'unavailable'),
    price,
    regularPrice,
    isOnSale: parseFloat(price) < parseFloat(regularPrice),
    value: chosen.value || '',
  } });
};

/**
 * Creates a javascript object containing product data
 * @param {jQuery|Element} sizeEl - The size element (select, input, etc)
 * @see DEFAULT_OPTIONS
 # @return {Object} Contains relevant data to a product
 */
export default function createProductData(sizeEl, opts = {}) {
  const { wrapBlockClass } = Object.assign({}, DEFAULT_OPTIONS, opts);
  const $wrap = $(sizeEl).closest(`.${wrapBlockClass}`);

  // whether input or select, find the chosen element
  const { options, selectedIndex } = sizeEl;
  const chosen = options ? options[selectedIndex] : sizeEl;
  const defaultOption = options ? options[0] : chosen;
  // TODO: deprecate the usage of "regular-price" on the "default" option.
  // Instead, each option should include its own "regular-price".
  // Overall, we should get away from referring to the "default" option.
  const regularPrice = defaultOption.getAttribute(REGULAR_PRICE_ATTR) ||
    defaultOption.getAttribute(PRICE_ATTR);

  // instantiate object, adding properties that apply to the whole dropdown
  const product = {
    // DOM references
    wrap: $wrap[0],
    wrapBlockClass,
    sizeEl,
    // product info
    regularPrice,
    chosen: {},
    // useful booleans
    oneSize: options && options.length === 1,
    allInStock: options ? !any(options, hasAttr, 'data-oos') : !hasAttr(chosen, 'data-oos'),
    allPreorder: options ? all(options, hasAttr, 'data-preorder') : hasAttr(chosen, 'data-preorder'),
    allOnSale: options ? all(options, isOnSale, regularPrice) : isOnSale(chosen, regularPrice),
  };

  updateChosenData(product, chosen);

  return product;
}
