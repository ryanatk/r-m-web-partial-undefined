import $ from 'jquery';
import chai, { expect } from 'chai';
import chaiJquery from 'chai-jquery';
import templatePolyfill from 'template-polyfill';

import updatePrice, {
  TEMPLATE_REGULAR,
  TEMPLATE_ON_SALE,
} from './product-price-update';
import {
  PRICE_BLOCK,
  PRODUCT_BLOCK,
} from '../lib/constants/pdp';
import priceTemplate from '../../partials/price.html';
import onSaleTemplate from '../../partials/price-on-sale.html';
import templateElement from '../../partials/template.html';

chai.use(chaiJquery);

describe('product price update', () => {
  const setupConditions = (modifier, isOnSale = false) => {
    const templateStyle = modifier || 'default';
    const idSuffix = isOnSale ? '-on-sale' : '';
    return {
      modifier,
      isOnSale,
      templateStyle,
      templateId: `price.${templateStyle}${idSuffix}`,
    };
  };
  const DEFAULT = setupConditions('');
  const DEFAULT_ON_SALE = setupConditions('', true);
  const LARGE = setupConditions('lg');
  const LARGE_ON_SALE = setupConditions('lg', true);

  const PRICE_ELEMENT = `${PRODUCT_BLOCK}__${PRICE_BLOCK}`;
  const REGULAR_PRICE = 100;
  const SALE_PRICE = 55;

  // helper fn that takes style & isOnSale, returning template html
  const getTemplateHTML = ({ modifier, isOnSale }) => {
    const template = isOnSale ? onSaleTemplate : priceTemplate;
    return template({
      price: isOnSale ? SALE_PRICE : REGULAR_PRICE,
      'regular-price': REGULAR_PRICE,
      modifier,
    });
  };

  // helper fn that wraps template html in a template element
  const writeTemplateEl = (style) => {
    const id = style.templateId;
    const html = getTemplateHTML(style);

    return templateElement({ id, html });
  };

  // helper fn to add the fixture
  const addFixture = (templateStyle, isOnSale = false) => {
    fixture.set(`
      <div class="${PRODUCT_BLOCK}">
        <div class="${PRICE_ELEMENT}"
          data-${TEMPLATE_REGULAR}="price.${templateStyle}"
          data-${TEMPLATE_ON_SALE}="price.${templateStyle}-on-sale"></div>
        ${writeTemplateEl(DEFAULT)}
        ${writeTemplateEl(DEFAULT_ON_SALE)}
        ${writeTemplateEl(LARGE)}
        ${writeTemplateEl(LARGE_ON_SALE)}
      </div>
    `);
    const $wrap = $(fixture.el).find(`.${PRODUCT_BLOCK}`);
    const data = {
      wrap: $wrap[0],
      chosen: {
        price: isOnSale ? SALE_PRICE : REGULAR_PRICE,
        regularPrice: REGULAR_PRICE,
        isOnSale,
      },
    };

    return { $wrap, data };
  };

  // main setup function for use within tests
  const setup = ({ templateStyle, modifier, isOnSale }) => {
    const { $wrap, data } = addFixture(templateStyle, isOnSale);

    // (because PhantomJS keeps it old school)
    templatePolyfill();

    // run function to update price
    updatePrice(data);

    // return elements for comparison
    const $priceEl = $wrap.find(`.${PRICE_ELEMENT}`);
    const templateHTML = getTemplateHTML({ modifier, isOnSale });

    return { $priceEl, templateHTML };
  };

  afterEach(() => fixture.cleanup());

  it('should show an item with a medium template', () => {
    const { $priceEl, templateHTML } = setup(DEFAULT);

    expect($priceEl).to.have.html(templateHTML);
  });

  it('should show an item with a large template style', () => {
    const { $priceEl, templateHTML } = setup(LARGE);

    expect($priceEl).to.have.html(templateHTML);
  });

  it('should show an item on sale with a default template style', () => {
    const { $priceEl, templateHTML } = setup(DEFAULT_ON_SALE);

    expect($priceEl).to.have.html(templateHTML);
  });

  it('should show an item on sale with a large template', () => {
    const { $priceEl, templateHTML } = setup(LARGE_ON_SALE);

    expect($priceEl).to.have.html(templateHTML);
  });

  it('should throw an error when the template is not found', () => {
    const { data } = addFixture('fail');
    const failUpdate = () => updatePrice(data);
    expect(failUpdate).to.throw(Error);
  });
});
