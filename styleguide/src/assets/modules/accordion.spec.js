import $ from 'jquery';
import chai, { expect } from 'chai';
import chaiJquery from 'chai-jquery';

import accordion, {
  DEFAULTS as defaults,
  CLICK_EVENT,
} from './accordion';

chai.use(chaiJquery);

describe('Accordion', () => {
  const assertNoHeight = ($el) => {
    expect($el.get(0).style.height).to.equal('');
  };

  const assertHeightAuto = ($el) => {
    expect($el.get(0).style.height).to.equal('auto');
  };

  const createAccordionWithFixture = (fixtureName) => {
    fixture.load(`${fixtureName}.html`);
    const $container = $(fixture.el).find('.accordion');

    accordion($container.get(0), {
      accSpeed: 0,
    });

    return $container;
  };

  before(() => {
    fixture.setBase('styleguide/src/materials/modules');
  });

  afterEach(() => {
    fixture.cleanup();
  });

  describe('when one tab is actively open', () => {
    let $container;

    beforeEach(() => {
      $container = createAccordionWithFixture('accordian-1');
    });

    it('should show the first tab as the active on initial load', () => {
      const $tab = $container.find(defaults.accItem).eq(0);
      expect($tab).to.have.class(defaults.accActive);
      assertHeightAuto($tab.find(defaults.accContent));
    });

    it('should open the second tab and close the initial active tab', () => {
      const $tabs = $container.find(defaults.accItem);
      const $activeTab = $tabs.eq(0);
      const $openTab = $tabs.eq(1);
      $openTab.find(defaults.accLabel).trigger(CLICK_EVENT);

      expect($activeTab).to.not.have.class(defaults.accActive);
      assertNoHeight($activeTab.find(defaults.accContent));

      expect($openTab).to.have.class(defaults.accActive);
      assertHeightAuto($openTab.find(defaults.accContent));
    });

    it('should close tab when interacted with and open', () => {
      const $tab = $container.find(defaults.accItem).eq(1);
      $tab.find(defaults.accLabel).trigger(CLICK_EVENT);
      expect($tab).to.have.class(defaults.accActive);

      $tab.find(defaults.accLabel).trigger(CLICK_EVENT);
      expect($tab).to.not.have.class(defaults.accActive);
    });
  });

  describe('when n number of tabs can actively be open', () => {
    let $container;

    const getItems = () => $container.find(defaults.accItem);

    const assertActiveItems = (...items) => {
      items.forEach(($item) => {
        expect($item).to.have.class(defaults.accActive);
      });
    };

    beforeEach(() => {
      $container = createAccordionWithFixture('accordian-2');
    });

    it('should have the first tab open', () => {
      assertActiveItems(getItems().eq(0));
    });

    it('should open the second tab and leave the first open by default', () => {
      const $items = getItems();
      const $firstItem = $items.eq(0);
      const $secondItem = $items.eq(1);
      $secondItem.find(defaults.accLabel).trigger(CLICK_EVENT);
      assertActiveItems(...[$firstItem, $secondItem]);
    });

    it('should open the second and third tab and leave the first open by default', () => {
      const $items = getItems();
      const $firstItem = $items.eq(0);
      const $secondItem = $items.eq(1);
      const $thirdItem = $items.eq(2);
      $secondItem.find(defaults.accLabel).trigger(CLICK_EVENT);
      $thirdItem.find(defaults.accLabel).trigger(CLICK_EVENT);
      assertActiveItems(...[$firstItem, $secondItem, $thirdItem]);
    });

    it('should open the second and then close the first tab', () => {
      const $items = getItems();
      const $firstItem = $items.eq(0);
      const $secondItem = $items.eq(1);
      $firstItem.find(defaults.accLabel).trigger(CLICK_EVENT);
      $secondItem.find(defaults.accLabel).trigger(CLICK_EVENT);
      assertActiveItems($secondItem);
      expect($firstItem).to.not.have.class(defaults.accActive);
    });
  });
});
