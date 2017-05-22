/**
 * Responsible for creating an toggleContent based on elements existing in the DOM
 * @module modal
 */

var $ = require('jquery');

// js-modal
// ========


    // Settings
    var pluginName = "modal",
    defaults = {
      url: "",
      type: "",
      open: null,
      cache: true,
      overlayClose: true,
      triggerOpen: false,
      onComplete : function () {}
    };

    // Ctor
    function Plugin( element, options ) {
        // If options doesn't exist assign empty object
        options = options || {};
        this.element    = element;
        // If options.open exist, assign its value otherwise use the data attribute
        this.modal      = options.open ? options.open : $( element ).data("open");
        this.options    = $.extend( {}, defaults, $("#"+this.modal).data() , options) ;
        this._defaults  = defaults;
        this._name      = pluginName;
        this.init();
    }

    // Init
    Plugin.prototype.init = function () {

        var options = this.options;
        // Selectors Vars
        var $body = $("body");
        var $modal = $("#" + this.modal);
        var $modalOverlay, $modalContent;
        var $modalButton = $( this.element );
        var $modalHTML = $("<div/>",{class : "modal"});
        // Booleans Vars
        var stopPageScroll = true;
        var ajaxContentLoaded = false;
        var overlay = true;

        // Steps
        //
        // If this modal loads ajax
        checkAjaxModal();

        if($modal) {
          // Add modal with overlay
          addModalOverlay();
          // Wrap modal content with wrapper div to help with scrolling
          wrapModalContent();
          // Adjust and set classes and options for appropriate modal type
          adjustToModalType();
          // Add all necessary listeners for modal controls
          setEventListeners();
          // If modal opens by default
          checkTriggerOpen()
        }

        function adjustToModalType() {
          switch(options.type) {
              case "full":
                $modal.addClass("modal--full");
              break;
              case "top":
                $modal.addClass("modal--top");
              break;
              case "notification":
                $modal.addClass("modal--notification");
                options.overlayClose = false;
                stopPageScroll = false;
                overlay = false;
              break;
          }
        }

        function checkAjaxModal() {
          // If url exist assign options modal to empty modal
          if(options.url !== "") {
            prependEmptyModal();
          }
        }

        function checkTriggerOpen() {
          if(options.triggerOpen) {
            initOpenModal();
          }
        }

        function prependEmptyModal() {
          $modalHTML.prependTo("body");
          $modal = $modalHTML;
          // Temporary till framework is full implemented
          $modal.wrap("<div class='eagle'></div>");
        }

        function wrapModalContent() {
          if(!$modal.find(".modal__content").length) {
            $modal.wrapInner("<div role='dialog' aria-label='modal' class='modal__content'></div>");
          }
          $modalContent = $modal.find(".modal__content");
        }

        function addModalOverlay() {
          if(!$(".modal-overlay").length) {
            $("<div class='modal-overlay'></div>").appendTo("body");
          }
          $modalOverlay = $(".modal-overlay");
          // Temporary till framework is full implemented
          $modalOverlay.wrap("<div class='eagle'></div>");
        }

        function setEventListeners() {
          // Add listener to button to open modal
          $modalButton.on("click", function(){
            initOpenModal();
          });

          // Add listener modal content for modalCloseClass to close modal
          $modalContent.on("click", ".js-modal-close", closeModal );

          // Stop the clicks from bubbling up
          $modalContent.on("click", function(e){
            e.stopPropagation();
          });

          // Add listener to outside of the modal if set true
          if(options.overlayClose) {
            $modal.on("click", closeModal);
          }
        }

        function initOpenModal() {
            // Ensure one modal is open at a time
            closeAllModals();
            // If url is defined and if ajax content have not been loaded
            // or url is defined and cache is false to reload new content
            if(options.url !== "" && !ajaxContentLoaded || options.url !== "" && !options.cache) {
              $.ajax({method: "POST", url: options.url })
              .done(function( content ) {
                  ajaxContentLoaded = true;
                  $modalContent.append( content );
                  options.onComplete();
                  openModal();
              });
            } else {
              openModal();
            }
        }

        function openModal() {
          $modal.addClass("is-active");
          $modalContent.scrollTop(0);

          if(overlay) {
            $modalOverlay.addClass("is-active");
          }
          if(stopPageScroll) {
            $body.css({overflow:"hidden"});
          }
          if(options.type === "notification") {
            setNotificationDuration();
          }

          // Shift and trap focus to modal
          // Get transition duration of modalcontent animation to focus on it
          var transitionDuration = $modalContent.css('transition-duration').replace("s","") * 1000 ;
          setTimeout(function(){
          },transitionDuration);

        }

        function closeAllModals() {
          $(".modal-overlay").removeClass("is-active");
          $(".modal").removeClass("is-active");
        }

        function closeModal() {
          if(overlay) {
            $modalOverlay.removeClass("is-active");
          }
          if(stopPageScroll) {
            $body.css({overflow:""});
          }

          $modal.removeClass("is-active");
          // Shift focus back to last focus

          // Get transition duration of modalcontent animation to focus on it
          var transitionDuration = $modalContent.css('transition-duration').replace("s","") * 1000 ;

          setTimeout(function(){
            if(!options.cache) {
                $modalContent.empty();
            }
          },transitionDuration);
        }

        function setNotificationDuration() {
          // Set Timer base on number of words
          var numWords = $modalContent.text().replace(/^[\s,.;]+/, "").replace(/[\s,.;]+$/, "").split(/[\s,.;]+/).length;
          // Each word equates to slightly half a second
          setTimeout(closeModal, numWords * 400);
        }
    };

    // Plugin wrapped ctor
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new Plugin( this, options ));
            }
        });
    }

$(window).load(function() {
    $(".js-modal").modal();
});

// Utility method for Modal
$.modal = function(options) {
    options["triggerOpen"] = true;
    $("<div/>").modal(options);
}
