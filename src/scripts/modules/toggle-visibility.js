var $ = require('jquery');

module.exports = function(id, speed) {
  speed = speed || 'fast';
  $(document.getElementById(id)).slideToggle(speed);
};

