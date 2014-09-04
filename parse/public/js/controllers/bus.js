'use strict';

angular.module('atlasApp').controller('BusCtrl', function(
    $location,
    $routeParams,
    $scope,
    $http,
    $q,
    cfpLoadingBar
    ) {

    // Bus image we are going to use.
    $scope.innerLoopImage = "img/buses/Inner Loop.png";

    /**
    * The map center coordinates of Rice University.
    */
    $scope.mapCenter = new google.maps.LatLng(29.717384, -95.403171);
    // dictionary that maps a bus SessionId to an object that has a marker and an infoWindow
    $scope.idToBusMarkerDict = {};
    // dictionary that maps a laptop to an object that has a marker and an infoWindow
    $scope.latLngToBusDict = {};

    // dictionary that maps latlng's to bus markers
    $scope.busMarkersDict = {};
    // dictionary that maps latlng's to bus infoWindow's.
    $scope.busInfoWindowsDict = {};

    // elements on the map. Initialized using campus_data.json.
    $scope.mapElements;

    // declare Fuse searcher
    $scope.searcher;

    // declare the google map.
    $scope.map;

    $scope.refreshRate = 5000;

    // init the lat/lng dictionary. Maps a latLng to various things.
    var latLngDict = {};
    
    //init search results.
    $scope.searchResults = [];

    // init the open status for the search results.
    $scope.open = true;

    // init the list for bus data.
    $scope.buses = [];

    /**
    * Initalizes the Bus controller.
    */
    $scope.init = function() {
        $scope.resizeView();
        $(window).resize($scope.resizeView);
        $scope.geoMarker = new GeolocationMarker($scope.map);

        // Function to update buses and pull's data every 5 seconds.
        (function tick() {
        $http.get('http://rice-buses.herokuapp.com').success(function (data) {
            // redraw the buses
            refreshBuses(data.d);

            $timeout(tick, 5000);
        });
    })();
    }

    /**
    * Resizes the view to fit within the bounds of the screen.
    */
    $scope.resizeView = function() {
        $scope.newHeight = 
        $(window).height() 
        - $('div.navbar').height() 
        - 90;
        $('#map-canvas').css({height: newHeight});
    };

    // function that clears input from input box and selects the input.
    $scope.clearInput = function() {
        $scope.searchText = "";
        $timeout(function() {
            $('#searchBox').focus();
        });
    }
    // function that gets called when the My Location button is clicked, and show the user's locaiton on the map and pans to your location.
    $scope.showMyLocation = function() {
        //sets the marker at your location and pans the screen to it.
        if (navigator.geolocation) navigator.geolocation.getCurrentPosition(function(pos) {
            var myLoc = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            createPersonMarker(myLoc);
        }, function(error) {
            // ...
        });
    }

    // function that creates a little marker representing a person/their location.
    $scope.createPersonMarker = function(latLng) {
        // Creates the marker to designate the position of a person.
        var personLocMarker = new google.maps.Marker({
            clickable: false,
            icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
                                                    new google.maps.Size(22,22),
                                                    new google.maps.Point(0,18),
                                                    new google.maps.Point(11,11)),
            shadow: null,
            zIndex: 999,
            map: map
        });

        personLocMarker.setPosition(latLng);
        map.panTo(latLng);
    }

    // removes a marker on the map for a map element.
    $scope.removeMarker = function(mapElement) {
        // check whether we've made the maker yet. If it exists, remove it.
        var latLng = new google.maps.LatLng(mapElement.location.latitude, mapElement.location.longitude);
        if (latLng in latLngDict) {
            // delete marker and entry in latLngDict.
            latLngDict[latLng].marker.setMap(null);
            delete latLngDict[latLng];
        }
    }


    /**
     * Refreshes buses on map according to new data.
     */
     $scope.refreshBuses = function(data) {
        // check to see if data has removed a bus we knew about.
        for (var sessionID in idToBusMarkerDict) {
            var busRemains = false;

            for (var i = 0; i < data.length; i++) {
                var bus = data[i];
                if (bus.SessionID === sessionID) {
                    busRemains = true;
                    break;
                }
            }

            // if the bus has retired, then delete it.
            if (!busRemains) {
                deleteBus(sessionID);
            }
        }

        // check to see if data contains a new bus.
        for (var i = 0; i < data.length; i++) {
            var bus = data[i];

            var busLatLng = new google.maps.LatLng(bus.Latitude, bus.Longitude);

            // if the bus is new, add it
            if (!(bus.SessionID in idToBusMarkerDict)) {
                createBus(bus.SessionID, busLatLng, bus.Name);
            }
            // otherwise, just change the latlng
            else {
                // change the key in the latLngToBusDict
                var oldLatLng = idToBusMarkerDict[bus.SessionID].getPosition();
                latLngToBusDict[busLatLng] = latLngToBusDict[oldLatLng];

                // change the position of the marker.
                idToBusMarkerDict[bus.SessionID].setPosition(busLatLng);
            }
        }
    }

    // Creates a marker from a new sessionID and latLng, adds it to the latLngToBusDict.
    $scope.createBus = function(sessionID, latLng, type) {
        var image = ''
 
        switch(type) {
            case "Inner Loop":
                image = innerLoopImage;
                break;
            default:
                image = innerLoopImage;
            }

        var busMarker = new google.maps.Marker({
            position: latLng,
            map: map,
            icon: image,
            type: type
        });

        var infoWindow = new google.maps.InfoWindow({
            content: type
        });
 
        idToBusMarkerDict[sessionID] = busMarker
        latLngToBusDict[latLng] = {'marker':busMarker, 'infoWindow':infoWindow}

        google.maps.event.addListener(busMarker, 'click', function(target) {
            // close all the info windows.
            closeAllInfoWindows();
            
            latLngToBusDict[target.latLng]['infoWindow'].open(map, latLngToBusDict[target.latLng].marker);
        }); 
    }

    // Removes a bus from the map and deletes it if the sessionID no longer exists.
    $scope.deleteBus = function(sessionID){
        idToBusMarkerDict[sessionID].setMap(null);
        delete latLngToBusDict[idToBusMarkerDict[sessionID].position];
        delete idToBusMarkerDict[sessionID];
    }

    /**
     * Add code for initializing the map.
     */
    $scope.initializeMap = function() {
        var mapOptions = {
          zoom: 15,
          center: mapCenter,
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
    $scope.closeAllInfoWindows = function() {
        for (var latLng in latLngDict) {
            latLngDict[latLng].infoWindow.close();
        }
        closeAllBusInfoWindows();
    }

    /**
     * Removes all markers from the map.
     */
    $scope.removeAllBuildingMarkers = function() {
        closeAllInfoWindows();

        $scope.visitorLotsShown = false;

        for (var latLng in latLngDict) {
            latLngDict[latLng].marker.setMap(null);
            delete latLngDict[latLng];
        }
    }

    /**
     * Closes all bus info windows on map.
     */
    $scope.closeAllBusInfoWindows = function() {
        for (var latLng in latLngToBusDict) {
            latLngToBusDict[latLng]['infoWindow'].close();
        }
    }

    $scope.init();

});