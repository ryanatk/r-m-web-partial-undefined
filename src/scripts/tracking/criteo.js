var $ = require('jquery');
var loaded = false;

window.criteo_q = window.criteo_q || [];

module.exports = {
  init: function(siteType, options) {
    if (!loaded) {
      loaded = true;
      var user = window.rcProps && window.rcProps.user || {};
      var customEvents = window.rcProps && window.rcProps.criteo && window.rcProps.criteo.events || [];

      options = options || {};
      $.extend(options, {
        id: user.id || null,
        email: user.email || null
      });

      window.criteo_q = window.criteo_q || [];

      if (!$.isEmptyObject(options)) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "//static.criteo.net/js/ld/ld.js";
        script.async = true;
        document.getElementsByTagName('head')[0].appendChild(script);

        var defaultEvents = [
          { event: "setAccount", account: 22418},
          { event: "setCustomerId", id: options.id},
          { event: "setHashedEmail", email: options.email},
          { event: "setSiteType", type: siteType}
        ];

        var events = [].concat(defaultEvents, customEvents);

        // criteo homepage
        window.criteo_q.push(events);
      }
    }
  },

  setPageName: function(pageName) {
    window.criteo_q.push({
      event: pageName
    });
  }
};
