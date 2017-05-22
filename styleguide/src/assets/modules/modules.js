import $ from 'jquery';

import './modules.scss';
import './accordion';
import './back-button';
import './toggle-display';
import './truncate';
import './product-size-change';
import './product-add-to-bag';
import './product-color-change';
import './product-oos';
import './product-zoom';
import ImageCarousel from './image-carousel';
import './ui-tabs';
import './rating-scale/rating-scale';
import updateNotifyMe from './notify-me-update';
import './modal';
import './submit-modal';
import './track-video';
import './vanish/vanish';

// Jon to move into its own module and follow standards
$.fn.navDropdowns = function navDropdowns() {
  function toggleDropdown($el) {
    $el.find('ul').slideToggle('slow');
  }

  // Iterate and reformat each matched element.
  return this.each(function reformat() {
    $(this).on('click', function setupToggle() {
      toggleDropdown($(this));
    });
  });
};


$(document).ready(() => {
  $('#js-nav-dropdown').navDropdowns();
  $('#js-nav-dropdown--full').navDropdowns();
  $('.js-accordion').accordion();
  $('.ui-tabs').tabs();
  $('.js-toggle-display').toggleDisplay();
  $('.js-modal').modal();
  $('.js-track-video').trackVideo();
  $('.submit-modal').submitModal();
  $('[data-truncate]').truncate();
  $('.back-button').backButton();

  const $product = $('.product');
  $product.find('.product__size select, .product__size input').sizeChange().trigger('change');
  $product.find('.product__color select').colorChange();
  $product
    .find('form')
    .filter('[data-open="product-added-confirmation"]')
    .addToBag();
  $product.find('.product-oos').oosProduct();

  // Image Carousels
  const IMAGE_CAROUSEL_SELECTOR = '.image-carousel';
  const PRODUCT_ZOOM_SELECTOR = `${IMAGE_CAROUSEL_SELECTOR}--product-zoom`;
  const $imageCarousel = $(IMAGE_CAROUSEL_SELECTOR);

  $imageCarousel
    .filter(`:not(${PRODUCT_ZOOM_SELECTOR})`)
    .imageCarousel();

  $imageCarousel
    .filter(PRODUCT_ZOOM_SELECTOR)
    .each(function setupZoomCarousel() {
      const carousel = new ImageCarousel(this);
      $(this).productZoom({
        slideFunc: carousel.setSlideNumber.bind(carousel),
        beforeUnmount: carousel.transitionSlide.bind(carousel),
        targetSelector: 'img',
      });
    });

  const notifyMeClass = 'notify-me';

  $(`.${notifyMeClass}`).find('.product__size select, .product__size input')
    .sizeChange({ wrapBlockClass: notifyMeClass, update: updateNotifyMe })
    .trigger('change');

  $(document.getElementsByClassName('rating-scale')).ratingScale({
    titleSelector: '.form-section__title',
  });

  $(document.getElementsByClassName('vanish')).vanish();
});
