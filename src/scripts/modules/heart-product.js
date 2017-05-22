var $ = require('jquery');
var defaults = require('lodash/defaults');
var PRODUCT_CODE = 'data-pcode';
var SELECTORS = {
  totalCount: '#tr_top_heart_mhp_count',
  favHeart: '.fav_heart'
};
var CLASS_NAMES = {
  activated: 'favorite-button--active'
};
var REQUESTS = {
  heartProduct: {
    url: '/r/ajaxHeartProduct.jsp?',
    method: 'POST'
  },
  totalCount: {
    url: '/r/AjaxHeartTotalCount.jsp',
    method: 'POST'
  }
};

module.exports = init;
defaults(module.exports, {
  heartProductM: heartProductM,
  heartAll: heartAll,
  SELECTORS: SELECTORS,
  CLASS_NAMES: CLASS_NAMES,
  REQUESTS: REQUESTS
});

function init(selector, delegateTo) {
  var $el = $(selector);

  if (delegateTo) {
    $el.on('click', delegateTo, function(e) {
      var target = e.currentTarget;
      heartProductM(target, target.getAttribute(PRODUCT_CODE));
    });
  } else {
    $el.on('click', function(e) {
      var target = e.target;
      heartProductM(target, target.getAttribute(PRODUCT_CODE));
    });
  }
}

function heartProductM(elem, pcode, size, sectionUrl){
  var $span = $(elem);
  if ($span.hasClass(CLASS_NAMES.activated)){
    $span.removeClass(CLASS_NAMES.activated);

    submitHeart('product', pcode, 'remove', size, sectionUrl);

    if(window.rcProps.removeItemOnUnhearted){
        var $citeDiv = $span.parents('.js-plp-container');
        $citeDiv.fadeOut();
        $citeDiv.remove();
        var count = $("#heart_total_count").html();
        if ((count - 1) <= 0) {
            var url = window.location.href.replace(/departmentFilter=[^&]*/, ""); // Remove the filter.
            window.location.replace(url);
        }
    }
  } else {
    $span.addClass(CLASS_NAMES.activated);
    return submitHeart('product', pcode, 'add', size, sectionUrl);
  }
}

function submitHeart(paramtype, paramvalue, action, psize, sectionUrl) {
  var data = {};
  var heartInfo = {};

  if (!paramtype) {
    return rejectPromise('param type is required when hearting a product');
  } else if (!paramvalue) {
    return rejectPromise('param value is required when hearting a product');
  } else if (!action) {
    return rejectPromise('action is required when hearting a product');
  }

  switch (paramtype) {
    case 'product':
      data.pcode = paramvalue;
      break
    case 'brand':
      data.bcode = paramvalue;
      break
  }

  data.action_T = action;

  if (psize) {
    data.psize = psize;
  }

  if (sectionUrl) {
    data.sectionURL = sectionUrl;
  }


  return requestHeartProduct(data)
    .then(function(heartStatus) {
      heartInfo.heartStatus = heartStatus.success;
      return updateHeartCount();
    })
    .then(function(totalCount) {
      heartInfo.totalCount = totalCount;
      return heartInfo;
    })
    // .then(function() {
    //   if(action =='add' && paramtype=='product') {
    //       insertCordialUpdateHeartItem('add', paramvalue);
    //   }
    //   if(action == 'remove' && paramtype=='product') {
    //       insertCordialUpdateHeartItem('remove', paramvalue);
    //   }
    //   return true;
    // });
}

function sanitizeResponse(str) {
  return str.replace(/^\s+|\s+$/g,'');
}

function rejectPromise(msg) {
  return $.Deferred().reject(new Error(msg));
}

function requestHeartProduct(data) {
  return $.ajax({
      type: REQUESTS.heartProduct.method,
      url: REQUESTS.heartProduct.url,
      data: data
    })
    .then(function(res) {
      return res;
    });
}

function updateHeartCount() {
  return $.ajax({
      type: REQUESTS.totalCount.method,
      url: REQUESTS.totalCount.url,
      cache: false
    })
    .then(function(res) {
      var count = sanitizeResponse(res);
      $(SELECTORS.totalCount).html(count);
      return count;
    });
}

//this method only use in mobile display product page
function heartAll(elem){
  if ($(elem).find('span').hasClass(CLASS_NAMES.activated)){
    $('.fav_heart').removeClass(CLASS_NAMES.activated);
  } else {
    $('.fav_heart').addClass(CLASS_NAMES.activated);
  }
}
