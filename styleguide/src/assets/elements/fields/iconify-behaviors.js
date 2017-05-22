/**
 * Responsible for covering icon related behavior within a floating label.
 * @module elements/fields/iconifyBehaviors
 */
import { TYPES, EVENTS } from './floating-label';
import setup, { VISIBLE_CLASS_NAME, ICON_CLASS_NAME } from './iconify-setup';

export { TYPES, EVENTS, VISIBLE_CLASS_NAME, ICON_CLASS_NAME };

/**
 * Defines available icons for iconify behaviors.
 * @type {Object}
 */
export const iconList = [
  { name: 'invalid', iconId: 'exclamation-point' },
  { name: 'valid', iconId: 'check-mark' },
  { name: 'clear', iconId: 'clear' },
];

/**
 * Responsible for clearing out the value of a form field.
 * @private
 * @param {HTMLFormElement} formField - The form element in the floating label
 */
const clearValue = (formField) => {
  /* eslint-disable no-param-reassign */
  // This is here to remove the placeholder which is visible
  // between the blur and focus event.
  const placeholder = formField.placeholder;
  formField.placeholder = '';

  formField.focus();
  formField.value = '';
  formField.placeholder = placeholder;
  /* eslint-enable no-param-reassign */
};

/**
 * Responsible for exposing methods used for clearing a form field based on
 * when events are fired off. For example, `attach` would be fired off during
 * focus, where `detach` would be fired off during blur. The tricky bit here
 * is using an event that won't trigger the blur event, hence why mousedown or
 * the preferred touchend event to ensure this event happens without disrupting
 * the blur event.
 *
 * There is a cleaner version here that uses touchend that minimizes a good
 * deal of this code and it's cleaner. However, in the interest of someone
 * saying, "This is broken" because they aren't on a mobile/touch device.
 * Therefore mousedown is used to ensure clear occurs before the blur event
 * can take affect.
 * @private
 * @param {HTMLElement} clearIcon
 * @returns {Object} Contains methods used for coordinating of clearing a field
 */
const coordinateClearEvents = (clearIcon) => {
  const evtName = 'mousedown';
  let handler;
  let shouldClearForm;

  return {
    attach: () => {
      clearIcon.addEventListener(evtName, handler = () => {
        shouldClearForm = true;
      });
    },

    detach: (formField) => {
      if (shouldClearForm) {
        clearValue(formField);
        clearIcon.removeEventListener(evtName, handler);
        shouldClearForm = false;
      }
    },
  };
};

/**
 * hides all icons by removing the visibility className.
 * @private
 * @param {HTMLElement} container - The icon container
 */
const hideAll = (container) => {
  Array.from(container.querySelectorAll(`.${ICON_CLASS_NAME}`)).forEach((el) => {
    el.classList.remove(VISIBLE_CLASS_NAME);
  });
};

/**
 * Responsible for showing the clear icon and hiding the rest of the icons.
 * @private
 * @param {HTMLElement} container - The icon container
 * @param {HTMLFormElement} target - The form field in the floating label
 * @param {HTMLElement} clearIcon - The clear icon element
 * @param {boolean} clearShown - Whether the clear icon has been shown
 * @returns {boolean|undefined} Determines whether the clear icon was shown,
 * otherwise returns undefined.
 */
const editable = (container, target, clearIcon, clearShown) => {
  if (clearShown && target.value) {
    return true;
  }

  hideAll(container);

  if (clearIcon && target.value) {
    clearIcon.classList.add(VISIBLE_CLASS_NAME);
    return true;
  }

  return false;
};

/**
 * Responsible for firing off a set of rules when the field has been completed.
 * This would happen when the field has initially loaded or on blur.
 * @private
 * @param {HTMLElement} container - The icon container
 * @param {HTMLElement} floatingLabel - The element containing the floating label
 * @param {HTMLFormElement} formField - The form element in the floating label
 * @param {HTMLElement} invalidIcon - The invalid icon element
 * @param {HTMLElement} validIcon - The valid icon element
 * @param {boolean} shouldValidate - Instructs to only validate on submit
 */
const completed = (container, floatingLabel, formField, invalidIcon, validIcon, shouldValidate) => {
  hideAll(container);

  if (shouldValidate) {
    if (invalidIcon && floatingLabel.querySelector(':invalid') === formField) {
      invalidIcon.classList.add(VISIBLE_CLASS_NAME);
    } else if (validIcon && formField.value) {
      validIcon.classList.add(VISIBLE_CLASS_NAME);
    }
  }
};

/**
 * Runs logic based on when an invalid event has been fired off.
 * @private
 * @param {HTMLElement} iconContainer - The icon container
 * @param {HTMLElement} invalidIcon - The invalid icon element
 */
const invalidated = (iconContainer, invalidIcon) => {
  hideAll(iconContainer);
  if (invalidIcon) {
    invalidIcon.classList.add(VISIBLE_CLASS_NAME);
  }
};

/**
 * Responds to the event received from floating label. The logic for this is as
 * follows:
 *
 * - focus: check to see if the clear icon should be shown
 * - input: show the clear icon if it already isn't shown
 * - blur: remove clear icon, show valid or invalid icon based on the state
 * formField of the form field
 * - invalid: show the invalid icon
 *
 * There are other optimizations taken for performance, but you get the idea.
 * @private
 * @param {HTMLElement} iconContainer - The icon container
 * @param {HTMLElement} floatingLabelEl - The element containing the floating label
 * @param {HTMLFormElement} formField - The form field
 * @param {Object} icons - Contains icon elements keyed by icon
 * @returns {Function} The inner function called on by floating label
 */
const respond = (iconContainer, floatingLabelEl, formField, icons) => {
  let clearShown = false;
  const {
    clear: clearIcon,
    invalid: invalidIcon,
    valid: validIcon,
  } = icons;

  const { FOCUS, BLUR, INVALID, INPUT } = EVENTS;
  // By going one level higher in scope, we can control the state of the clear
  // icon in terms of when it was bound and when it needs to be unbound.
  const coordinate = coordinateClearEvents(clearIcon);

  // At this point, the page has loaded without any events so there's a chance
  // a field could already have values. Therefore, apply any completed
  // behaviors, i.e. invalid or valid.
  completed(iconContainer, floatingLabelEl, formField, invalidIcon, validIcon, true);

  return (type, _ = {}, { validateOnlyOnSubmit }) => {
    switch (type) {
      case FOCUS:
        // Attaches clear events upon focus since it's the first time the field
        // has been interacted with. This will apply any event handlers used
        // for clearing the field.
        coordinate.attach(formField, () => {
          clearShown = false;
        });

        // Checks to see if we are in an edited state when the focus event
        // occurs. We don't about the return value because the input event
        // manages that portion of the lifecycle.
        editable(iconContainer, formField, clearIcon, clearShown);
        break;

      case INPUT:
        // At this point, the user is inputting values into the field. We call
        // on editable, so that we know how to treat the clear icon, i.e. should
        // it be shown or hidden. By returning back clearShown, we can cache
        // the state and limit the amount of DOM manipulation upon interaction.
        clearShown = editable(iconContainer, formField, clearIcon, clearShown);
        break;

      case BLUR:
        // At this point, the user is done with the field. We reset anything
        // that has state, i.e. clearShown and any event handlers. We also
        // apply the final completed state to the form, i.e. invalid or valid.
        clearShown = false;
        // Release the clear related events from memory.
        coordinate.detach(formField);

        completed(
          iconContainer,
          floatingLabelEl,
          formField,
          invalidIcon,
          validIcon,
          !validateOnlyOnSubmit,
        );
        break;

      case INVALID:
        invalidated(iconContainer, invalidIcon);
        break;

      default:
        break;
    }
  };
};

/**
 * Responsible for rendering out icons that will be used for a floating label.
 * The rendering is happening internally for a number of reasons:
 *
 * - Minimize the payload in the HTML (that is, if this was coming from there)
 * - Keep configuring from a consumer side as simple as possible.
 * - Since the icons are dependent on JavaScript, inlining them within allows
 *   for the HTML to operate in isolation with little external factors
 *
 * It's also responsible for doing the following:
 *
 * - Showing the correct icon based on the state of the input
 * - Attach/detach any events applied to the icon
 *
 * As for usage, iconify looks for data attributes denoting the different icons
 * to render where the value is used to populate the title of the SVG for
 * i18n/accessibility purposes. Here are the support data attributes:
 *
 * - data-iconify-clear
 * - data-iconify-invalid
 * - data-iconify-valid
 *
 * Any of these options can be used at different times. Therefore, if only clear
 * should be used, then only configure data-iconify-clear and nothing else.
 * Here's an example of the expected markup:
 *
 * @example
 * <div
 *     class="floating-label"
 *     data-iconify-clear="Clear"
 *     data-iconify-invalid="Invalid"
 *     data-iconify-valid="Valid">
 *   <label for="the-dude" class="floating-label__label">The Dude</label>
 *   <input id="the-dude" class="floating-label__input">
 * </div>
 *
 * @param {Object} options - Configurable options
 * @returns {Function} Used to setup and respond to events from floating label
 */
const iconify = (options = {}) => (...nodes) => {
  const {
    floatingLabel,
    formField,
    iconContainer,
    iconNodes,
  } = setup(iconList, nodes, options);

  if (iconNodes) {
    return respond(iconContainer, floatingLabel, formField, iconNodes);
  }

  return () => {};
};

export default iconify;
