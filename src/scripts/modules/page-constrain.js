// Toggle Page Overflow / Constraints
var $ = require('jquery');

$(function(){
    $(".js-constrain-page").on("click", function() {
        var $bodyAndHtml = $("html, body");
        var constrainClass = "page-constrain";
        if(!$bodyAndHtml.hasClass(constrainClass)) {
            $bodyAndHtml.addClass(constrainClass);
        } else {
             $bodyAndHtml.removeClass(constrainClass);
        }
    });
});
