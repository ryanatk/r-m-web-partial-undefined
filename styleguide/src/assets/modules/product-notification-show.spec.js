import $ from 'jquery';
import chai, { expect } from 'chai';
import chaiJquery from 'chai-jquery';
import { PRODUCT_BLOCK } from '../lib/constants/pdp';
import showNotification, {
  EL_CLASS,
  finalSale,
  sampleDefect,
  oneLeft,
  preorder,
} from './product-notification-show';

chai.use(chaiJquery);

describe('product notification show', () => {
  let $product;
  let data;
  const notifications = [
    {
      attr: 'sample-defect',
      template: sampleDefect,
    }, {
      attr: 'final-sale',
      template: finalSale,
    }, {
      attr: 'one-left',
      template: oneLeft,
    }, {
      attr: 'preorder',
      template: preorder,
    },
  ];

  beforeEach(() => {
    $product = $(fixture.set(`
      <div class="${PRODUCT_BLOCK}">
        <p class="${PRODUCT_BLOCK}__${EL_CLASS}"></p>
      </div>
    `));

    data = {
      wrap: $product[0],
      wrapBlockClass: PRODUCT_BLOCK,
      chosen: {
        'delivery-date': 'my bday',
      },
    };
  });

  afterEach(() => fixture.cleanup());

  it(`should not throw an error when the element is found ".${PRODUCT_BLOCK}__${EL_CLASS}"`, () => {
    expect(() => showNotification(data)).to.not.throw(Error);
  });

  it(`should throw error when the element is not found ".${PRODUCT_BLOCK}__${EL_CLASS}"`, () => {
    $product.empty();
    expect(() => showNotification(data)).to.throw(Error);
  });

  it('should remove any existing elements from the wrap', () => {
    data.chosen['one-left'] = true;
    showNotification(data);
    data.chosen['one-left'] = false;

    showNotification(data);
    expect($(`.${PRODUCT_BLOCK}__${EL_CLASS}`).html()).to.be.empty;
  });

  notifications.forEach((notification) => {
    it(`should render ${notification.attr} notification with the correct template`, () => {
      data.chosen[notification.attr] = true;
      expect(showNotification(data)).to.have.html(notification.template(data.chosen));
    });
  });
});
