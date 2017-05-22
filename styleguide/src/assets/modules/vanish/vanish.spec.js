import { expect } from 'chai';
import $ from 'jquery';

import vanish from './vanish';

describe('Vanish', () => {
  const defaults = {
    containerClassName: 'vanish',
    target: 'some-target',
    targetSelector: '.some-target',
    target2: 'another-target',
    targetSelector2: '.another-target',
    removeDelay: 10,
  };
  const setup = (options = {}) => {
    const {
      containerClassName,
      target,
      target2,
      removeDelay,
      targetSelector,
      targetSelector2,
    } = Object.assign({}, defaults, options);
    const containerSelector = `.${containerClassName}`;
    const hiddenClassName = `${containerClassName}--hide`;

    const $fixture = $(fixture.set(`
      <div class="container">
        <style>
          ${containerSelector} {
            transition: opacity 400ms ease-in;
            opacity: 1;
          }

          .${hiddenClassName} {
            opacity: 0;
          }
        </style>
        <div class="${containerClassName}"
             data-vanish-hidden-class-name="${hiddenClassName}"
             data-vanish-target="${targetSelector},${targetSelector2}"
             data-vanish-remove-delay="${removeDelay}">
          <p>yo dawg</p>
          <a class="${target}" href="/remove">Remove Me!</a>
          <a class="${target2}" href="/remove">Remove Me Again!</a>
        </div>
      </div>
    `));

    const $el = $fixture.find(`.${containerClassName}`);
    const $target = $el.find(targetSelector);
    const $target2 = $el.find(targetSelector2);
    const promise = vanish($el[0]);
    const trigger = () => {
      $target.trigger('click');
      $el.trigger('transitionend');
    };
    const trigger2 = () => {
      $target2.trigger('click');
      $el.trigger('transitionend');
    };
    return { promise, trigger, trigger2, $fixture, containerSelector };
  };

  afterEach(() => fixture.cleanup());

  it('should click on a target and the container should disappear', () => {
    const { $fixture, containerSelector, promise, trigger } = setup();
    const $el = $fixture.find(containerSelector);
    expect($el).to.have.lengthOf(1);
    trigger();

    return promise.then(() => {
      expect($fixture.find(containerSelector)).to.have.lengthOf(0);
    });
  });

  it('should click on a second target and the container should disappear', () => {
    const { $fixture, containerSelector, promise, trigger2 } = setup();
    const $el = $fixture.find(containerSelector);
    expect($el).to.have.lengthOf(1);
    trigger2();

    return promise.then(() => {
      expect($fixture.find(containerSelector)).to.have.lengthOf(0);
    });
  });
});
