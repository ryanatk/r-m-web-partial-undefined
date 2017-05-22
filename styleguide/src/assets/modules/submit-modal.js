/**
 * Responsible for listening for a form submission that sends along the form
 * data to an endpoint and shows a modal.
 * @module modules/submitModal
 */
import $ from 'jquery';
import modal from './modal';
import registerJQueryPlugin from '../lib/register-jquery-plugin';

/**
 * Defines the value for a form content type.
 * @type {string}
 */
export const FORM_CONTENT_TYPE = 'application/x-www-form-urlencoded';

/**
 * Defines the value for a json content type.
 * @type {string}
 */
export const JSON_CONTENT_TYPE = 'application/json';

/**
 * Defines the default request content type
 * @type {string}
 */
export const DEFAULT_REQUEST_CONTENT_TYPE = FORM_CONTENT_TYPE;

/**
 * Defines sensible defaults for the submit modal.
 * @type {Object}
 */
const SUBMIT_MODAL_OPTIONS = {
  modal,
  successCallback: res => res,
  errorCallback: err => err,
  submitModalMethod: 'GET',
  submitModalHeaders: {},
  submitModalRequestContentType: DEFAULT_REQUEST_CONTENT_TYPE,
  submitModalRequestCharset: 'UTF-8',
};

/**
 * Will make a request with the fields in the form and then continue to
 * resolve successes/failures based on the actions.
 * @private
 * @param {HTMLElement} el - Element under question
 * @param {Function} serializer - Used to serialize data based on content type
 * @param {Object} ajaxSettings - Settings passed along for the ajax request
 * @param {Object} options = Configurable options with sensible defaults
 * @returns {jQuery.Deferred} Determines when the request has finished
 */
const makeRequest = (el, serializer, ajaxSettings, options) => {
  const { modal: modalFunc, successCallback, errorCallback } = options;
  const data = serializer($(el));
  const settings = Object.assign({}, ajaxSettings, { data });

  // TODO: Figure out how we want to handle error other than delegating to the
  // the errorCallback or promise. However, this could simply be delegated to
  // the caller and hooked into by either the errorCallback/promise.
  return $.ajax(settings)
    .then((res) => {
      modalFunc(el, {
        triggerOpen: true,
      });

      successCallback(res);
      return res;
    }, errorCallback);
};

/**
 * Used to represent a submit handler which will make a request and show the
 * modal.
 * @private
 * @param {Event} e - Represents an event
 * @param {HTMLElement} el - Element under question
 * @param {Function} serializer - Used to serialize data based on content type
 * @param {Object} ajaxSettings - Settings passed along for the ajax request
 * @param {Object} options = Configurable options with sensible defaults
 * @returns {jQuery.Deferred} Determines when the request has finished
 */
const submitHandler = (e, el, serializer, ajaxSettings, options) => {
  e.preventDefault();
  return makeRequest(el, serializer, ajaxSettings, options);
};

/**
 * Contains a list of "serializers" or supported options used to take the form
 * fields and values and create a representation based on the request content
 * type.
 * @type {Object}
 */
const serializers = {
  /**
   * Serializes form data or query string representation.
   * @param {jQuery} $el - Element being serialized
   * @returns {string} form data
   */
  [DEFAULT_REQUEST_CONTENT_TYPE]: $el => $el.serialize(),

  /**
   * Serializes the form as JSON.
   * @param {jQuery} $el - Element being serialized
   * @returns {string} JSON string
   */
  [JSON_CONTENT_TYPE]: ($el) => {
    const data = $el
      .serializeArray()
      .reduce((obj, { name, value }) =>
        Object.assign({}, obj, { [name]: value }),
        {},
      );

    return JSON.stringify(data);
  },
};

/**
 * Acts as an initializer to setup, negotiate, and combine options for common
 * use cases.
 * @private
 * @param {HTMLElement} el - Element containing the form fields
 * @param {Object} options = Configurable options with sensible defaults
 * @returns {Object} Fulfilled fields ready for extended use
 */
const setup = (el, options = {}) => {
  const $el = $(el);
  // TODO: See if this support is needed. I'm on the fence as this feels a bit
  // to implicit for my liking. At the same time, these may be good for server
  // fallbacks, creating a clear distinction between what the server and client
  // will support.
  const elementOptions = {
    submitModalMethod: $el.attr('method'),
    submitModalUrl: $el.attr('action'),
  };
  const opts = Object.assign({}, SUBMIT_MODAL_OPTIONS, options, elementOptions, $el.data());
  const {
    submitModalUrl: url,
    submitModalMethod: type,
    submitModalHeaders: headers,
    submitModalRequestContentType: requestContentType,
    submitModalRequestCharset: charset,
  } = opts;

  if (!url) {
    throw new Error('Must provide a data attribute of submit-modal-url in order to proceed');
  }

  const serializer = serializers[requestContentType];
  if (!serializer) {
    throw new Error(`No serializer found for content type ${requestContentType}`);
  }

  const contentType = `${requestContentType}; charset=${charset}`;
  const ajaxSettings = { url, contentType, headers, type };
  return { $el, serializer, ajaxSettings, opts };
};

/**
 * Responsible for accepting a submit, performing an ajax request on said
 * submit, and renders a modal with the next steps after the submission.
 * @see SUBMIT_MODAL_OPTIONS
 * @param {HTMLElement} el - The element containing a form or form fields
 * @param {Object} options = Configurable options with sensible defaults
 */
export default function submitModal(el, options = {}) {
  const { serializer, ajaxSettings, opts } = setup(el, options);
  el.addEventListener('submit', e => submitHandler(e, el, serializer, ajaxSettings, opts));
}

/**
 * Triggers a submit modal without it being attached to an event.
 * @see SUBMIT_MODAL_OPTIONS
 * @param {HTMLElement} el - Element containing the form fields
 * @param {Object} options = Configurable options with sensible defaults
 * @returns {jQuery.Deferred} Determines when the request has finished
 */
export const trigger = (el, options = {}) => {
  const { serializer, ajaxSettings, opts } = setup(el, options);
  return makeRequest(el, serializer, ajaxSettings, opts);
};

/**
 * Triggers a submit modal with a provided event. This would be useful for
 * subscribing to an event that is outside of the control of submit modal, but
 * still want to immediate trigger the submit modal.
 * @see SUBMIT_MODAL_OPTIONS
 * @param {Event} e - A DOM event
 * @param {HTMLElement} el - Element containing the form fields
 * @param {Object} options = Configurable options with sensible defaults
 * @returns {jQuery.Deferred} Determines when the request has finished
 */
export const triggerWithEvent = (e, el, options = {}) => {
  e.preventDefault();
  return trigger(el, options);
};

registerJQueryPlugin('submitModal', submitModal);
