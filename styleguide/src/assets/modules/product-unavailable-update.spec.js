import $ from 'jquery';
import chai, { expect } from 'chai';
import chaiJquery from 'chai-jquery';

import updateUnavailable, {
  UNAVAILABLE_ATTR,
  HREF_ATTR,
  VALUE,
  SPECIAL_ORDER,
  BACK_IN_STOCK,
  CANT_FIND_YOUR_SIZE,
} from './product-unavailable-update';

chai.use(chaiJquery);

describe('product unavailable link', () => {
  const VALUE_SELECTOR = `[value="${VALUE}"]`;
  const hrefSelector = href => `[data-${HREF_ATTR}="${href}"]`;

  const SETUP_DEFAULTS = {
    chosen: {},
    oneSize: false,
    allInStock: false,
    template: `<select id="scrubs" data-${UNAVAILABLE_ATTR}="turk"></select>`,
  };

  const setup = (options = {}) => {
    const { chosen, oneSize, allInStock, template } = Object.assign({}, SETUP_DEFAULTS, options);

    fixture.set(template);
    const $fixture = $(fixture.el);
    const $sizeEl = $fixture.find('#scrubs');

    updateUnavailable({
      sizeEl: $sizeEl[0],
      oneSize,
      allInStock,
      chosen,
    });

    return { $fixture, $sizeEl };
  };

  afterEach(() => {
    fixture.cleanup();
  });

  it('should not add an unavailable link when attribute is not found', () => {
    const template = '<select id="scrubs"></select>';
    const { $sizeEl } = setup({ template });
    expect($sizeEl).to.not.have.descendants(VALUE_SELECTOR);
  });

  it('should add an unavailable link when attribute is found', () => {
    const { $sizeEl } = setup();
    expect($sizeEl).to.have.descendants(VALUE_SELECTOR);
  });

  it('should not add a link when oneSize', () => {
    const options = { oneSize: true };
    const { $sizeEl } = setup(options);
    expect($sizeEl).to.not.have.descendants(VALUE_SELECTOR);
  });

  it('should not add a link when all sizes are in stock and chosen is on sale', () => {
    const options = {
      allInStock: true,
      chosen: { isOnSale: true },
    };
    const { $sizeEl } = setup(options);
    expect($sizeEl).to.not.have.descendants(VALUE_SELECTOR);
  });

  it('should add "can\'t find your size" link by default', () => {
    const href = CANT_FIND_YOUR_SIZE;
    const { $sizeEl } = setup();
    expect($sizeEl).to.have.descendants(hrefSelector(href));
  });

  it('should add "special order" link when all sizes are in stock but chosen is not on sale', () => {
    const href = SPECIAL_ORDER;
    const options = { allInStock: true };
    const { $sizeEl } = setup(options);
    expect($sizeEl).to.have.descendants(hrefSelector(href));
  });

  it('should add "back in stock" link when chosen size is on sale', () => {
    const href = BACK_IN_STOCK;
    const chosen = { isOnSale: true };
    const { $sizeEl } = setup({ chosen });
    expect($sizeEl).to.have.descendants(hrefSelector(href));
  });
});
