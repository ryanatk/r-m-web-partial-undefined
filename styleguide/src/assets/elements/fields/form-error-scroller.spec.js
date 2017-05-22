import $ from 'jquery';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import chaiJquery from 'chai-jquery';
import kebabCase from 'lodash/kebabCase';
import merge from 'lodash/merge';
import formErrorScroller, { ERROR_SECTION_CLASS_NAME as errorClassName } from './form-error-scroller';

chai.use(sinonChai);
chai.use(chaiJquery);


describe('Form Error Scroller', () => {
  let sandbox;

  const setup = (options) => {
    const errorMessage = 'You\'re out of your element!';
    const opts = merge({
      headerClassName: 'header',
      errorMessage,
      scrollTriggerSpy: sandbox.spy(),
      dataAttrs: {
        errorMessage,
      },
    }, options);

    const { headerClassName, dataAttrs, scrollTriggerSpy } = opts;

    const $el = $(fixture.set(`
      <div
        ${Object.keys(dataAttrs)
          .map(name => `data-validate-${kebabCase(name)}="${dataAttrs[name]}"`)
          .join(' ')}>
        <h1 class="${headerClassName}">Header</h1>
      </div>
    `));
    const canUse = formErrorScroller($el, scrollTriggerSpy);
    const $error = $el.find(`.${errorClassName}`);
    return Object.assign({}, opts, { $el, $error, scrollTriggerSpy, canUse });
  };

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
    fixture.cleanup();
  });

  it('should not use the scroller if the necessary fields are not available', () => {
    const headerClassName = 'shabbos';
    const headerSelector = `.${headerClassName}`;
    const tests = [
      {},
      {
        scrollToPosition: 0,
      },
      {
        insertErrorBefore: headerSelector,
      },
      {
        insertErrorAfter: headerSelector,
      },
      {
        scrollToPosition: 0,
        insertErrorAfter: '.bad',
      },
    ];

    tests.forEach((dataAttrs) => {
      const { canUse } = setup({ dataAttrs, headerClassName });
      expect(canUse, JSON.stringify(dataAttrs)).to.be.false;
    });
  });

  it('should render an error', () => {
    const headerClassName = 'maude';
    const headerSelector = `.${headerClassName}`;
    const scrollToPosition = 0;
    const { $error, errorMessage } = setup({
      headerClassName,
      dataAttrs: {
        scrollToPosition,
        insertErrorBefore: headerSelector,
      },
    });

    expect($error.find(`:contains(${errorMessage})`)).to.have.lengthOf(1);
  });

  it('should to to 10 pixels on the y-axis when setting the scroll position', () => {
    const headerClassName = 'bunny';
    const headerSelector = `.${headerClassName}`;
    const scrollToPosition = 10;
    const { scrollTriggerSpy } = setup({
      headerClassName,
      dataAttrs: {
        scrollToPosition,
        insertErrorBefore: headerSelector,
      },
    });

    expect(scrollTriggerSpy).to.have.been.calledWith(0, scrollToPosition);
  });

  it('should scroll to 10 pixels on the y-axis', () => {
    const headerClassName = 'dude';
    const headerSelector = `.${headerClassName}`;
    const top = $(document.body).scrollTop();
    const { scrollTriggerSpy } = setup({
      headerClassName,
      dataAttrs: {
        scrollToSelector: 'body',
        insertErrorBefore: headerSelector,
      },
    });

    expect(scrollTriggerSpy).to.have.been.calledWith(0, top);
  });

  it('should insert an error before the target and 10 pixels down on the page', () => {
    const headerClassName = 'walter';
    const headerSelector = `.${headerClassName}`;
    const { $el, $error } = setup({
      headerClassName,
      dataAttrs: {
        scrollToPosition: 0,
        insertErrorBefore: headerSelector,
      },
    });

    expect($error.next().is($el.find(headerSelector))).to.be.true;
  });

  it('should insert an error after the target', () => {
    const headerClassName = 'donny';
    const headerSelector = `.${headerClassName}`;
    const { $el, $error } = setup({
      headerClassName,
      dataAttrs: {
        scrollToPosition: 0,
        insertErrorAfter: headerSelector,
      },
    });

    expect($error.prev().is($el.find(headerSelector))).to.be.true;
  });
});
