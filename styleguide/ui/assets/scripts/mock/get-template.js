/**
 * Gets HTML template from the page
 * @module getTemplate
 */

/**
 * Find template and return the HTML
 * @param {String} id - id of the template (correlates to the handlebars partial)
 * @return {HTML} innerHTML of template
 */
export default function getTemplate(id) {
  const el = document.getElementById(id);

  if (el)
    return el.innerHTML;
  else
    return null;
}
