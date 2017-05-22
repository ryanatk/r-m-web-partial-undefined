module.exports = (function() {
	var $ = require('jquery');
	var Bloodhound = require('vendor/typeahead'); // Load typeahead jQuery plugin
	var rcProps = window.rcProps;
	var Mustache = require('mustache');

	function initTypeahead() {

		// Products
		var products = new Bloodhound({
			datumTokenizer: Bloodhound.tokenizers.obj.whitespace("productName"),
			queryTokenizer: Bloodhound.tokenizers.whitespace,
			remote: {
				url: '/r/ajax/VisualSearch.jsp?q=%QUERY&d=' + rcProps.get("department"),
				wildcard: '%QUERY'
			}
		});

		// Text Suggestions
		var textSuggestions = new Bloodhound({
			datumTokenizer: Bloodhound.tokenizers.obj.whitespace("searchTerm"),
			queryTokenizer: Bloodhound.tokenizers.whitespace,
			remote: {
				url: '/r/ajax/TextSuggestions.jsp?q=%QUERY&d=' + rcProps.get("department"),
				wildcard: '%QUERY'
			}
		});

		// Sets up the "search" button to toggle the search area and set focus.
		$("#tr_top_search_btn").click(function () {
			var $this = $(this);
			var $toggleEl = $($this.attr("data-toggle"));
			var $input = $('.js-site-search__textbox');
			var focus = !$input.is(":visible");
			$toggleEl.slideToggle();
			if (focus) {
				$input.focus();
			}
			logEngagement('search_engagement');
		});

		var sources = [
			{
				hint: false,
				highlight: true,
				minLength: 1, // FIXME: Replace with soft-coding.
				classNames: {
					menu: 'site-search__results',
					highlight: 'site-search__highlight',
					dataset: "g n-block-grid--2"
				}
			},
			{
				name: 'textSuggestions',
				display: function (obj) {
					return obj.suggestion;
				},
				source: textSuggestions,
				templates: {
					suggestion: (function () {
						var template = rcProps.get("search.text.templates.line");
						return function (data) {
							return Mustache.render(template, data);
						}
					}())
				},
				limit: rcProps.get("search.text.limit")
			}
		];

		if ("B" == rcProps.get("testgroups.mobileProductSuggestionsTypeahead")) {
			sources.push({
				name: 'productSuggestions',
				display: 'productName',
				source: products,
				templates: {
					header: rcProps.get("search.visual.templates.header"),
					footer: rcProps.get("search.visual.templates.footer"),
					suggestion: (function () {
						var template = rcProps.get("search.visual.templates.line");
						return function (data) {
							return Mustache.render(template, data);
						}
					}())
				},
				limit: rcProps.get("search.visual.limit")
			});
		}

		// Creates typeahead feature on search box.
		var textbox = $('.js-site-search__textbox');
		textbox.typeahead.apply(textbox, sources)
			.on('typeahead:select', function (event, suggestion) {
				console.log(suggestion); // Just dump the suggestion object to the console for debugging. FIXME: DO NOT COMMIT TO CODE REPOSITORY!
				logEngagement("click_search_suggestion_" + (suggestion.termType || "search"));
				if ("productURL" in suggestion) {
					window.location.href = suggestion.productURL;
				}
				else if ("suggestionUrl" in suggestion) {
					window.location.href = suggestion.suggestionUrl;
				}
				else {
					var href = '/content/s/ct?type=' + suggestion.typeShortCode + '&q=' + suggestion.searchTerm + '&s=' + suggestion.suggestion + '&d=' + rcProps.get("department");
					window.location.href = href;
				}
			});

		// Stacked Search Suggestion Layout
		$(".tt-dropdown-menu")
			.addClass("site-search__predictions")
			.css({
				"left": "",
				"z-index": "",
				"right": ""
			});
		$(".twitter-typeahead").addClass("site-search__typeahead form-search__input").css({ display: "inline-block" });
		$(".tt-dataset-textSuggestions").addClass("site-search__suggestions");
		$(".tt-dataset-products").addClass("g")
			.addClass("n-block-grid--2");
		$(".site-search__results div").first().removeClass("g n-block-grid--2  n-block-grid--2-textSuggestions");
		$(".tt-highlight").addClass("site-search__highlight");
		$(".tt-dataset-products").addClass("predict-related");
		$('.site-search__results').appendTo(".nav_wrap");
		$('.site-search__results').css({ width: "100%" });
	}


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

	function initEventHandlers() {
		// get vars
		var searchEl = $(".js-search-form");
		var labelEl = $(".js-toggle-form-search");
		var textbox = $(".js-site-search__textbox");
		var exitEl = $(".js-toggle-form-search-x");

		//register clicks and toggle classes
		labelEl.click(function () {
			if (searchEl.hasClass("is-displayed")) {
				searchEl.removeClass("is-displayed");
				labelEl.removeClass("is-active");
				searchEl.removeClass("form-search--full");

			}
			else {
				searchEl.addClass("is-displayed");
				labelEl.addClass("is-active");

				// input[0].selectionStart = input[0].selectionEnd = input.val().length;
			}
		});

		textbox.keyup(function () {
			if (textbox.val().length > 0) {
				searchEl.addClass("form-search--full");
			}
			else {

				searchEl.removeClass("form-search--full");
			}
		});

		$(".site-search__toggle-btn").on("click", function (e) {
			e.preventDefault();
			textbox.focus();
		});

		exitEl.click(function () {
			searchEl.removeClass("form-search--full");
			textbox.focus();
		});
	}

	return {
		init: function() {
			initTypeahead();
			initEventHandlers();
		}
	};
}());

