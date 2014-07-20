'use strict';

angular.module('atlasApp')
  .controller('MainCtrl', function($scope, $http, $q) {
    console.log('Main Controller Initialized');

    $scope.searchPlaces = function(query) {
      var deferred = $q.defer();

      Parse.Cloud.run("placesSearch", {query: query}).then(function(res) {
        console.log(res);
        window.res = res;
        deferred.resolve(res);
      });

      return deferred.promise;
    };

  });