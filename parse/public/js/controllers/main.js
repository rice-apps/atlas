'use strict';

angular.module('atlasApp').controller('MainCtrl', function(
    $routeParams,
    $scope) {
  $scope.searchResults = [];
  window.searchResults = $scope.searchResults;
  if ($routeParams.q) {   // If url contains search query, perform search
    $scope.query = $routeParams.q;
  }
});
