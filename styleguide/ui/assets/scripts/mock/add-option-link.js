/**
 * Add a link to the 'page options' section
 * @module addOptionLink
 */

const MOCK_PAGE_OPTIONS = document.getElementById('mock-page-options');

/**
 * Create & append link
 * @param {String} title - the link's text to display
 * @param {String} params - ampersand-delimited GET parameters used to apply options
 *       likely to correspond with id's of the handlebars partials
 */
export default function addOptionLink( title, params, list = MOCK_PAGE_OPTIONS ) {
  const li = document.createElement('li');

  li.innerHTML = `<a href="?${params}">${title}</a>`;
  list.appendChild(li);
}
