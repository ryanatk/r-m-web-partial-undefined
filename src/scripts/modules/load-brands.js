var $ = require('jquery');
var defaults = require('lodash/defaults');

module.exports = loadBrandsURL;

function loadBrandsURL(elem, options) {
  if (!elem) {
    return;
  }

  options = options || {}
  defaults(options, {
    navigateFunc: function(url) {
      window.location.assign(url);
    },
    path: window.location.href
  });

  var $newarrivals = $('#newarrivals');
  var $sortBy = $('#sortby');
  var urlParams = {
    path: options.path,
    sortBy: $sortBy.find('option:selected').length > 0 ? $sortBy.find('option:selected').val() : [],
    designers: getMultiItemOptions($('#alldesigners')),
    sizes: getMultiItemOptions($('#allsizes')),
    colors: getMultiItemOptions($('#allcolors')),
    arrivalDate: $newarrivals.length > 0 ? $newarrivals.prop('value') : '',
    pageNum: parseInt($('#pageNum_param').val())
  };
  var isNewPage = $newarrivals.length > 0;
  var selectFromCategory = $(elem).closest('div').prop('id') === 'plp_filter_dd';

  // category filters
  if (selectFromCategory) {
    urlParams.path = $(elem).data('caturl');
    resetFilters(urlParams);
  }

  // new arrival dates
  if (isNewPage && !selectFromCategory) {
    urlParams.path = $newarrivals.find('option:selected').data('url');
    urlParams.arrivalDate = $newarrivals.prop('value');
  }

  switch (elem.id) {
    case 'pre_btn':
      urlParams.pageNum = urlParams.pageNum - 1;
      break
    case 'next_btn':
      urlParams.pageNum = urlParams.pageNum + 1;
      break
    case 'apply_filters':
      urlParams.pageNum = 1;
      break;
  }

  var newURL = '';
  var alreadyParams = (urlParams.path.indexOf("?") > -1);
  urlParams.path = removeFilterParams(urlParams);
  if (alreadyParams) {
    var amp = '&';
    if (urlParams.path.indexOf("?") === (urlParams.path.length - 1)) {
      amp = '';
    }
    newURL = urlParams.path + amp + getFilterParams(urlParams);
  } else {
    newURL = urlParams.path + '?' + getFilterParams(urlParams);
  }

  // append arrival date for selected status
  if (isNewPage) {
    newURL = newURL + "&arrivalDate=" + urlParams.arrivalDate;
  }

  options.navigateFunc(newURL);
}

function resetFilters(urlParams){
  urlParams.designers = [];
  urlParams.sizes = [];
  urlParams.colors = [];
  urlParams.arrivalDate = '';
  urlParams.pageNum = 1;
}

function getFilterParams(urlParams) {
  var i;
  var len;
  var newURL = 'sortBy=' + urlParams.sortBy;

  for (i = 0, len = urlParams.designers.length; i < len; i++) {
    newURL = newURL + '&designer=' + encodeURIComponent(urlParams.designers[i]);
  }

  for (i = 0, len = urlParams.sizes.length; i < len; i++) {
    newURL = newURL + '&size=' + urlParams.sizes[i];
  }

  for (i = 0, len = urlParams.colors.length; i < len; i++) {
    newURL = newURL + '&color=' + urlParams.colors[i];
  }

  return newURL + '&pageNum=' + urlParams.pageNum;
}

function removeFilterParams(urlParams) {
  // assume filter params are followed by each other
  // starts from sortby and ends at pagenume
  var startString = '&sortBy=';
  var endString = '&pageNum=' + parseInt($('#pageNum_param').val());
  var start = urlParams.path.indexOf(startString);
  var end = urlParams.path.indexOf(endString) + endString.length;
  if (start < 0) {
    start = urlParams.path.indexOf('sortBy=')
    if (start < 0) {
      return urlParams.path;
    }
  }

  return urlParams.path.substring(0, start) + urlParams.path.substring(end);
}

function getMultiItemOptions(element){
  if (element && element.length > 0){
    // Remove empty values (i.e., the "All" value) if there are other values
    // Customer will have clear all filters or de-select filters to get back the "All" value
    var options = element.val() || [];
    var rtn = [];

    if (options.length > 1) {
      for (var i = 0, len = options.length; i < len; i++){
        if (options[i] != '') {
          rtn.push(options[i]);
        }
      }
      options = rtn;
    }
    return options;
  } else {
    return [];
  }
}
