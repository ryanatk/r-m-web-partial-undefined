import $ from 'jquery';

import './base.scss';
import './load-image';

$(document).ready(() => {
  $('body').attr('ontouchstart', '');
});

$(window).load(() => {
  $('img').loadImage();
});
