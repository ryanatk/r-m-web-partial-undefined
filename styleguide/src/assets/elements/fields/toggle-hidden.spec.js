import $ from 'jquery';
import chai, { expect } from 'chai';
import chaiJquery from 'chai-jquery';

import input from '../../../partials/input-text.html';
import toggleHidden, { DEFAULT_OPTIONS } from './toggle-hidden';

chai.use(chaiJquery);

describe('Toggle Hidden', () => {
  const { fieldClassName, hiddenModifier } = DEFAULT_OPTIONS;
  const hiddenClassName = `${fieldClassName}--${hiddenModifier}`;
  const ELEMENT_ID = 'email';
  let $form;
  let $field;
  let $inputElement;

  beforeEach(() => {
    $form = $(fixture.set(`
      <form>
        ${input({ id: ELEMENT_ID, label: 'email', fieldClassName })}
      </form>
    `));
    $inputElement = $form.find(`#${ELEMENT_ID}`);
    $field = $inputElement.closest('.field');
  });

  afterEach(() => fixture.cleanup());

  it('should find a field wrapper', () => {
    expect($field).to.have.length.above(0);
  });

  describe('When form element should be hidden', () => {
    const shouldHide = true;

    it('should disable the form element', () => {
      toggleHidden($field, shouldHide);
      expect($inputElement).to.be.disabled;
    });

    it('should hide the field wrapper', () => {
      toggleHidden($field, shouldHide);
      expect($field).to.have.class(hiddenClassName);
    });
  });

  describe('When form element should be visible', () => {
    const shouldHide = false;

    it('should not disable the form element', () => {
      toggleHidden($field, shouldHide);
      expect($inputElement).not.to.be.disabled;
    });

    it('should not hide the field wrapper', () => {
      toggleHidden($field, shouldHide);
      expect($field).to.not.have.class(hiddenClassName);
    });
  });
});
