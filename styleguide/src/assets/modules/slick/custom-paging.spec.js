import $ from 'jquery';
import chai, { expect } from 'chai';
import chaiJquery from 'chai-jquery';
import sinonChai from 'sinon-chai';

import customPaging, { DOT_CLASS } from './custom-paging';

chai.use(chaiJquery);
chai.use(sinonChai);

describe('Slick Custom Paging', () => {
  const EL_ID = 'image-1';
  const setup = () => {
    const $slides = $([{ id: EL_ID }]);
    const $a = customPaging({ $slides }, 0);
    const el = $a[0];

    return { $a, el };
  };

  it('should return a link with the correct href', () => {
    const { el } = setup();

    expect(el.tagName).to.equal('A');
    expect(el.hash).to.equal(`#${EL_ID}`);
  });

  it('should return a jQuery element with the proper className', () => {
    const { $a } = setup();

    expect($a).to.have.class(DOT_CLASS);
  });

  it('should preventDefault on click of the returned jQuery object', () => {
    const { $a } = setup();
    const $e = $.Event('click');

    sinon.spy($e, 'preventDefault');
    $a.trigger($e);

    expect($e.preventDefault).to.have.been.called;
  });
});
