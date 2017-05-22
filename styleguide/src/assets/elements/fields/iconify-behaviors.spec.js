import chai, { expect } from 'chai';
import chaiJquery from 'chai-jquery';
import { triggerEvent } from '../../test/helpers/events';
import { iconsToDataAttrs } from '../../test/helpers/dom';
import { create } from '../../test/factories/floating-label';
import iconifyBehaviors, {
  iconList,
  EVENTS,
  ICON_CLASS_NAME,
  VISIBLE_CLASS_NAME,
} from './iconify-behaviors';

chai.use(chaiJquery);

describe('Iconify Behaviors', () => {
  const { FOCUS, INPUT, BLUR, INVALID } = EVENTS;
  const setup = (run, overrides = {}, formAttrs = {}) => {
    const options = {
      prefix: 'walter',
    };

    const fieldAttrs = iconsToDataAttrs(iconList, options);
    const data = Object.assign({}, { fieldAttrs }, overrides);
    const caller = iconifyBehaviors(options);
    const { $el, $input, trigger, teardown } = create([caller], data, {}, formAttrs);
    run({ options, $el, $input, trigger });
    teardown();
  };

  describe('when doing a focus event', () => {
    it('should respond to a focus event with no value and not show a clear icon', () => {
      setup(({ $el, trigger }) => {
        trigger(FOCUS);
        const $icon = $el.find(`.${VISIBLE_CLASS_NAME}`);
        expect($icon).to.have.lengthOf(0);
      });
    });

    it('should respond to a focus event with some value and show a clear icon', () => {
      setup(({ $el, trigger }) => {
        trigger(FOCUS, { value: 'bowling' });
        const $title = $el.find(`.${VISIBLE_CLASS_NAME} title`);
        expect($title).to.have.lengthOf(1);
        expect($title).to.have.text('clear');
      });
    });

    it('should respond to a focus event and remove all visible class names', () => {
      setup(({ $el, trigger }) => {
        $el.find(`.${ICON_CLASS_NAME}`).addClass(VISIBLE_CLASS_NAME);
        trigger(FOCUS);
        const $icons = $el.find(`.${VISIBLE_CLASS_NAME}`);
        expect($icons).to.have.lengthOf(0);
      });
    });
  });

  describe('when doing an input event', () => {
    it('should respond to an input event with some value and show a clear icon', () => {
      setup(({ $el, trigger }) => {
        trigger(INPUT, { value: 'bowling' });
        const $title = $el.find(`.${VISIBLE_CLASS_NAME} title`);
        expect($title).to.have.text('clear');

        trigger(INPUT, 'bowlin');
        const $title2 = $el.find(`.${VISIBLE_CLASS_NAME} title`);
        expect($title2).to.have.text('clear');
      });
    });
  });

  describe('when doing a blur event', () => {
    it('should show an invalid icon upon a bad value', () => {
      setup(({ $el, trigger }) => {
        trigger(BLUR, { value: 'bowling' });
        const $title = $el.find(`.${VISIBLE_CLASS_NAME} title`);
        expect($title).to.have.text('invalid');
      }, {
        attrs: 'pattern="https?://.+"',
      });
    });

    it('should show an valid icon upon a good value', () => {
      setup(({ $el, trigger }) => {
        trigger(BLUR, { value: 'http://lebowski.me' });
        const $title = $el.find(`.${VISIBLE_CLASS_NAME} title`);
        expect($title).to.have.text('valid');
      }, {
        attrs: 'pattern="https?://.+"',
      });
    });

    it('should clear the value ontouchend and regain focus after a blur', () => {
      setup(({ $el, $input, trigger }) => {
        trigger(FOCUS, { value: 'bowling' });
        const $icon = $el.find(`.${VISIBLE_CLASS_NAME}`);
        triggerEvent($icon, 'mousedown');
        trigger(BLUR, { value: 'bowling' });
        expect($input).to.have.value('');
        expect(document.activeElement).to.equal($input[0]);
      });
    });
  });

  describe('when doing an invalid event', () => {
    it('should show an invalid icon', () => {
      setup(({ $el, trigger }) => {
        trigger(INVALID, { value: 'bowling' });
        const $title = $el.find(`.${VISIBLE_CLASS_NAME} title`);
        expect($title).to.have.text('invalid');
      }, {
        attrs: 'pattern="https?://.+"',
      });
    });

    it('should not show an invalid icon when it is not present', () => {
      setup(({ $el, trigger }) => {
        trigger(INVALID, { value: 'bowling' });
        const $visibleIcons = $el.find(`.${VISIBLE_CLASS_NAME}`);
        expect($visibleIcons).to.have.lengthOf(0);
      }, {
        attrs: 'pattern="https?://.+"',
        fieldAttrs: iconList.filter(({ name }) => name !== 'invalid'),
      });
    });
  });

  describe('when should validate on submit', () => {
    it('should show an error icon on load', () => {
      setup(({ $el }) => {
        const $visibleIcons = $el.find(`.${VISIBLE_CLASS_NAME}`);
        expect($visibleIcons).to.have.lengthOf(1);
      }, {
        required: true,
      }, {
        validateOnlyOnSubmit: true,
      });
    });

    it('should not show any icon when doing a blur', () => {
      setup(({ $el, trigger }) => {
        trigger(BLUR, { value: 'bowling' });
        const $visibleIcons = $el.find(`.${VISIBLE_CLASS_NAME}`);
        expect($visibleIcons).to.have.lengthOf(0);
      }, {
        attrs: 'pattern="https?://.+"',
      }, {
        validateOnlyOnSubmit: true,
      });
    });
  });
});
