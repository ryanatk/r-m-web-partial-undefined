var $ = require('jquery');
// require('vendor/jquery.dotdotdot.min');

function scrollToTop(){
  $('body,html').animate({
    scrollTop: 0
  }, 'fast');
}

module.exports = function() {
  $('#js-revolve-me-carousel').on('click', 'button', function(e) {
    e.preventDefault();
    var id = e.currentTarget.getAttribute('data-revolveme-id');

    $('.js-revolve-me-popup-content').load('/r/mobile/SocialEntry.jsp?id='+id+'&showImg=true&from=hp', function() {
      $(".js-page-content").hide();
      $(".js-revolve-me-popup").show();
      // $('#caption_'+id).dotdotdot();
      scrollToTop();
    });
  });

  $('.close-revolveme-popup').on('click', function(e) {
    e.preventDefault();
    $(".js-revolve-me-popup").hide();
    $(".js-page-content").show();
    $("window").resize();
  });
};
