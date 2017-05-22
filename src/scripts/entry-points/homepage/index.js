var $ = require('jquery');
var toggleVisibility = require('modules/toggle-visibility');
var revolveMePopup = require('modules/revolve-me-popup');
var lazyload = require('modules/lazyload');


// var smartBanner = require('modules/smart-banner');
// var tellapart = require('tracking/tellapart');
// var tabMenu = require('./tab-menu');
require('slick-carousel');

// function selectNavTab() {
//   var $container = $('#mens-homepage-bottom-nav');
//   tabMenu($container.find('.occ_box'), $container.find('.occ_tab a'));
// }

// function executeTellapart() {
//   var config = window.rcProps && window.rcProps.tellapart;
//   if (config) {
//     tellapart.homepage(config.boutiqueId, config.browserId);
//   }
// }

function toggleFeaturedShopsMenu() {
  $('#js-featured-menu-button').on('click', function(e) {
    e.preventDefault();
    $(this).toggleClass('is-active');
    toggleVisibility('featured-shops-list');
  });
}

function setupHomeSlideshow() {
    var slideshow = $('#js-homepage-slideshow');
    slideshow.removeClass('slick-slideshow--js-trigger');
    slideshow.slick({
    arrows: false,
    dots: true,
    infinite: true,
    mobileFirst: true,
    autoplay: false,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slide: 'div',
    lazyLoad: 'ondemand'
  });
}

function setupLazyLoad() {
  lazyload({
      slideshowSettings: {
        arrows: false,
        infinite: true,
        mobileFirst: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        lazyLoad: 'ondemand'
      }
  });
  
  
}

$(document).ready(function() {
  setupHomeSlideshow();
  // smartBanner();
  toggleFeaturedShopsMenu();
  revolveMePopup();
  // selectNavTab();
  // executeTellapart();
  
  setupLazyLoad();
});
