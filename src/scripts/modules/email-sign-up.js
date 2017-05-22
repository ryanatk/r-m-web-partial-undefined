var $ = require('jquery');
var SELECTORS = {
  container: '#email_signup_form'
};
var CLASS_NAMES = {
  error: 'error'
};
var METHOD = 'GET';
var PATH = '/r/ajax/SignUpForNewsletter.jsp';

module.exports = emailSignUp;
$.extend(module.exports, {
  METHOD: METHOD,
  PATH: PATH,
  eventHandler: eventHandler,
  SELECTORS: SELECTORS,
  CLASS_NAMES: CLASS_NAMES
});

function emailSignUp() {
  var $emailForm = $(SELECTORS.container);
  var $emailInput = $emailForm.find("input");
  var email = $emailInput.val();
  var gender = $emailForm.data("gender");

  $emailInput.removeClass(CLASS_NAMES.error);

  if(email.indexOf("@") != -1){
    return $.get(PATH, {"email" : email, "gender": gender}, function(r) {
      var msg =  $.parseJSON(r);

      if(msg.success){
        $emailForm.find("span").eq(0).show();
        $emailForm.find("input").hide();
        $emailForm.find("span").eq(1).hide();
        window.open("/r/mobile/email/subscribe_landing_m.jsp?email="+email+"&homePage=true");
      }else{
        displayError($emailInput, msg.msg0)
      }
    });
  }else{
    displayError($emailInput, 'Invalid email. Please try again')
    return $.Deferred().reject(new Error('Invalid email'));
  }
}

function eventHandler(event) {
  event.preventDefault();
  emailSignUp();
}

function displayError($input, errorMsg) {
  $input
    .attr("placeholder", errorMsg)
    .addClass(CLASS_NAMES.error)
    .val("");
}
