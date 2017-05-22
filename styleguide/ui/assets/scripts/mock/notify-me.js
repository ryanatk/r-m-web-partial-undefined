/**
 * Functionality specifically related to PDP
 * @module notify-me
 */

import $ from 'jquery'

import addOption from './add-option-link'
import applyParams from './apply-params'

/**
 * List of functions to run for page setup
 */
export default function notifyMe() {
  const page = getPage();

  // add option links to mock page footer
  addOption('One Size', 'product-options.one-size');
  if (page === 'special-order.html') {
    addOption('Special Order Unavailable', 'product-options.one-size&unavailable');
    addOption('Automatically Place Order', 'auto-order');
  }

  // apply new templates
  applyParams('product-options.one-size', updateSize);

  // apply variations to those templates
  applyParams('unavailable', updateToUnavailable);
  applyParams('auto-order', updateToAutoOrder);

  // apply mock hacks
  setupSizes();
}

/**
 * Make assumptions about what sizes are in dropdown based on what page we on
 * That's because you can only get to each page based on certain sizes being available
 * So here we update the sizes based on the page
 */
const setupSizes = () => {
  const $sizeEls = $('.notify-me').find('.product__size select, .product__size input');
  let len = $sizeEls.length;

  while (len--) {
    const el = $sizeEls[len];
    const chosen = el.options ? el.options[0] : el;
    chosen.setAttribute('data-oos', 'true');
  }
};

/**
 * Helper function to get the page we're on
 */
const getPage = () => document.location.pathname.replace(/\/.*site\//,'');

/**
 * Callback to upate size dropdown, based on selected option
 */
function updateToUnavailable() {
  const $sizeEls = $('.notify-me').find('.product__size select, .product__size input');
  let len = $sizeEls.length;

  while (len--) {
    const el = $sizeEls[len];
    const chosen = el.options ? el.options[0] : el;
    chosen.setAttribute('data-unavailable', 'true');
  }
}

/**
 * Callback to add auto order checkbox, based on selected option
 */
function updateToAutoOrder() {
  $('.notify-me')
    .find('.product__size')
    .after(`
    	<div class="field">
    		<input id="auto-order" class="form__checkbox" type="checkbox">
    		<label for="auto-order">If Available, Automatically Place Order</label>
    	</div>
    `)
    ;
}

/**
 * Callback to upate size dropdown, based on selected option
 */
function updateSize( opt ) {
  var el = document.getElementsByClassName('product__size')[0];

  // replace the existing product option
  el.outerHTML = opt.html;
}
