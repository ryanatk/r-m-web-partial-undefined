import chai, { expect } from 'chai';
import chaiJquery from 'chai-jquery';
import $ from 'jquery';
import cookies from 'js-cookie';

import productZoom, {
  FAVORITE_ID,
  FADE_OUT_BADGE_CLASS_NAME,
  ZOOM_BADGE_ID,
  ZOOM_BADGE_TRANSITION_EVENT,
  ZOOM_BADGE_COOKIE,
} from './product-zoom';
import { createDataAttrsFromObj } from '../lib/test-helpers';

chai.use(chaiJquery);

describe('Product Zoom', () => {
  let $container;
  let sandbox;
  let $fixture;
  const images = ['//:the-dude', '//:walter', '//:donny'];


  const createProductZoom = (options = {}) => {
    productZoom($container, Object.assign({
      images,
      sliderZoom: sandbox.spy(),
      targetSelector: '.character',
    }, options));
  };

  const attrs = {
    images,
    tapToZoom: 'Do zoom things',
    noImages: 'got no images dude',
  };

  beforeEach(() => {
    fixture.set(`
      <div id="dialog"></div>
      <div id="lebowski-characters" ${createDataAttrsFromObj(attrs)}>
        ${images.map(image => `<img class="character" src="${image}"/>`).join('')}
      </div>
    `);

    sandbox = sinon.sandbox.create();
    $fixture = $(fixture.el);
    $container = $fixture.find('#lebowski-characters');
  });

  afterEach(() => {
    sandbox.restore();
    fixture.cleanup();
  });

  it('should open up the slider zoom when an image has been interacted with', () => {
    const idx = 1;
    const sliderZoom = sandbox.spy();
    productZoom($container, {
      images,
      sliderZoom,
      targetSelector: '.character',
    });

    $container.find(`.character:eq(${idx})`).trigger('click');
    expect(sliderZoom).to.have.been.calledWith(images, sinon.match.has('startingIndex', idx));
  });

  it('should render and find the extra menu', () => {
    // eslint-disable-next-line no-shadow
    const sliderZoom = sandbox.spy((images, { menuRender, didRender }) => {
      $fixture.find('#dialog').html(menuRender());
      didRender();
    });
    productZoom($container, {
      images,
      sliderZoom,
      targetSelector: '.character',
    });

    $container.find('.character:eq(1)').trigger('click');
    expect($fixture.find(`#${FAVORITE_ID}`)).to.have.lengthOf(1);
  });

  describe('Zoom Badge', () => {
    const getBadge = () => $fixture.find(`#${ZOOM_BADGE_ID}`);

    beforeEach(() => {
      cookies.remove(ZOOM_BADGE_COOKIE.name);
    });

    it('should render the zoom badge', () => {
      createProductZoom();
      expect(getBadge()).to.have.lengthOf(1);
      expect(getBadge().text()).to.contain(attrs.tapToZoom);
    });

    it('should not render the zoom badge on the second visit', () => {
      createProductZoom();
      getBadge().remove();
      createProductZoom();
      expect(getBadge()).to.have.lengthOf(0);
    });

    it('should hide the badge after a certain duration', (done) => {
      const zoomBadgeDuration = 10;
      createProductZoom({
        zoomBadgeDuration,
      });

      setTimeout(() => {
        expect(getBadge()).to.have.class(FADE_OUT_BADGE_CLASS_NAME);
        getBadge().trigger(ZOOM_BADGE_TRANSITION_EVENT);
        expect(getBadge()).to.have.lengthOf(0);
        done();
      }, zoomBadgeDuration + 5);
    });
  });
});
