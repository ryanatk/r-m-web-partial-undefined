import $ from 'jquery';
import chai, { expect } from 'chai';
import chaiJquery from 'chai-jquery';

import { DEFAULT_OPTIONS } from './load-image';

chai.use(chaiJquery);

describe('load image', () => {
  const DATA_ATTR = DEFAULT_OPTIONS.attr;
  const OLD_SRC = '//:0';
  // these janky url's needed for karma browser tests
  const NEW_SRC = [
    'http://:jeffrey/',
    'http://:walter/',
    'http://:donald/',
  ];
  const imgMap = NEW_SRC.map(src => `
    <img src="${OLD_SRC}" ${DATA_ATTR}="${src}" />
  `).join('');

  let $fixture;

  beforeEach(() => {
    $fixture = $(fixture.set(`
      <div>
        ${imgMap}
      </div>
    `));
  });

  afterEach(() => fixture.cleanup());

  it('should update src to not be original source', () => {
    const $images = $fixture.find('img');

    $images.loadImage();
    expect($images).to.not.have.attr('src', OLD_SRC);
  });

  it('should update src attribute of all images to match deferred attribute', () => {
    const $images = $fixture.find('img');

    $images.loadImage();
    const sources = $.makeArray($images).map(img => img.src);

    expect(sources).to.eql(NEW_SRC);
  });
});
