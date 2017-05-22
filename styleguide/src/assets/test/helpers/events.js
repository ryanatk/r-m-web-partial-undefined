/* eslint import/prefer-default-export: 0 */
/**
 * Responsible for containing an event related test utilities
 * @module test/helpers/events
 */

/**
 * Fires off a series of DOM events on an element. This is particularly useful
 * for focus/blur, where there is a bug between jQuery and karma fixture not
 * playing nicely when a test is being reloaded in Chrome.
 * @param {jQuery} $el - Element getting triggered event
 * @param {...string} events - The events to fire off
 */
export const triggerEvent = ($el, ...events) => {
  events.forEach((name) => {
    const evt = new Event(name);
    $el[0].dispatchEvent(evt);
  });
};

