import $ from 'jquery';
import { expect } from 'chai';

import input from '../../partials/input-text.html';
import {
  chooseCTA,
  notify,
  hideEmail,
  ctaAddToBag,
  ctaPreorder,
  ctaNotifyMe,
  ctaSpecialOrder,
  notificationInStock,
  notificationPreorderEmail,
  notificationPreorderAvailable,
  notificationUnavailable,
} from './notify-me-update';

describe('notify me update', () => {
  const WRAP_CLASS = 'notify-me';
  const updateChosen = (data, chosenUpdates) => {
    const chosen = Object.assign({}, data.chosen, chosenUpdates);
    return Object.assign({}, data, { chosen });
  };
  let $fixture;
  let data;

  beforeEach(() => {
    fixture.set(`
      <div class="${WRAP_CLASS}">
        ${input({ id: 'email', label: 'email' })}
      </div>
    `);
    $fixture = $(fixture.el);
    data = {
      wrap: $fixture.find(`.${WRAP_CLASS}`)[0],
      wrapBlockClass: WRAP_CLASS,
      chosen: {
        oos: true,
      },
    };
  });

  afterEach(() => fixture.cleanup());

  describe('by default', () => {
    it('should show the "Notify Me" CTA', () => {
      const expected = ctaNotifyMe(data);
      expect(chooseCTA(data)).to.equal(expected);
    });

    it('should not show any Notification', () => {
      expect(notify(data)).to.be.empty;
    });

    it('should not hide email', () => {
      expect(hideEmail(data)).to.be.false;
    });
  });

  describe('special order page', () => {
    const setSpecialOrder = $el => $el.find(`.${WRAP_CLASS}`).attr('id', 'special-order');

    it('should show the "Special Order" CTA', () => {
      const expected = ctaSpecialOrder();
      setSpecialOrder($fixture);

      expect(chooseCTA(data)).to.equal(expected);
    });

    it('should show the "Unavailable" Notification when chosen size is unavailable', () => {
      const chosen = { unavailable: true };
      const expected = notificationUnavailable();
      setSpecialOrder($fixture);

      expect(notify(updateChosen(data, chosen))).to.equal(expected);
    });

    it('should show the "Preorder Avaiable" Notification when chosen size is preorder', () => {
      const chosen = {
        preorder: true,
        'delivery-date': 'next week',
      };
      const expected = notificationPreorderAvailable(chosen);
      setSpecialOrder($fixture);

      expect(notify(updateChosen(data, chosen))).to.equal(expected);
    });

    it('should hide email when chosen size is preorder', () => {
      const chosen = {
        preorder: true,
      };
      setSpecialOrder($fixture);

      expect(hideEmail(updateChosen(data, chosen))).to.be.true;
    });

    it('should not hide email when chosen size is not preorder or in stock', () => {
      setSpecialOrder($fixture);

      expect(hideEmail(data)).to.be.false;
    });

    it('should hide email when #auto-order is present', () => {
      const $wrap = setSpecialOrder($fixture);

      $wrap.append(`${input({ id: 'auto-order', label: 'auto order' })}`);
      expect(hideEmail(data)).to.be.true;
    });
  });

  describe('chosen size is preorder', () => {
    const chosen = { preorder: true };

    it('should show the "Preorder" CTA', () => {
      const expected = ctaPreorder();

      expect(chooseCTA(updateChosen(data, chosen))).to.equal(expected);
    });

    it('should show the "Preorder Email" Notification', () => {
      const expected = notificationPreorderEmail();

      expect(notify(updateChosen(data, chosen))).to.equal(expected);
    });

    it('should show email field', () => {
      updateChosen(data, chosen);
      expect(hideEmail(data)).to.be.false;
    });
  });

  describe('chosen size is in stock', () => {
    const chosen = { oos: false };

    it('should show the "Add To Bag" CTA', () => {
      const expected = ctaAddToBag();

      expect(chooseCTA(updateChosen(data, chosen))).to.equal(expected);
    });

    it('should show the "In Stock" Notification', () => {
      const expected = notificationInStock();

      expect(notify(updateChosen(data, chosen))).to.equal(expected);
    });

    it('should hide email field', () => {
      expect(hideEmail(updateChosen(data, chosen))).to.be.true;
    });
  });
});
