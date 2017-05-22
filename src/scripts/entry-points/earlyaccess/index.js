var $ = require('jquery');
var heartProduct = require('modules/heart-product');


function filterSetup() {
  // Event for clicking on overlay on title dropdown
  var $pageHeaderOverlay = $(".js-page-header-overlay");
  var $pageHeaderTitle =$(".page-header__title");


  $pageHeaderOverlay.on("click", function() {
    $pageHeaderTitle.click();
  });
}

var manageRefineMenu = require('./manage-refine-menu');
//var initSearch = require('./search-results');  //this tracking should only be on search result page
var initColorSwatches = require('./plpswatches');
var initMyFavorites = require('./my-favorite');
// var toggleCategoryDropdown = require('./toggle-category-dropdown');
// var loadBrands = require('modules/load-brands');

// function setupToggleCategoryDropdown() {
//   toggleCategoryDropdown();
// }

// function resetFilters() {
//   var $filterSelects = $('#filter_options').find('.select_single select, .select_multiple select');

//   $('#clear_filters').click(function(event) {
//     event.preventDefault();
//     $filterSelects.prop('selectedIndex', 0);
//   });
// }

// function processSorting() {
//   var $formSort = $('#sort_by_form');
//   var $filterApply = $('#apply_filters');
//   $('#sort_options').change(function(){
//     $formSort.submit();
//     $filterApply.click();
//   });
// }

// function bindBrandsURl() {
//   $('#apply_filters, #next_btn').on('click', function(e) {
//     loadBrands(e.currentTarget);
//   });

//   $('#plp_filter_dd').on('click', 'a', function(e) {
//     loadBrands(e.target);
//   });
// }

function bindHeartItems() {
  heartProduct('#pageItems', '.fav-item');
}

function closeLimitLightBox(elemId) {
    $('#' + elemId).removeClass('u-block');
}
function closeLimitLightBox2(elemId) {
    $('#'+elemId).hide();
}
function clearOldFavItems() {
    $.ajax({
        type: 'GET',
        url: '/r/ajaxHeartProduct.jsp?action_T=clearolditems',
        success: function () {
            location.reload();
        }
    });
}

$(document).ready(function() {
  filterSetup();
  manageRefineMenu();
  bindHeartItems();
  initColorSwatches();
  initMyFavorites();

  window.closeLimitLightBox = closeLimitLightBox;
  window.clearOldFavItems = clearOldFavItems;
  //initSearch();

    // setupToggleCategoryDropdown();
    // resetFilters();
    // processSorting();
    // bindBrandsURl();
    if ($('#early-access-modal').length) {
        $.modal({
            open: "early-access-modal",
            overlayClose: false
        });
    }

    $('#loyalty-password').keypress(function(e){
        var key = e.which;
        if (key == 13){
            optIn();
        }
    });
    $('#loyalty-terms').prop('checked', true);

    $('#loyalty-terms').click(function(){
        if (!$('#loyalty-terms').is(':checked')) {
            markErrorOptIn();
        } else {
            unMarkErrorOptIn();
        }
    });
    $('#shoppingbutton').click(function(){
        closeLimitLightBox2('early-access-modal');
    });
    $('#joinnowbutton').click(function(){
        optIn();
    });
});
function optIn(){
    if (!$('#loyalty-terms').is(':checked')) {
        return;
    }

    var data = $.param({
        email: $('#loyalty-email').val(),
        pw: $('#loyalty-password').val(),
        origin: window.location.pathname + window.location.search

    });
    $.ajax({
        url: '/content/loyalty-club/opt-in',
        data: data,
        type: 'POST',
        dataType: 'json',
        success: function(rtn){
            if (rtn.success){
                window.location = rtn.redirect;
            } else {
                var errorClasses = 'is-error';
                $('#loyalty-email-field').addClass(errorClasses);
                $('#loyalty-password-field').addClass(errorClasses);
            }
        }
    });
}

function markErrorOptIn(){
    $('#loyalty-terms').addClass('is-error');
    $('#loyalty-terms-label').addClass('link--error u-color--error');
    $('#loyalty-opt-in-error').slideDown();
}

function unMarkErrorOptIn(){
    $('#loyalty-terms').removeClass('is-error');
    $('#loyalty-terms-label').removeClass('link--error u-color--error')
    $('#loyalty-opt-in-error').slideUp();
}

