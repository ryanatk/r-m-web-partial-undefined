/**
 * Loads image by replacing the src with data attr
 * @module load-image
 */

import registerJQueryPlugin from '../lib/register-jquery-plugin';

export const PLUGIN_NAME = 'loadImage';
export const DEFAULT_OPTIONS = {
  attr: 'data-src',
};

/**
 * Initial function to load image
 * @param {HTMLElement} image - Image to update
 */
export default function loadImage(image, options = {}) {
  const { attr } = Object.assign({}, DEFAULT_OPTIONS, options);
  const src = image.getAttribute(attr);

  if (src) {
    image.setAttribute('src', src);
  }

  return image;
}

// Expose the function as a jQuery plugin for ease of use
registerJQueryPlugin(PLUGIN_NAME, loadImage);
