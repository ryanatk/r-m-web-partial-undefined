/**
 * Helper to determine which mock page's javascript to run, and then execute
 * @module runPage
 */

import pdp from './pdp'
import notifyMe from './notify-me'
import bag from './bag'

// Object to hold all the imported pages (above)
const page = {
  bag,
  pdp,
  notifyMe,
}

/**
 * Run the appropriate mock page's javascript, based on page name
 * @param {String} name - page name, set within the mock page html options
 */
export default function runPage(name) {
  if (page[name])
    page[name]();
}
