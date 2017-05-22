/* eslint import/prefer-default-export: 0 */
/**
 * Responsible for setting up a floating label test factory
 * @module test/factories/floatingLabel
 */

import isObject from 'lodash/isObject';
import $ from 'jquery';
import floatingLabel, { TYPES } from '../../elements/fields/floating-label';
import { createDataAttrsFromObj } from '../../lib/test-helpers';
import { triggerEvent } from '../../test/helpers/events';
import template from '../../../partials/floating-label-input.html';

/**
 * Creates a floating label factory to be used throughout unit tests. It can be
 * used to directly interact with the caller or optionally return back the
 * fixture data appearing in the DOM.
 * @param {Array} [callers=[]] - The callers passed along to floating label
 * @param {Object} [overrides={}] - Data overrides for the template
 * @param {Object} [options={}] - Options to pass along to floating label
 * @param {Object} [formAttrs={}] - Attributes on the form
 * @returns {Object} Variety of properties to interact with floating label
 */
export const create = (callers = [], overrides = {}, options = {}, formAttrs = {}) => {
  const { CONTAINER, LABEL, FIELD } = TYPES;
  const block = 'dude';
  const labelElement = 'label';
  const inputElement = 'input';
  const label = `${block}__${labelElement}`;
  const input = `${block}__${inputElement}`;
  const data = Object.assign({
    id: 'dude',
    label: 'lebowski',
    fieldClassName: block,
    labelClassName: label,
    inputClassName: input,
  }, overrides);
  const $form = $(fixture.set(`
    <form ${createDataAttrsFromObj(formAttrs)}>
      ${template(data)}
    </form>
  `));
  const $el = $form.find(`.${block}`);
  const $label = $el.find(`.${label}`);
  const $input = $el.find(`.${input}`);
  const nodes = [
    { type: CONTAINER, name: block, node: $el[0] },
    { type: LABEL, name: label, node: $label[0] },
    { type: FIELD, name: input, node: $input[0] },
  ];
  const defaults = {
    block,
    labelElement,
    fieldElements: [inputElement],
    callers,
  };

  const opts = Object.assign({}, defaults, options);
  const { removeListeners } = floatingLabel($el[0], opts);
  const teardown = (done = () => {}, cb = () => {}) => {
    cb();
    removeListeners();
    fixture.cleanup();
    done();
  };

  const trigger = (...argList) => {
    const triggerOptions = [...argList].pop();

    if (isObject(triggerOptions)) {
      const { value } = triggerOptions;
      const evtNames = argList.slice(0, -1);
      $input.val(value);
      triggerEvent($input, ...evtNames);
      return;
    }

    triggerEvent($input, ...argList);
  };

  return { $el, $label, $input, nodes, trigger, removeListeners, teardown };
};

