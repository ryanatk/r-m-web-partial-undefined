/**
 * This simple helper aids in the creation of creating/registering a jquery
 * plugin.
 * @module create-jquery-plugin
 */

var $ = require('jquery');

/**
 * Simple helper function that creates/register a jQuery plugin.
 * @param {string} name - The name of the plugin to reguster
 * @param {jQueryPluginCallback} cb - A callback function
 */
module.exports = function registerJQueryPlugin(name, cb) {
  $.fn[name] = function(options) {
    return this.each(function() {
      if (!$.data(this, 'plugin_' + name)) {
        $.data(this, 'plugin_' + name, cb(this, options) || true);
      }
    });
  }
};

/**
 * This callback is used for registering a jQuery plugin.
 * @callback jQueryPluginCallback
 * @param {HTMLElement} el - The element applied to the plugin
 * @param {Object} options - Options forwarded along to the plugin.
 */
