var $ = require('jquery');
var SELECTORS = {
    addToBagDropDown: '.js-add-to-bag-select',
    clearOldFav : '#js-clear-old-fav',
    closePopupBtn : '.js-close-limit-popup',
    sendMyFavBtn : '#js-send-my-fav'
};

module.exports = init;
module.exports.SELECTORS = SELECTORS;

function init(){
    var isGuest = $('#limitPopup').data('isGuest');
    var productSize = $('#limitPopup').data('productSize');
    if (isGuest && productSize > 200) {
        $('#guestLimitPop').addClass('u-block');
    } else if (!isGuest && productSize > 2000) {
        $('#userLimitPop').addClass('u-block');
    }

    $(SELECTORS.addToBagDropDown).change(addToBagFromMyFav);
    $(SELECTORS.clearOldFav).click(clearOldFavItems);
    $(SELECTORS.closePopupBtn).click(closeLimitLightBox);

    initPopUp();
    initSendFavorites();

    $(SELECTORS.sendMyFavBtn).click(sendMyFavoriteEmail);
}

function sendMyFavoriteEmail() {
    var email = $('#email-favorites').val();
    if(!email){
        $('#email-favorites').addClass('has--error');
        return;
    }else{
        $('#email-favorites').removeClass('has--error');
    }
    var data = $.param({
        email: email,
        comment: $('#comment').val()
    });

    $.ajax({
        type: 'GET',
        url: '/r/ajax/SendMyFavoriteEmail.jsp',
        data: data
    }).success(function () {
        $('#js-fav-share-popup-form').hide();
        $('#js-fav-share-popup-thanks').slideDown();
    });
}
function addToBagFromMyFav(){
    var sizeOption = $(this).find("option:selected");
    var code = $(this).data('code');
    var productNameNoBrandNoColor = $(this).data('productName');
    var size = sizeOption.val();
    if(size == '' || code == ''){
        return;
    }

    if(sizeOption.data("showNotifyMe")){
        var url = "/r/mobile/BISAndSO.jsp?code=" + code;
        location.href = url;
        return;
    }

    var data = $.param({
        code : code,
        size : size,
        qty : 1,
        csrfHash : window.rcProps.csrfHash,
        sectionURL : $(this).data('sectionurl'),
        sessionID : $(this).data('sessionid')

    });

    if (typeof window.gaq != 'undefined') {
        window._gaq.push(['_trackEvent', 'Product', 'Add to Cart',
            code + ' | ' + productNameNoBrandNoColor + ' | 1'
        ]);
    }

    $.post("AddToCart.jsp", data, function(){
        $.when(window.insertPageTrackForMobile(true, code)).done(function(){
            var param = $.param({
                code : code
            });
            $.get("/r/mobile/dialog/AddToBagPopup.jsp", param, function(html){
                $("#add-to-bag-popup").html(html);
                $("#add-to-bag-popup").fadeIn();
                $("#add-to-bag-popup").find(".view-bag-btn").click(function(){
                    window.location = "/r/mobile/ShoppingBag.jsp";
                });
                $("#add-to-bag-popup").find(".continue-shopping-btn").click(function(){
                    $("#add-to-bag-popup").fadeOut();
                });
                $('body,html').animate({
                    scrollTop: 0
                }, 'fast');
                
                $.ajax({
                    type: "POST",
                    url: "/r/mobile/AjaxUserShoppingBag.jsp",
                    success: function(response) {
                        var responseObj = eval('(' + response + ')');
                        $("#shopping_bag_count").html(responseObj);
                    }
                });
            });
        });
    });

    try {
        window.optimizely = window.optimizely || window.parent.optimizely || window.top.optimizely || [];
        window.optimizely.push(["trackEvent", "addtobag"]);
    }
    catch (e) {
        console.log(e);
    }

}

function initPopUp() {
    var popup,
        popupAlt;

    $(".js-inpopup-toggle").on("click", function() {
        popup = $($(this).attr("data-inpopup"));
        popupAlt = $(".js-inpopup-alt-content");

        popup.show();
        popupAlt.hide();
    });

    $(".js-inpopup-close-btn").on("click", closeInpopup);

    function closeInpopup() {
        popup.hide();
        popupAlt.show();
    }

}

function initSendFavorites(){
    var favoritesSubmit =  $(".js-submit-favorites");
    favoritesSubmit.on("click", function(e){
        e.preventDefault();
        $("#js-fav-share-popup-form").hide();
        $("#js-fav-share-popup-thanks").show();
    });
}

function clearOldFavItems() {
    $.ajax({
        type: 'GET',
        url: '/r/ajaxHeartProduct.jsp?action_T=clearolditems',
        success: function () {
            location.reload();
        }
    });
}


function closeLimitLightBox() {
    var elemId = $(this).data('popupId');
    $('#' + elemId).removeClass('u-block');
}


