import $ from 'jquery';

/**
 * Defines the className of the dot button
 * @type {string}
 */
export const DOT_CLASS = 'image-carousel__dot-button';

/**
 * Allows us to customize the "dot buttons"
 * @param {jQuery} $slides - slick slides (from slick)
 * @param {number} i - iterator, used to select current slide from $slides
 * @see DEFAULT_OPTIONS
 * @return {jQuery} "dot button"
 */
export default function customPaging({ $slides }, i) {
  // try to get the slide's id to use in the link's href
  const id = $slides[i].id || '';
  const $a = $(`<a href="#${id}" class="${DOT_CLASS}" data-role="none">Image ${i + 1}</a>`);

  return $a.on('click', e => e.preventDefault());
}
