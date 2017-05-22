/**
 * Functionality specifically related to Bag
 * @module bag
 */

import $ from 'jquery';
import '../../../../src/assets/modules/modal';

import addOption from './add-option-link';
import applyParams from './apply-params';

/**
 * Update bag summary to show "preorder" summary
 */
const showPreorderSummary = (opt) => {
  const target = document.querySelector('.bag__summary');

  // update summary
  target.innerHTML = opt.html;
};

/**
 * Show "auto remove" modal on page load
 */
const showAutoRemoveModal = () => {
  $.modal({
    open: 'auto-remove-modal',
    triggerOpen: true,
  });
};

/**
 * List of functions to run for page setup
 */
export default function bag() {
  // add option links to mock page footer
  addOption('Preorder Summary', 'bag-summary-preorder');
  addOption('Auto Remove Modal', 'auto-remove');

  // apply new templates
  applyParams('bag-summary-preorder', showPreorderSummary);
  applyParams('auto-remove', showAutoRemoveModal);

  // apply variations to those templates

  // apply mock hacks
}
