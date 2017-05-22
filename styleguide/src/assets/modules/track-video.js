/**
 * Handles all Video tracking
 * @module modules/trackVideo
 */

import $ from 'jquery';
import registerJQueryPlugin from '../lib/register-jquery-plugin';

// Expose the function as a jQuery plugin for ease of use
export const PLUGIN_NAME = 'trackVideo';
export const VIMEO_API_URL = 'https://player.vimeo.com/api/player.js';
export const YOUTUBE_API_URL = 'https://www.youtube.com/iframe_api';
export const GA_TRACKING_IDS = {
  revolve: 'UA-319064-1',
  forward: 'UA-319064-6',
};

/**
 * Setup players for respective video sources
 * @param  {jQuery} $el - iframe of video to track
 * @param  {string} string of video type to test source against
 */
const playerType = ($el, type) => {
  const src = $el.attr('src').toLowerCase();
  if (src.indexOf(type) !== -1) {
    return true;
  }
  return false;
};
/**
 * Clean title for GA tracking
 * @private
 * @param  {string} video title
 * @return {string} clean title with no space or special characters
 */
const cleanTitle = title => title.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-');
/**
 * Check if beauty tracker exist
 * @private
 */
const beautyTrackerExist = (ga) => {
  if (ga.getByName('beautyVideoTracker')) {
    return true;
  }
  return false;
};
/**
 * Create Google Analytics tracker for beauty videos.
 * @private
 * @param {object} GA_TRACKING_IDS - collection of GA tracking code for our differennt properties
 */
const createBeautyTracker = () => {
  ga(() => {
    if (!beautyTrackerExist(ga)) {
      const siteURL = window.location.origin.toLowerCase();
      let gaTrackingID = '';
      if (siteURL.indexOf('revolve') !== -1) {
        gaTrackingID = GA_TRACKING_IDS.revolve;
      } else if (siteURL.indexOf('forward') !== -1) {
        gaTrackingID = GA_TRACKING_IDS.forward;
      }
      ga('create', gaTrackingID, 'auto', 'beautyVideoTracker');
      ga('beautyVideoTracker.send', 'pageview');
    }
  });
};
/**
 * Track with GA
 * @private
 * @param  {string} Video title to send to GA
 */
const sendToGA = (videoTitle) => {
  if (window.ga && ga.create) {
    ga(() => {
      if (!beautyTrackerExist(ga)) {
        createBeautyTracker(GA_TRACKING_IDS);
      }
      if (beautyTrackerExist(ga)) {
        ga('beautyVideoTracker.send', 'event', {
          eventCategory: 'Beauty Video',
          eventAction: 'play',
          eventLabel: videoTitle,
        });
      }
    });
  }
};
/**
 * Set up Vimeo player event
 * @private
 * @param  {object} vimeo player
 */
const setVimeoEvents = (player) => {
  let videoTitle;
  player.getVideoTitle().then((title) => {
    videoTitle = cleanTitle(title);
  });
  player.on('play', () => {
    sendToGA(videoTitle);
  });
};
/**
 * Clean title for GA tracking
 * @private
 * @param  {jQuery} $el - iframe of video to track
 * @return {string} unique id for youtube initialization
 */
const createUniqueID = ($el) => {
  const ytid = `yt- ${Math.ceil(Math.random() * 10000000000)}`;
  $el.attr('id', ytid);
  return ytid;
};
/**
 * Init YouTube Player
 * @private
 * @param  {event} youtube player event
 */
const onYouTubePlayerReady = (event) => {
  const videoTitle = cleanTitle(event.target.getVideoData().title);
  $(event.target.a).data('video-title', videoTitle);
};

/**
 * Set up YouTube player event
 * @private
 * @param  {event} youtube play event
 */
const setYouTubeEvents = (event) => {
  const videoTitle = $(event.target.a).data('video-title');
  switch (event.data) {
    case 1:
      sendToGA(videoTitle);
      break;
    default:
  }
};
/**
 * Init YouTube Player
 * @private
 * @param  {jQuery} $el - iframe of video to track
* @return {object} YT Object
 */
const initYouTubeVideo = ($el) => {
  const ytid = createUniqueID($el);
  return new YT.Player(ytid, {
    events: {
      onReady: onYouTubePlayerReady,
      onStateChange: setYouTubeEvents,
    },
  });
};
/**
 * Setup players for respective video sources
 * @private
 * @param  {jQuery} $el - iframe of video to track
 */
const setupPlayer = ($el) => {
  if (playerType($el, 'vimeo')) {
    const player = new Vimeo.Player($el);
    setVimeoEvents(player);
  } else if (playerType($el, 'youtube')) {
    if (window.youtubeLoaded) {
      initYouTubeVideo($el);
    }
    $(window).on('youtubeLoaded', () => {
      initYouTubeVideo($el);
    });
  }
};
/**
 * Load correct api base on url
 * @private
 * @param  {jQuery} $el - iframe of video to track
 */
const loadAPI = ($el) => {
  let apiURL;

  if (playerType($el, 'vimeo')) {
    apiURL = VIMEO_API_URL;
  } else if (playerType($el, 'youtube')) {
    apiURL = YOUTUBE_API_URL;
  }

  $.ajax({
    url: apiURL,
    cache: true,
    dataType: 'script',
  })
  .done(() => {
    setupPlayer($el);
  });
};
/**
 * Initializes modal.
 * @param {HTMLElement} el - iframe of video to track
 * @see DEFAULTS
 */
export default function trackVideo(el) {
  const $el = $(el);
  loadAPI($el);
}
/**
 * Check for Google Analytics.
 * @private
 * @param {object} GA_TRACKING_IDS - collection of GA tracking code for our differennt properties
 */
const checkGATracker = () => {
  if (window.ga && ga.create) {
    createBeautyTracker(GA_TRACKING_IDS);
  } else {
    $(window).on('gaLoaded', () => {
      createBeautyTracker(GA_TRACKING_IDS);
    });
  }
};

checkGATracker(GA_TRACKING_IDS);

/**
* Add event for YouTube API ready method
*/
window.onYouTubeIframeAPIReady = () => {
  $(window).trigger('youtubeLoaded');
  window.youtubeLoaded = true;
};

registerJQueryPlugin(PLUGIN_NAME, trackVideo);
