/**
 * Responsible for doing the baseline setup for an iconify floating label.
 * @module iconifySetup
 */
import camelCase from 'lodash/camelCase';
import { TYPES } from './floating-label';

/**
 * Defines default configuration for iconify.
 * @type {Object}
 */
const DEFAULT_ICONIFY_OPTIONS = {
  prefix: 'iconify',
  containerClassName: 'floating-label__iconify',
  containerElementName: 'div',
};

/**
 * CSS className used for the container.
 * @type {string}
 */
export const CONTAINER_CLASS_NAME = 'iconify';

/**
 * CSS className for an icon element.
 * @type {string}
 */
export const ICON_CLASS_NAME = `${CONTAINER_CLASS_NAME}__icon`;

/**
 * CSS className for a visible modifier.
 * @type {string}
 */
export const VISIBLE_CLASS_NAME = `${CONTAINER_CLASS_NAME}__icon--visible`;

/**
 * CSS className for a hidden modifier.
 * @type {string}
 */
export const HIDDEN_CLASS_NAME = `${CONTAINER_CLASS_NAME}__icon--hidden`;

/**
 * Obtains all the available icons based on how the data-iconify-* attributes
 * have been configured.
 * @private
 * @param {Array} acceptedIcons - List of icons with affiliated data
 * @param {Object} dataset - Data attributes on the floating label container
 * @param {string} prefix - Prepended name applied to the data attributes
 * @returns {Array} Al available icons based on name, text, and the unique ID
 */
const getAvailableIcons = (acceptedIcons, dataset, prefix) =>
  acceptedIcons
    .map(({ name, iconId }) => ({
      name,
      iconId,
      text: dataset[camelCase(`${prefix}-${name}`)],
    }))
    .filter(({ text }) => text);

/**
 * Creates the icon container with the selected icons.
 * @private
 * @param {Object} icons - Set of icons that will be rendered
 * @param {string} containerClassName - CSS className for the icon container
 * @param {string} iconClassName - CSS className applied to a single icon
 * @param {string} hiddenClassName - CSS className used to hide an icon
 * @returns {string} String representation of rendered icons
 */
const renderIcons = ({ icons, containerClassName, iconClassName, hiddenClassName }) => `
  <div class="${containerClassName}">
    ${icons.map(({ text, iconId }) => `
      <span class="${iconClassName} ${hiddenClassName} icon ${iconClassName}--${iconId}">
        <svg>
          <title>${text}</title>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-${iconId}"></use>
        </svg>
      </span>
    `).join('')}
  </div>
`;

/**
 * Append the icon container to the DOM.
 * @private
 * @param {HTMLElement} floatingLabel - The floating label container
 * @param {Object} icons - Set of icons that will be rendered
 * @param {string} elementName - Name of the element for the appended element
 * @param {string} className - CSS className for the appended element
 * @returns {Element} The icon container
 */
export const appendIconContainer = (floatingLabel, icons, elementName, className) => {
  const container = document.createElement(elementName);
  container.classList.add(className);
  container.innerHTML = renderIcons({
    icons,
    containerClassName: CONTAINER_CLASS_NAME,
    iconClassName: ICON_CLASS_NAME,
    hiddenClassName: HIDDEN_CLASS_NAME,
  });
  floatingLabel.appendChild(container);
  return container;
};

/**
 * Looks for all icon related nodes and creates an object based on the name of
 * the icon. This will allow for the consumers of this code to easily reference
 * icons based on what has been passed in by the consumers.
 * @private
 * @param {HTMLElement} iconContainer - Element with icon container
 * @param {Array} icons - Reference to passed in icons from consumer
 * @returns {Object} Contains icons keyed by icon name with icon HTML element
 */
const findIconNodes = (iconContainer, icons) =>
  icons.reduce((acc, { name, iconId }) =>
      Object.assign({}, acc, {
        [name]: iconContainer.querySelector(`.${ICON_CLASS_NAME}--${iconId}`),
      }),
    {});

/**
 * Responsible for taking a list of icons, HTML elements, and options with the
 * intention of rendering a icon contains and the icons that have been passed
 * in. This is a common piece of functionality that covers a couple different
 * of iconify floating labels. The goal here is to ensure iconify floating
 * labels can focus on their functionality without having to worry about doing
 * this type of setup and expose all the available elements created so they
 * can be leveraged by the consumers.
 * @see DEFAULT_ICONIFY_OPTIONS
 * @param {Array} possibleIcons - Icons that might be available
 * @param {Array} nodes - All floating label related elements
 * @param {Object} options - Used for overriding any options
 * @returns {Object} HTML elements pertaining to the icons being rendered
 */
export default function setupIconify(possibleIcons, nodes, options = {}) {
  const {
    prefix,
    containerClassName: className,
    containerElementName: elementName,
  } = Object.assign({}, DEFAULT_ICONIFY_OPTIONS, options);
  const [{ node: floatingLabel }] = nodes.filter(({ type }) => TYPES.CONTAINER === type);
  const [{ node: formField }] = nodes.filter(({ type }) => TYPES.FIELD === type);
  const availableIcons = getAvailableIcons(possibleIcons, floatingLabel.dataset, prefix);

  if (!availableIcons.length) {
    return {};
  }

  const iconContainer = appendIconContainer(floatingLabel, availableIcons, elementName, className);
  const iconNodes = findIconNodes(iconContainer, availableIcons);
  return { floatingLabel, formField, iconContainer, iconNodes };
}

