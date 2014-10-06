'use strict';

angular.module('atlasApp').directive('searchBar', function() {
  return {
    restrict: 'E',
    scope: {
      // Search results are provided here upon clicking the search button
      results: '=',
      // The query text that goes in the search bar
      query: '=',
      // Whether the search bar should be overlayed or take its own space
      overlay: '@'
    },
    templateUrl: '/views/directives/SearchBar.html',
    controller: function(
        $scope,
        $analytics,
        $location,
        cfpLoadingBar) {
      /**
       * Provides autocomplete suggestions as you type the query
       */
      $scope.autocomplete = function(query) {
        var places = Parse.Cloud.run("placeAutocomplete", {query: query});
        return places;
      };

      /**
       * Google Analytics for Autocomplete
       */
      $scope.onAutocompleteSelect = function(item, model, label) {
        $analytics.eventTrack(
          'Click Autocomplete Suggestion',
          { category: 'Search' }
        );
        $scope.search(model.id);
      }

      /**
       * Used to request a search with the provided query
       */
      $scope.search = function(query) {
        $location.url('/place/' + query);
      }

      /**
       * Performs the actual search and provides the results
       */
      $scope._search = function(query) {
        cfpLoadingBar.start();
        Parse.Cloud.run("placeSearch", {query: query}).then(function(res) {
          $scope.results = res;
          cfpLoadingBar.complete();
        });
      };

      // If the directive is instantiated with a pre-existing query, perform a
      // a search.
      if ($scope.query) {
        $scope._search($scope.query);
      }
    },
    compile: function(element, attrs) {
      // Default values
      if (!attrs.overlay) {
        attrs.overlay = false;
      }
    }
  };
});