/**
 * Responsible for showing a notify based on the state of the product
 * @module modules/notifyMeUpdate
 */
import $ from 'jquery';

import { updateChosenData } from '../lib/create-product-data';
import toggleHidden from '../elements/fields/toggle-hidden';
import showNotification from './product-notification-show';
import updateCTA from './product-cta-update';
import { getChosen } from './product-size-change';

import ctaAddToBag from '../../materials/modules/cta-buttons/add-to-bag.html';
import ctaPreorder from '../../materials/modules/cta-buttons/preorder.html';
import ctaNotifyMe from '../../materials/modules/cta-buttons/notify-me.html';
import ctaSpecialOrder from '../../materials/modules/cta-buttons/special-order.html';
import notificationInStock from '../../materials/modules/product-notifications/in-stock.html';
import notificationPreorderEmail from '../../materials/modules/product-notifications/preorder-email.html';
import notificationPreorderAvailable from '../../materials/modules/product-notifications/preorder-available.html';
import notificationUnavailable from '../../materials/modules/product-notifications/unavailable.html';

export {
  ctaAddToBag,
  ctaPreorder,
  ctaNotifyMe,
  ctaSpecialOrder,
  notificationInStock,
  notificationPreorderEmail,
  notificationPreorderAvailable,
  notificationUnavailable,
};

/**
 * Helper function to check if wrap has id of "special-order"
 * @param {HTMLElement} wrap - The closest wrap from the select
 */
const isSpecialOrder = wrap => wrap.id === 'special-order';

/**
 * Choose the CTA based on attributes.
 * @param {HTMLElement} wrap - The closest wrap from the select
 * @param {Object} chosen - Selected option of select dropdown
 * @return {String} Handlebars template from import above
 */
export const chooseCTA = ({ wrap, chosen = {} }) => {
  const { oos, preorder } = chosen;

  // if preorder available
  if (preorder) {
    return ctaPreorder();
  }
  // item is in stock now, show "add to bag"
  if (!oos) {
    return ctaAddToBag();
  }
  // default for special order page
  if (isSpecialOrder(wrap)) {
    return ctaSpecialOrder();
  }
  // default for all other pages
  return ctaNotifyMe();
};

/**
 * Choose template for notification.
 * @param {HTMLElement} wrap - The closest wrap from the select
 * @param {Object} chosen - Selected option of select dropdown
 * @return {String} Handlebars template from import above
 */
export const notify = ({ wrap, chosen }) => {
  const { oos, preorder, 'delivery-date': deliveryDate, unavailable } = chosen;

  // if data-attr, show notification
  if (isSpecialOrder(wrap)) {
    if (preorder) {
      return notificationPreorderAvailable({ 'delivery-date': deliveryDate });
    }
    if (unavailable) {
      return notificationUnavailable();
    }
  }
  if (preorder) {
    return notificationPreorderEmail();
  }
  if (!oos) {
    return notificationInStock();
  }

  return {};
};

/**
 * Determine whether Email Field should be hidden
 * @param {HTMLElement} wrap - Notify Me block wrap
 * @param {Object} chosen - Selected option of select dropdown
 * @return {boolean} Whether the email field should be hidden
 */
export const hideEmail = ({ wrap, chosen = {} }) => {
  const { oos, preorder } = chosen;
  // hide whenever "auto order" is available
  if (wrap.querySelector('#auto-order')) {
    return true;
  }

  // hide for preorder, only if "special order"
  if (preorder) {
    return isSpecialOrder(wrap);
  }

  // if no conditions above are met, simply check if in stock
  return !oos;
};

/**
 * Callback function to update the Notify Me section.
 * @param {Object} data - Object containing relevant data about the product
 */
export default function updateNotifyMe(data) {
  const { wrap, sizeEl } = data;
  const chosen = getChosen(sizeEl);
  const $emailField = $(wrap).find('#email').closest('.floating-label');

  updateChosenData(data, chosen);

  // update the user-facing form elements
  toggleHidden($emailField, hideEmail(data));
  showNotification(data, { notify });
  updateCTA(data, { chooseCTA });
}
