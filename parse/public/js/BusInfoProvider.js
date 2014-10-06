'use strict';

/**
 * A utility class that obtains Bus info from the rices Heroku app and plots it on the 
 * map.
 */
angular.module('atlasApp').factory('BusInfoProvider', function() {
  /**
   * Instantiates a BusInfoProvider.
   * Parameters:
   *   map{google.maps.Map}: The map to plot Bus location on
   */
  function BusInfoProvider() {
    console.log("Bus Info Provider instantiated");
    this._map = MapsService.initMap();

    // Bus image we are going to use.
    this.graduateApartmentsShoppingShuttleImage = "img/buses/Graduate Apartments Shopping Shuttle.png";
    this.graduateApartmentsImage = "img/buses/Graduate Apartments.png";
    this.greaterLoopImage = "img/buses/Greater Loop.png";
    this.innerLoopImage = "img/buses/Inner Loop.png";
    this.nightEscortServiceImage = "img/buses/Night Escort Service.png";
    this.riceVillageImage = "img/buses/Rice Village.png";
    this.riceVillageApartmentsImage = "img/buses/Rice Village Apartments.png";
    this.undergraduateShoppingShuttleImage = "img/buses/Undergraduate Shopping Shuttle.png";

    /**
    * The map center coordinates of Rice University.
    */
    this.mapCenter = new google.maps.LatLng(29.717384, -95.403171);
    // dictionary that maps a bus SessionId to an object that has a marker and an infoWindow
    this.idToBusMarkerDict = {};

    // dictionary that maps a laptop to an object that has a marker and an infoWindow
    this.latLngToBusDict = {};

    // dictionary that maps latlng's to bus markers
    this.busMarkersDict = {};
    // dictionary that maps latlng's to bus infoWindow's.
    this.busInfoWindowsDict = {};

    // elements on the map. Initialized using campus_data.json.
    this.mapElements;

    // declare Fuse searcher
    this.searcher;

    this.refreshRate = 2500;

    // init the lat/lng dictionary. Maps a latLng to various things.
    this.latLngDict = {};
    
    //init search results.
    this.searchResults = [];

    // init the open status for the search results.
    this.open = true;

    // init the list for bus data.
    this.buses = [];
  }

  BusInfoProvider.prototype = {


    stopDrawingBusInfo : function(){
      for (var sessionID in this.idToBusMarkerDict) {
        this.deleteBus(sessionID);
      }
      this.closeAllInfoWindows();
      this.closeAllBusInfoWindows();
      this.removeAllBuildingMarkers();
    },

    /**
     * Refreshes buses on map according to new data.
     */
     refreshBuses : function(data) {

        console.log('Refresh Buses got called');
        // check to see if data has removed a bus we knew about.
        for (var sessionID in this.idToBusMarkerDict) {
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
              this.deleteBus(sessionID);
            }
          }

        // check to see if data contains a new bus.
        for (var i = 0; i < data.length; i++) {
          var bus = data[i];

          var busLatLng = new google.maps.LatLng(bus.Latitude, bus.Longitude);

          // if the bus is new, add it
          if (!(bus.SessionID in this.idToBusMarkerDict)) {
            this.createBus(bus.SessionID, busLatLng, bus.Name);
          }
          // otherwise, just change the latlng
          else {
              // change the key in the latLngToBusDict
              var oldLatLng = this.idToBusMarkerDict[bus.SessionID].getPosition();
              this.latLngToBusDict[busLatLng] = this.latLngToBusDict[oldLatLng];

              // change the position of the marker.
              this.idToBusMarkerDict[bus.SessionID].setPosition(busLatLng);
          }
        }
      },

    // Creates a marker from a new sessionID and latLng, adds it to the latLngToBusDict.
    createBus: function(sessionID, latLng, type) {
        var image = ''
 
        console.log("Type is: " + type);

        switch(type) {
            case "Graduate Apartments":
                image = this.graduateApartmentsImage;
                break;
            case "Graduate Apartments Shopping Shuttle":
                image = this.graduateApartmentsShoppingShuttleImage;
                break;
            case "Greater Loop":
                image = this.greaterLoopImage;
                break;
            case "Inner Loop":
                image = this.innerLoopImage;
                break;
            case "Night Escort Service":
                image = this.nightEscortServiceImage;
                break;
            case "Rice Village":
                image = this.riceVillageImage;
                break;
            case "Rice Village Apartments\/Greenbriar":
                image = this.riceVillageApartmentsImage;
                break;
            case "Undergraduate Shopping Shuttle":
                image = this.undergraduateShoppingShuttleImage;
                break;
            case "Texas Medical Center\/BRC":
                image = this.undergraduateShoppingShuttleImage;
                break;
            default:
                image = this.innerLoopImage;
            }

        var busMarker = new google.maps.Marker({
            position: latLng,
            map: this._map,
            icon: image,
            type: type
        });

        var infoWindow = new google.maps.InfoWindow({
            content: type
        });
 
        this.idToBusMarkerDict[sessionID] = busMarker
        this.latLngToBusDict[latLng] = {'marker':busMarker, 'infoWindow':infoWindow}

        google.maps.event.addListener(busMarker, 'click', function(target) {
            // close all the info windows.
            closeAllInfoWindows();
            
            this.latLngToBusDict[target.latLng]['infoWindow'].open(this._map, this.latLngToBusDict[target.latLng].marker);
        }); 
    },

    // Removes a bus from the map and deletes it if the sessionID no longer exists.
    deleteBus: function(sessionID){
        this.idToBusMarkerDict[sessionID].setMap(null);
        delete this.latLngToBusDict[this.idToBusMarkerDict[sessionID].position];
        delete this.idToBusMarkerDict[sessionID];
    },

    /**
     * Closes all info windows on the map.
     */
    closeAllInfoWindows: function() {
        for (var latLng in this.latLngDict) {
            this.latLngDict[latLng].infoWindow.close();
        }
        this.closeAllBusInfoWindows();
    },

    /**
     * Removes all markers from the map.
     */
    removeAllBuildingMarkers: function() {
        this.closeAllInfoWindows();

        // this.visitorLotsShown = false;

        for (var latLng in this.latLngDict) {
            this.latLngDict[latLng].marker.setMap(null);
            delete this.latLngDict[latLng];
        }
    },

    /**
     * Closes all bus info windows on map.
     */
    closeAllBusInfoWindows: function() {
        for (var latLng in this.latLngToBusDict) {
            this.latLngToBusDict[latLng]['infoWindow'].close();
        }
    }
  }

  return BusInfoProvider;
});