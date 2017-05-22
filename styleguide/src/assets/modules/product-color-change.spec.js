import $ from 'jquery';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import colorChange from './product-color-change';

chai.use(sinonChai);

describe('product color change', () => {
  let $fixture;

  beforeEach(() => {
    $fixture = $(fixture.set(`
      <select id="color">
        <option value="1">1</option>
        <option value="2">2</option>
      </select>
    `));
  });

  afterEach(() => fixture.cleanup());

  it('should fire off a change event with the proper DOM structure', () => {
    const $color = $fixture.find('#color');
    colorChange($color);
    $color.find('option[value="1"]').trigger('change');
  });
});
