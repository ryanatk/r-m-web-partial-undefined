/**
 * Responsible for rendering a product specific zoom
 * @module modules/productZoom
 */
import $ from 'jquery';
import 'slick-carousel';
import cookies from 'js-cookie';

import toggleFavorite from '../elements/toggle-favorite';
import registerJQueryPlugin from '../lib/register-jquery-plugin';
import sliderZoom from './zoom/slider-zoom';
import dataProps from '../lib/data-props';
import './product-zoom.scss';

/**
 * Defines the options which can be provided for the product zoom.
 * @type {Object}
 */
const DEFAULTS = {
  sliderZoom,
  targetSelector: '',
  slideFunc: num => num,
  didUnmount: () => {},
  zoomBadgeDuration: 2000,
};

/**
 * Defines the default props for the component.
 * @type {Object}
 */
const DEFAULT_PROPS = {
  images: [],
  noImages: 'No images found :(',
  tapToZoom: 'Tap to Zoom',
};

/**
 * Defines the id for the favorite element.
 * @type {String}
 */
export const FAVORITE_ID = 'product-zoom-favorite';

/**
 * Defines the fade out className.
 * @type {String}
 */
export const FADE_OUT_BADGE_CLASS_NAME = 'product-badge--fade-out';

/**
 * Defines the element ID for a zoom badge.
 * @type {String}
 */
export const ZOOM_BADGE_ID = 'zoom-badge';

/**
 * Defines the event used for finishing a transition.
 * @type {String}
 */
export const ZOOM_BADGE_TRANSITION_EVENT = 'transitionend';

/**
 * Contains fields for interacting with a badge cookie.
 * @type {Object}
 */
export const ZOOM_BADGE_COOKIE = {
  name: 'zb',
  expires: 14,
};

/**
 * Setup used for hiding the zoom badge so that it can be shown and later on
 * removed.
 * @private
 * @param  {number} zoomBadgeDuration - The duration in milliseconds when the
 *                                      badge should be removed
 */
const setupHideZoomBadge = (zoomBadgeDuration) => {
  setTimeout(() => {
    const $zoomBadge = $(document.getElementById(ZOOM_BADGE_ID));
    $zoomBadge
      .on(ZOOM_BADGE_TRANSITION_EVENT, () => $zoomBadge.remove())
      .addClass(FADE_OUT_BADGE_CLASS_NAME);
  }, zoomBadgeDuration);
};

/**
 * Contains the component used for rendering zoom info badge.
 * @private
 * @param  {string} tapToZoom - Text used in the badge
 * @return {string} Rendered template containing the badge
 */
const infoBadgeComponent = ({ tapToZoom }) => `
  <div id="${ZOOM_BADGE_ID}" class="product-badge product-badge--center product-badge--inline">
    ${tapToZoom}
  </div>`;

/**
 * Renders an info badge if the necessary cookie isn't present.
 * @private
 * @param  {number} zoomBadgeDuration - Represents duration in milliseconds
 * @param  {string} tapToZoom - Text used inside zoom badge
 * @return {string} The info badge if the logic checks out
 */
const renderInfoBadge = ({ zoomBadgeDuration, tapToZoom }) => {
  const { name, expires } = ZOOM_BADGE_COOKIE;
  const sawZoomBadge = cookies.get(name);

  if (!sawZoomBadge) {
    cookies.set(name, 1, { expires });
    setupHideZoomBadge(zoomBadgeDuration);
    return infoBadgeComponent({ tapToZoom });
  }

  return '';
};

/**
 * Renders any additional markup that goes in the menu.
 * @private
 * @return {string} A fully render template for the menu.
 */
const favoriteButtonComponent = () => `
  <button id="${FAVORITE_ID}" class="favorite-button zoom-menu__favorite">
    <span class="favorite-button__icon icon icon--heart-fill">
      <svg>
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-heart-fill"></use>
      </svg>
    </span>
  </button>`;

/**
 * Used to bind the events for the product zoom.
 * @private
 */
const didRender = () => toggleFavorite(document.getElementById(FAVORITE_ID));

/**
 * Determines whether a function should be ran based on images existing.
 * @private
 * @param  {array}   images - A list of image sources
 * @param  {Function} callback - Callback to return if logic is valid
 * @return {Function} Used for execution based on logic
 */
const shouldRun = (images, callback) => (images.length ? callback : () => '');

/**
 * Responsible for rendering a slider zoom that's specifically used showcasing
 * a product.
 * @see DEFAULTS
 * @param {HTMLElement} el - The element used for opening up the product zoom
 * @param {Object} [options={}] - Forwarded along options
 */
export default function productZoom(el, options = {}) {
  const opts = Object.assign({}, DEFAULTS, options);
  const { targetSelector, sliderZoom: sliderZoomFunc, zoomBadgeDuration } = opts;
  const { images, tapToZoom, noImages } = dataProps(el, DEFAULT_PROPS);

  $(el)
    .append(shouldRun(images, renderInfoBadge({ tapToZoom, zoomBadgeDuration })))
    .on('click', targetSelector, (e) => {
      const startingIndex = images.length ? $(e.target.parentNode).index() : null;

      sliderZoomFunc(images, Object.assign({}, opts, {
        menuRender: shouldRun(images, favoriteButtonComponent),
        didRender: shouldRun(images, didRender),
        startingIndex,
        noImages,
      }));
    });
}

registerJQueryPlugin('productZoom', productZoom);

