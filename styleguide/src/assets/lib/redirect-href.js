/**
 * Redirects user to new page when selecting an option with data attribute
 * @module lib/redirectHref
 */

export const DATA_ATTR = 'data-href';

const DEFAULT_OPTIONS = {
  redirectFunc: (href) => {
    document.location.href = href;
  },
};

/**
 * Function to redirect user based on data attribute.
 * @param {HTMLElement} el - The selected option
 */
export default function redirectHref(el, options = {}) {
  const { redirectFunc } = Object.assign({}, DEFAULT_OPTIONS, options);
  const href = el.getAttribute(DATA_ATTR);

  if (href) {
    redirectFunc(href);
  }
}
