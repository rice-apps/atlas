var mapApp = angular.module('mapApp', []);

mapApp.controller('SearchCtrl', function($scope, $http) {
    // declare Fuse searcher
    var searcher;

    $scope.searchResults = [];

    $http.get('/data/campus_data.json').then(function(result) {
        // set the fuse searcher.
        var options = {
          keys: ['name']
        }
        searcher = new Fuse(result.data, options);
    });

    $scope.$watch('searchText', function(newValue, oldValue) {
        if (searcher !== undefined) {
            $scope.searchResults = searcher.search(newValue);
        }
    });

});