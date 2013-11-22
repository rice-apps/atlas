var mapApp = angular.module('mapApp', []);

mapApp.controller('SearchCtrl', function($scope, $http, $window) {
    // init function for body.
    $scope.init = function() {
        initializeMap();
    };

    // declare Fuse searcher
    var searcher;

    // declare the google map.
    var map;

    //init search results.
    $scope.searchResults = [];

    // init the open status for the search results.
    $scope.open = true;

    $scope.hideSearchResults = function(clickedElement) {
        if (clickedElement.target.id !== 'searchBox') {
            $scope.open = false;
        }
        else {
            $scope.open = true;
        }
    }

    $http.get('/data/campus_data.json').then(function(result) {
        // set the fuse searcher.
        var options = {
          keys: ['name']
        }
        searcher = new Fuse(result.data, options);

        // add markers to the map.
    });

    $scope.$watch('searchText', function(newValue, oldValue) {
        if (searcher !== undefined) {
            $scope.searchResults = searcher.search(newValue);
        }
    });

    /**
     * Add code for initializing the map.
     */
    function initializeMap() {
        var mapOptions = {
          zoom: 17,
          center: new google.maps.LatLng(29.718204, -95.400000),
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);


    }

});