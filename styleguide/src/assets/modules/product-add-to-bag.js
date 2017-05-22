/**
 * Click event attached to product form to show confirmation
 * @module modules/addToBag
 */

import $ from 'jquery';

import registerJQueryPlugin from '../lib/register-jquery-plugin';
import modal from './modal';
import { PRODUCT_BLOCK, SIZE_BLOCK_ELEMENT } from '../lib/constants/pdp';
import createProductData, { updateChosenData } from '../lib/create-product-data';
import updatePrice from './product-price-update';

/**
 * Confirmation modal's default `id` attribute
 */
export const MODAL_ID = 'product-added-confirmation';

/**
 * Function to open the modal, using the modal module
 * @private
 * @param {HTMLElement} el - element the handler is attached to
 * @param {String} open - id of the modal id to be opened
 */
const openModal = (el, open) => modal(el, { open, triggerOpen: true });

/**
 * Function to update the modal's content
 * @private
 * @param {HTMLElement} btn - button that was clicked
 */
const updateModal = (form, open) => {
  const dropdown = $(form).find(`.${SIZE_BLOCK_ELEMENT} select`)[0];
  const data = createProductData(dropdown);

  // make sure modal element exists
  const modalEl = document.getElementById(open);

  if (!modalEl) {
    throw new Error('Modal element does not exist (addToBag)');
  }

  // create modalData to point at modal
  const wrap = $(modalEl).find(`.${PRODUCT_BLOCK}`);
  const modalData = Object.assign({}, data, { wrap });

  const { options, selectedIndex } = dropdown;
  updateChosenData(modalData, options[selectedIndex]);

  // expect price to update in modal
  updatePrice(modalData);
};

/**
 * Adds 'submit' listener to parent 'form'.
 * @private
 * @param {HTMLElement} el - The element the modal is attached to
 * @param {String} open - modal id
 * @param {Function} updateFunc - function to update the modal contents
 * @param {Function} openFunc - function to open the modal
 */
const clickHandler = (el, { modalId: open, updateModal: updateFunc, openModal: openFunc }) => {
  updateFunc(el, open);
  openFunc(el, open);
};

/**
 * @namespace
 * @property {String} modalId - id of the modal to use
 * @property {Function} clickHandler - fires when the button is clicked
 * @property {Function} updateModal - the function to update the modal contents
 * @property {Function} openModal - the function fired to show the modal
 */
const DEFAULT_OPTIONS = {
  modalId: MODAL_ID,
  clickHandler,
  updateModal,
  openModal,
};

/**
 * Initializes color dropdown changes.
 * @param {HTMLElement} el - The form we're attaching to
 * @see DEFAULT_OPTIONS
 */
export default function addToBag(el, options = {}) {
  const $el = $(el);
  const opts = Object.assign({}, DEFAULT_OPTIONS, options, $el.data());
  const { clickHandler: clickFunc } = opts;

  $el.on('submit', (e) => {
    e.preventDefault();
    clickFunc(el, opts);
  });
}

registerJQueryPlugin('addToBag', addToBag);
