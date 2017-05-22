var $ = require('jquery');
require('slick-carousel');

// function setupLineSlideshow() {
//     var slideshow = $('#js-line-slideshow');
//     //slideshow.removeClass('slick-slideshow--js-trigger');
//     slideshow.slick();
// }

function setupLineSlider() {
  var slider = $('#js-welcome__line-slideshow');
  slider.slick({
    arrows: false,
    dots: true,
    centerMode: true,
    centerPadding: '12%',
    infinite: false,
    mobileFirst: true,
    autoplay: false,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slide: 'div'
  });
}

$(document).ready(function() {
  setupLineSlider();
});
