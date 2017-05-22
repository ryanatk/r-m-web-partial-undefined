/**
 * Functionality specifically related to PDP
 * @module pdp
 */

import $ from 'jquery'

import addOption from './add-option-link'
import applyParams from './apply-params'
// TODO: make this work: import url from '../../../../src/data/url.json';

/**
 * List of functions to run for page setup
 */
export default function pdp() {
  // add option links to mock page footer
  addOption('No Reviews', 'no-reviews');
  addOption('Wedding Badge', 'badges.wedding');
  addOption('Product Badge', 'badges.product');
  addOption('Out of Stock', 'product-options.out-of-stock');
  addOption('Out of Stock: On Sale', 'product-options.out-of-stock&on-sale');
  addOption('One Color', 'product-options.one-color');
  addOption('One Size', 'product-options.one-size');
  addOption('One Size: Preorder', 'product-options.one-size&preorder');
  addOption('One Size: On Sale', 'product-options.one-size&on-sale');
  addOption('All Sizes Preorder', 'preorder');
  addOption('All Sizes On Sale', 'on-sale');
  addOption('All Sizes In Stock', 'in-stock');
  addOption('All Sizes In Stock & On Sale', 'in-stock&on-sale');

  // apply new templates
  // runs the appropriate callback fn based on matching url parameters
  applyParams('badges.wedding', addBadge);
  applyParams('badges.product', addBadge);
  applyParams('product-options.out-of-stock', updateSize);
  applyParams('product-options.one-color', updateColor);
  applyParams('product-options.one-size', updateSize);

  // apply variations to those new templates
  applyParams('no-reviews', updateToNoReviews);
  applyParams('on-sale', updateToOnSale);
  applyParams('in-stock', updateToInStock);
  applyParams('preorder', updateToPreorder);

  // apply mock hacks
  changeColorValues();
  muteLinks(document.getElementsByClassName('product-recs__link'));
}

/**
 * This is a mock page, and other product pages don't exist, so this hack...
 */
const muteLinks = links => {
  const uri = document.location.href;
  let i = links.length;

  while (i--) {
    links[i].setAttribute('href', uri);
  }
};

/**
 * This is a mock page, and other color pages don't exist, so this hack...
 */
const changeColorValues = () => {
  const select = document.getElementById('color');
  const options = select.getElementsByTagName('option');
  let len = options.length;

  while (len--) {
    const opt = options[len];
    opt.setAttribute('data-href-original', opt.getAttribute('data-href'));
    opt.setAttribute('data-href', document.location.href);
  }
};

/**
 * Callback to update Reviews for a product with no reviews
 */
function updateToNoReviews( opt ) {
  const div = document.getElementById('reviews');

  // remove stars and qty of reviews
  div.removeChild(div.querySelector('span[itemprop="ratingCount"]'));
  div.removeChild(div.querySelector('section.star-rating'));

  // update link
  const link = div.querySelector('a.link');
  // TODO: make this work: link.href = '{{url.write-review}}';
  link.href = './write-review.html';
  link.innerHTML = 'Be the first to review this product!';
}

/**
 * Callback to add badge template to product images when option is selected
 */
function addBadge( opt ) {
  const target = document.querySelector('.product__badge');

  // add badge
  target.innerHTML = opt.html;
}

/**
 * Callback to upate color dropdown, based on selected option
 */
function updateColor( opt ) {
  updateProductOption('color', opt.html);
}

/**
 * Callback to upate size dropdown, based on selected option
 */
function updateSize( opt ) {
  updateProductOption('size', opt.html);
}

/**
 * Callback to upate price to sale
 */
function updateToOnSale( opt ) {
  const el = document.getElementById('size');
  const options = el.options;
  // if it's a select, get the first option, otherwise use el
  const shown = options ? options[0] : el;

  const price = shown.getAttribute('data-price') || shown.getAttribute('data-regular-price');
  const regularPrice = parseFloat(price) + 10 + '';

  // update price to sale
  shown.setAttribute('data-price', price);
  shown.setAttribute('data-regular-price', regularPrice);
}

/**
 * Helper function to update size & color product options
 */
function updateProductOption( element, template ) {
  var option = document.getElementsByClassName('product__' + element)[0];

  // replace the existing product option
  option.outerHTML = template;
}

/**
 * Callback to upate all sizes to "in stock"
 */
function updateToInStock() {
  updateSizes(size => {
    if (size.text)
      size.text = size.text.replace(' (Out of Stock)', '');
    size.removeAttribute('disabled');
    size.removeAttribute('data-oos');
  });
}

/**
 * Callback to upate all sizes to "preorder"
 */
function updateToPreorder() {
  updateSizes(size => {
    size.setAttribute('data-preorder', 'true');
  });
}

/**
 * Helper function to update all sizes (or single size) with callback
 */
function updateSizes(callback) {
  const el = document.getElementById('size');
  const options = el.options || [ el ];
  let len = options.length;

  while (len--) {
    callback(options[len]);
  }
}
