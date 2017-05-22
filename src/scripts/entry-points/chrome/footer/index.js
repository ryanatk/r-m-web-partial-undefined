var $ = require('jquery');
var smartBanner = require('modules/smart-banner');
var emailSignUpHandler = require('modules/email-sign-up');
require('./fixed-corner');
/// var googleRemarketing = require('tracking/google-remarketing');
// var criteo = require('tracking/criteo');
// var pageTracking = require('tracking/page-tracking');
// require('tracking/google-analytics');


function emailSignUp() {
  $('#email_signup_form').on('submit', emailSignUpHandler.eventHandler);
  $('#email-signup-target').on('click', emailSignUpHandler.eventHandler);
}

// function executeGoogleRemarketing() {
//   googleRemarketing();
// }

// function executeCriteo() {
//   criteo.init('m');
// }

// function executePageTracking() {
//   return pageTracking();
// }

$(document).ready(function() {
  smartBanner({
    title: 'REVOLVEClothing',
    author: 'Eminent, Inc.',
    appendToSelector : '#home',
    icon : '//is4.revolveassets.com/r/i/logo-mobile.png'
  });
  emailSignUp();
  // executeGoogleRemarketing();
  // executeCriteo();
  // executePageTracking();
});
