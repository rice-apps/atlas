'use strict';

angular.module('atlasApp').controller('MainCtrl', 
  function($location, $routeParams, $scope, $http, $q, cfpLoadingBar) {

    $scope.searchResults = [];

    /**
     * Provides autocomplete suggestions as you type the query
     */
    $scope.autocomplete = function(query) {
      return Parse.Cloud.run("placeAutocomplete", {query: query});
    };

    $scope.onAutocompleteSelect = function(item, model, label) {
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
        $scope.searchResults = res;
        cfpLoadingBar.complete();
      });
    };

    if ($routeParams.q) {   // If url contains search query, perform search
      $scope.query = $routeParams.q;
      $scope._search($routeParams.q);
    }

  }
);