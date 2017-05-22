/**
 * Updates CTA when stock id changes
 * @module modules/updateCTA
 */

import $ from 'jquery';

import ctaAddToBag from '../../materials/modules/cta-buttons/add-to-bag.html';
import ctaPreorder from '../../materials/modules/cta-buttons/preorder-cart.html';
import ctaNotifyMeSpecial from '../../materials/modules/cta-buttons/notify-me-special.html';
import ctaNotifyMe from '../../materials/modules/cta-buttons/notify-me.html';

export { ctaAddToBag, ctaPreorder, ctaNotifyMeSpecial, ctaNotifyMe };
export const CTA_CLASS = 'cta';

/**
 * Choose the CTA based on attributes.
 * @private
 * @param {Boolean} oos - Whether the chosen size is out of stock
 * @param {Boolean} preorder - Whether the chosen size is preorder only
 * @param {Boolean} allOnSale - Whether all sizes are on sale
 */
function chooseCTA({ chosen = {}, allOnSale }) {
  const { oos, preorder } = chosen;
  if (oos) {
    return allOnSale ? ctaNotifyMe() : ctaNotifyMeSpecial();
  }
  if (preorder) {
    return ctaPreorder();
  }
  return ctaAddToBag();
}

const DEFAULT_OPTIONS = {
  chooseCTA,
};

/**
 * Update CTA based on selected value.
 * @param {HTMLElement} wrap - The .product wrap
 * @param {String} wrapBlockClass - Class of wrap HTML Element
 * @param {Boolean} allOnSale - Whether all sizes are on sale
 * @param {Object} chosen - Selected product size, including relevant data
 * @param {Function} options.chooseCTA - Function used to choose the CTA
 */
export default function updateCTA(data, options = {}) {
  const { wrap, wrapBlockClass } = data;
  const { chooseCTA: chooseCTAFunc } = Object.assign({}, DEFAULT_OPTIONS, options);

  const $cta = $(wrap).find(`.${wrapBlockClass}__${CTA_CLASS}`);

  $cta.html(chooseCTAFunc(data));
}
