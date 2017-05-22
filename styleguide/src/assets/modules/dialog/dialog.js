/**
 * Responsible for showing a simple generic dialog.
 * @module modules/dialog/dialog
 */
import $ from 'jquery';

import './dialog.scss';

export const DIALOG_CLASSNAME = 'dialog';
export const BODY_CLASSNAME = `${DIALOG_CLASSNAME}__body`;
export const CONTAINER_CLASSNAME = `${DIALOG_CLASSNAME}__container`;
export const CONTAINER_FADE_CLASSNAME = `${DIALOG_CLASSNAME}__container--fade`;
export const TRANSITION_EVENT = 'transitionend';

/**
 * Responsible for creating a unified experience to render a dialog.
 * TODO: Use modal instead
 * @deprecated
 */
export default class Dialog {
  /**
   * Initializes or sets up a dialog.
   * @constructor
   * @param {Object} options
   * @param {HTMLElement} [html=document.getElementsByTagName('html')[0]]
   * @param {HTMLElement} [body=document.body]
   */
  constructor({ html = document.getElementsByTagName('html')[0], body = document.body } = {}) {
    this.html = html;
    this.body = body;
    this.$body = $(body);
    this.$el = $();
  }

  /**
   * Responsible for rendering a dialog.
   * @param {String} template - Markup contained in a dialog
   * @return {Promise} Waits for the dialog to be rendered
   */
  render(template = '') {
    return new Promise((resolve) => {
      this.$el = $(`<div class="${CONTAINER_CLASSNAME}">${template}</div>`);
      this.$body.append(this.$el);
      this.html.classList.add(DIALOG_CLASSNAME);
      this.body.classList.add(BODY_CLASSNAME);
      // TODO: Find out desired interaction
      setTimeout(() => {
        this.$el.addClass(CONTAINER_FADE_CLASSNAME);
        resolve(this.$el);
      }, 0);
    });
  }

  /**
   * Removes an existing dialog and resets things.
   * @return {Promise} Waits for the dialog to be removed from the DOM
   */
  remove() {
    return new Promise((resolve) => {
      this.$el.removeClass(CONTAINER_FADE_CLASSNAME);

      this.$el.on(TRANSITION_EVENT, () => {
        this.$el.trigger('remove');
        this.$el.remove();
        this.html.classList.remove(DIALOG_CLASSNAME);
        this.body.classList.remove(BODY_CLASSNAME);
        resolve();
      });
    });
  }
}
