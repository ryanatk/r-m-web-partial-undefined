//this one is a tracking feature on search result page
//we can not add it to plp.js since it adds tracking to all product clicks
//maybe move to a track js in the future
var $ = require('jquery');
var SELECTORS = {
  citem : '.citem',
  productRec: '.js-product-rec'
};

module.exports = initSearch;
module.exports.SELECTORS = SELECTORS;

function initSearch(){
    $(SELECTORS.citem).click(function() {
        logEngagement("click_search_result");
    });

    $(SELECTORS.productRec).click(function() {
        logEngagement("no_search_results_click_rec");
    });

    function logEngagement(action) {
        console.log("logEngagement('" + action + "'");
        $.ajax({
            type: 'POST',
            data: $.param({
                url: window.location.href,
                module: "mobile_search",
                action: action

            }),
            url: '/r/ajax/LogEngagement.jsp'
        });
    }
}





