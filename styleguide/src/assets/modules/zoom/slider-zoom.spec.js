import $ from 'jquery';
import 'slick-carousel';
import { expect } from 'chai';
import Hammer from 'hammerjs';
import Dialog from '../dialog/dialog';

import sliderZoom, {
  ZOOM_SLIDER_ID,
  CLOSE_ID,
  CONTENT_CLASSNAME,
} from './slider-zoom';

describe('slider zoom', () => {
  let sandbox;
  const images = ['//:the-dude', '//:walter', '//:donny'];

  const stubDialog = () => {
    const stubs = {
      render: template => fixture.set(template),
      remove: () => {
        fixture.cleanup();
        return Promise.resolve();
      },
    };
    Object.keys(stubs).forEach((method) => {
      sandbox.stub(Dialog.prototype, method).callsFake(stubs[method]);
    });
  };

  const runRenderZoom = (options) => {
    stubDialog();

    return sliderZoom(images, Object.assign({
      Dialog,
      speed: 0,
      loadHammerJS: () => Promise.resolve(Hammer),
    }, options));
  };

  const runNoImagesRenderZoom = (options) => {
    stubDialog();

    return sliderZoom([], Object.assign({
      Dialog,
      loadHammerJS: () => Promise.resolve(Hammer),
    }, options));
  };

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
    fixture.cleanup();
  });

  it('should perform a render', () => {
    const slideFunc = sandbox.spy();
    const didRender = sandbox.spy();
    const startingIndex = 2;

    return runRenderZoom({ didRender, startingIndex, slideFunc })
      .then(() => {
        expect(slideFunc).to.have.been.calledOnce;
        expect(slideFunc).to.have.been.calledWith(startingIndex);
        expect(didRender).to.have.been.called;
      });
  });

  it('should transition to the next slide', (done) => {
    const startingIndex = 0;
    const nextIndex = 1;
    const slideFunc = sandbox.spy();

    runRenderZoom({
      slideFunc,
      startingIndex,
      didSlideTransition: (prev, current) => {
        expect(slideFunc).to.have.been.calledWith(nextIndex);
        expect(slideFunc).to.have.been.calledTwice;
        expect(prev.src).to.contain(images[0]);
        expect(current.src).to.contain(images[1]);
        expect(prev.style.transform).to.equal('none');
        done();
      },
    })
    .then(() => {
      expect(slideFunc).to.have.been.calledWith(startingIndex);

      const $zoomSlider = $(fixture.el).find(`#${ZOOM_SLIDER_ID}`);
      $zoomSlider.trigger('afterChange', [{}, nextIndex]);
    });
  });

  it('should not transition when the next slide is the same as the current', () => {
    const slideFunc = sandbox.spy();

    return runRenderZoom({ slideFunc })
      .then(() => {
        expect(slideFunc).to.have.been.calledWith(0);

        const $zoomSlider = $(fixture.el).find(`#${ZOOM_SLIDER_ID}`);
        $zoomSlider.trigger('afterChange', [{}, 1]);
        $zoomSlider.trigger('afterChange', [{}, 0]);
        $zoomSlider.trigger('afterChange', [{}, 0]);
        $zoomSlider.trigger('afterChange', [{}, 0]);

        // once for the initial call
        // second for going from 0 to 1
        // third for going from 1 to 0
        // every other call is sending 0 so it shouldn't be called
        expect(slideFunc).to.have.been.calledThrice;
      });
  });

  it('should not transition to the same slide when on it already', () => {
    const currentSlide = 0;
    const slideFunc = sandbox.spy();

    return runRenderZoom({ slideFunc })
      .then(() => {
        expect(slideFunc).to.have.been.calledWith(currentSlide);

        const $zoomSlider = $(fixture.el).find(`#${ZOOM_SLIDER_ID}`);
        $zoomSlider.trigger('afterChange', [{}, currentSlide]);
        $zoomSlider.trigger('afterChange', [{}, currentSlide]);

        expect(slideFunc).to.have.been.calledOnce;
      });
  });

  it('should close the zoom slider', () => {
    const beforeUnmount = sandbox.spy();

    return runRenderZoom({ beforeUnmount })
      .then(() => {
        const $close = $(fixture.el).find(`#${CLOSE_ID}`);
        $close.trigger('click');

        expect(beforeUnmount).to.have.been.calledOnce;
        const $zoomSlider = $(fixture.el).find(`#${ZOOM_SLIDER_ID}`);
        expect($zoomSlider).to.have.lengthOf(0);
      });
  });

  it('should render no images text', () =>
    runNoImagesRenderZoom()
      .then(() => {
        const $content = $(fixture.el).find(`.${CONTENT_CLASSNAME}`);
        expect($content).to.have.lengthOf(1);
      }),
  );

  it('should be able to close a dialog with no images text', () => {
    const beforeUnmount = sandbox.spy();

    return runNoImagesRenderZoom({
      beforeUnmount,
    })
    .then(() => {
      const $close = $(fixture.el).find(`#${CLOSE_ID}`);
      $close.trigger('click');

      expect(beforeUnmount).to.have.been.calledOnce;
      const $content = $(fixture.el).find(`.${CONTENT_CLASSNAME}`);
      expect($content).to.have.lengthOf(0);
    });
  });
});
