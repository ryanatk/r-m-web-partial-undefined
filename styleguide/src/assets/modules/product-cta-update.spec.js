import $ from 'jquery';
import chai, { expect } from 'chai';
import chaiJquery from 'chai-jquery';
import { PRODUCT_BLOCK } from '../lib/constants/pdp';
import updateCTA, {
  CTA_CLASS,
  ctaAddToBag,
  ctaPreorder,
  ctaNotifyMeSpecial,
  ctaNotifyMe,
} from './product-cta-update';

chai.use(chaiJquery);

describe('product cta update', () => {
  let $fixture;
  let $ctaWrap;
  let data;

  beforeEach(() => {
    fixture.set(`
      <div class="${PRODUCT_BLOCK}">
        <div class="${PRODUCT_BLOCK}__${CTA_CLASS}"></div>
      </div>
    `);
    $fixture = $(fixture.el);
    $ctaWrap = $fixture.find(`.${PRODUCT_BLOCK}__${CTA_CLASS}`);
    data = {
      wrap: $fixture.find(`.${PRODUCT_BLOCK}`)[0],
      wrapBlockClass: PRODUCT_BLOCK,
      chosen: {},
    };
  });

  afterEach(() => fixture.cleanup());

  it('should show the ADD TO BAG CTA by default', () => {
    const ctaTemplate = ctaAddToBag();
    updateCTA(data);
    expect($ctaWrap).to.have.html(ctaTemplate);
  });

  it('should show the NOTIFY ME CTA when the chosen size is out of stock and all stock is on sale', () => {
    const ctaTemplate = ctaNotifyMe();
    data.allOnSale = true;
    data.chosen.oos = true;
    updateCTA(data);
    expect($ctaWrap).to.have.html(ctaTemplate);
  });

  it('should show the NOTIFY ME / SPECIAL ORDER CTA when the chosen size is out of stock and all stock is not on sale', () => {
    const ctaTemplate = ctaNotifyMeSpecial();
    data.chosen.oos = true;
    updateCTA(data);
    expect($ctaWrap).to.have.html(ctaTemplate);
  });

  it('should show the PREORDER CTA when the chosen size is on preorder', () => {
    const ctaTemplate = ctaPreorder();
    data.chosen.preorder = true;
    updateCTA(data);
    expect($ctaWrap).to.have.html(ctaTemplate);
  });
});
