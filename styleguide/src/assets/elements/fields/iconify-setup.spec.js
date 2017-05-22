import $ from 'jquery';
import chai, { expect } from 'chai';
import chaiJquery from 'chai-jquery';
import { iconsToDataAttrs } from '../../test/helpers/dom';
import { create } from '../../test/factories/floating-label';
import iconifySetup, {
  CONTAINER_CLASS_NAME,
  ICON_CLASS_NAME,
  HIDDEN_CLASS_NAME,
} from './iconify-setup';

chai.use(chaiJquery);

describe('Iconify Setup', () => {
  const setup = (icons) => {
    const options = {
      prefix: 'walter',
      containerClassName: 'shabbos',
      containerElementName: 'section',
    };

    const fieldAttrs = iconsToDataAttrs(icons, options);
    const { $el, $input, nodes, removeListeners } = create([], { fieldAttrs });
    removeListeners();
    const argSet = iconifySetup(icons, nodes, options);
    return Object.assign({}, { $el, $input }, { options }, argSet);
  };

  it('should send back the floating label, form field, icon container, and icons', () => {
    const icons = [
      { name: 'dude', iconId: 'dude' },
      { name: 'walter', iconId: 'walter' },
    ];
    const keys = icons.map(({ name }) => name);

    const { floatingLabel, formField, $el, $input, iconContainer, iconNodes } = setup(icons);
    expect(floatingLabel).to.equal($el[0]);
    expect(formField).to.equal($input[0]);
    expect(iconContainer).to.exist;
    expect(iconNodes).to.have.all.keys(...keys);
  });

  it('should render the proper element and className', () => {
    const icons = [
      { name: 'dude', iconId: 'dude' },
    ];

    const { iconContainer, options: { containerClassName, containerElementName } } = setup(icons);
    const elementNameRegex = new RegExp(containerElementName, 'i');
    const $iconContainer = $(iconContainer);
    expect($iconContainer).to.have.class(containerClassName);
    expect($iconContainer).to.have.prop('tagName').match(elementNameRegex);
  });

  it('should render only one icon', () => {
    const icons = [
      { name: 'dude', iconId: 'dude' },
    ];

    const { iconContainer } = setup(icons);
    expect($(iconContainer).find(`.${ICON_CLASS_NAME}`)).to.have.lengthOf(1);
  });

  it('should render an iconify and have three icons', () => {
    const icons = [
      { name: 'dude', iconId: 'dude' },
      { name: 'walter', iconId: 'walter' },
      { name: 'donny', iconId: 'donny' },
    ];

    const { iconContainer } = setup(icons);
    const $iconContainer = $(iconContainer);
    expect($iconContainer).to.have.descendants(`.${CONTAINER_CLASS_NAME}`);
    expect($iconContainer.find(`.${ICON_CLASS_NAME}`)).to.have.lengthOf(3);
  });

  it('should not return an arg set when no icons are found', () => {
    const { floatingLabel, formField, iconContainer, iconNodes } = setup([]);
    [floatingLabel, formField, iconContainer, iconNodes].forEach((el) => {
      expect(el).to.not.exist;
    });
  });

  it('should contain all the icons as a return value', () => {
    const icons = [
      { name: 'dude', iconId: 'dude' },
      { name: 'walter', iconId: 'walter' },
      { name: 'donny', iconId: 'donny' },
    ];

    const { iconContainer, iconNodes } = setup(icons);
    icons.forEach(({ name }) =>
      expect($(iconContainer)).to.have.descendants(iconNodes[name]),
    );
  });

  it('should render the proper svg values', () => {
    const icons = [
      { name: 'dude', iconId: 'dude' },
      { name: 'walter', iconId: 'walter' },
      { name: 'donny', iconId: 'donny' },
    ];

    const { iconNodes } = setup(icons);
    icons.forEach(({ name, iconId }) => {
      const $icon = $(iconNodes[name]);
      expect($icon).to.have.class(ICON_CLASS_NAME);
      expect($icon).to.have.class(HIDDEN_CLASS_NAME);
      expect($icon).to.have.class('icon');
      expect($icon).to.have.class(`${ICON_CLASS_NAME}--${iconId}`);
      expect($icon.find('title')).to.have.text(name);
      expect($icon.find('use')).to.have.attr('xlink:href', `#icon-${iconId}`);
    });
  });
});
