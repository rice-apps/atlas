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

    // init the lat/lng dictionary. Maps a latLng to various things.
    var latLngDict = {};

    //init search results.
    $scope.searchResults = [];

    // init the open status for the search results.
    $scope.open = true;

    // function that gets called on all clicks to hide/show search results.
    $scope.hideSearchResults = function(clickedElement) {
        if (clickedElement.target.id !== 'searchBox') {
            $scope.open = false;
        }
        else {
            $scope.open = true;
        }
    }

    // function for focusing on a building.
    $scope.focusBuilding = function(buildingToFocus) {
        var latLng = new google.maps.LatLng(buildingToFocus.location.latitude, buildingToFocus.location.longitude);
        map.setCenter(latLng);
        var dictEntry = latLngDict[latLng];
        dictEntry.infoWindow.open(map, dictEntry.marker);
    };

    // load in the campus data json via a HTTP GET request.
    $http.get('/data/campus_data.json').then(function(result) {
        // set the fuse searcher.
        var options = {
          keys: ['name']
        }
        searcher = new Fuse(result.data, options);

        // add markers to the map.
        var index;
        for (index = 0; index < result.data.length; index++) {
            var building = result.data[index];
            var latLng = new google.maps.LatLng(building.location.latitude, building.location.longitude);
            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                title: building.name,
                index: index
            });
            var contentString = '<div id="content">'+
                building.abbreviation + ' ' + building.name +
                '</div>';
            var infoWindow = new google.maps.InfoWindow({
                content: contentString
            });

            // add entry to latLngDict.
            latLngDict[latLng] = {"marker":marker, "infoWindow":infoWindow};
            google.maps.event.addListener(marker, 'click', function(target){
                var dictEntry = latLngDict[target.latLng];
                dictEntry.infoWindow.open(map, dictEntry.marker);
            }); 
        }
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
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true,
          minZoom: 15,
          maxZoom: 20
        };
        map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
    }

});