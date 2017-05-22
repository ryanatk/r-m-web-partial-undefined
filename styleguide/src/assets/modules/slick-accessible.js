import $ from 'jquery';
import 'slick-carousel';
import registerJqueryPlugin from '../lib/register-jquery-plugin';
import customPaging from './slick/custom-paging';

export const SLICK_ACTIVE_CLASSNAME = 'slick-active';

/**
 * Takes any defaults coming from slick along with some additional
 * properties to override any builtin accessibility coming from slick.
 * @type {Object}
 */
const SLICK_ACCESSIBLE_OPTIONS = {
  accessibility: false,
  arrows: true,
  customPaging,
  dots: false,
  dotsClass: 'slick-dots',
  dotsTagElement: 'ol',
  dotsWrapperSelector: '<nav />',
  focusOnSelect: true,
  slide: 'li',
};

/**
 * Strips any accessibility related attributes from the dots container since
 * they are incorrect.
 * @param {jQuery} $dots - Current dots container
 * @param {string} wrapperSelector - Used to wrap the dots
 */
const resetDotsWrapper = ($dots, wrapperSelector) =>
  $dots
    .wrap(wrapperSelector)
    .removeAttr('role');

/**
 * Strips any accessibility related attributes from the individual dots since
 * they are incorrect.
 * @param {jQuery} $dots - Current dots container.
 */
const resetDots = $dots =>
  $dots
    .find('li')
    .removeAttr('aria-hidden')
    // Use detach to keep the existing elements intact
    .detach();

/**
 * Creates the updated dots element and acquires all the existing attributes
 * from the current dots. Since element names are immutable, we create a new
 * element with the intention to remove it later on once all the high jacking is
 * complete.
 * @param {jQuery} $dots - Current dots container
 * @param {jQuery} $li - list items representing the dots
 * @param {string} tagElement - The tagName to use for the dots container
 * @returns {jQuery} - The updated dots
 */
const createUpdatedDots = ($dots, $li, tagElement) => {
  const $ol = $(document.createElement(tagElement)).append($li);
  const attrs = Array.from($dots[0].attributes);

  attrs.forEach(({ nodeName, nodeValue }) => {
    $ol.attr(nodeName, nodeValue);
  });

  return $ol;
};

/**
 * Replaces the existing dots with an updated version that makes things more
 * "accessible".
 * @param {jQuery} $dots - Current dots container
 * @param {jQuery} $updatedDots - Updated dots container
 */
const insertUpdatedDots = ($dots, $updatedDots) =>
  $dots
    .after($updatedDots)
    .remove();

/**
 * Applies an active slide based on a slick listener. Since slick applies it's
 * active slider via the container and since said container referenced within
 * slick exists, we need to handle this manually. Yeah, lame, I know.
 * TODO: See if we can get a patch into slick so that we can remove a good of
 * this code here.
 * @param {jQuery} $li - List elements representing dots
 */
const applyActiveSlide = $li => (event, slick, currentSlide, nextSlide) => {
  $li.eq(currentSlide).removeClass(SLICK_ACTIVE_CLASSNAME);
  $li.eq(nextSlide).addClass(SLICK_ACTIVE_CLASSNAME);
};

/**
 * Responsible for resetting accessibility applied by slick when dots have been
 * requested by the caller.
 * @param {jQuery} $el - Elements receiving carousel
 * @param {jQuery} $dots - Dots container
 * @param {string} dotsTagElement - tagName used for the dots
 * @param {string} dotsWrapperSelector - Selector used for wrapper the dots
 */
const resetDotsA11y = ($el, $dots, {
  dotsTagElement,
  dotsWrapperSelector,
}) => {
  resetDotsWrapper($dots, dotsWrapperSelector);
  const $li = resetDots($dots);
  const $updatedDots = createUpdatedDots($dots, $li, dotsTagElement);
  insertUpdatedDots($dots, $updatedDots);

  $el.on('beforeChange', applyActiveSlide($li));
};

/**
 * Looks for dots if configured properly.
 * @param {string} appendDots - Where to append dots
 * @param {string} dotsClass - className to apply to dots
 * @returns {jQuery} - Dots container
 */
const findDots = ({ appendDots, dotsClass }) =>
  $(appendDots)
    .find(`.${dotsClass}`)
    // There's a chance that the dots are hidden in the DOM, so make sure that
    // the dots are visible. In order to remove this, we would need to make
    // things such as modals either in script or template tags.
    .filter(':visible');

/**
 * Human readable mapping of key codes for keyboard support.
 * @type {Object}
 */
export const KEYS = {
  LEFT: 37,
  RIGHT: 39,
};

/**
 * Adds custom keyboard support to the slick image carousel.
 * When carousel is in focus, left/right arrow keys rotate the images.
 * @param {jQuery} $el - Carousel element
 */
const addKeyboardSupport = ($el) => {
  $el.on('keydown', ({ which }) => {
    const { LEFT, RIGHT } = KEYS;
    switch (which) {
      case LEFT:
        $el.slick('slickPrev');
        break;
      case RIGHT:
        $el.slick('slickNext');
        break;
      default:
        break;
    }
  });
};

/**
 * Applies custom accessibility to slick since there are people out there who
 * feel that slick does accessibility incorrectly yet recommend it? Yeah, I'm
 * confused. Anyways, the goal of this work will override any accessibility
 * defaults provided by slick so they meet the need of UX-3936.
 * @see SLICK_ACCESSIBLE_OPTIONS
 * @param {HTMLElement} el - Element getting slick carousel
 * @param {Object} options - Configurable options
 */
export default function slickAccessible(el, options = {}) {
  const opts = Object.assign({}, SLICK_ACCESSIBLE_OPTIONS, options);
  const $el = $(el);
  const slickInstance = $el.slick(opts);
  const $dots = findDots(opts);

  if ($dots.length) {
    resetDotsA11y($el, $dots, opts);
  }

  addKeyboardSupport($el);

  return slickInstance;
}

registerJqueryPlugin('slickAccessible', slickAccessible);
