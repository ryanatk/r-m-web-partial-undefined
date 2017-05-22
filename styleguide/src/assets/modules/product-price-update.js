/**
 * Updates price displayed when stock id changes
 * @module modules/updatePrice
 */

import $ from 'jquery';

import { PRICE_BLOCK, PRODUCT_BLOCK, CURRENT_PRICE_ELEMENT, REGULAR_PRICE_ELEMENT } from '../lib/constants/pdp';

/**
 * data attributes attached to the price element
 * used to explicitly declare template id's
 */
export const TEMPLATE_REGULAR = 'template-regular';
export const TEMPLATE_ON_SALE = 'template-on-sale';

/**
 * Update price based on selected value.
 * @param {HTMLElement} wrap - Product wrap
 * @param {Object} chosen - Object representing data from selected option of
 * select dropdown (or input for 1 size)
 */
export default function updatePrice({ wrap, chosen = {} }) {
  const { price, regularPrice, isOnSale } = chosen;

  // get the price element
  const $priceEl = $(wrap).find(`.${PRODUCT_BLOCK}__${PRICE_BLOCK}`);

  // get the template style from the price element
  const attr = isOnSale ? TEMPLATE_ON_SALE : TEMPLATE_REGULAR;
  const templateId = $priceEl.data(attr);

  // get the template
  const template = document.getElementById(templateId);

  if (!template) {
    throw new Error('Price template not found');
  }

  // update price
  const templateContent = document.importNode(template.content, true);
  const priceEl = templateContent.querySelector(`.${CURRENT_PRICE_ELEMENT}`);
  if (priceEl) {
    priceEl.innerHTML = price;
  }

  // update regular price, for on-sale items
  if (isOnSale) {
    const currencySymbolEl = templateContent.querySelector('span[itemprop="priceCurrency"]') || { innerHTML: '' };
    const regularPriceEl = templateContent.querySelector(`.${REGULAR_PRICE_ELEMENT}`);
    if (regularPriceEl) {
      regularPriceEl.innerHTML = currencySymbolEl.innerHTML + regularPrice;
    }
  }

  // inject template into price element
  $priceEl.html(templateContent);
}
