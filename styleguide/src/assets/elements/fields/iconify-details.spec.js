import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { iconsToDataAttrs } from '../../test/helpers/dom';
import { create } from '../../test/factories/floating-label';
import iconifyMoreDetails, {
  iconList,
  VISIBLE_CLASS_NAME,
} from './iconify-details';

chai.use(sinonChai);

describe('Iconify More Details', () => {
  const setup = (run, overrides = {}) => {
    const modal = sinon.spy();
    const options = {
      modal,
      prefix: 'walter',
    };

    const fieldAttrs = iconsToDataAttrs(iconList, options);
    const data = Object.assign({}, { fieldAttrs }, overrides);
    const caller = iconifyMoreDetails(options);
    const { $el, trigger, teardown } = create([caller], data);
    run({ $el, modal, trigger });
    teardown();
    modal.reset();
  };

  it('should not show more details icon when no nodes are found', () => {
    setup(({ $el }) => {
      expect($el.find(`.${VISIBLE_CLASS_NAME}`)).to.have.lengthOf(0);
    }, { fieldAttrs: [] });
  });

  it('should show a more details icon', () => {
    setup(({ $el }) => {
      expect($el.find(`.${VISIBLE_CLASS_NAME}`)).to.have.lengthOf(1);
    });
  });

  it('should open a modal upon clicking on a more details icon', () => {
    setup(({ $el, modal }) => {
      $el.find(`.${VISIBLE_CLASS_NAME}`).trigger('click');
      expect(modal).to.have.been.calledOnce;
    });
  });
});
