import $ from 'jquery';

/**
 * Javascript overrides for Revolve Style Guide
 */

const preventFormSubmission = ($form) => {
  $form.on('submit', e => e.preventDefault());
};

$(document).ready(() => {
  preventFormSubmission($(document.getElementsByClassName('form-no-submit')));
});
