import chai, { expect } from 'chai';
import $ from 'jquery';
import chaiJquery from 'chai-jquery';
import sinonChai from 'sinon-chai';

import Dialog, {
  DIALOG_CLASSNAME,
  BODY_CLASSNAME,
  TRANSITION_EVENT,
} from './dialog';

chai.use(chaiJquery);
chai.use(sinonChai);

describe('Dialog', () => {
  let html;
  let body;

  const createDialog = () => new Dialog({ html, body });

  beforeEach(() => {
    const htmlId = 'html';
    const bodyId = 'body';
    fixture.set(`
      <div id="${htmlId}">
        <div id="${bodyId}"></div>
      </div>
    `);
    const $fixture = $(fixture.el);
    html = $fixture.find(`#${htmlId}`)[0];
    body = $fixture.find(`#${bodyId}`)[0];
  });

  afterEach(() => fixture.cleanup());

  describe('when rendering a dialog', () => {
    it('should successfully render a dialog', () => {
      const id = 'yo-dawg';
      return createDialog()
        .render(`<div id="${id}">Yo dawg, I heard you like dialogs.</div>`)
        .then(($el) => {
          expect($(html)).to.have.class(DIALOG_CLASSNAME);
          expect($(body)).to.have.class(BODY_CLASSNAME);
          expect($el.find(`#${id}`)).to.have.lengthOf(1);
        });
    });
  });

  describe('when removing a dialog', () => {
    it('should remove a dialog', () => {
      const id = 'yo-dawg';
      const dialog = createDialog();
      const removeSpy = sinon.spy();
      return dialog
        .render(`<div id="${id}">Yo dawg, I heard you like dialogs.</div>`)
        .then(($el) => {
          const promise = dialog.remove();
          $el.on('remove', removeSpy);
          $el.trigger(TRANSITION_EVENT);
          return promise;
        })
        .then(() => {
          expect(removeSpy).to.have.been.calledOnce;
          expect($(html)).to.not.have.class(DIALOG_CLASSNAME);
          expect($(body)).to.not.have.class(BODY_CLASSNAME);
          expect($(body).find(`#${id}`)).to.have.lengthOf(0);
          removeSpy.reset();
        });
    });
  });
});
