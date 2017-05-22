import $ from 'jquery';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import registerJQueryPlugin from './register-jquery-plugin';

chai.use(sinonChai);

describe('Create jQuery Plugin', () => {
  let sandbox;

  beforeEach(() => {
    fixture.set('<div id="dude">The dude abides</div>');
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should create a jQuery plugin', () => {
    const $dude = $('#dude');
    const spy = sandbox.spy();
    const opts = {
      abides: true,
    };

    registerJQueryPlugin('abides', spy);
    $dude.abides(opts);
    expect(spy).to.have.been.calledWith($dude[0], opts);
  });

  it('should not attempt to call on plugin if exists in cache', () => {
    const $dude = $('#dude');
    const spy = sandbox.spy();
    const opts = {
      abides: true,
    };

    registerJQueryPlugin('abides', spy);
    $dude.abides(opts);
    $dude.abides(opts);
    expect(spy).to.have.been.calledOnce;
  });

  it('should throw an error when no instance is bound to an element', () => {
    const $dude = $('#dude');
    const spy = sandbox.spy();

    registerJQueryPlugin('abides', spy);
    expect(() => {
      $dude.abides('walter');
    }).to.throw(Error);
  });

  it('should throw an error when no method is found on the instance', () => {
    const $dude = $('#dude');
    const spy = sandbox.spy(() => ({
      donny() {},
    }));

    registerJQueryPlugin('abides', spy);
    expect(() => {
      $dude.abides();
      $dude.abides('walter');
    }).to.throw(Error);
  });

  it('should call on a method bound to the element of a plugin', () => {
    const $dude = $('#dude');
    const walter = sandbox.spy();
    const instance = () => ({ walter });
    const argList = ['walter', 'this is bowling', 'there are rules'];

    registerJQueryPlugin('abides', instance);
    $dude.abides();
    $dude.abides(...argList);
    expect(walter).to.have.been.calledWith(...argList.slice(1));
  });

  it('should call on a method and return a value', () => {
    const $dude = $('#dude');
    const expected = 'Smokey, this is not \'Nam. This is bowling. There are rules.';
    const walter = sandbox.stub().returns(expected);
    const stub = () => ({ walter });
    const argList = ['walter', 'this is bowling', 'there are rules'];

    registerJQueryPlugin('abides', stub);
    $dude.abides();
    const actual = $dude.abides(...argList);
    expect(actual).to.equal(expected);
  });

  it('should call on a method and a jQuery instance', () => {
    const $dude = $('#dude');
    const walter = sandbox.stub().returns(undefined);
    const stub = () => ({ walter });
    const argList = ['walter', 'this is bowling', 'there are rules'];

    registerJQueryPlugin('abides', stub);
    $dude.abides();
    const $actual = $dude.abides(...argList);
    expect($actual).to.eql($dude);
  });

  it('should be able to chain the initial call followed by a method call', () => {
    const $dude = $('#dude');
    const walter = sandbox.stub().returns(undefined);
    const stub = () => ({ walter });
    const argList = ['walter', 'this is bowling', 'there are rules'];

    registerJQueryPlugin('abides', stub);
    const $actual = $dude
      .abides()
      .abides(...argList);
    expect($actual).to.eql($dude);
  });

  it('should not call on the same instance more than once', () => {
    const $dude = $('#dude');
    const spy = sandbox.spy();
    registerJQueryPlugin('abides', spy);
    $dude.abides();
    $dude.abides();
    expect(spy).to.have.been.calledOnce;
  });

  it('should call, remove, and then call the plugin', () => {
    const $dude = $('#dude');
    const plugin = (el, options, { deregister }) => ({
      destroy: () => deregister(),
    });
    const spy = sandbox.spy(plugin);
    registerJQueryPlugin('abides', spy);
    $dude.abides();
    expect(spy).to.have.been.calledOnce;
    $dude.abides('destroy');
    $dude.abides();
    expect(spy).to.have.been.calledTwice;
  });
});
