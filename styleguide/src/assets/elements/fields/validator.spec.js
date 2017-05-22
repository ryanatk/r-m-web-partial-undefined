import $ from 'jquery';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import { createDataAttrsFromObj } from '../../lib/test-helpers';
import validator, { VALIDATE_TRIGGER, EVENTS } from './validator';
import { triggerEvent } from '../../test/helpers/events';

chai.use(sinonChai);

describe('Validator', () => {
  let sandbox;
  const { INVALID_SCROLL_POSITION: positionEvent } = EVENTS;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
    fixture.cleanup();
  });

  const setupSimpleForm = (formAttrs = {}) => {
    const $form = $(fixture.set(`
      <form ${createDataAttrsFromObj(formAttrs)}>
        <input id="character" type="text" required>
        <input id="quote" type="text" data-validate-not-empty="true">
        <span ${VALIDATE_TRIGGER}="true" id="click-trigger">Click Trigger</span>
        <button type="submit">Submit</button>
      </form>
    `));

    const $required = $form.find('[required]');
    const $notEmpty = $form.find('[data-validate-not-empty]');
    const $clickTrigger = $form.find('#click-trigger');
    const successCallback = sandbox.spy();
    const errorCallback = sandbox.spy();
    const scrollTrigger = sandbox.spy();
    const useCustomFormErrorScroll = sandbox.spy();
    validator($form[0], {
      successCallback,
      errorCallback,
      scrollTrigger,
      useCustomFormErrorScroll,
    });

    return {
      $form,
      $required,
      $notEmpty,
      $clickTrigger,
      successCallback,
      errorCallback,
      scrollTrigger,
      useCustomFormErrorScroll,
    };
  };

  describe('when performing a form submission', () => {
    it('should produce a valid form submission', () => {
      const { $form, $required, $notEmpty, successCallback, errorCallback } = setupSimpleForm();

      $required.val('Walter');
      $notEmpty.val('I don\'t roll on shabbos');
      $form
        .on('submit', () => false)
        .trigger('submit');

      expect(errorCallback).to.not.have.been.called;
      expect(successCallback).to.have.been.calledWith([$notEmpty[0]]);
    });

    it('should produce an invalid form submission', () => {
      const { $form, $required, $notEmpty, successCallback, errorCallback } = setupSimpleForm();
      $form
        .on('submit', () => false)
        .trigger('submit');

      expect(successCallback).to.not.have.been.called;
      expect(errorCallback).to.have.been.calledWith([$required[0], $notEmpty[0]]);
    });

    it('should ignore hidden fields, producing a valid form submission', () => {
      const { $form, $required, $notEmpty, successCallback, errorCallback } = setupSimpleForm();

      $required.hide();
      $notEmpty.hide();
      $form
        .on('submit', () => false)
        .trigger('submit');

      expect(errorCallback).to.not.have.been.called;
      expect(successCallback).to.have.been.calledWith([$notEmpty[0]]);
    });
  });

  describe('when performing a click trigger submission', () => {
    it('should perform a valid click trigger', () => {
      const {
        $required,
        $notEmpty,
        $clickTrigger,
        successCallback,
        errorCallback,
      } = setupSimpleForm();

      $required.val('Donny');
      $notEmpty.val('He peed on the Dude\'s rug');
      $clickTrigger.trigger('click');

      expect(errorCallback).to.not.have.been.called;
      expect(successCallback).to.have.been.calledWith([$notEmpty[0]]);
    });

    it('should perform an invalid click trigger', () => {
      const {
        $required,
        $notEmpty,
        $clickTrigger,
        successCallback,
        errorCallback,
      } = setupSimpleForm();

      $clickTrigger.trigger('click');

      expect(successCallback).to.not.have.been.called;
      expect(errorCallback).to.have.been.calledWith([$required[0], $notEmpty[0]]);
    });

    it('should be invalid and then valid a mixture of built in and custom', () => {
      const {
        $required,
        $notEmpty,
        $clickTrigger,
        successCallback,
        errorCallback,
      } = setupSimpleForm();

      $clickTrigger.trigger('click');
      expect(errorCallback).to.have.been.calledWith([$required[0], $notEmpty[0]]);

      $required.val('Walter');
      $clickTrigger.trigger('click');
      expect(errorCallback).to.have.been.calledWith([$notEmpty[0]]);

      $notEmpty.val('You\'re out of your element!');
      $clickTrigger.trigger('click');

      expect(errorCallback).to.have.been.calledTwice;
      expect(successCallback).to.have.been.calledWith([$notEmpty[0]]);
    });
  });

  describe('when setting scroll position from being invalid', () => {
    const resetInput = ($input, overrides = {}) =>
      $input.css(Object.assign({
        position: 'absolute',
        height: '10px',
        fontSize: '10px',
      }, overrides));

    const resetBody = () =>
      $(document.body).css({
        position: 'absolute',
        top: 0,
      });

    it('should scroll to the first element', () => {
      const expectedTop = 100;
      const { $required, $notEmpty, $clickTrigger, scrollTrigger } = setupSimpleForm();
      resetBody();
      resetInput($required, { top: expectedTop });
      resetInput($notEmpty, { top: '200px' });

      $clickTrigger.trigger('click');

      expect(scrollTrigger).to.have.been.calledWith(0, expectedTop);
    });

    it('should scroll to the second element', () => {
      const expectedTop = 200;
      const { $required, $notEmpty, $clickTrigger, scrollTrigger } = setupSimpleForm();
      resetBody();
      resetInput($required, { top: '100px' })
        .val('things');

      resetInput($notEmpty, { top: expectedTop });

      $clickTrigger.trigger('click');

      expect(scrollTrigger).to.have.been.calledWith(0, expectedTop);
    });

    it('should set the second element when the first element fails', () => {
      const expectedTop = 200;
      const { $required, $notEmpty: $expected, $clickTrigger, scrollTrigger } = setupSimpleForm();

      resetBody();
      resetInput($required, { top: '100px' })
        .on(positionEvent, ({ detail: { setElement } }) => {
          setElement($expected[0]);
        });

      resetInput($expected, { top: expectedTop });

      $clickTrigger.trigger('click');

      expect(scrollTrigger).to.have.been.calledWith(0, expectedTop);
    });

    it('should set a custom position when the first element fails', () => {
      const { $required, $notEmpty, $clickTrigger, scrollTrigger } = setupSimpleForm();
      const expectedY = 1500;
      resetInput($required, { top: '100px' })
        .on(positionEvent, ({ detail: { setPosition } }) => {
          setPosition(expectedY);
        });

      resetInput($notEmpty, { top: '200px' });

      $clickTrigger.trigger('click');

      expect(scrollTrigger).to.have.been.calledWith(0, expectedY);
    });

    it('should set a custom position with no adjustments when the first element fails', () => {
      const { $required, $notEmpty, $clickTrigger, scrollTrigger } = setupSimpleForm();
      const expectedY = 1500;
      resetInput($required, { top: '100px' })
        .on(positionEvent, ({ detail: { setRawPosition } }) => {
          setRawPosition(expectedY);
        });

      resetInput($notEmpty, { top: '200px' });

      $clickTrigger.trigger('click');

      expect(scrollTrigger).to.have.been.calledWith(0, expectedY);
    });

    it('should call on a custom form error scroll', () => {
      const {
        $form,
        $clickTrigger,
        scrollTrigger,
        useCustomFormErrorScroll,
      } = setupSimpleForm();
      $clickTrigger.trigger('click');

      expect(useCustomFormErrorScroll).to.have.been.calledWith(
        sinon.match($form),
        scrollTrigger,
      );
    });
  });

  describe('when doing a blur on a form element', () => {
    it('should be valid when a not-empty element has been filled in', () => {
      const { $required, $notEmpty } = setupSimpleForm();

      $required.val('The Dude');
      $notEmpty
        .val('Donny')
        .trigger('focus')
        .trigger('blur');

      expect($notEmpty.is(':invalid')).to.be.false;
    });

    it('should be invalid when a not-empty element has been filled in and then cleared', () => {
      const { $required, $notEmpty, $clickTrigger } = setupSimpleForm();

      $required.val('The Dude');
      triggerEvent($notEmpty, 'focus', 'blur');

      expect($notEmpty.is(':invalid')).to.be.true;
      $clickTrigger.trigger('click');

      $notEmpty.val('he peed on the dude\'s rug');

      triggerEvent($notEmpty, 'focus', 'blur');

      expect($required.is(':invalid')).to.be.false;

      $notEmpty.val('');

      triggerEvent($notEmpty, 'focus', 'blur');

      expect($notEmpty.is(':invalid')).to.be.true;
    });
  });

  describe('when validating a not empty validator', () => {
    const setupNotEmpty = () => {
      const $form = $(fixture.set(`
        <div>
          <input id="drink" type="text" data-validate-not-empty="true" placeholder="What's your drink?">
          <span ${VALIDATE_TRIGGER}="true" id="click-trigger">Click Trigger</span>
        </div>
      `));

      const $drink = $form.find('#drink');
      const $clickTrigger = $form.find('#click-trigger');
      validator($form[0]);
      return { $drink, $clickTrigger };
    };

    it('should error when the value is empty', () => {
      const { $drink, $clickTrigger } = setupNotEmpty();
      $clickTrigger.trigger('click');
      expect($drink.is(':invalid')).to.be.true;
    });

    it('should submit when value is not empty', () => {
      const { $drink, $clickTrigger } = setupNotEmpty();
      $drink.val('white russian');
      $clickTrigger.trigger('click');
      expect($drink.is(':invalid')).to.be.false;
    });

    it('should submit when input is hidden', () => {
      const { $drink, $clickTrigger } = setupNotEmpty();
      $drink.hide();
      $clickTrigger.trigger('click');
      expect($drink.is(':invalid')).to.be.false;
    });
  });

  describe('when validating a not validator', () => {
    const setupNot = () => {
      const notValue = 'tub';
      const $form = $(fixture.set(`
        <div>
          <label for="dude">He peed on the dude's:</label>
          <input id="dude" name="dude" type="text" data-validate-not="${notValue}">
          <span ${VALIDATE_TRIGGER}="true" id="click-trigger">Click Trigger</span>
        </div>
      `));

      const $dude = $form.find('#dude');
      const $clickTrigger = $form.find('#click-trigger');
      validator($form[0]);
      return { $dude, $clickTrigger, notValue };
    };

    it('should error when a field value is the provided value', () => {
      const { notValue, $dude, $clickTrigger } = setupNot();
      $dude.val(notValue);
      $clickTrigger.trigger('click');
      expect($dude.is(':invalid')).to.be.true;
    });

    it('should submit when a value is not the provided value', () => {
      const { $dude, $clickTrigger } = setupNot();
      $dude.val('rug');
      $clickTrigger.trigger('click');
      expect($dude.is(':invalid')).to.be.false;
    });

    it('should submit when the input is hidden', () => {
      const { $dude, $clickTrigger } = setupNot();
      $dude.hide();
      $clickTrigger.trigger('click');
      expect($dude.is(':invalid')).to.be.false;
    });
  });

  describe('when validating against a select', () => {
    const setupSelect = () => {
      const notValue = 'donny';
      const $form = $(fixture.set(`
        <div>
          <label for="donny">Donny says:</label>
          <select id="donny" data-validate-not="${notValue}">
            <option value="${notValue}">${notValue}</option>
            <option value="1">I am the walrus</option>
            <option value="2">Are these the Nazis, Walter?</option>
          </select>
          <span ${VALIDATE_TRIGGER}="true" id="click-trigger">Click Trigger</span>
        </div>
      `));

      const $donny = $form.find('#donny');
      validator($form[0]);
      return { $donny, notValue };
    };

    // This is in place because jQuery sucks
    const triggerChange = ($el, val) => {
      $el.val(val);
      const evt = new Event('change');
      $el[0].dispatchEvent(evt);
    };

    it('should be an invalid select', () => {
      const { $donny, notValue } = setupSelect();
      triggerChange($donny, notValue);
      expect($donny.is(':invalid')).to.be.true;
    });

    it('should be a valid select', () => {
      const { $donny } = setupSelect();
      triggerChange($donny, 1);
      expect($donny.is(':invalid')).to.be.false;
    });

    it('should be invalid and then valid', () => {
      const { $donny, notValue } = setupSelect();
      triggerChange($donny, notValue);
      expect($donny.is(':invalid')).to.be.true;

      triggerChange($donny, 2);
      expect($donny.is(':invalid')).to.be.false;
    });
  });

  describe('when validating an email', () => {
    const setupEmail = () => {
      const $form = $(fixture.set(`
        <div>
          <label for="dude">He peed on the dude's:</label>
          <input id="dude" name="dude" type="text" data-validate-email="true" placeholder="Enter an email">
          <span ${VALIDATE_TRIGGER}="true" id="click-trigger">Click Trigger</span>
        </div>
      `));

      const $dude = $form.find('#dude');
      const $clickTrigger = $form.find('#click-trigger');
      validator($form[0]);
      return { $dude, $clickTrigger };
    };

    it('should be valid when no input value has been provided', () => {
      const { $dude, $clickTrigger } = setupEmail();
      $dude.val('');
      $clickTrigger.trigger('click');
      expect($dude.is(':invalid')).to.be.false;
    });

    it('should be invalid when the minimum requirements have not been met', () => {
      const { $dude, $clickTrigger } = setupEmail();
      const inputs = ['name', 'name@', 'name@something'];
      inputs.forEach((input) => {
        $dude.val(input);
        $clickTrigger.trigger('click');
        expect($dude.is(':invalid')).to.be.true;
      });
    });

    it('should meet the basic requirement of name@something.co to be valid', () => {
      const { $dude, $clickTrigger } = setupEmail();
      $dude.val('name@something.co');
      $clickTrigger.trigger('click');
      expect($dude.is(':invalid')).to.be.false;
    });
  });

  describe('with a validate only on submit', () => {
    it('should not do validation when changing except on submission', () => {
      const { $notEmpty, $clickTrigger } = setupSimpleForm({ validateOnlyOnSubmit: true });
      $notEmpty
        .val('Donny')
        .trigger('focus')
        .trigger('blur')
        .val('')
        .trigger('focus')
        .trigger('blur');

      expect($notEmpty.is(':invalid')).to.be.false;
      $clickTrigger.trigger('click');
      expect($notEmpty.is(':invalid')).to.be.true;
    });
  });
});
