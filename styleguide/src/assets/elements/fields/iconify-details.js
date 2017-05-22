/**
 * Responsible for using the details behavior within a floating label.
 * @module elements/fields/iconifyDetails
 */
import modal from '../../modules/modal';
import setup, { VISIBLE_CLASS_NAME } from './iconify-setup';

export { VISIBLE_CLASS_NAME };

/**
 * Contains the list of icons associated with a more details iconify floating
 * label.
 * @type {Object}
 */
export const iconList = [
  { name: 'details', iconId: 'details' },
];

/**
 * Defines configurable options
 * @type {Object}
 */
const DEFAULT_MORE_DETAILS = {
  modal,
};

/**
 * Responsible for showing a more details icons within a floating element. Once
 * the icon has been interacted with, it will show a modal. This is different
 * than an iconify-behaviors as this work doesn't need to hook into the
 * floating label events cycle, but rather utilizes the same setup, therefore
 * allowing us to reuse things such as setting up icons and the applicable
 * elements used in a floating label.
 *
 * To configure this work, make sure the following data attributes have been
 * provided:
 *
 * - data-iconify-more-details: contains the title for the icon used for i18n
 *   and accessibility
 * - data-open: an ID to a modal
 *
 * Since this work will leverage the modal, any modal related data attributes
 * can be applied here. Here's an example in HTML to wire this dude up:
 *
 * @example
 * <div
 *     class="floating-label"
 *     data-iconify-more-details="More Details"
 *     data-open="modal-example">
 *   <label for="the-dude" class="floating-label__label">The Dude</label>
 *   <input id="the-dude" class="floating-label__input">
 * </div>
 *
 * <div id="modal-example" class="modal u-center" data-type="default-modal">
 *   <p>modal content goes here</p>
 * </div>
 *
 * @param {Object} options - Configurable options
 * @returns {Function} Initialization of iconify more details
 */
const iconifyMoreDetails = (options = {}) => (...nodes) => {
  const opts = Object.assign({}, DEFAULT_MORE_DETAILS, options);
  const { modal: modalFunc } = opts;
  const { floatingLabel, iconNodes } = setup(iconList, nodes, opts);
  if (!iconNodes) {
    return;
  }

  const { details: detailsIcon } = iconNodes;
  detailsIcon.classList.add(VISIBLE_CLASS_NAME);
  detailsIcon.addEventListener('click', () => {
    modalFunc(floatingLabel, {
      triggerOpen: true,
    });
  });
};

export default iconifyMoreDetails;

