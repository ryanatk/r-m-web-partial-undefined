/**
 * Toggles the 'active' class modifier on favorite buttons when clicking
 * @module toggleFavorite
 */

import $ from 'jquery';
import modal from '../modules/modal';
import registerJQueryPlugin from '../lib/register-jquery-plugin';

export const PLUGIN_NAME = 'toggleFavorite';
export const ACTIVE_CLASS = 'favorite-button--active';
export const VISUAL_HIDDEN_CLASS = 'u-screen-reader';
export const MODAL_CLASS = 'modal';
export const EVENT_NAME = 'favorite';

/**
 * Defines sensible defaults for toggle favorite.
 * @type {Object}
 */
const TOGGLE_FAVORITE_OPTIONS = {
  modal,
  container: document.body,
};

/**
 * Central place to see if a specific element has been favorited.
 * @private
 * @param {jQuery} $el - Container for the favorite button
 * @returns {boolean} Whether the item has been favorited
 */
const isFavorited = $el => $el.hasClass(ACTIVE_CLASS);

/**
 * Shows the appropriate favorite related message for screen readers.
 * @private
 * @param {jQuery} $el - Container for the favorite button
 * @param {boolean} hasFavorite - Whether it has been favorited
 */
const showMessage = ($el, hasFavorite) => {
  let message = $el.data('favoriteMessage');
  if (hasFavorite) {
    message = $el.data('unfavoriteMessage');
  }

  $el.find(`.${VISUAL_HIDDEN_CLASS}`).text(message);
};

/**
 * Creates a notification specific to an item being favorited.
 * @private
 * @param {string} notificationModalId - ID for the container of the notification
 * @param {string} message - The message of the notification
 * @returns {string} Fully qualified notification
 */
const createNotification = ({ notificationModalId, message }) => `
  <div id="${notificationModalId}" class="${MODAL_CLASS}" data-type="notification" >
    <p class="u-margin-b--none u-center">${message}</p>
  </div>
`;

/**
 * Responsible for showing the notification based on whether the item has been
 * favorited. Since more than one item can appear on the page, it's important
 * to allow for each notification to be unique since these requests can be made
 * asynchronously. On top of that
 * @private
 * @param {jQuery} $el - Container for the favorite button
 * @param {boolean} hasFavorite - Whether it has been favorited
 * @param {Function} modalFunc - Used to display the notification
 * @param {HTMLElement} container - Container to append to
 */
const showNotification = ($el, hasFavorite, { modal: modalFunc, container }) => {
  let message = $el.data('unfavoriteNotification');
  if (hasFavorite) {
    message = $el.data('favoriteNotification');
  }

  const notificationModalId = `notification-modal-${Date.now()}`;
  const $modalContent = $(createNotification({ notificationModalId, message }));
  $modalContent.appendTo(container);

  modalFunc($el, {
    triggerOpen: true,
    open: notificationModalId,
  });
};

/**
 * Responsible for initializing any visual hidden text related to the state of
 * the favorite button.
 * @private
 * @param {jQuery} $el - Container for the favorite button
 */
const initializeVisualHidden = ($el) => {
  const hasFavorite = isFavorited($el);
  const el = document.createElement('span');
  el.className = VISUAL_HIDDEN_CLASS;
  $el.prepend(el);
  showMessage($el, hasFavorite);
};

/**
 * Responsible for dispatching a favorited event.
 * @private
 * @param {HTMLElement} el - Element triggering event
 * @param {boolean} favorited - Whether the element was favorited
 */
const dispatchFavoriteEvent = (el, favorited) => {
  const evt = new CustomEvent(EVENT_NAME, {
    detail: { favorited },
  });

  el.dispatchEvent(evt);
};

/**
 * Toggle the favorited state
 * @private
 * @param {jQuery} $el - Element to toggle
 * @param {Object} opts - Configurable options
 */
const toggleActive = ($el, opts) => {
  $el.toggleClass(ACTIVE_CLASS);

  const hasFavorite = isFavorited($el);
  showMessage($el, hasFavorite);
  showNotification($el, hasFavorite, opts);
  dispatchFavoriteEvent($el[0], hasFavorite);
};

/**
 * Sets up click event toggle for favorite heart button.
 * @private
 * @see TOGGLE_FAVORITE_OPTIONS
 * @param {HTMLElement} el - Elements matching the selector (likely .favorite-button)
 * @param {Object} options - Configurable options
 */
export default function toggleFavorite(el, options = {}) {
  const $el = $(el);
  const opts = Object.assign({}, TOGGLE_FAVORITE_OPTIONS, options);
  initializeVisualHidden($el);

  $el.on('click', () => toggleActive($el, opts));
}

// Expose the function as a jQuery plugin for ease of use
registerJQueryPlugin(PLUGIN_NAME, toggleFavorite);
