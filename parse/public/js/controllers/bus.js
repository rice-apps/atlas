'use strict';

angular.module('atlasApp').controller('BusCtrl', function(
    $location,
    $routeParams,
    $scope,
    $http,
    $q,
    cfpLoadingBar,
    LocationProvider
    ) {

    // Bus image we are going to use.
    $scope.graduateApartmentsShoppingShuttleImage = "img/buses/Graduate Apartments Shopping Shuttle.png";
    $scope.graduateApartmentsImage = "img/buses/Graduate Apartments.png";
    $scope.greaterLoopImage = "img/buses/Greater Loop.png";
    $scope.innerLoopImage = "img/buses/Inner Loop.png";
    $scope.nightEscortServiceImage = "img/buses/Night Escort Service.png";
    $scope.riceVillageImage = "img/buses/Rice Village.png";
    $scope.riceVillageApartmentsImage = "img/buses/Rice Village Apartments.png";
    $scope.undergraduateShoppingShuttleImage = "img/buses/Undergraduate Shopping Shuttle.png";

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

    // Used to determine whether the user location is turned on or not
    $scope.userLocationOn = false;

    /**
    * Initalizes the Bus controller.
    */
    $scope.init = function() {
        $scope.resizeView();
        $(window).resize($scope.resizeView);
        $scope.initializeMap();
        // $scope.showMyLocation();
        // Function to update buses and pull's data every 5 seconds.
        (function tick() {
        $http.get('http://rice-buses.herokuapp.com').success(function (data) {
            // redraw the buses
            $scope.refreshBuses(data.d);
            console.log("Pulled in Data");
            setTimeout(tick, $scope.refreshRate);
        });
    })();
    }

    /**
    * Resizes the view to fit within the bounds of the screen.
    */
    $scope.resizeView = function() {
        var newHeight = $(window).height() - $('div.navbar').height();
        $('#map-canvas').css({height: newHeight});
    };

    /**
     * Add code for initializing the map.
     */
    $scope.initializeMap = function() {
        console.log('Initializing');
        var mapOptions = {
        zoom: 15,
        center: $scope.mapCenter,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        };

        var mapCanvas = document.getElementById('map-canvas');
        
        $scope.map = new google.maps.Map(
        mapCanvas,
        mapOptions
        );

        $scope.locationProvider = new LocationProvider($scope.map);
        $scope.locationProvider.showUserLocation();
    }


    /**
     * Refreshes buses on map according to new data.
     */
     $scope.refreshBuses = function(data) {
        // check to see if data has removed a bus we knew about.
        for (var sessionID in $scope.idToBusMarkerDict) {
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
                $scope.deleteBus(sessionID);
            }
        }

        // check to see if data contains a new bus.
        for (var i = 0; i < data.length; i++) {
            var bus = data[i];

            var busLatLng = new google.maps.LatLng(bus.Latitude, bus.Longitude);

            // if the bus is new, add it
            if (!(bus.SessionID in $scope.idToBusMarkerDict)) {
                $scope.createBus(bus.SessionID, busLatLng, bus.Name);
            }
            // otherwise, just change the latlng
            else {
                // change the key in the latLngToBusDict
                var oldLatLng = $scope.idToBusMarkerDict[bus.SessionID].getPosition();
                $scope.latLngToBusDict[busLatLng] = $scope.latLngToBusDict[oldLatLng];

                // change the position of the marker.
                $scope.idToBusMarkerDict[bus.SessionID].setPosition(busLatLng);
            }
        }
    }

    // Creates a marker from a new sessionID and latLng, adds it to the latLngToBusDict.
    $scope.createBus = function(sessionID, latLng, type) {
        var image = ''
 
        switch(type) {
            case "Graduate Apartments":
                image = $scope.graduateApartmentsImage;
                break;
            case "Graduate Apartments Shopping Shuttle":
                image = $scope.graduateApartmentsShoppingShuttleImage;
                break;
            case "Greater Loop":
                image = $scope.greaterLoopImage;
                break;
            case "Inner Loop":
                image = $scope.innerLoopImage;
                break;
            case "Night Escort Service":
                image = $scope.nightEscortServiceImage;
                break;
            case "Rice Village":
                image = $scope.riceVillageImage;
                break;
            case "Rice Village Apartments":
                image = $scope.riceVillageApartmentsImage;
                break;
            case "Undergraduate Shopping Shuttle":
                image = $scope.undergraduateShoppingShuttleImage;
                break;
            default:
                image = $scope.innerLoopImage;
            }

        var busMarker = new google.maps.Marker({
            position: latLng,
            map: $scope.map,
            icon: image,
            type: type
        });

        var infoWindow = new google.maps.InfoWindow({
            content: type
        });
 
        $scope.idToBusMarkerDict[sessionID] = busMarker
        $scope.latLngToBusDict[latLng] = {'marker':busMarker, 'infoWindow':infoWindow}

        google.maps.event.addListener(busMarker, 'click', function(target) {
            // close all the info windows.
            $scope.closeAllInfoWindows();
            
            $scope.latLngToBusDict[target.latLng]['infoWindow'].open($scope.map, $scope.latLngToBusDict[target.latLng].marker);
        }); 
    }

    // Removes a bus from the map and deletes it if the sessionID no longer exists.
    $scope.deleteBus = function(sessionID){
        $scope.idToBusMarkerDict[sessionID].setMap(null);
        delete $scope.latLngToBusDict[idToBusMarkerDict[sessionID].position];
        delete $scope.idToBusMarkerDict[sessionID];
    }

    /**
     * Closes all info windows on the map.
     */
    $scope.closeAllInfoWindows = function() {
        for (var latLng in latLngDict) {
            $scope.latLngDict[latLng].infoWindow.close();
        }
        $scope.closeAllBusInfoWindows();
    }

    /**
     * Removes all markers from the map.
     */
    $scope.removeAllBuildingMarkers = function() {
        $scope.closeAllInfoWindows();

        // $scope.visitorLotsShown = false;

        for (var latLng in $scope.latLngDict) {
            $scope.latLngDict[latLng].marker.setMap(null);
            delete $scope.latLngDict[latLng];
        }
    }

    /**
     * Closes all bus info windows on map.
     */
    $scope.closeAllBusInfoWindows = function() {
        for (var latLng in $scope.latLngToBusDict) {
            $scope.latLngToBusDict[latLng]['infoWindow'].close();
        }
    }



    $scope.toggleUserLocation = function($event) {
        if ($scope.userLocationOn) {
            $scope.locationProvider.hideUserLocation();
        } else {
            $scope.locationProvider.showUserLocation();
        }
        $scope.userLocationOn = !$scope.userLocationOn;
    }

    $scope.init();

});