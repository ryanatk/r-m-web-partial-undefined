import { expect } from 'chai';
import $ from 'jquery';

import dataProps from './data-props';
import { createDataAttrsFromObj } from './test-helpers';

describe('Data Props', () => {
  const createFixture = obj =>
    $(fixture.set(`<div id='lebowski' ${createDataAttrsFromObj(obj)}></div>`));

  afterEach(() => fixture.cleanup());

  it('should negotiate data props with no defaults or required parameters', () => {
    const expected = {
      name: 'the-dude',
      age: 40,
      abides: true,
      friends: ['walter', 'donny'],
    };

    const $el = createFixture(expected);
    const actual = dataProps($el);
    expect(actual).to.eql(expected);
  });

  it('should negotiate data props with defaults', () => {
    const props = {
      name: 'the-dude',
    };
    const defaults = {
      drink: 'white russian',
      name: 'walter',
    };

    const $el = createFixture(props);
    const actual = dataProps($el, defaults);
    expect(actual).to.eql(Object.assign({}, defaults, props));
  });

  it('should not throw error when all required fields have been provided', () => {
    const props = {
      name: 'the-dude',
      abides: true,
    };
    const required = ['name', 'abides'];

    const $el = createFixture(props);
    expect(() => dataProps($el, {}, required)).to.not.throw(Error);
  });

  it('should throw error when some required fields have not been provided', () => {
    const props = {
      name: 'the-dude',
      abides: true,
    };
    const required = ['name', 'abides', 'friends', 'age'];

    const $el = createFixture(props);
    expect(() => dataProps($el, {}, required)).to.throw(Error);
  });
});
