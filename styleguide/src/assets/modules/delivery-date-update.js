/**
 * Updates 'delivery-date' text to reflect size chosen
 * @module updateDeliveryDate
 */

import $ from 'jquery';

import template from '../../materials/modules/delivery-date.html';

export { template };
export const EL_CLASS = 'delivery-date';

/**
 * Initializes 'estimated delivery' text changes.
 * @param {HTMLElement} wrap - The closest wrap from the select
 * @param {String} wrapBlockClass - The BEM block class of the wrap
 * @param {Object} chosen - Information on the selected size
 * @return {jQuery} delivery-date element
 */
export default function updateDeliveryDate({ wrap, wrapBlockClass, chosen = {} }) {
  const { oos, preorder, 'delivery-date': deliveryDate } = chosen;

  const $el = $(wrap).find(`.${wrapBlockClass}__${EL_CLASS}`);

  // remove shown delivery-date text
  if (oos || preorder) {
    $el.empty();
  } else if (!deliveryDate) {
    $el.empty();
    throw new Error('Chosen does not include deliveryDate');
  } else {
    $el.html(template(chosen));
  }

  return $el;
}
