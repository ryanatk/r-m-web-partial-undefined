/**
 * Responsible for showing/hiding content based on a tab structure
 * @module modules/uiTabs
 */
import $ from 'jquery';
import registerJQueryPlugin from '../lib/register-jquery-plugin';

// Expose the function as a jQuery plugin for ease of use
export const PLUGIN_NAME = 'tabs';

export const NAV_CLASS = 'nav';
export const TAB_CLASS = 'tab';
export const LINK_CLASS = 'link';
export const CONTENT_CLASS = 'content';
export const ACTIVE_CLASS = 'active';

/**
 * Updates tabs.
 * @private
 * @param {jQueryElement} $wrap - Tab wrap element
 * @param {String} wrapClass - Class of the tab wrap
 * @param {HTMLElement} chosen - Chosen tab
 */
function updateTabs($wrap, wrapClass, chosen) {
  const $chosen = $(chosen);
  const activeTabClass = `${wrapClass}__${TAB_CLASS}--${ACTIVE_CLASS}`;
  const activeContentClass = `${wrapClass}__${CONTENT_CLASS}--${ACTIVE_CLASS}`;

  // if tab is already active, don't change anything
  if ($chosen.hasClass(activeTabClass)) { return false; }

  const $tabs = $wrap.find(`.${wrapClass}__${TAB_CLASS}`);
  const $contents = $wrap.find(`.${wrapClass}__${CONTENT_CLASS}`);
  const id = $chosen.find(`.${wrapClass}__${LINK_CLASS}`).attr('href');

  // remove active class to all tabs
  $tabs.removeClass(activeTabClass);

  // add active class to tab
  $chosen.addClass(activeTabClass);

  // hide all content
  $contents.removeClass(activeContentClass);

  // reveal chosen content
  return $wrap.find(id).addClass(activeContentClass);
}

export const DEFAULT_OPTIONS = {
  wrapClass: 'ui-tabs',
  updateFunc: updateTabs,
  initialTab: location.hash,
};

/**
 * Gets chosen tab
 * @private
 * @param {jQuery} $wrap - The tab wrap
 * @param {String} wrapClass - Class of the tab wrap
 * @param {String} initialTab - location hash value
 * @return {HTMLElement} chosen tab
 */
const getChosenTab = ($wrap, wrapClass, initialTab) => {
  if (initialTab) {
    // get the tab indicated by the initial requested state, either via
    // location.hash or provided value
    const link = $wrap.find(`.${wrapClass}__link[href="${initialTab}"]`)[0];
    if (link) {
      return link.parentNode;
    }
  }

  // use the first tab when either no initialTab or if the associated href
  // containing the tab cannot be found in the DOM.
  return $wrap.find(`.${wrapClass}__${TAB_CLASS}`)[0];
};

/**
 * Initializes UI Tabs.
 * @param {HTMLElement} wrap - The tab wrap
 * @param {Object} [options] - Object containing override options
 */
export default function uiTabs(wrap, options = {}) {
  const $wrap = $(wrap);
  const { wrapClass, updateFunc, initialTab } = Object.assign({}, DEFAULT_OPTIONS, options);
  const $nav = $wrap.find(`.${wrapClass}__${NAV_CLASS}`);

  // attach click listener to nav
  $nav.click((evt) => {
    evt.preventDefault();

    updateFunc($wrap, wrapClass, evt.target.parentNode);
  });

  // get the chosen tab
  const chosen = getChosenTab($wrap, wrapClass, initialTab);

  // run once
  updateFunc($wrap, wrapClass, chosen);
}

registerJQueryPlugin(PLUGIN_NAME, uiTabs);
