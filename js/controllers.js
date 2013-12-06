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

    // function that shows search results.
    $scope.showSearchResults = function() {
        $scope.open = true;
    }

    // function that gets called on all clicks to hide/show search results.
    $scope.hideSearchResults = function(clickedElement) {
        if (clickedElement.target.id !== 'searchBox') {
            $scope.open = false;
        }
        else {
            $scope.open = true;
        }
    }
    // function that gets called when the Show My Location button is clicked, and show the user's locaiton on the map and pans to your location.
    $scope.showMyLocation = function() {
        // Makes the marker to show where you are.
        var myLocMarker = new google.maps.Marker({
            clickable: false,
            icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
                                                    new google.maps.Size(22,22),
                                                    new google.maps.Point(0,18),
                                                    new google.maps.Point(11,11)),
            shadow: null,
            zIndex: 999,
            map: map
        });
        //sets the marker at your location and pans the screen to it.
        if (navigator.geolocation) navigator.geolocation.getCurrentPosition(function(pos) {
            var myLoc = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            myLocMarker.setPosition(myLoc);
            map.panTo(myLoc);
        }, function(error) {
            // ...
        });
    }

    // event where a building was selected by a keypress..
    $scope.buildingSelectedByKeyPress = function(keyPressed) {
        if (keyPressed.keyCode == 13 && $scope.searchResults.length > 0) {
            // focus on the building.
            var building = $scope.searchResults[0];
            $scope.focusBuilding(building);

            // hide the search results. we have to emulate a clicked element here.
            $scope.hideSearchResults({target: {id: 'fakeElement'}});
        }
    }

    // function for focusing on a building.
    $scope.focusBuilding = function(building) {
        // first close all info windows.
        closeAllInfoWindows();

        var latLng = new google.maps.LatLng(building.location.latitude, building.location.longitude);
        map.panTo(latLng);

        // check whether we've made the maker yet. If not, make it.
        if (!(latLng in latLngDict)) {
            var latLng = new google.maps.LatLng(building.location.latitude, building.location.longitude);
            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                title: building.name
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
        var dictEntry = latLngDict[latLng];
        dictEntry.infoWindow.open(map, dictEntry.marker);
    };

    // load in the campus data json via a HTTP GET request.
    $http.get('data/campus_data.json').then(function(result) {
        // set the fuse searcher.
        var options = {
          keys: ['name', 'abbreviation']
        }

        searcher = new Fuse(result.data, options);
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

    /**
     * Closes all info windows on the map.
     */
    function closeAllInfoWindows() {
        for (var latLng in latLngDict) {
            latLngDict[latLng].infoWindow.close();
        }
    }

});