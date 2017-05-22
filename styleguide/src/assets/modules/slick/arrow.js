import { BLOCK_NAME } from '../image-carousel';

/**
 * Creates optional next/previous arrow buttons for slick carousel.
 * @param {string} element - BEM element name within image-carousel
 * @param {string} title - Title text and aria-label for svg icon
 * @param {string} svg - File name of the svg
 * @return {string} - HTML for button element
 */
export default function slickArrow(element, title, svg) {
  return `
    <button type="button" class="${BLOCK_NAME}__${element}">
      <span class="icon icon--sm icon--${svg}" aria-label="${title}">
        <svg>
          <title>${title}</title>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-${svg}"></use>
        </svg>
      </span>
    </button>
  `;
}
