var $ = require('jquery');
var toggleVisibility = require('modules/toggle-visibility');

require('vendor/jquery.autocomplete');

module.exports = Search;

function Search(searchFieldSelector) {
  this.$searchField = $(searchFieldSelector);
  this.initAutocomplete();
  this.attachEventListeners();
}

Search.prototype.attachEventListeners = function() {
  $('#clear-search').on('click', this.clearSearchField.bind(this));
  $('.top_search_btn').on('click', this.focusSearchTerm.bind(this));
  $('#search-header-target').on('click', this.toggleSearchBox);
};

Search.prototype.clearSearchField = function() {
  this.$searchField.val('');
};

Search.prototype.focusSearchTerm = function() {
  this.$searchField.focus();
};

Search.prototype.toggleSearchBox = function(e) {
  e.preventDefault();
  toggleVisibility('header_search_mhp');
};

Search.prototype.initAutocomplete = function() {
  this.$searchField.autocomplete(
    "/mobile/SearchSuggestions.jsp",
    {
      delay:100,
      minChars:2,
      matchSubset:1,
      matchContains:1,
      cacheLength:1,
      maxItemsToShow: 20,
      formatItem:this.formatItem,
      autoFill:false
    }
  );
};

Search.prototype.formatItem = function(row) {
  var searchTerm = this.$searchField.val();
  var start = searchTerm.length;

  var displayString = row[0].substr(0,start) + '<span>' + row[0].substr(start,row[0].length) + '</span>';
  return displayString;
};
