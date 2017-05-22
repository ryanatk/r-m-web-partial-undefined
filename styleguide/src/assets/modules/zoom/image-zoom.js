/**
 * Responsible for calculating the viewport for an image upon a pan or pitch
 * event occurring
 * @module modules/zoom/imageZoom
 */

/**
 * Responsible for applying zooming functionality to an element.
 * @param {Function} Hammer - A function constructor of HammerJS
 * @param {HTMLElement} el - The element receiving the zoom
 * @return {Hammer} An instance of Hammer
 */
export default function imageZoom(Hammer, el) {
  const hammertime = new Hammer(el, {});
  let posX = 0;
  let posY = 0;
  let scale = 1;
  let lastScale = 1;
  let lastPosX = 0;
  let lastPosY = 0;
  let maxPosX = 0;
  let maxPosY = 0;

  hammertime.get('pinch').set({
    enable: true,
  });

  hammertime.on('pan pinch panend pinchend', (ev) => {
    if (scale !== 1) {
      posX = lastPosX + ev.deltaX;
      posY = lastPosY + ev.deltaY;
      maxPosX = Math.ceil((scale - 1) * (el.clientWidth / 2));
      maxPosY = Math.ceil((scale - 1) * (el.clientHeight / 2));

      if (posX > maxPosX) {
        posX = maxPosX;
      }

      if (posX < -maxPosX) {
        posX = -maxPosX;
      }

      if (posY > maxPosY) {
        posY = maxPosY;
      }

      if (posY < -maxPosY) {
        posY = -maxPosY;
      }
    }


    if (ev.type === 'pinch') {
      scale = Math.max(0.999, Math.min(lastScale * (ev.scale), 4));
    }

    if (ev.type === 'pinchend') {
      lastScale = scale;
    }

    if (ev.type === 'panend') {
      lastPosX = posX < maxPosX ? posX : maxPosX;
      lastPosY = posY < maxPosY ? posY : maxPosY;
    }

    if (scale !== 1) {
      /* eslint-disable no-param-reassign */
      el.style.transform = `translate3d(${posX}px, ${posY}px, 0px) scale3d(${scale}, ${scale}, 1)`;
      /* eslint-enabled no-param-reassign */
    }
  });

  return hammertime;
}
