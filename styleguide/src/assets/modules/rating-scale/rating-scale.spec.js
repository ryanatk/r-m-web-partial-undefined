import $ from 'jquery';
import chai, { expect } from 'chai';
import chaiJquery from 'chai-jquery';

import writeReview from '../../../data/writeReview.json';
import ratingScale, { RATING_SCALE_OPTIONS } from './rating-scale';
import ratingScaleTemplate from '../../../materials/modules/rating-scale/rating-scale-no-validation.html';

chai.use(chaiJquery);

describe('Rating Scale', () => {
  const {
    block,
    inputElement,
    labelElement,
    filledModifier,
    titleSelector,
  } = RATING_SCALE_OPTIONS;

  const setup = () => {
    const $wrap = $(fixture.set(ratingScaleTemplate({ writeReview })));
    ratingScale($wrap[0]);
    const $els = $wrap.find(`.${block}`);
    const $title = $wrap.find(titleSelector);
    return { $wrap, $els, $title };
  };

  const assertFilledByIndex = ($els, selectedIndex) => {
    $els.toArray().some((el, i) => {
      if (i > selectedIndex) {
        return true;
      }

      const $el = $(el);
      expect($el).to.have.class(`${block}--${filledModifier}`);
      expect($el.find('input')).to.have.class(`${block}__${inputElement}--${filledModifier}`);
      expect($el.find('label')).to.have.class(`${block}__${labelElement}--${filledModifier}`);
      return false;
    });
  };


  const triggerInputClick = ($el, index) => {
    $el.eq(index).find('input').trigger('click');
  };

  afterEach(() => {
    // unbind, to ensure memory leaks are kept to a minimum
    $(fixture.el).off();
    fixture.cleanup();
  });

  it('should fill in 3 stars', () => {
    const { $els, $title } = setup();
    const selectedIndex = 2;
    triggerInputClick($els, selectedIndex);
    assertFilledByIndex($els, selectedIndex);
    expect($title.text()).to.equal(writeReview.starRatings[selectedIndex].text);
  });

  it('should fill multiple times jumping back and forth', () => {
    const { $els, $title } = setup();
    const selections = [4, 0, 3, 2, 4, 1, 1];

    selections.forEach((i) => {
      triggerInputClick($els, i);
      assertFilledByIndex($els, i);
      expect($title.text()).to.equal(writeReview.starRatings[i].text);
    });
  });

  it('should fill in 2 stars and not allow a non input to be interacted with', () => {
    const { $els } = setup();
    const selectedIndex = 2;
    triggerInputClick($els, selectedIndex);
    $els.eq(0).find('label').trigger('click');
    assertFilledByIndex($els, selectedIndex);
  });
});
