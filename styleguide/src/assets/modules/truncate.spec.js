import $ from 'jquery';
import chai, { expect } from 'chai';
import chaiJquery from 'chai-jquery';

import el from '../../materials/modules/truncate-toggle.html';
import truncate, {
  TRUNCATE_CLASS,
  SHOW_MODIFIER,
  BTN_TOGGLE_ATTR,
} from './truncate';

chai.use(chaiJquery);

describe('truncate toggle module', () => {
  const setup = (options = {}) => {
    const $fixture = $(fixture.set(`
      <div>
        <style>
          /* also setting css for class to work correctly */
          .u-truncate {
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 4;
          }
        </style>
        ${el(options)}
      </div>
    `));
    const $el = $fixture.find('[data-truncate]');
    $el.width('200px'); // set width because karma is a mofo

    truncate($el[0]);

    const $btn = $fixture.find('button');
    const more = $btn.text();
    const less = $btn.data(BTN_TOGGLE_ATTR);

    return { $el, $btn, more, less };
  };

  afterEach(() => fixture.cleanup());

  describe('intitial setup', () => {
    it('should not have the "truncate" class in the template', () => {
      expect($(el())).to.not.have.class(TRUNCATE_CLASS);
    });

    it('should add the "truncate" class', () => {
      const { $el } = setup();
      expect($el).to.have.class(TRUNCATE_CLASS);
    });

    it('should not add the "show" class', () => {
      const { $el } = setup();
      expect($el).to.not.have.class(`${TRUNCATE_CLASS}--${SHOW_MODIFIER}`);
    });

    it('should add the "more" button', () => {
      const { $btn, more } = setup();
      expect($btn).to.have.lengthOf(1);
      expect($btn).to.have.text(more);
    });
  });

  describe('toggle button', () => {
    it('should update on "click" to un-truncate and show the "less" button', () => {
      const { $el, $btn, less } = setup();
      $btn.click();
      expect($el).to.have.class(`${TRUNCATE_CLASS}--${SHOW_MODIFIER}`);
      expect($btn).to.have.text(less);
    });

    it('should update on 2nd "click" to re-truncate and show the "more" button again', () => {
      const { $el, $btn, more } = setup();
      $btn.click();
      $btn.click();
      expect($el).to.not.have.class(`${TRUNCATE_CLASS}--${SHOW_MODIFIER}`);
      expect($btn).to.have.text(more);
    });
  });
});
