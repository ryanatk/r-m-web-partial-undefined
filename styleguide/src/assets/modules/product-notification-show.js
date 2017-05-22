/**
 * Responsible for showing a product notification.
 * @module modules/productNotificationShow
 */
import $ from 'jquery';

import finalSale from '../../materials/modules/product-notifications/final-sale.html';
import sampleDefect from '../../materials/modules/product-notifications/final-sale-sample-defect.html';
import oneLeft from '../../materials/modules/product-notifications/one-left.html';
import preorder from '../../materials/modules/product-notifications/preorder.html';

export { finalSale, sampleDefect, oneLeft, preorder };
export const EL_CLASS = 'notification';

/**
 * Choose template for notification.
 * @private
 * @param {Object} chosen - Selected option of select dropdown
 * @return {String} Handlebars template from import above
 */
function notify({ chosen }) {
  // if data-attr, show notification
  if (chosen['sample-defect']) {
    return sampleDefect();
  } else if (chosen['final-sale']) {
    return finalSale();
  } else if (chosen['one-left']) {
    return oneLeft();
  } else if (chosen.preorder) {
    return preorder({ 'delivery-date': chosen['delivery-date'] });
  }

  return '';
}

const DEFAULT_OPTIONS = {
  notify,
};

/**
 * Show notification based on chosen option.
 * @param {HTMLElement} wrap - The closest wrap from the select
 * @param {String} wrapBlockClass - The BEM block class of the wrap
 * @param {Object} chosen - Information on the selected size
 * @return {jQueryElement} product__notification element
 */
export default function showNotification(data, options = {}) {
  const { wrap, wrapBlockClass } = data;
  const { notify: notifyFunc } = Object.assign({}, DEFAULT_OPTIONS, options);
  const $el = $(wrap).find(`.${wrapBlockClass}__${EL_CLASS}`);
  if (!$el.length) {
    throw new Error(`Did not find $el: ".${wrapBlockClass}__${EL_CLASS}"`);
  }

  $el.empty();

  const notification = notifyFunc(data);

  // show template
  if (notification) {
    $el.html(notification);
  }

  return $el;
}
