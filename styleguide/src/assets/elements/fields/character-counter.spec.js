import $ from 'jquery';
import chai, { expect } from 'chai';
import chaiJquery from 'chai-jquery';

import characterCounter, {
  COUNT_BLOCK_ELEMENT,
  COUNT_SELECTOR,
} from './character-counter';
import template from '../../../partials/floating-label-textarea.html';

chai.use(chaiJquery);

describe('Character Counter', () => {
  const defaultOptions = {
    before: $el => $el,
    maxlength: 200,
  };

  const setup = (options = {}) => {
    const opts = Object.assign({}, defaultOptions, options);
    const { before } = opts;
    const $el = $(fixture.set(template(opts)));
    before($el);
    characterCounter($el[0], opts);
    return { $el };
  };

  const assertCount = (value, $textarea, $count) => {
    const expectedText = value.length.toString();
    $textarea.val(value);
    // TODO: have this use triggerEvent from different PR
    const evt = new Event('input');
    $textarea[0].dispatchEvent(evt);
    expect($count).to.have.text(expectedText);
  };

  afterEach(() => {
    $(fixture.el).off();
    fixture.cleanup();
  });

  it('should throw an error when no maxlength was found on target element', () => {
    expect(() => {
      setup({
        maxlength: -1,
      });
    }).to.throw(Error);
  });

  it('should insert counter before the end of the element', () => {
    const expectedClassName = 'rug';
    const { $el } = setup({
      characterCounterInsertPosition: 'beforeend',
      characterCounterAddClassName: expectedClassName,
    });

    expect($el.find(':last-child')).to.have.class(expectedClassName);
  });

  it('should abide by data attribute verses passed in insert position', () => {
    const expectedClassName = 'marmot';
    const { $el } = setup({
      insertPosition: 'afterbegin',
      characterCounterAddClassName: expectedClassName,
      fieldAttrs: 'data-character-counter-insert-position=beforeend',
    });

    expect($el.find(':last-child')).to.have.class(expectedClassName);
  });

  it('should read field length when page initially loads and display it', () => {
    const fieldSelector = 'textarea';
    const val = 'goes bowling';
    const expectedCount = val.length.toString();
    const { $el } = setup({
      fieldSelector,
      before: $fixture => $fixture.find(fieldSelector).val(val),
    });

    expect($el.find(COUNT_SELECTOR).text()).to.equal(expectedCount);
  });

  it('should display the maxlength as feedback', () => {
    const className = 'white-russian';
    const maxlength = 100;
    const { $el } = setup({
      maxlength,
      characterCounterAddClassName: className,
    });

    expect($el.find(`.${className}:contains(${maxlength})`)).to.have.lengthOf(1);
  });

  it('should read the textarea when an input event is triggered', () => {
    const fieldSelector = 'textarea';
    const { $el } = setup({ fieldSelector });
    const $textarea = $el.find(fieldSelector);
    const $count = $el.find(`.${COUNT_BLOCK_ELEMENT}`);

    assertCount('t', $textarea, $count);
    assertCount('', $textarea, $count);
    assertCount('th', $textarea, $count);
    assertCount('the', $textarea, $count);
    assertCount('the dude', $textarea, $count);
    assertCount('the dude abides', $textarea, $count);
    assertCount('the dude a', $textarea, $count);
    assertCount('', $textarea, $count);
  });
});
