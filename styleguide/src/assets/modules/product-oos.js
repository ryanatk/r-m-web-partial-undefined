/**
 * Updates page for Out Of Stock product
 * @module modules/oosProduct
 */

import createProductData from '../lib/create-product-data';
import registerJQueryPlugin from '../lib/register-jquery-plugin';
import updateCTA from './product-cta-update';
import updateDeliveryDate from './delivery-date-update';

// Expose the function as a jQuery plugin for ease of use
export const PLUGIN_NAME = 'oosProduct';

/**
 * Initializes changes for oos product.
 * @param {HTMLElement} el - The select dropdown we're attaching to
 */
export default function oosProduct(el) {
  const data = createProductData(el);
  updateDeliveryDate(data);
  updateCTA(data);
}

registerJQueryPlugin(PLUGIN_NAME, oosProduct);
