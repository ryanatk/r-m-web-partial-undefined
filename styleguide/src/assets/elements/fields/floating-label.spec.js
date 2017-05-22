import $ from 'jquery';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { create } from '../../test/factories/floating-label';
import floatingLabel, { EVENTS } from './floating-label';
import { triggerEvent } from '../../test/helpers/events';

chai.use(sinonChai);

describe('Floating Label', () => {
  const { FOCUS, BLUR, INVALID, LOAD } = EVENTS;

  const setup = (run, formAttrs = {}) => {
    const listenerSpy = sinon.spy();
    const callerSpy = sinon.spy(() => listenerSpy);
    const {
      $input,
      nodes,
      removeListeners,
      teardown,
    } = create([callerSpy], {}, {}, formAttrs);

    run({ $input, nodes, callerSpy, listenerSpy, removeListeners });
    listenerSpy.reset();
    callerSpy.reset();
    teardown();
  };

  it('should pass along nodes when initially calling a caller', () => {
    setup(({ nodes, callerSpy }) => {
      expect(callerSpy).to.have.been.calledWith(...nodes);
    });
  });

  it('should throw an error when no label has been provided', () => {
    const $el = $('<div class="dude"><input class="dude__input"></div>');

    expect(() => {
      floatingLabel($el[0], {
        block: 'dude',
        fieldElements: ['input'],
      });
    }).to.throw(Error);

    $el.off();
  });

  it('should throw an error more than one element is in a CONTAINER', () => {
    const $el = $(`<div class="dude">
      <label class="dude__label">Dude</label>
      <input class="dude__input">
      <textarea class="dude__textarea"></textarea>
    </div>`);

    expect(() => {
      floatingLabel($el[0], {
        block: 'dude',
        fieldElements: ['input', 'textarea'],
      });
    }).to.throw(Error);

    $el.off();
  });

  it('should throw an error when no form fields are found', () => {
    const $el = $('<div class="dude"></div>');

    expect(() => {
      floatingLabel($el[0], {
        block: 'dude',
        fieldElements: ['input'],
      });
    }).to.throw(Error);

    $el.off();
  });

  it('should listen for a load event, which will happen immediately', () => {
    setup(({ listenerSpy }) => {
      expect(listenerSpy).to.have.been.calledWith(LOAD, sinon.match({ type: LOAD }));
    });
  });

  it('should listen for a focus event', () => {
    setup(({ listenerSpy, $input }) => {
      triggerEvent($input, FOCUS);
      expect(listenerSpy).to.be.calledWith(FOCUS, sinon.match({ target: $input[0] }));
    });
  });

  it('should listen for a blur event', () => {
    setup(({ listenerSpy, $input }) => {
      triggerEvent($input, FOCUS, BLUR);
      expect(listenerSpy).to.be.calledWith(BLUR, sinon.match({ target: $input[0] }));
    });
  });

  it('should listen for an invalid event', () => {
    setup(({ listenerSpy, $input }) => {
      triggerEvent($input, INVALID);
      expect(listenerSpy).to.be.calledWith(INVALID, sinon.match({ target: $input[0] }));
    });
  });

  it('should send along validateOnlyOnSubmit when setting up a listener', () => {
    const attr = 'validateOnlyOnSubmit';
    const formAttrs = { [attr]: true };

    setup(({ listenerSpy, $input }) => {
      triggerEvent($input, FOCUS);
      expect(listenerSpy).to.have.been.calledWith(
        FOCUS,
        sinon.match.any,
        sinon.match.has(attr, formAttrs[attr]),
      );
    }, formAttrs);
  });

  it('should not send along validateOnlyOnSubmit when setting up a listener', () => {
    setup(({ listenerSpy, $input }) => {
      triggerEvent($input, FOCUS);
      expect(listenerSpy).to.have.been.calledWith(
        FOCUS,
        sinon.match.any,
        sinon.match.has('validateOnlyOnSubmit', false),
      );
    });
  });

  it('should remove all listened to events', () => {
    setup(({ listenerSpy, $input, removeListeners }) => {
      removeListeners();
      triggerEvent($input, FOCUS);
      // for the load event
      expect(listenerSpy).to.have.been.calledOnce;
      // make sure that the focus event wasn't fired off
      expect(listenerSpy).to.have.not.been.calledTwice;
    });
  });
});
