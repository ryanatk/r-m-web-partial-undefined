/**
 * Applies page options set by URL Parameters
 * @module applyParams
 */

import getTemplate from './get-template'

/**
 * Parse URL parameters, then apply chosen option(s)
 * @param {String} id - id of the handlebars partial
 * @param {Function} callback - function to run when applying params
 */
export default function applyParams( id, callback ) {
  const params = splitParams(document.location.search);

  if (params[id] && typeof callback === 'function') {
    callback({
      id: id,
      html: getTemplate(id),
      value: params[id],
    });
  }
}

/**
 * Parse URL parameters
 * @param {String} str - String containing selected options (or default to '?')
 * @return {Object} Parameters object
 */
const splitParams = ( str = '?' ) => {
  const params = str.substr(1).split('&');
  let obj = {};

  params.forEach( param => {
    const [ key, value = true ] = param.split('=');

    obj[key] = value;
  })

  return obj;
}
