import $ from 'jquery';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import redirectHref, { DATA_ATTR } from './redirect-href';

chai.use(sinonChai);

describe('redirect href', () => {
  let $fixture;
  let $dropdown;
  let redirectFunc;

  beforeEach(() => {
    fixture.set(`
      <select name="lebowski" id="lebowski-select">
        <option ${DATA_ATTR}="the-dude">The Dude</option>
        <option ${DATA_ATTR}="walter">Walter</option>
        <option ${DATA_ATTR}="">Donny</option>
      </select>
    `);
    $fixture = $(fixture.el);
    $dropdown = $fixture.find('#lebowski-select');
    redirectFunc = sinon.spy();
  });

  afterEach(() => {
    redirectFunc.reset();
    fixture.cleanup();
  });

  it(`should redirect when element has ${DATA_ATTR} attribute`, () => {
    const href = 'the-dude';
    const el = $dropdown.find(`option[${DATA_ATTR}="${href}"]`)[0];

    redirectHref(el, { redirectFunc });

    expect(redirectFunc).to.have.been.calledWith(href);
  });

  it(`should not redirect when element does not have ${DATA_ATTR} attribute`, () => {
    const href = '';
    const el = $dropdown.find(`option[${DATA_ATTR}="${href}"]`)[0];

    redirectHref(el, { redirectFunc });

    expect(redirectFunc).to.not.have.been.called;
  });
});
