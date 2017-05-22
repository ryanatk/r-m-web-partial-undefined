import $ from 'jquery';
import kebabCase from 'lodash/kebabCase';
import chai, { expect } from 'chai';
import chaiSubset from 'chai-subset';
import sinonChai from 'sinon-chai';

import submitModal, {
  trigger,
  triggerWithEvent,
  JSON_CONTENT_TYPE,
} from './submit-modal';

chai.use(chaiSubset);
chai.use(sinonChai);

describe('Submit Modal', () => {
  let sandbox;
  let server;

  const resolveObjectAsAttrs = obj =>
    Object
      .keys(obj)
      .map(name => `${kebabCase(name)}=${obj[name]}`)
      .join(' ');

  const setup = (options = {}) => {
    const { formAttrs = {} } = options;

    const $form = $(fixture.set(`
      <form ${resolveObjectAsAttrs(formAttrs)}>
        <input name="alias-1" id="alias-1">
        <input name="alias-2" id="alias-2">
        <button type="submit" id="submit">Submit</button>
      </form>
    `));

    const $submit = $form.find('#submit');
    return { $form, $submit };
  };

  const fillForm = $form =>
    $form.find('input').each((i, el) => $(el).val('El Duderino'));

  const createFakeRequest = (
    url = '/these-men-are-nihilists',
    method = 'POST',
    res = { status: 'sweet budd\'eh' },
  ) => {
    server.respondWith(method, url, [
      200,
      { 'Content-Type': JSON_CONTENT_TYPE },
      JSON.stringify(res),
    ]);

    return { url, method, res };
  };

  const createOptions = (options = {}) =>
    Object.assign({}, { modal: sandbox.spy() }, options);

  const getFromRequest = (key) => {
    const [request] = server.requests;
    return request[key];
  };

  beforeEach(() => {
    sandbox = sinon.sandbox.create({
      useFakeServer: true,
    });

    ({ server } = sandbox);
    server.respondImmediately = true;
  });

  afterEach(() => {
    sandbox.restore();
    $(fixture.el).off();
    fixture.cleanup();
  });

  describe('when listening for a form submit', () => {
    it('should perform a submit with the default serializer', (done) => {
      const { url, method, res: expectedRes } = createFakeRequest();
      const headers = {
        'X-Dude': 'Abides',
      };
      const { $form, $submit } = setup({
        formAttrs: {
          dataSubmitModalUrl: url,
          dataSubmitModalMethod: method,
          dataSubmitModalHeaders: JSON.stringify(headers),
        },
      });

      const modal = sandbox.spy();
      const successCallback = (res) => {
        expect(modal).to.have.been.called;
        expect(getFromRequest('requestHeaders')).to.containSubset(headers);
        expect(getFromRequest('requestBody')).to.equal($form.serialize());
        expect(res).to.eql(expectedRes);
        done();
      };

      const options = createOptions({ successCallback, modal });

      submitModal($form[0], options);
      fillForm($form);
      $submit.trigger('click');
    });

    it('should perform a submit as JSON', (done) => {
      const { url, method } = createFakeRequest();
      const { $form, $submit } = setup({
        formAttrs: {
          dataSubmitModalUrl: url,
          dataSubmitModalMethod: method,
          dataSubmitModalRequestContentType: JSON_CONTENT_TYPE,
        },
      });

      const successCallback = () => {
        const data = $form
          .find('input')
          .toArray()
          .map(({ name, value }) => ({ [name]: value }))
          .reduce((obj, item) => Object.assign({}, obj, item), {});

        expect(JSON.parse(getFromRequest('requestBody'))).to.eql(data);
        done();
      };

      submitModal($form[0], createOptions({ successCallback }));
      fillForm($form);
      $submit.trigger('click');
    });

    it('should error when no URL was found', () => {
      const { $form } = setup();
      expect(() => {
        submitModal($form[0], createOptions());
      }).to.throw(Error);
    });

    it('should error when no serializer was found', () => {
      const { $form } = setup({
        formAttrs: {
          dataSubmitModalRequestContentType: 'application/you-want-a-toe',
        },
      });

      expect(() => {
        submitModal($form[0], createOptions());
      }).to.throw(Error);
    });

    it('should call on the error callback with a crap request', (done) => {
      const { $form, $submit } = setup({
        formAttrs: {
          dataSubmitModalUrl: '/lets-go-bowling',
          dataSubmitModalMethod: 'PUT',
          dataSubmitModalRequestContentType: JSON_CONTENT_TYPE,
        },
      });

      const errorCallback = (err) => {
        expect(err.status).to.equal(404);
        done();
      };

      submitModal($form[0], createOptions({ errorCallback }));
      $submit.trigger('click');
    });

    it('should use the action and method for the ajax request', (done) => {
      const { url: action, method, res: expectedRes } = createFakeRequest();
      const { $form, $submit } = setup({
        formAttrs: { action, method },
      });

      const successCallback = (res) => {
        expect(res).to.eql(expectedRes);
        done();
      };

      submitModal($form[0], createOptions({ successCallback }));
      fillForm($form);
      $submit.trigger('click');
    });
  });

  describe('when triggering a submit modal', () => {
    it('should open the modal', () => {
      const { url, method, res: expectedRes } = createFakeRequest();
      const { $form } = setup({
        formAttrs: {
          dataSubmitModalUrl: url,
          dataSubmitModalMethod: method,
        },
      });

      const options = createOptions();
      const { modal } = options;

      fillForm($form);
      return trigger($form[0], options)
        .then((res) => {
          expect(modal).to.have.been.called;
          expect(res).to.eql(expectedRes);
        });
    });
  });

  describe('when triggering with an event', () => {
    it('should prevent the default action and show the modal', () => {
      const { url, method, res: expectedRes } = createFakeRequest();
      const { $form } = setup({
        formAttrs: {
          dataSubmitModalUrl: url,
          dataSubmitModalMethod: method,
        },
      });

      const options = createOptions();
      const { modal } = options;

      fillForm($form);
      const evt = $.Event('click');
      sandbox.spy(evt, 'preventDefault');

      return triggerWithEvent(evt, $form[0], options)
        .then((res) => {
          expect(evt.preventDefault).to.have.been.called;
          expect(modal).to.have.been.called;
          expect(res).to.eql(expectedRes);
        });
    });
  });
});
