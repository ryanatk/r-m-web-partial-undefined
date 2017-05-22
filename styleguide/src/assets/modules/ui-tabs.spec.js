import $ from 'jquery';
import chai, { expect } from 'chai';
import chaiJquery from 'chai-jquery';

import template from '../../materials/modules/ui-tabs.html';
import uiTabs, {
  TAB_CLASS,
  LINK_CLASS,
  CONTENT_CLASS,
  ACTIVE_CLASS,
  DEFAULT_OPTIONS,
} from './ui-tabs';

chai.use(chaiJquery);

describe('ui tabs', () => {
  const { wrapClass } = DEFAULT_OPTIONS;
  const activeTabClass = `${wrapClass}__${TAB_CLASS}--${ACTIVE_CLASS}`;
  const activeContentClass = `${wrapClass}__${CONTENT_CLASS}--${ACTIVE_CLASS}`;

  let $tabs;
  const clickTab = (index) => {
    const tab = $tabs.find(`.${wrapClass}__${TAB_CLASS}`)[index];
    $(tab).find(`.${wrapClass}__${LINK_CLASS}`).click();
    return tab;
  };

  const getEl = (elClass, index) =>
    $tabs.find(`.${wrapClass}__${elClass}`)[index];

  beforeEach(() => {
    fixture.set(template());
    $tabs = $(fixture.el).find(`.${wrapClass}`);
    uiTabs($tabs);
  });

  afterEach(() => fixture.cleanup());

  it('should initially set the 1st tab to active', () => {
    const el = getEl(TAB_CLASS, 0);
    const expected = activeTabClass;

    expect($(el)).to.have.class(expected);
  });

  it('should initially set the 1st content to active', () => {
    const el = getEl(CONTENT_CLASS, 0);
    const expected = activeContentClass;

    expect($(el)).to.have.class(expected);
  });

  it(`should initially set the 1st content to active when the initial tab isn't
      present`, () => {
    uiTabs($tabs, { initialTab: 'f-it-dude-lets-go-bowling' });
    const el = getEl(CONTENT_CLASS, 0);

    expect($(el)).to.have.class(activeContentClass);
  });

  it('should on click set the 2nd tab to active', () => {
    const el = clickTab(1);
    const expected = activeTabClass;

    expect($(el)).to.have.class(expected);
  });

  it('should on click set the 2nd content to active', () => {
    const el = getEl(CONTENT_CLASS, 1);
    const expected = activeContentClass;

    clickTab(1);
    expect($(el)).to.have.class(expected);
  });

  it('should on click of 2nd tab remove active class from 1st tab', () => {
    const el = getEl(TAB_CLASS, 0);
    const expected = activeTabClass;

    clickTab(1);
    expect($(el)).to.have.not.class(expected);
  });

  it('should on click of 2nd tab remove active class from 1st content', () => {
    const el = getEl(CONTENT_CLASS, 0);
    const expected = activeContentClass;

    clickTab(1);
    expect($(el)).to.have.not.class(expected);
  });
});
