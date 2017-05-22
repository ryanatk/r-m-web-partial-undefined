import $ from 'jquery';
import chai, { expect } from 'chai';
import chaiJquery from 'chai-jquery';

import { BLOCK_NAME } from '../image-carousel';
import slickArrow from './arrow';

chai.use(chaiJquery);

describe('Slick Arrow', () => {
  const DEFAULT_OPTIONS = {
    element: 'arrow',
    title: 'slick arrow',
    svg: 'arrow--thin',
  };
  const setup = (options) => {
    const {
      element,
      title,
      svg,
    } = Object.assign({}, DEFAULT_OPTIONS, options);
    const arrow = slickArrow(element, title, svg);
    const $arrow = $(arrow);

    return { arrow, $arrow };
  };

  it('should return an HTML string', () => {
    const { arrow } = setup();

    expect(arrow).to.be.a('string');
  });

  it('should return a wrapper with the proper className', () => {
    const element = 'robin-hood';
    const { $arrow } = setup({ element });

    expect($arrow).to.have.class(`${BLOCK_NAME}__${element}`);
  });

  it('should return a wrapper containing the proper HTML', () => {
    const title = 'achoo';
    const svg = 'blinkin';
    const { $arrow } = setup({ title, svg });

    expect($arrow.find('title')).to.have.text(title);
    expect($arrow.find('svg use')).to.have.attr('xlink:href')
      .equal(`#icon-${svg}`);
  });
});
