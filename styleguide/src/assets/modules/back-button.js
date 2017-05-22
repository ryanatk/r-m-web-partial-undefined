/**
 * Responsible for handling back button functionality
 * @module module/backButton
 */
import $ from 'jquery';

import registerJQueryPlugin from '../lib/register-jquery-plugin';

/**
 * Defines the class name for the back button
 * @type {string}
 */
export const BACK_BUTTON_CLASS = 'back-button';

/**
 * Defines the default options for the back button
 * @type {Object}
 */
const DEFAULT_OPTIONS = {
  back: () => history.back(-1),
};

/**
 * Adds onclick event to element to go back
 * @param {HTMLElement} el - The anchor/button we're attaching to
 * @see DEFAULT_OPTIONS
 */
export default function backButton(el, options) {
  const { back } = Object.assign({}, DEFAULT_OPTIONS, options);
  $(el).on('click', (evt) => {
    evt.preventDefault();
    back();
  });
}

registerJQueryPlugin('backButton', backButton);
