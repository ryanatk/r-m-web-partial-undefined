var $ = require('jquery');
// var Search = require('./search');
var toggleVisibility = require('modules/toggle-visibility');
var headerLogout = require('./header-logout');
require('modules/toggle-display');
var search = require('modules/search');
// var clearSearchCookies = require('./clear-search-cookies');
// var SiteMenu = require('modules/site-menu');
require('modules/page-constrain');

function toggleDisplay() {
  $('.js-toggle-display').toggleDisplay();
}

function categoryNav() {
    var $pageHeaderOverlay = $(".js-page-header-categories-overlay");
    var $pageHeaderTitle =$("#nav-categories");


    $pageHeaderOverlay.on("click", function() {
      $pageHeaderTitle.click();
    });
}

function clickToLogoutFromHeader() {
  headerLogout('#js-header-logout');
}

function toggleRevolveMenu() {
  $('#tr-burger-icon').on('click', function(e) {
    e.preventDefault();
    toggleVisibility('js-top-navigation');
  });
}

// function clearSearchCookiesFromHeader() {
//   clearSearchCookies('#mens-homepage-search-button');
// }

function initSearch() {
    $('#tr_top_search_btn, #js-site-search-close').on('click', function(e) {
      e.preventDefault();
      toggleVisibility('js-site-search'); 
    });
    $(".js-site-search__textbox").removeClass('site-search__textbox--preload');
    search.init();
  // return new Search('#search_term');
}

// function initMobileMenu() {
//   var siteMenuContainerEl = document.getElementById('site-menu-container');
//   if (siteMenuContainerEl) {
//     return new SiteMenu(
//       siteMenuContainerEl,
//       document.getElementById('logo_drop_down_mhp'),
//       document.getElementById('site-menu')
//     );
//   } else {
//     console.error('no #site-menu-container could be found');
//   }
// }

$(document).ready(function() {
  clickToLogoutFromHeader();
  initSearch();
  toggleRevolveMenu();
  toggleDisplay();
  categoryNav();
  // clearSearchCookiesFromHeader();
  // initMobileMenu();
});
