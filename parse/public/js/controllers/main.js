'use strict';

angular.module('atlasApp')
  .controller('MainCtrl', function($scope, $http, $q) {
    console.log('Main Controller Initialized');

    $scope.placeAutocomplete = function(query) {
      return Parse.Cloud.run("placeAutocomplete", {query: query});
    };

  });