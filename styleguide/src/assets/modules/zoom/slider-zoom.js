/**
 * Responsible for creating a slider zoom or in other words a carousel where the
 * images in the carousel can be interacted with so that they can be zoomed in
 * @module modules/zoom/sliderZoom
 */
import $ from 'jquery';
import 'slick-carousel';
import $script from 'scriptjs';

import customPaging from '../slick/custom-paging';
import { get } from '../../lib/props';
import DialogFunc from '../dialog/dialog';
import imageZoom from './image-zoom';
import './slider-zoom.scss';

const HAMMERJS_FALLBACK = 'https://ajax.googleapis.com/ajax/libs/hammerjs/2.0.8/hammer.min.js';

/**
 * Makes a request for HammerJS.
 * @private
 * @return {Promise} Denotes when the request has been successfully executed
 */
const loadHammerJSFunc = () =>
  new Promise((resolve) => {
    $script(get('scripts.hammerJS', HAMMERJS_FALLBACK), () => {
      resolve(window.Hammer);
    });
  });

/**
 * Defines the options which can be provided for the image zoom.
 * @type {Object}
 */
const DEFAULTS = {
  Dialog: DialogFunc,
  loadHammerJS: loadHammerJSFunc,
  startingIndex: 0,
  speed: 300,
  slideFunc: num => num,
  menuRender: () => '',
  didRender: () => {},
  beforeUnmount: () => {},
  didUnmount: () => {},
  didSlideTransition: (prev, current) => ({ prev, current }),
  noImages: '',
};

/**
 * Defines the id for the close element.
 * @type {String}
 */
export const CLOSE_ID = 'close-zoom-menu';

/**
 * Defines the id for the zoom slider.
 * @type {String}
 */
export const ZOOM_SLIDER_ID = 'zoom-slider';

/**
 * Defines the content className
 * @type {String}
 */
export const CONTENT_CLASSNAME = 'zoom-slider__content';

/**
 * Binds an event to the close element
 * @private
 * @param  {Function} callback - The event handler for the close element
 */
const bindClose = (callback) => {
  $(document.getElementById(CLOSE_ID)).on('click', callback);
};

/**
 * Closes the dialog.
 * @private
 * @param  {Dialog} dialog - Instance of a dialog
 * @param  {Function} didUnmount - Called once the dialog has closed
 */
const closeDialog = (dialog, beforeUnmount, didUnmount) => {
  beforeUnmount();
  dialog.remove().then(() => {
    didUnmount();
  });
};

/**
 * Stupid helper that concats the element id based on an id for a slide.
 * @private
 * @param  {string} id - The id of the slide being requested
 * @return {string} - A slide id
 */
const getSlideId = id => `zoom-slider__item-${id}`;

/**
 * Obtains a slide or image basd on the id provided in the template.
 * @private
 * @param  {number} id - The id of the slide being requested
 * @return {HTMLElement} An element representing a slide or image
 */
const getSlide = id => document.getElementById(getSlideId(id));

/**
 * Executes in the future the close callback. The callback is responsible for
 * clean up to ensure nothing is left in memory.
 * @private
 * @param  {jQuery} $zoomSlider
 * @param  {Hammer} hammer - An instance of Hammer from hammerjs
 * @param  {Dialog} dialog - An instance of a dialog
 * @param  {Function} didUnmount - Used to denote when closed
 * @return {Function} Callback function used for the event
 */
const teardownFull = ($zoomSlider, hammer, dialog, beforeUnmount, didUnmount) => () => {
  hammer.destroy();
  dialog.$el.on('remove', () => $zoomSlider.slick('unslick'));
  // TODO: Find out the preferred interaction.
  // dialog.remove();
  // didUnmount();
  closeDialog(dialog, beforeUnmount, didUnmount);
};

/**
 * Simple rendering when no images are found.
 * @private
 * @param  {String} noImages - Text indicating no images were found
 * @return {string} Template containing content around no visible images
 */
const renderNoImages = ({ noImages }) => `
  <p class="${CONTENT_CLASSNAME}">${noImages}</p>
`;

/**
 * Template containing what is to be rendered in the dialog.
 * @private
 * @param  {array} images - A list of images
 * @param  {Function} [menuRender=() => ''] - Used for additional rendering
 * @return {String} A fully rendered template as a string
 */
const renderDialog = ({ images, noImages, menuRender = () => '' }) => `
    <div id="zoom-menu" class="zoom-menu">
      <span class="zoom-menu__extra">${menuRender()}</span>
      <button id="${CLOSE_ID}" class="zoom-menu__close">
        <span class="icon icon--md icon--x-icon u-color--grey-light">
          <svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-x-icon"></use></svg>
        </span>
      </button>
    </div>
    <ul id="${ZOOM_SLIDER_ID}" class="zoom-slider">
      ${images.length
        ?
        images.map((image, i) =>
          `<li><img src="${image}" class="zoom-slider__item" id="${getSlideId(i)}"></li>`,
        ).join('')
        :
        renderNoImages({ noImages })
      }
    </ul>
  `;

/**
 * Merges or concats options to be passed along to slick.
 * @private
 * @param  {Object} [options={}] - Options sent along to slick
 * @return {Object} A mergingin of options for slick
 */
const mergeSliderOptions = (options = {}) =>
  Object.assign({
    arrows: false,
    dots: true,
    infinite: false,
    slidesToShow: 1,
    appendDots: '#zoom-menu',
    dotsClass: 'slider-dots__menu image-carousel__dots',
    slide: 'li',
    customPaging,
  }, options);

/**
 * Responsible for rendering a slider zoom. More specifically, it will create
 * a dialog/modal such that n number of images are used for creating a slider.
 * On top of that, each image will have the ability for pinch/zoom/moving
 * around an image such that the image can be examined by the end user.
 * @see DEFAULTS
 * @param {array} images - A list of images used for the slider and zooming
 * @param {Object} options - Additional hooks to interact with the slider zoom
 * @return {Promise} Denotes when the slier zoom has been fully rendered
 */
export default function sliderZoom(images, options = {}) {
  const {
    startingIndex,
    speed,
    slideFunc,
    menuRender,
    didRender,
    beforeUnmount,
    didUnmount,
    loadHammerJS,
    didSlideTransition,
    noImages,
    Dialog,
  } = Object.assign({}, DEFAULTS, options);
  const dialog = new Dialog();

  return loadHammerJS().then((Hammer) => {
    const output = renderDialog({ images, menuRender, noImages });
    dialog.render(output);

    didRender();

    if (!images.length) {
      bindClose(() => closeDialog(dialog, beforeUnmount, didUnmount));
      return;
    }

    slideFunc(startingIndex);

    const $zoomSlider = $(document.getElementById(ZOOM_SLIDER_ID));
    let currentSliderItem = getSlide(startingIndex);
    let hammerInstance = imageZoom(Hammer, currentSliderItem);
    let currentNum = startingIndex;
    let previous;

    $zoomSlider
      .slick(mergeSliderOptions({
        speed,
        initialSlide: startingIndex,
      }))
      .on('afterChange', (evt, slide, currentSlide) => {
        // when at the beginning or end, do not reset zooming
        if (currentNum === currentSlide) {
          return;
        }

        currentNum = currentSlide;
        slideFunc(currentNum);
        previous = currentSliderItem;
        hammerInstance.destroy();

        currentSliderItem = getSlide(currentNum);
        hammerInstance = imageZoom(Hammer, currentSliderItem);

        // use a setTimeout instead of the afterChange event since it'll
        // provide to long of a delay between swipe change when the image
        // has been zoomed in too much, yeah, a whole lot of edge cases
        // happening here.
        setTimeout(() => {
          /* eslint-disable no-param-reassign */
          previous.style.transform = 'none';
          /* eslint-enable no-param-reassign */
          didSlideTransition(previous, currentSliderItem);
        }, speed);
      });

    bindClose(teardownFull($zoomSlider, hammerInstance, dialog, beforeUnmount, didUnmount));
  });
}
