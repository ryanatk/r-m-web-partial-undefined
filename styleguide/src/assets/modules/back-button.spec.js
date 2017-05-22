import $ from 'jquery';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import backButton, {
  BACK_BUTTON_CLASS,
} from './back-button';
import template from '../../materials/modules/back-button.html';


chai.use(sinonChai);


describe('back button', () => {
  let $button;

  beforeEach(() => {
    const $fixture = $(fixture.set(`
      <div>
        ${template()}
      </div>
    `));
    $button = $fixture.find(`.${BACK_BUTTON_CLASS}`);
  });

  it('should fire "back" function once on click', () => {
    const back = sinon.spy();

    backButton($button[0], { back });
    $button.trigger('click');
    expect(back).to.have.been.calledOnce;
    expect(back).to.have.not.been.calledTwice;

    back.reset();
  });
});
