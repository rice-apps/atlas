'use strict';

angular.module('atlasApp')
  .controller('MainCtrl', function($scope, $http, $q) {
    console.log('Main Controller Initialized');

    $scope.searchResults = [];

    $scope.autocomplete = function(query) {
      return Parse.Cloud.run("placeAutocomplete", {query: query});
    };

    $scope.search = function(query) {
      console.log("Performing search");
      Parse.Cloud.run("placeSearch", {query: query}).then(function(res) {
        $scope.$apply(function() {
          $scope.searchResults = res;
          console.log("Updated $scope.searchResults");
          console.log($scope.searchResults);
        });
      });
    };

    $scope.searchEnter = function(keyEvent, query) {
      if (keyEvent.which == 13) { // Enter pressed
        console.log("Enter pressed");
        $scope.search(query);
      }
    }

  });