import $ from 'jquery';
import chai, { expect } from 'chai';
import chaiJquery from 'chai-jquery';
import sinonChai from 'sinon-chai';
import { PRODUCT_BLOCK, SIZE_BLOCK_ELEMENT } from '../lib/constants/pdp';
import sizeChange from './product-size-change';

chai.use(chaiJquery);
chai.use(sinonChai);

describe('product size change', () => {
  let $fixture;

  beforeEach(() => {
    $fixture = $(fixture.set(`
      <div class="${PRODUCT_BLOCK}">
        <div class="${SIZE_BLOCK_ELEMENT}">
          <select>
            <option value="1" data-regular-price="10">1</option>
            <option value="2" data-price="5">2</option>
          </select>
        </div>
      </div>
    `));
  });

  afterEach(() => fixture.cleanup());

  it('should fire off a change event with the proper DOM structure', () => {
    const update = sinon.spy();
    const $size = $fixture.find(`.${SIZE_BLOCK_ELEMENT} select`);
    sizeChange($size[0], { update });
    $size.val('2').trigger('change');
    expect(update).to.have.been.calledOnce;
    update.reset();
  });
});
