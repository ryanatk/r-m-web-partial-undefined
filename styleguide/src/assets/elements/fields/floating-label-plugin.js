/**
 * Responsible for combining all floating label related callers and exposing it
 * as a jQuery plugin.
 * @module elements/fields/floatingLabelPlugin
 */
import registerJQueryPlugin from '../../lib/register-jquery-plugin';
import floatingLabel from './floating-label';
import stateModifiers from './state-modifiers';
import iconifyBehaviors from './iconify-behaviors';
import iconifyDetails from './iconify-details';
import floatingError from './floating-error';

/**
 * Defines any built in callers for a floating label.
 * @type {Array}
 */
export const BUILTIN_CALLERS = [
  stateModifiers(),
  iconifyBehaviors(),
  iconifyDetails(),
  floatingError(),
];

/**
 * Performs a setup of all the necessary pieces for calling on a floating label
 * jQuery plugin.
 * @see FLOATING_LABEL_OPTIONS
 * @param {HTMLElement} el - Receives floating label treatment
 * @param {Object} options - Configurable options
 */
export default function floatingLabelPlugin(el, options = {}) {
  const { callers: providedCallers = [] } = options;
  const callers = [].concat(BUILTIN_CALLERS, providedCallers);
  const defaults = { floatingLabel };
  const overrides = { callers };
  const opts = Object.assign({}, defaults, options, overrides);
  const { floatingLabel: floatingLabelFunc } = opts;
  floatingLabelFunc(el, opts);
}

registerJQueryPlugin('floatingLabel', floatingLabelPlugin);
