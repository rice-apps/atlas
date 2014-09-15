'use strict';

/**
 * A utility class that obtains user location from browser and plots it on the 
 * map.
 */
angular.module('atlasApp').factory('LocationProvider', function() {
  /**
   * Instantiates a LocationProvider.
   * Parameters:
   *   map{google.maps.Map}: The map to plot user location on
   */
  function LocationProvider(map) {
    console.log("Location Provider instantiated");
    this._map = map;
  }

  LocationProvider.prototype = {

    getUserLocation: function() {
      // Use lazy instantiation to avoid asking the user for location permissions
      // if this function never gets called
      if (this._userLocation == null) {
        console.log("userLocation instantiated");
        this._userLocation = new GeolocationMarker();  // Asks browser for location
        this._userLocation.setMap(this._map);
      }
      return this._userLocation;
    },

    _startWatchingUserLocation: function() {
      var self = this;
      if (!navigator.geolocation) {
        return;   // Geolocation not supported
      }
      if (this._watchId != null) {
        return;   // Already watching
      }
      this._watchId = navigator.geolocation.watchPosition(function(position) {
        var coordinates = new google.maps.LatLng(
            position.coords.latitude, 
            position.coords.longitude);
        self._map.panTo(coordinates);
      }, function(error) {
        console.log(error);
      }, this.getUserLocation().getPositionOptions());
    },

    _stopWatchingUserLocation: function() {
      // TODO: Implement this
    },

    showUserLocation: function() {
      this.getUserLocation().setMarkerOptions({visible: true});
      this.getUserLocation().setCircleOptions({visible: true});
      this._startWatchingUserLocation();
    },

    hideUserLocation: function() {
      this.getUserLocation().setMarkerOptions({visible: false});
      this.getUserLocation().setCircleOptions({visible: false});
      this._stopWatchingUserLocation();
    }
  }

  return LocationProvider;
});