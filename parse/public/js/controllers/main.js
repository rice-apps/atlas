'use strict';

angular.module('atlasApp').controller('MainCtrl', function(
  $location,
  $routeParams,
  $scope,
  $http,
  $q,
  $analytics,
  cfpLoadingBar
) {

  $scope.searchResults = [];

  /**
   * Provides autocomplete suggestions as you type the query
   */
  $scope.autocomplete = function(query) {
    var places = Parse.Cloud.run("placeAutocomplete", {query: query});
    return places;
    // var courses = Parse.Cloud.run("courseAutocomplete", {query: query});
    // return places + courses
  };

  $scope.onAutocompleteSelect = function(item, model, label, from) {
    $analytics.eventTrack(
      'Click Autocomplete Suggestion from ' + from,
      { category: 'Search' }
    );
    $scope.search(model.id);
  }
  
  /**
   * Google Analytics for Click Url to Place
   */
  $scope.clickLinkToPlace = function(item, model, label) {
    $analytics.eventTrack(
      'Click link to Place',
      { category: 'Result' }
    );
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
      $scope.searchResults = res;
      cfpLoadingBar.complete();
    });
  };

  if ($routeParams.q) {   // If url contains search query, perform search
    $scope.query = $routeParams.q;
    $scope._search($routeParams.q);
  }

});
