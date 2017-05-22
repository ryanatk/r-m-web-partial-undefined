import { expect } from 'chai';
import $ from 'jquery';

import Hammer from 'hammerjs';
import imageZoom from './image-zoom';

describe('image zoom', () => {
  let hammer;
  let img;

  const getTransform = (deltaX, deltaY, scale) =>
    `translate3d(${deltaX}px, ${deltaY}px, 0px) scale3d(${scale}, ${scale}, 1)`;

  beforeEach(() => {
    fixture.set(`
      <img src="//:maude" style="width:300px; height:300px" />
    `);
    img = $(fixture.el).find('img')[0];
    hammer = imageZoom(Hammer, img);
  });

  afterEach(() => {
    hammer.destroy();
    fixture.cleanup();
  });

  it('should perform a pinch event', () => {
    const deltaX = 0;
    const deltaY = 0;
    const scale = 1.02082;
    hammer.emit('pinch', {
      deltaX,
      deltaY,
      scale,
    });

    expect(img.style.transform).to.equal(getTransform(deltaX, deltaY, scale));
  });

  it('should perform a pan event', () => {
    const deltaX = -32;
    const deltaY = 16;
    const scale = 2;
    hammer.emit('pinch', {
      deltaX: 0,
      deltaY: 0,
      scale,
    });

    hammer.emit('pan', {
      deltaX,
      deltaY,
      scale: 1,
    });

    expect(img.style.transform).to.equal(getTransform(deltaX, deltaY, scale));
  });

  it('should perform a panend event', () => {
    const deltaX = -32;
    const deltaY = 16;
    const scale = 2;
    hammer.emit('pinch', {
      deltaX: 0,
      deltaY: 0,
      scale,
    });

    hammer.emit('panend', {
      deltaX,
      deltaY,
      scale: 1,
    });

    expect(img.style.transform).to.equal(getTransform(deltaX, deltaY, scale));
  });

  it('should do a panend where the X and Y are greater than the image', () => {
    const deltaX = 400;
    const deltaY = 400;
    const scale = 2;
    hammer.emit('pinch', {
      deltaX: 0,
      deltaY: 0,
      scale,
    });

    hammer.emit('panend', {
      deltaX,
      deltaY,
      scale: 1,
    });

    expect(img.style.transform).to.equal(getTransform(150, 150, scale));
  });

  it('shuold do a panend where the X and Y are doing something else', () => {
    const deltaX = -200;
    const deltaY = -200;
    const scale = 2;
    hammer.emit('pinch', {
      deltaX: 0,
      deltaY: 0,
      scale,
    });

    hammer.emit('panend', {
      deltaX,
      deltaY,
      scale: 1,
    });

    expect(img.style.transform).to.equal(getTransform(-150, -150, scale));
  });

  it('should do a pinch and then pinchend such that the previous scale can be altered', () => {
    const deltaX = 0;
    const deltaY = 0;
    const scale = 1.8;
    const nextScale = 1.9;
    hammer.emit('pinch', {
      deltaX: 0,
      deltaY: 0,
      scale,
    });

    hammer.emit('pinchend', {
      deltaX: 0,
      deltaY: 0,
      nextScale,
    });

    hammer.emit('pinch', {
      deltaX: 0,
      deltaY: 0,
      scale,
    });

    expect(img.style.transform).to.equal(getTransform(deltaX, deltaY, 3.24));
  });
});
