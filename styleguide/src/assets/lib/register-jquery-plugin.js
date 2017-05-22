/**
 * This simple helper aids in the creation of creating/registering a jquery
 * plugin.
 * @module lib/createJqueryPlugin
 */

import $ from 'jquery';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';

const NOOP = () => {};

/**
 * Provides noop actions for sensible defaults.
 * @type {Object}
 */
export const noopActions = {
  deregister: NOOP,
};

/**
 * Contains a number of methods representing actions.
 * @param {HTMLElement} el - The element applied to the plugin
 * @param {string} name - The name of the plugin
 */
const actions = (el, name) => ({
  /**
   * Performs a deregisteration on the plugin
   */
  deregister: () => $.removeData(el, name),
});

/**
 * Simple helper function that creates/register a jQuery plugin.
 * @param {string} name - The name of the plugin to reguster
 * @param {jQueryPluginCallback} cb - A callback function
 */
export default function registerJQueryPlugin(name, cb) {
  $.fn[name] = function pluginRegister(...args) {
    const $obj = this;
    const opt = args[0];

    const [result] = $obj
      .toArray()
      .map((el) => {
        if (isString(opt)) {
          const instance = $.data(el, name);
          if (!instance) {
            throw new Error(`Attempted to call method ${name} existed when no instance existed`);
          }

          if (!instance[opt]) {
            throw new Error(`No method found for ${opt} on ${name}`);
          }

          const argList = args.slice(1);
          return instance[opt](...argList);
        }

        if (isUndefined($.data(el, name))) {
          $.data(el, name, cb(el, opt, actions(el, name)) || {});
        }

        // this is here so we can identify that chaining should occur and also
        // shut up eslint from complaining about a needed return value
        return undefined;
      })
      .filter(val => !isUndefined(val));

    return result || $obj;
  };
}

/**
 * This callback is used for registering a jQuery plugin.
 * @callback jQueryPluginCallback
 * @param {HTMLElement} el - The element applied to the plugin
 * @param {Object} options - Options forwarded along to the plugin.
 * @param {Object} actions - Actions that can be taken on the plugin
 */
