import $ from 'jquery';
import isUndefined from 'lodash/isUndefined';
import slickArrow from './slick/arrow';
import './slick-accessible';
import registerJQueryPlugin from '../lib/register-jquery-plugin';

export const BLOCK_NAME = 'image-carousel';

/**
 * Wires up slick slider and provides hooks such that the internal can talk to
 * external functionality.
 */
export default class ImageCarousel {
  /**
   * @constructor
   * @param {HTMLElement|string} el - Element (or a selector) containing the slider
   * @param {Object} options - Any additional options based along to the slider
   */
  constructor(el, options = {}) {
    const $el = $(el);
    const {
      nextArrowTitle,
      previousArrowTitle,
    } = $el.data();

    this.num = 0;
    this.$el = $el.slickAccessible(Object.assign({
      lazyLoad: 'progressive',
      dots: true,
      dotsClass: `${BLOCK_NAME}__dots`,
      appendDots: el,
      infinite: false,
      nextArrow: slickArrow('next', nextArrowTitle, 'arrow-right--thin'),
      prevArrow: slickArrow('previous', previousArrowTitle, 'arrow-left--thin'),
    }, options));
  }

  /**
   * Sets the active slider number for later use.
   * @param {number} currentNum - The number of the active slide
   */
  setSlideNumber(currentNum) {
    this.num = currentNum;
  }

  /**
   * Transitions or goes to the slide number based on the current state.
   */
  transitionSlide() {
    if (!isUndefined(this.num)) {
      this.$el.slick('slickGoTo', this.num, true);
    }
  }
}

registerJQueryPlugin('imageCarousel', (el, opts) => new ImageCarousel(el, opts));
