import $ from 'jquery';
import chai, { expect } from 'chai';
import chaiJquery from 'chai-jquery';
import kebabCase from 'lodash/kebabCase';

import inputGroup from './radio-group-validator';

chai.use(chaiJquery);

describe('Input Group', () => {
  const setupTest = (options = {}) => {
    const { data = {}, titleClassName = 'bowling' } = options;
    const errorClassName = 'maude';
    const errorMessage = 'Am I the only one who gives a **** about the rules?!';
    const dataAttrs = Object
      .keys(data)
      .map(name => `data-${kebabCase(name)}=${data[name]}`)
      .join(' ');

    const $form = $(fixture.set(`
      <form data-radio-group-error-message="${errorMessage}" ${dataAttrs}>
        <h1 class="${titleClassName}">Some title</h1>
        <input type="radio" name="characters" value="dude" required>
        <input type="radio" name="characters" value="walter" required>
        <input type="radio" name="characters" value="donny" required>
      </form>
    `));

    const $title = $form.find(`.${titleClassName}`);

    inputGroup($form[0], Object.assign({
      errorClassName,
    }, options));

    return { $form, $title, errorClassName, errorMessage };
  };

  const triggerValidity = (checked, $form) => {
    const $input = $form.find('input');
    $input.prop('checked', checked);
    const evt = new Event('change');
    $input[0].dispatchEvent(evt);
    $input[0].checkValidity();
  };

  afterEach(() => fixture.cleanup());

  it('should show an error message and then remove it', () => {
    const { $form, errorClassName, errorMessage } = setupTest({
      errorPosition: 'afterbegin',
    });

    triggerValidity(false, $form);
    expect($form.find(':first-child')).to.have.class(errorClassName);
    expect($form.find(`.${errorClassName}`)).to.have.text(errorMessage);

    triggerValidity(true, $form);
    expect($form.find(`.${errorClassName}`)).to.have.lengthOf(0);
  });

  it('should show an error message before the title', () => {
    const titleClassName = 'bunny';
    const { $form, $title, errorClassName } = setupTest({
      titleClassName,
      data: {
        radioGroupInsertErrorBefore: `.${titleClassName}`,
      },
    });

    triggerValidity(false, $form);
    expect($title.prev()).to.have.class(errorClassName);
  });

  it('should show an error message after the title', () => {
    const titleClassName = 'bunny';
    const { $form, $title, errorClassName } = setupTest({
      titleClassName,
      data: {
        radioGroupInsertErrorAfter: `.${titleClassName}`,
      },
    });

    triggerValidity(false, $form);
    expect($title.next()).to.have.class(errorClassName);
  });
});
