import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import ImageCarousel, { BLOCK_NAME } from './image-carousel';
import template from '../../partials/image-carousel.html';

chai.use(sinonChai);

describe('Image Carousel', () => {
  let sandbox;
  let imageCarousel;
  const data = {
    images: ['//:the-dude', '//:walter', '//:donny'],
    alt: 'He is a good man, and thorough.',
    idPrefix: 'maude',
  };

  beforeEach(() => {
    fixture.set(template(data));
    sandbox = sinon.sandbox.create();
    imageCarousel = new ImageCarousel(document.querySelector(`.${BLOCK_NAME}`));
  });

  afterEach(() => {
    sandbox.restore();
    fixture.cleanup();
  });

  it('should switch to a different slides', () => {
    const changeSpy = sandbox.spy();
    const num = 2;
    imageCarousel.$el.on('afterChange', changeSpy);
    imageCarousel.setSlideNumber(num);
    imageCarousel.transitionSlide();
    expect(changeSpy).to.have.been.calledWith(sinon.match.any, sinon.match.any, num);

    const nextSpy = sandbox.spy();
    const nextNum = 1;
    imageCarousel.$el.on('afterChange', nextSpy);
    imageCarousel.setSlideNumber(nextNum);
    imageCarousel.transitionSlide();
    expect(changeSpy).to.have.been.calledWith(sinon.match.any, sinon.match.any, nextNum);
  });

  it('should not switch to a slide when an invalid number has been provided', () => {
    const changeSpy = sandbox.spy();
    imageCarousel.$el.on('afterChange', changeSpy);
    imageCarousel.setSlideNumber(undefined);
    imageCarousel.transitionSlide();
    expect(changeSpy).to.not.have.been.called;
  });
});
