import $ from 'jquery';
import chai, { expect } from 'chai';
import chaiJquery from 'chai-jquery';
import sinonChai from 'sinon-chai';
import templatePolyfill from 'template-polyfill';

import addToBag, { MODAL_ID } from './product-add-to-bag';
import { sizes } from '../../data/pdp.json';
import { PRODUCT_BLOCK, PRICE_BLOCK, CURRENT_PRICE_ELEMENT } from '../lib/constants/pdp';
import { TEMPLATE_REGULAR } from './product-price-update';
import priceTemplate from '../../partials/price.html';
import sizeTemplate from '../../partials/product-size.html';
import templateElement from '../../partials/template.html';

chai.use(chaiJquery);
chai.use(sinonChai);

describe('Product Add to Bag', () => {
  const PRICE_TEMPLATE = 'price-template';
  const PRICE = sizes[0].price.toString();

  const setup = (options = {}) => {
    fixture.set(`<div>
      <!-- Product -->
      <div class="${PRODUCT_BLOCK}">
        <!-- Product Form -->
        <form data-open="${MODAL_ID}">
          <!-- Size -->
          ${sizeTemplate({ sizes })}
          <button type="submit">push it</button>
        </form>
      </div>
      <!-- Modal -->
      <div id="${MODAL_ID}">
        <!-- Product -->
        <div class="${PRODUCT_BLOCK}">
          <!-- Price -->
          <div class="${PRODUCT_BLOCK}__${PRICE_BLOCK}"
            data-${TEMPLATE_REGULAR}="${PRICE_TEMPLATE}"></div>
        </div>
      </div>
      <!-- Price Template, on page -->
      ${templateElement({ id: PRICE_TEMPLATE, html: priceTemplate({ price: PRICE }) })}
    </div>`);

    // (because PhantomJS keeps it old school)
    templatePolyfill();

    const $fixture = $(fixture.el);
    const $priceEl = $fixture.find(`.${PRODUCT_BLOCK}__${PRICE_BLOCK}`);
    const $form = $fixture.find('form');
    const $button = $fixture.find('button');
    const openModal = sinon.spy();
    const defaultOptions = { openModal };
    const opts = Object.assign({}, defaultOptions, options);

    addToBag($form[0], opts);

    return { $priceEl, $button, $form, openModal };
  };

  afterEach(() => fixture.cleanup());

  it('should fire click handler when the button is clicked', () => {
    const clickHandler = sinon.spy();
    const { $form } = setup({ clickHandler });
    $form.submit();
    expect(clickHandler).to.have.been.calledOnce;
    expect(clickHandler).to.not.have.been.calledTwice;
  });

  it('should update the price when the button is clicked', () => {
    const { $form, $priceEl } = setup();
    $form.submit();
    const $currentPriceEl = $priceEl.find(`.${CURRENT_PRICE_ELEMENT}`);
    expect($currentPriceEl).to.have.text(PRICE);
  });

  it('should throw an error when the modal is not found', () => {
    const modalId = 'not-gonna-work';
    const { $form } = setup({ modalId });
    const submit = () => $form.submit();
    expect(submit).to.throw(Error);
  });

  it('should fire the modal function with the correct arguments', () => {
    const { $form, openModal } = setup();
    $form.submit();
    expect(openModal).to.have.been.calledWith($form[0], MODAL_ID);
    expect(openModal).to.have.been.calledOnce;
  });
});
