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
    $scope.showMyLocation = function() {
        var myloc = new google.maps.Marker({
            clickable: false,
            icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
                                                    new google.maps.Size(22,22),
                                                    new google.maps.Point(0,18),
                                                    new google.maps.Point(11,11)),
            shadow: null,
            zIndex: 999,
            map: map
        });

        if (navigator.geolocation) navigator.geolocation.getCurrentPosition(function(pos) {
            var me = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            myloc.setPosition(me);
        map.panTo(me);
        }, function(error) {
            // ...
        });
    }
    // function for focusing on a building.
    $scope.focusBuilding = function(building) {
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
    $http.get('/data/campus_data.json').then(function(result) {
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

});