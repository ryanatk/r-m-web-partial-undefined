var $ = require('jquery');
var SELECTORS = {
  sortBy : '#sortby',
  clearFilter: '#clear_filters',
  applyFilter: '#apply_filters',
  filterClickable: '.plp-filter-clickable',
  catFilter : '#category'
};

module.exports = manageRefineMenu;
module.exports.SELECTORS = SELECTORS;

function manageRefineMenu() {

    $(SELECTORS.clearFilter).click(function(event) {
        event.preventDefault();
        $('#alldesigners, #allcolors, #allsizes, #category').prop('selectedIndex', 0);
        $(SELECTORS.applyFilter).click();
    });

    $(SELECTORS.sortBy).change(function(){
        $(SELECTORS.applyFilter).click();
    });

    $(SELECTORS.catFilter).change(function(){
        $(SELECTORS.applyFilter).click();
    });

    $(SELECTORS.filterClickable).click(function(e){
        e.preventDefault();
        loadBrandsURL(this);
    });

}

function getMultiItemOptions(element){
    if (element && element.length > 0){
        // Remove empty values (i.e., the "All" value) if there are other values
        // Customer will have clear all filters or de-select filters to get back the "All" value
        var options = element.val();
        if (options && options.length > 1){
            var rtn = [];
            for (var i=0; i<options.length; i++){
                if (options[i] != '')
                    rtn.push(options[i]);
            }
            options = rtn;
        }
        return options;
    } else {
        return [''];
    }
}

function loadBrandsURL(elem, featuredSort){
    if (elem === 'undefined')
        return;
    var urlParams = {
        path: window.location.href,
        sortBy: (featuredSort!=null && featuredSort!='')? featuredSort:($('#sortby option:selected').length > 0 ? $('#sortby option:selected').val() : ['']),
        catFilter : $('#category').val(),
        designers: getMultiItemOptions($('#alldesigners')),
        sizes: getMultiItemOptions($('#allsizes')),
        colors: getMultiItemOptions($('#allcolors')),
        arrivalDate: $('#newarrivals').length > 0 ? $('#newarrivals').prop('value') : '',
        pageNum: parseInt($('#pageNum_param').val())
    };
    var isNewPage = $('#newarrivals').length > 0;
    var selectFromCategory = $(elem).closest('div').prop('id') === 'plp_filter_dd';
    var isPreNextBtn = elem.id === 'prev_btn' || elem.id === 'next_btn';
    // category filters
    if (selectFromCategory) {
        urlParams.path = $(elem).data('caturl');
        resetFilters(urlParams);
    }

    // new arrival dates
    if (isNewPage && !selectFromCategory && !isPreNextBtn) {
        urlParams.path = $('#newarrivals option:selected').data('url');
        urlParams.arrivalDate = $('#newarrivals').prop('value');
    }

    // pagination
    if (elem.id === 'prev_btn')
        urlParams.pageNum = urlParams.pageNum - 1;
    if (elem.id === 'next_btn')
        urlParams.pageNum = urlParams.pageNum + 1;

    if($(elem).hasClass("pagination__link")){
        urlParams.pageNum = $(elem).data("pageNo");
    }
    // redirect to page 1 when filter is reset
    if (elem.id === 'apply_filters')
        urlParams.pageNum = 1;

    var newURL = '';
    var alreadyParams = (urlParams.path.indexOf("?") > -1);
    //var isPrettyURL = (urlParams.path.indexOf(".jsp") < 0);
    urlParams.path = removeFilterParams(urlParams);
    if (alreadyParams) {
        var amp = '&';
        if (urlParams.path.indexOf("?") === (urlParams.path.length - 1))
            amp = '';
        newURL = urlParams.path + amp + getFilterParams(urlParams);
    } else {
        newURL = urlParams.path + '?' + getFilterParams(urlParams);
    }

    // append arrival date for selected status
    if (isNewPage)
        newURL = newURL + "&arrivalDate=" + urlParams.arrivalDate;

    window.location.assign(newURL);
}

function resetFilters(urlParams){
    urlParams.designers = [''];
    urlParams.sizes = [''];
    urlParams.colors = [''];
    urlParams.arrivalDate = '';
    urlParams.catFilter = '';
    urlParams.pageNum = 1;
}

function getFilterParams(urlParams){
    var newURL = 'sortBy=' + urlParams.sortBy;
    var i = 0;
    if (urlParams.designers) {
        for (i = 0; i < urlParams.designers.length; i++) {
            if(urlParams.designers[i] != ''){
                newURL = newURL + '&designer=' + encodeURIComponent(urlParams.designers[i]);
            }
        }
    }
    if (urlParams.sizes) {
        for (i = 0; i < urlParams.sizes.length; i++) {
            if(urlParams.sizes[i] !=''){
                newURL = newURL + '&size=' + urlParams.sizes[i];
            }
        }
    }
    if (urlParams.colors) {
        for (i = 0; i < urlParams.colors.length; i++) {
            if(urlParams.colors[i] != ''){
                newURL = newURL + '&color=' + urlParams.colors[i];
            }
        }
    }
    if(urlParams.catFilter){
        newURL = newURL + '&catFilter=' + urlParams.catFilter;
    }

    newURL = newURL + '&pageNum=' + urlParams.pageNum;
    return newURL;
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
        if (start < 0)
            return urlParams.path;
    }

    var resultPath = urlParams.path.substring(0, start) + urlParams.path.substring(end);

    return resultPath;
}




