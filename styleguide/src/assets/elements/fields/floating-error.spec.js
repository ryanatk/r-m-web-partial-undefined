import $ from 'jquery';
import chai, { expect } from 'chai';
import chaiJquery from 'chai-jquery';
import { create } from '../../test/factories/floating-label';
import floatingError, {
  FOCUS,
  BLUR,
  INVALID,
  CONTAINER,
  INVALID_SCROLL_POSITION,
} from './floating-error';

chai.use(chaiJquery);

describe('Floating Error', () => {
  const setup = (run, formAttrs = {}) => {
    const floatingErrorOptions = {
      floatingErrorMessage: 'duuuuuuuuuuuude, not cool!',
      floatingErrorContainerClassName: 'custom-floating-label-error',
      floatingErrorElement: 'p',
      floatingErrorClassName: 'some-error',
    };
    const caller = floatingError(floatingErrorOptions);
    const createOptions = {
      required: true,
      attrs: 'pattern="https?://.+"',
    };
    const { $input, nodes, trigger, teardown } = create([caller], createOptions, {}, formAttrs);
    const $error = $(fixture.el).find(`.${floatingErrorOptions.floatingErrorClassName}`);
    const [{ node: container }] = nodes.filter(({ type }) => type === CONTAINER);
    const $container = $(container);
    run({ $input, $error, $container, floatingErrorOptions, nodes, trigger, teardown });
    teardown();
  };

  const assertError = (className, containerClassName) => {
    const $fixture = $(fixture.el);
    expect($fixture.find(`.${className}`)).to.have.lengthOf(1);
    expect($fixture.find(`.${containerClassName}`)).to.have.lengthOf(1);
  };

  const assertValid = (className, containerClassName) => {
    const $fixture = $(fixture.el);
    expect($fixture.find(`.${className}`)).to.have.lengthOf(0);
    expect($fixture.find(`.${containerClassName}`)).to.have.lengthOf(0);
  };

  it('should show an error when initially loading', () => {
    setup(({ $error, $container, floatingErrorOptions }) => {
      const {
        floatingErrorContainerClassName: containerClassName,
        floatingErrorElement: errorElement,
        floatingErrorClassName: className,
        floatingErrorMessage: message,
      } = floatingErrorOptions;
      expect($error).to.have.lengthOf(1);
      expect($error).to.have.class(className);
      expect($error).to.have.text(message);
      expect($error).to.have.prop('tagName', errorElement.toUpperCase());
      expect($container).to.have.class(containerClassName);
    });
  });

  it('should remove the error upon focusing', () => {
    setup(({ floatingErrorOptions, trigger }) => {
      const {
        floatingErrorContainerClassName: containerClassName,
        floatingErrorClassName: className,
      } = floatingErrorOptions;
      trigger(FOCUS);
      assertValid(className, containerClassName);
    });
  });

  it('should reapply the error upon a focus and then a blur', () => {
    setup(({ floatingErrorOptions, trigger }) => {
      const {
        floatingErrorContainerClassName: containerClassName,
        floatingErrorClassName: className,
      } = floatingErrorOptions;
      trigger(FOCUS);
      trigger(BLUR, {
        value: 'lebowski.me',
      });
      assertError(className, containerClassName);
    });
  });

  it('should remove the error upon a focus and then a blur', () => {
    setup(({ floatingErrorOptions, trigger }) => {
      const {
        floatingErrorContainerClassName: containerClassName,
        floatingErrorClassName: className,
      } = floatingErrorOptions;
      trigger(FOCUS);
      trigger(BLUR, {
        value: 'http://lebowski.me',
      });
      assertValid(className, containerClassName);
    });
  });

  it('should have an error when invalid', () => {
    setup(({ floatingErrorOptions, trigger }) => {
      const {
        floatingErrorContainerClassName: containerClassName,
        floatingErrorClassName: className,
      } = floatingErrorOptions;
      trigger(FOCUS);
      trigger(BLUR, {
        value: 'http://lebowski.me',
      });
      trigger(INVALID);
      assertError(className, containerClassName);
    });
  });

  it('should have one error when invalid is triggered multiple times', () => {
    setup(({ floatingErrorOptions, trigger }) => {
      const {
        floatingErrorContainerClassName: containerClassName,
        floatingErrorClassName: className,
      } = floatingErrorOptions;
      trigger(FOCUS);
      trigger(BLUR, {
        value: 'lebowski',
      });
      trigger(INVALID);
      assertError(className, containerClassName);

      trigger(FOCUS);
      trigger(BLUR, {
        value: 'lebowski.me',
      });
      trigger(INVALID);

      assertError(className, containerClassName);
    });
  });

  it('should first off an invalid scroll position and respond to it', () => {
    setup(({ $input, floatingErrorOptions, trigger }) => {
      const {
        floatingErrorClassName: className,
      } = floatingErrorOptions;

      trigger(FOCUS);
      trigger(BLUR, {
        value: 'lebowski',
      });
      trigger(INVALID);

      const setElement = sinon.spy();
      const evt = new CustomEvent(INVALID_SCROLL_POSITION, {
        detail: { setElement },
      });
      $input[0].dispatchEvent(evt);

      const errorEl = $(fixture.el).find(`.${className}`)[0];
      expect(setElement).to.have.been.calledWith(sinon.match(errorEl));
      setElement.reset();
    });
  });

  it('should not show the message when validate submit only is enabled', () => {
    setup(({ floatingErrorOptions, trigger }) => {
      const {
        floatingErrorContainerClassName: containerClassName,
        floatingErrorClassName: className,
      } = floatingErrorOptions;
      trigger(FOCUS);
      trigger(BLUR, {
        value: 'lebowski.me',
      });
      assertValid(className, containerClassName);
    }, {
      validateOnlyOnSubmit: true,
    });
  });
});
