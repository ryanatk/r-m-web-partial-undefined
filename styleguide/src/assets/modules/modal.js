/**
 * Handles all modals
 * @module modules/modal
 */

import $ from 'jquery';
import Keyboard from './keyboard';
import registerJQueryPlugin, { noopActions } from '../lib/register-jquery-plugin';
// import trapFocus from './trap-focus';

// Expose the function as a jQuery plugin for ease of use
export const PLUGIN_NAME = 'modal';
export const DEFAULTS = {
  url: '',
  type: '',
  open: null,
  cache: true,
  closeButton: true,
  overlayClose: true,
  triggerOpen: false,
  onComplete: () => {},
  onClose: () => {},
};

/**
 * Get Modal
 * Target modal via options.open / data-open(legacy) / href(accessibility)
 * @private
 * @param  {jQuery} $el - button /element that opens modal
 * @param  {Object} [options={}] - Any options provided upon initialization
 * @return {jQuery} modal element
 */
const getModal = ($el, options = {}) => {
  let $modal;
  if (options.open) {
    $modal = $(`#${options.open}`);
  } else if ($el.attr('href')) {
    $modal = $($el.attr('href'));
  } else if ($el.data('open')) {
    $modal = $(`#${$el.data('open')}`);
  }
  return $modal;
};
/**
 * Merges together all the options and the various conditions in which they
 * can be set.
 * @private
 * @param  {jQuery} $el - button /element that opens modal
 * @param  {Object} [options={}] - Any options provided upon initialization
 * @return {Object} Immutable version of the options
 */
const mergeOptions = ($el, options = {}) => {
  // Assign $modal to modal element either by options {} or $el's data attribute
  const $modal = getModal($el, options);
  const opts = Object.assign({}, DEFAULTS, $modal.data(), options);
  return opts;
};
/**
 * Check if options.url is define, if it is create an empty modal
 * for ajax content. Otherwise, assign with options.open or $el's data attribute
 * @private
 * @return {jQuery} modal element
 */
const appendModal = () => {
  const $modalHTML = $('<div/>', { class: 'modal' });
  $modalHTML.appendTo('body');
  return $modalHTML;
};
/**
 * Check if options.url is define, if it is create an empty modal
 * otherwise target options.open or $el's data attribute
 * @private
 * @param  {jQuery} $el - button /element that opens modal
 * @param  {Object} [options={}] - Any options provided upon initialization
 * @return {jQuery} modal element
 */
const setModal = ($el, options = {}) => {
  // Assign $modal to modal element either by options {} or $el's data attribute
  let $modal = getModal($el, options);
  // if options.url is define, prepend empty modal
  if (options.url) {
    $modal = appendModal();
  }
  $modal.appendTo('body');
  return $modal;
};

/**
 * @private
 * @return {jQuery} modal overlay element
 */
const appendModalOverlay = () => {
  if (!$('.modal-overlay').length) {
    $('<div class="modal-overlay"></div>').appendTo('body');
  }
  return $('.modal-overlay');
};
/**
 * Check if options.url is define, if it is create an empty modal
 * otherwise target options.open or $el's data attribute
 * @private
 * @param  {jQuery} $el - modal element
 * @return {jQuery} modal content element
 */
const wrapModalContent = ($el) => {
  if (!$el.find('.modal__content').length) {
    $el.wrapInner('<div role="dialog" tabindex="0" class="modal__content"></div>');
  }
  return $el.find('.modal__content');
};
/**
 * Adjust and set classes and options for appropriate modal type
 * @private
 * @param  {jQuery} $el - modal element
 * @param  {Object} [options={}] - Any options provided upon initialization
 * @return {Object} Immutable modal settings
 */
const adjustToModalType = ($el, options = {}) => {
  let typeAdjust = {
    pageScroll: false,
    overlay: true,
  };
  switch (options.type) {
    case 'full':
      $el.addClass('modal--full');
      break;
    case 'top':
      $el.addClass('modal--top');
      break;
    case 'notification':
      $el.addClass('modal--notification');
      typeAdjust = {
        pageScroll: true,
        overlay: false,
      };
      break;
    default:
  }
  return typeAdjust;
};
/**
 * Remove active class on elements
 * @private
 * @param  {rest}
 */
const removeActiveClass = (...args) => {
  args.forEach(($el) => {
    $el.removeClass('is-active');
  });
};
/**
 * Ensure one modal is open at a time
 * @param  {jQuery} $modal
 * @param  {jQuery} $overlay
 */
const closeAllModals = () => {
  removeActiveClass($('.modal-overlay'), $('.modal'));
};
/**
 * Add active class on elements
 * @private
 * @param  {rest}
 */
const addActiveClass = (...args) => {
  args.forEach(($el) => {
    $el.addClass('is-active');
  });
};
/**
 * Callback after css animation
 * @private
 * @param  {jQuery} $el - css animated element
 */
const afterAnimation = ($el, cb) => {
  const transitionDuration = $el.css('transition-duration').replace('s', '') * 1000;
  setTimeout(cb, transitionDuration);
};
/**
 * Return to last focusable element
 * @param  {jQuery} $modal
 * @param  {jQuery} $content
 */
const returnToLastFocus = ($content) => {
  Keyboard.releaseFocus($content, $(document).data('lastFocus'));
};
/**
 * Handles the click event to close the modal
 * @private
 * @param  {event} event
 * @param  {jQuery} $modal
 * @param  {jQuery} $content
 * @param  {jQuery} $overlay
 * @param  {Object} [typeAdjust={}] - Modal Settings define by modal type
 * @param  {Object} [options={}] - Any options provided upon initialization
 */
const closeModal = (event, $modal, $content, $overlay, typeAdjust, options = {}) => {
  if (event) {
    event.preventDefault();
  }
  if (typeAdjust.overlay) {
    removeActiveClass($overlay);
  }
  if (!typeAdjust.pageScroll) {
    $('body').css({ overflow: '' });
  }
  removeActiveClass($modal);
  afterAnimation($content, () => {
    options.onClose();
    if (!options.cache) {
      $content.empty();
    }
    returnToLastFocus($content);
  });
};
/**
 * Set timeout for notification modal
 * @private
 * @param  {jQuery} $modal
 * @param  {jQuery} $content
 * @param  {jQuery} $overlay
 * @param  {Object} [typeAdjust={}] - Modal Settings define by modal type
 */
const setNotificationDuration = ($modal, $content, $overlay, typeAdjust, options) => {
  // Set Timer base on number of words
  const numWords = $content.text().replace(/^[\s,.;]+/, '').replace(/[\s,.;]+$/, '').split(/[\s,.;]+/).length;
  const minDuration = 3000;
  let duration = numWords * 500;
  if (duration < minDuration) {
    duration = minDuration;
  }
  setTimeout(() => {
    closeModal(false, $modal, $content, $overlay, typeAdjust, options);
  }, duration);
};
/**
 * Add aria-labelledby to modal content for accessible
 * audible title that corresponds with modal's heading
 * @private
* @param  {jQuery} $content
 */
const addHedAria = ($content) => {
  const $modalHed = $($content.find('.modal__hed'));
  if ($modalHed.length && !$modalHed.attr('id')) {
    const modalHedID = `modal-hed-${Math.ceil(Math.random() * 10000000000)}`;
    $content.attr('aria-labelledby', modalHedID);
    $modalHed.attr('id', modalHedID);
    if (!$modalHed.is('h2')) {
      throw new Error(`Modal Heading: ${$modalHed.text()} is not an H2. Screen reader will not be able to navigate the page as efficiently without heading landmarks.`);
    }
  }
};
/**
 * Save last focus element that's not inside modal
 * @private
 * @param  {jQuery} $el - last focusable element
 */
const saveLastFocus = ($el) => {
  if (!$el.parents('.modal__content').length) {
    $(document).data('lastFocus', $el);
  }
};
/**
 * Give each <a> a unique href value, in order to avoid users hearing
 * "visited" on links they've yet to visit.
 * @private
* @param  {jQuery} $modal
 */
const uniqueCloseHref = ($modal) => {
  $modal.find('.js-modal-close').each(function eachCloseLink() {
    const $closeLink = $(this);
    if ($closeLink.is('a')) {
      $closeLink.attr('href', `#modal-uid-${Math.ceil(Math.random() * 10000000000)}`);
    } else {
      throw new Error('Modal close triggers should be anchors');
    }
  });
};
/**
 * Open modal
 * @private
 * @param  {jQuery} $el - button /element that opens modal
 * @param  {jQuery} $modal
 * @param  {jQuery} $content
 * @param  {jQuery} $overlay
 * @param  {Object} [typeAdjust={}] - Modal Settings define by modal type
 * @param  {Object} [options={}] - Any options provided upon initialization
 */
const openModal = ($el, $modal, $content, $overlay, typeAdjust, options = {}) => {
  addActiveClass($modal);
  addHedAria($content);
  saveLastFocus($el);
  uniqueCloseHref($modal);

  $content.scrollTop(0);

  if (typeAdjust.overlay) {
    addActiveClass($overlay);
  }
  if (!typeAdjust.pageScroll) {
    $('body').css({ overflow: 'hidden' });
  }
  if (options.type === 'notification') {
    setNotificationDuration($modal, $content, $overlay, typeAdjust, options);
  }

  options.onComplete();

  // Shift and trap focus to modal after animation
  afterAnimation($content, () => {
    Keyboard.trapFocus($content);
    $content.find('.modal__hed').focus();
  });
};
/**
 * Handles the click event when modal trigger/ button is clicked
 * @private
 * @param  {jQuery} $modal
 * @param  {jQuery} $content
 * @param  {jQuery} $overlay
 * @param  {Object} [typeAdjust={}] - Modal Settings define by modal type
 * @param  {Object} [options={}] - Any options provided upon initialization
 */
const openModalEventHandler = ($el, $modal, $content, $overlay, typeAdjust, options = {}) => {
  closeAllModals();
  // If url is passed then attempt to load ajax.
  if (options.url) {
    // Load ajax only if there's no content or cache is false.
    if (!$content.children().length || !options.cache) {
      $.ajax({
        method: 'POST',
        url: options.url,
      })
      .done((content) => {
        $content.append(content);
        openModal($el, $modal, $content, $overlay, typeAdjust, options);
      });
    // Content is already loaded and cache is true, open modal.
    } else {
      openModal($el, $modal, $content, $overlay, typeAdjust, options);
    }
  // Not dynamic, open inline modal instead.
  } else {
    openModal($el, $modal, $content, $overlay, typeAdjust, options);
  }
};
/**
 * @private
  * @param  {jQuery} evt - key event
  * @param  {jQuery} $modal
  * @param  {jQuery} $content
 */
const escapeModal = (evt, $content) => {
  if (Keyboard.parseKey(evt) === Keyboard.keys.ESCAPE) {
    closeAllModals();
    returnToLastFocus($content);
  }
};
/**
 * Applies any sort of event handlers for the modal.
 * @private
 * @param  {jQuery} $el - button /element that opens modal
 * @param  {jQuery} $modal
 * @param  {jQuery} $content
 * @param  {jQuery} $overlay
 * @param  {Object} [typeAdjust={}] - Modal Settings define by modal type
 * @param  {Object} [options={}] - Any options provided upon initialization
 */
const setEventListeners = ($el, $modal, $content, $overlay, typeAdjust, options = {}) => {
  // Add escape key down feature
  // Add listener to button to open modal
  if (!options.triggerOpen) {
    $($el)
      .on('click.modal', () => openModalEventHandler($el, $modal, $content, $overlay, typeAdjust, options));
  }
  $content
    // To ensure the event isn't get bound multiple times
    .off('keydown.modalEscape')
    // escape event to close modal
    .on('keydown.modalEscape', evt => escapeModal(evt, $content)).data('modalEscape', true)
    // to ensure the event isn't get bound multiple times
    .off('click.modal')
    // Add listener modal content for modalCloseClass to close modal
    .on('click.modal', '.js-modal-close', evt => closeModal(evt, $modal, $content, $overlay, typeAdjust, options))
    // Stop the clicks from bubbling up
    .on('click.modal', evt => evt.stopPropagation());

  if (options.overlayClose) {
    $modal
      // to ensure the event isn't get bound multiple times
      .off('click')
      // Add listener to outside of the modal if set true
      .on('click.modal', evt => closeModal(evt, $modal, $content, $overlay, typeAdjust, options));
  }
};
/**
 * Remove any sort of event handlers for the modal.
 * @private
 * @param  {jQuery} $el - button /element that opens modal
 * @param  {jQuery} $modal
 * @param  {jQuery} $content
 */
const removeEventListeners = ($el, $modal, $content) => {
  $el.off('click.modal');
  $content
  .off('click.modal')
  .off('keydown.modalEscape');
  $modal.off('click.modal');
};
/**
 * If triggerOpen option is set true open modal
 * @private
 * @param  {jQuery} $modal
 * @param  {jQuery} $content
 * @param  {jQuery} $overlay
 * @param  {Object} [typeAdjust={}] - Modal Settings define by modal type
 * @param  {Object} [options={}] - Any options provided upon initialization
 */
const checkTriggerOpen = ($el, $modal, $content, $overlay, typeAdjust, options = {}) => {
  if (options.triggerOpen) {
    // CSS Animation fix Timeout is set to give plugin a chance to initialize
    setTimeout(() => {
      openModalEventHandler($el, $modal, $content, $overlay, typeAdjust, options);
    }, 1000);
  }
};
/**
 * @private
 * @param  {jQuery} $el - modal element
 * @param  {rest}
 */
const removeModalTypeClasses = ($el) => {
  $el
    .removeClass('modal--top')
    .removeClass('modal--full')
    .removeClass('modal--notification');
};
/**
 * @param  {jQuery} $el - button /element that opens modal
 * @param  {jQuery} $modal
 * @param  {jQuery} $content
 * @param  {jQuery} $overlay
 * @param  {Object} [typeAdjust={}] - Modal Settings define by modal type
 * @param  {Object} [options={}] - Any options provided upon initialization
 * @param  {Function} deregister - teardown method from register jquery plugin;
*/
const destroy = ($el, $modal, $content, $overlay, typeAdjust, options = {}, deregister) => {
  removeEventListeners($el, $modal, $content);
  removeActiveClass($('.modal-overlay'), $('.modal'));
  removeModalTypeClasses($modal);
  deregister();
  $('body').css({ overflow: '' });
};
/* Add Close Button to modal
 * @private
 * @param  {jQuery} $content
 * @param  {Object} [options={}] - Any options provided upon initialization
 */
const addCloseButton = ($content, options = {}) => {
  if (options.closeButton
    && !$content.find('.modal__close').length
  && options.type !== 'notification') {
    $content.append(`
      <a href="#" class="btn btn--circle btn--white js-modal-close modal__close">
        <span class="icon icon--x-icon">
          <svg focusable="false" aria-hidden="true">
            <use xlink:href="#icon-x-icon"></use>
          </svg>
          <div class="u-screen-reader">Close Modal</div>
        </span>
      </a>
    `);
  }
};
/**
 * Initializes modal.
 * @param {HTMLElement} el - button /element that opens modal
 * @param {Object} options - Options used for wiring up the modal
 * @param {Object} deregister - Performs a deregisteration on the plugin
 * @see DEFAULTS
 */
export default function modal(el, options = {}, { deregister } = noopActions) {
  const $el = $(el);
  const opts = mergeOptions($el, options);
  const $modal = setModal($el, opts);
  const $overlay = appendModalOverlay();
  const $content = wrapModalContent($modal);
  const typeAdjust = adjustToModalType($modal, opts);

  addCloseButton($content, opts);
  setEventListeners($el, $modal, $content, $overlay, typeAdjust, opts);
  checkTriggerOpen($el, $modal, $content, $overlay, typeAdjust, opts);

  return {
    close: () => closeAllModals(),
    destroy: () => destroy($el, $modal, $content, $overlay, typeAdjust, opts, deregister),
  };
}

/**
 * Utility Function for Modal
 * @param  {Object} [options={}] - Any options provided upon initialization
 */
$.modal = (options) => {
  $('<div/>').modal(options);
};

registerJQueryPlugin(PLUGIN_NAME, modal);
