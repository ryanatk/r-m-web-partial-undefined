import $ from 'jquery';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import floatingLabelPlugin, { BUILTIN_CALLERS } from './floating-label-plugin';

chai.use(sinonChai);

describe('FLoating Label Plugin', () => {
  const setup = (options = {}) => {
    const sandbox = sinon.sandbox.create();
    const floatingLabel = sandbox.spy();
    const callers = [sandbox.spy(), sandbox.spy()];
    const $el = $(fixture.set('<div></div>'));
    const opts = Object.assign({ floatingLabel, callers }, options);
    const teardown = () => {
      fixture.cleanup();
      sandbox.restore();
    };

    floatingLabelPlugin($el[0], opts);

    return {
      $el,
      teardown,
      floatingLabel,
      callers,
    };
  };

  it('should call on a floating label', () => {
    const { floatingLabel, teardown } = setup();
    expect(floatingLabel).to.have.been.calledOnce;
    teardown();
  });

  it('should call on a floating label with builtin callers', () => {
    const { floatingLabel, teardown, $el } = setup();
    expect(floatingLabel).to.have.been.calledWith(
      $el[0],
      sinon.match.has('callers', sinon.match.array.contains(BUILTIN_CALLERS)),
    );
    teardown();
  });

  it('should call on a floating label with custom callers', () => {
    const { floatingLabel, teardown, $el, callers } = setup();
    expect(floatingLabel).to.have.been.calledWith(
      $el[0],
      sinon.match.has('callers', sinon.match.array.contains(callers)),
    );
    teardown();
  });
});
