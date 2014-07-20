'use strict';

angular.module('atlasApp')
  .controller('MainCtrl', function($scope, $http, $q) {
    console.log('Main Controller Initialized');

    $scope.searchPlaces = function(query) {
      return Parse.Cloud.run("placesSearch", {query: query});
    };

  });