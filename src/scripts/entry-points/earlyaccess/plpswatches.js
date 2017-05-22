var $ = require('jquery');

module.exports = function(){
    var productData = {}; // populated via ajax below.
    var codes = []; // List of product codes for which to retrieve data.
    var department = "F"; // Default to women's. Set later when we find out for sure.
    var layoutChangeHandlers = [];

    $("div.js-plp-container").each(function () {
        var $div = $(this);
        var $swatchContainer = $div.find('.js-plp-swatches');
        if ($swatchContainer.length) {
            createSwatchDropDown($div.find(".js-plp-swatches"));
        }
        createSwatchClickHandlers($(this));
        $(window).on("layout-change", onLayoutChange);

    });
    $.ajax({
        url: "/r/ajax/GetSwatchData.jsp",
        dataType: "json",
        method: "POST",
        data: {
            product: codes,
            department: department,
            mobile : true
        }
    }).success(function (json) {
        productData = json;
    });

    // columnView.js fires a custom event when it changes the layout.
    function onLayoutChange(event) {
        // This doesn't need to be synchronous. Let the event handler return
        // to re-flowing the page.
        window.setTimeout(function() {
            layoutChangeHandlers.forEach(function (f) {
                try { f(event); }
                catch (e) { console.log(e); }
            });
        }, 1);
    }

    function createSwatchClickHandlers($div) {
        var $heart = $div.find('.fav-item');
        var $qv = $div.find(".js-plp-quickview");
        var $img = $div.find(".js-plp-image"); // *Seems to be the only one... need to add class.
        var $name = $div.find(".js-plp-name");
        var $brand = $div.find(".js-plp-brand");
        var $price = $div.find(".js-plp-price");
        var $link = $div.find(".js-plp-pdp-link");
        var $retail = $div.find(".js-plp-price-retail");
        var $swatches = $div.find(".js-plp-swatch");
        $swatches.each(function () {
            var code = $(this).data("code");
            department = $(this).data("department") || department; // Just stomp on the value. Last one wins.
            codes.push(code);
            $(this).click(function () {
                $swatches.removeClass("is-toggled");        // desktop
                $swatches.removeClass("plp_active_color "); // mobile
                $(this).addClass("is-toggled");             // desktop
                $(this).addClass("plp_active_color");       // mobile
                if (code in productData) {
                    var prod = productData[code];

                    $img.attr("src", prod.imgPlp);
                    $name.html(prod.name);
                    $brand.html(prod.brand);
                    $price.html(prod.price);
                    $retail.html(prod.retailPrice);
                    $link.prop("href", prod.url);
                    $qv.attr("data-code", code); // Updates parameter value to Quick View code.

                    //update heart status
                    $heart.attr("data-pcode", code);
                    $heart.toggleClass("favorite-button--active", prod.isFavorite);

                }
            });
        });

        $heart.click(function() {
            var code = this.getAttribute("data-pcode");
            if(productData[code]){
                productData[code].isFavorite = !(productData[code].isFavorite);
            }
        });
    }

    function createSwatchDropDown($container) {

        function toggleSwatches() {
            visible ? hide() : show();
        }

        function hide() {
            $container.animate({ height: contracted }, 200, function () {
                $up.hide();
                $down.show();
                visible = false;
            });
        }

        function show() {
            $container.animate({ height: expanded }, 200, function () {
                $down.hide();
                $up.show();
                visible = true;
            });
        }

        function init() {
            $container.css("height", ""); // Let the element expand/contract to its natural height.
            var containerWidth = $container.width();
            var numWide = Math.floor(containerWidth / swatchWidth);
            if (numWide >= numSwatches) {
                $toggle.hide();
            }
            else {
                $toggle.show();
                expanded = $container.height();
                $up.hide();
                $down.show();
                $container.height(contracted);
                visible = false;
            }
        }

        if ($container.find(".js-plp-swatch").length > 1) {
            var visible = false;
            var $swatches = $container.find(".js-plp-swatch");
            var $toggle = $container.find(".js-swatch-toggle-container");
            var $down = $toggle.find(".js-swatch-toggle-down");
            var $up = $toggle.find(".js-swatch-toggle-up");

            var numSwatches = $swatches.length;

            // Keep some dimensions handy.
            // We can't reliably determine the height of a single row of swatches, since we'd need to take into account
            // padding, margins, etc. $.position() is likewise unreliable since it returns a position relative to the
            // nearest offsetParent, which depends on CSS properties and might not be the actual parent. So we take a
            // good guess: we know how many rows there are, and we figure they're probably devided more-or-less evenly.
            var swatchWidth = $swatches.outerWidth() + Math.max(parseInt($swatches.css("margin-right")), parseInt($swatches.css("margin-left")));
            var swatchHeight = $swatches.outerHeight() + Math.max(parseInt($swatches.css("margin-top")), parseInt($swatches.css("margin-bottom")));
            var numRows = Math.floor($container.height() / swatchHeight);

            var expanded = 0;
            var contracted = Math.ceil($container.outerHeight() / numRows);

            $container.css("overflow-y", "hidden");
            layoutChangeHandlers.push(init);
            init();

            $down.click(toggleSwatches);
            $up.click(toggleSwatches);
            hide();
        }
    }
};

