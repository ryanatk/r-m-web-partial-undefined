import $ from 'jquery';
import chai, { expect } from 'chai';
import chaiJquery from 'chai-jquery';
import slickAccessible, {
  SLICK_ACTIVE_CLASSNAME,
  KEYS,
} from './slick-accessible';

chai.use(chaiJquery);

describe('Slick Accessible', () => {
  const setup = (options) => {
    const dotsClass = 'dots-container';
    const appendDots = '.carousel-container';
    const images = [
      ['//:0', 'dude'],
      ['//:0', 'walter'],
      ['//:0', 'donny'],
    ];
    const $el = $(fixture.set(`
      <div class="carousel-container">
        <ul class="image-container" tabindex="0">
          ${images
            .map(([src, alt]) => `<li class="item"><img src="${src}" alt="${alt}"/></li>`)
            .join('')}
        </ul>
      </div>
    `));

    const slider = $el.find('.image-container')[0];
    const $slider = $(slider);
    const $items = $slider.find('li');
    const instance = slickAccessible(slider, Object.assign({
      dots: true,
      dotsClass,
      appendDots,
    }, options));
    return { $el, slider, $slider, $items, instance, dotsClass, appendDots };
  };

  afterEach(() => fixture.cleanup());

  describe('when resetting/updating dots', () => {
    it('should be able to interact with slick directly', () => {
      const { instance, slider } = setup();
      const slick = instance.slick('getSlick');
      expect(slick.$slider[0]).to.eql(slider);
    });

    it('should not render dots when not all requirements have been met', () => {
      [
        { appendDots: 'yo-dawg' },
        { dots: false },
      ].forEach((options) => {
        const { $el, dotsClass } = setup(options);
        const message = `with options ${JSON.stringify(options)}`;
        expect($el.find(`.${dotsClass}`), message).to.have.lengthOf(0);
      });
    });

    it('should apply a wrapper around the dots and reset dots', () => {
      const wrapperClassName = 'dots-wrapper';
      const { $el } = setup({
        dotsWrapperSelector: `<nav class="${wrapperClassName}"/>`,
      });
      const $wrapper = $el.find(`.${wrapperClassName}`);

      expect($wrapper).to.have.lengthOf(1);
      expect($wrapper).to.not.have.attr('role');
    });

    it('should have no accessible methods on the individual dots', () => {
      const { $el, dotsClass } = setup();
      const $dots = $el.find(`.${dotsClass}`);
      expect($dots.find('li')).to.not.have.attr('aria-hidden');
    });

    it('should create a new element containing an updated dots element', () => {
      // Yes, I know this is not a real tagName, it's for testing purposes.
      const dotsTagElement = 'yo';
      const { $el, dotsClass } = setup({ dotsTagElement });
      const $dots = $el.find(`.${dotsClass}`);
      expect($dots).to.have.prop('tagName', dotsTagElement.toUpperCase());
    });

    it('should remove/add active slide', () => {
      const { $el, $slider, dotsClass } = setup();
      const $dots = $el.find(`.${dotsClass}`);

      // To ensure we are starting from the beginning
      $slider.slick('slickGoTo', 0, true);
      expect($dots.find('li').eq(0)).to.have.class(SLICK_ACTIVE_CLASSNAME);

      // Move from 0 to 1 with the intention that 0 will no longer be active
      $slider.slick('slickGoTo', 1, true);
      expect($dots.find('li').eq(0)).to.not.have.class(SLICK_ACTIVE_CLASSNAME);
      expect($dots.find('li').eq(1)).to.have.class(SLICK_ACTIVE_CLASSNAME);
    });
  });

  describe('when interacting with the keyboard', () => {
    const { LEFT, RIGHT } = KEYS;
    const infinite = false; // option removes slick-clone that breaks tests
    const keydown = ($el, which) => {
      const evt = $.Event('keydown', { which });

      $el
        .focus()
        .trigger(evt);
    };

    it('should move to the next slide on right arrow', () => {
      const { $slider, $items } = setup({ infinite });
      const first = 0;
      const next = first + 1;

      // Start with the first item
      $slider.slick('slickGoTo', 0, true);
      expect($items.eq(first)).to.have.class(SLICK_ACTIVE_CLASSNAME);

      // Right arrow for next item
      keydown($slider, RIGHT);
      expect($items.eq(next)).to.have.class(SLICK_ACTIVE_CLASSNAME);
    });

    it('should move to the previous slide on left arrow', () => {
      const { $slider, $items } = setup({ infinite });
      const last = $items.length - 1;
      const previous = last - 1;

      // Start with the last item
      $slider.slick('slickGoTo', last, true);
      expect($items.eq(last)).to.have.class(SLICK_ACTIVE_CLASSNAME);

      // Left arrow for previous item
      keydown($slider, LEFT);
      expect($items.eq(previous)).to.have.class(SLICK_ACTIVE_CLASSNAME);
    });
  });
});
