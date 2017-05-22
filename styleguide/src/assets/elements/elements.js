import $ from 'jquery';

import './elements.scss';
import './toggle-favorite';
import './fields/validator';
import './fields/character-counter';
import './fields/radio-group-validator';

import './fields/floating-label-plugin';

$(document).ready(() => {
  $('.favorite-button').toggleFavorite();

  $(document.querySelectorAll('[data-validate]')).validator();
  $(document.getElementsByClassName('character-counter-field')).characterCounter();
  $(document.getElementsByClassName('validate-radio-group')).radioGroupValidator({
    errorClassName: 'form-section__error',
  });

  $(document.getElementsByClassName('floating-label')).floatingLabel();
});

